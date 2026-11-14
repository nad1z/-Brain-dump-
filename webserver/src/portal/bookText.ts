// Turns a book file into the plain UTF-8 text the device's reader shows. EPUB is converted
// here in the browser (the device has no room or CPU for unzipping and parsing HTML), so the
// device only ever receives text. No libraries: ZIP via DecompressionStream('deflate-raw'),
// HTML via DOMParser -- both built into current phone and desktop browsers.

export interface BookText {
  // Suggested file name (the device makes it safe and adds .txt).
  name: string;
  text: string;
}

const BLOCK_TAGS = new Set([
  'address', 'article', 'aside', 'blockquote', 'br', 'dd', 'div', 'dl', 'dt', 'figcaption',
  'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav',
  'ol', 'p', 'pre', 'section', 'table', 'td', 'th', 'tr', 'ul',
]);
const SKIPPED_TAGS = new Set(['head', 'script', 'style', 'svg', 'math', 'noscript', 'title']);

interface ZipEntry {
  name: string;
  method: number;
  compressedSize: number;
  dataOffset: number;
}

function stem(fileName: string): string {
  return fileName.replace(/\.(txt|epub)$/i, '');
}

// --- ZIP ---------------------------------------------------------------------------------

function readZipEntries(bytes: Uint8Array): Map<string, ZipEntry> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  // End of central directory: scan back over a possible archive comment.
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i -= 1) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) {
    throw new Error('That EPUB file is damaged (not a valid ZIP archive).');
  }
  const count = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  const utf8 = new TextDecoder('utf-8');
  const entries = new Map<string, ZipEntry>();
  for (let n = 0; n < count; n += 1) {
    if (view.getUint32(offset, true) !== 0x02014b50) {
      throw new Error('That EPUB file is damaged (bad ZIP directory).');
    }
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = utf8.decode(bytes.subarray(offset + 46, offset + 46 + nameLength));
    // The local header's own name/extra lengths decide where the data starts.
    const localNameLength = view.getUint16(localOffset + 26, true);
    const localExtraLength = view.getUint16(localOffset + 28, true);
    entries.set(name, {
      name,
      method,
      compressedSize,
      dataOffset: localOffset + 30 + localNameLength + localExtraLength,
    });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

async function inflate(bytes: Uint8Array, entry: ZipEntry): Promise<Uint8Array> {
  const data = bytes.subarray(entry.dataOffset, entry.dataOffset + entry.compressedSize);
  if (entry.method === 0) {
    return data;
  }
  if (entry.method !== 8) {
    throw new Error(`That EPUB uses an unsupported compression (${entry.method}).`);
  }
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('This browser cannot open EPUB files. Try a newer browser, or send .txt.');
  }
  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// --- EPUB --------------------------------------------------------------------------------

function resolvePath(base: string, href: string): string {
  const clean = decodeURIComponent(href.split('#')[0]);
  const parts = (base ? `${base}/${clean}` : clean).split('/');
  const out: string[] = [];
  for (const part of parts) {
    if (part === '..') {
      out.pop();
    } else if (part !== '.' && part !== '') {
      out.push(part);
    }
  }
  return out.join('/');
}

function normalizeSpaces(text: string): string {
  return text.replace(/[\s\u00a0]+/g, ' ').trim();
}

// Block-aware text: each paragraph-like element becomes its own paragraph.
function htmlToParagraphs(root: Node): string[] {
  const paragraphs: string[] = [];
  let current = '';
  const flush = () => {
    const line = normalizeSpaces(current);
    if (line) {
      paragraphs.push(line);
    }
    current = '';
  };
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      current += node.textContent ?? '';
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    const tag = (node as Element).localName.toLowerCase();
    if (SKIPPED_TAGS.has(tag)) {
      return;
    }
    const block = BLOCK_TAGS.has(tag);
    if (block) {
      flush();
    }
    node.childNodes.forEach(walk);
    if (block) {
      flush();
    }
  };
  walk(root);
  flush();
  return paragraphs;
}

function parseXml(text: string, type: DOMParserSupportedType): Document {
  return new DOMParser().parseFromString(text, type);
}

async function epubToText(file: File): Promise<BookText> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const entries = readZipEntries(bytes);
  const utf8 = new TextDecoder('utf-8');
  const readText = async (path: string) => {
    const entry = entries.get(path);
    if (!entry) {
      throw new Error(`That EPUB is missing ${path}.`);
    }
    return utf8.decode(await inflate(bytes, entry));
  };

  if (entries.has('META-INF/encryption.xml')) {
    const encryption = await readText('META-INF/encryption.xml');
    // Font obfuscation is harmless; anything else means DRM-protected text.
    if (/EncryptedData/.test(encryption) && !/obfuscation|font/i.test(encryption)) {
      throw new Error('That EPUB is copy-protected (DRM), so its text cannot be read.');
    }
  }

  const container = parseXml(await readText('META-INF/container.xml'), 'application/xml');
  const opfPath = container.querySelector('rootfile')?.getAttribute('full-path');
  if (!opfPath) {
    throw new Error('That EPUB has no table of contents (container.xml).');
  }
  const opfDir = opfPath.includes('/') ? opfPath.slice(0, opfPath.lastIndexOf('/')) : '';
  const opf = parseXml(await readText(opfPath), 'application/xml');

  const manifest = new Map<string, { href: string; type: string }>();
  opf.querySelectorAll('manifest > item').forEach(item => {
    const id = item.getAttribute('id');
    const href = item.getAttribute('href');
    if (id && href) {
      manifest.set(id, { href, type: item.getAttribute('media-type') ?? '' });
    }
  });

  const title = normalizeSpaces(
    opf.getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', 'title')[0]?.textContent ?? ''
  );

  const chapters: string[] = [];
  for (const itemref of Array.from(opf.querySelectorAll('spine > itemref'))) {
    const item = manifest.get(itemref.getAttribute('idref') ?? '');
    if (!item || !/html/.test(item.type)) {
      continue;
    }
    const path = resolvePath(opfDir, item.href);
    if (!entries.has(path)) {
      continue;
    }
    const source = await readText(path);
    let doc = parseXml(source, 'application/xhtml+xml');
    if (doc.getElementsByTagName('parsererror').length > 0) {
      doc = parseXml(source, 'text/html');  // lenient fallback for sloppy XHTML
    }
    const paragraphs = htmlToParagraphs(doc.body ?? doc.documentElement);
    if (paragraphs.length > 0) {
      chapters.push(paragraphs.join('\n\n'));
    }
  }
  if (chapters.length === 0) {
    throw new Error('No readable text was found in that EPUB.');
  }
  const text = (title ? `${title}\n\n` : '') + chapters.join('\n\n\n');
  return { name: title || stem(file.name), text };
}

// --- TXT ---------------------------------------------------------------------------------

function decodeTextFile(bytes: Uint8Array): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    // Not UTF-8: an older single-byte file. Hebrew Windows text uses 0xE0-0xFA for its
    // letters; otherwise assume Western European.
    let hebrewLetters = 0;
    let highBytes = 0;
    for (const b of bytes) {
      if (b >= 0x80) {
        highBytes += 1;
        if (b >= 0xe0 && b <= 0xfa) {
          hebrewLetters += 1;
        }
      }
    }
    const encoding = highBytes > 0 && hebrewLetters / highBytes > 0.6 ? 'windows-1255' : 'windows-1252';
    return new TextDecoder(encoding).decode(bytes);
  }
}

async function txtToText(file: File): Promise<BookText> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.includes(0)) {
    throw new Error(`${file.name} is not a plain text file.`);
  }
  const text = decodeTextFile(bytes).replace(/^\ufeff/, '').replace(/\r\n?/g, '\n');
  return { name: stem(file.name), text };
}

export async function bookFileToText(file: File): Promise<BookText> {
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.epub')) {
    return epubToText(file);
  }
  if (lower.endsWith('.txt')) {
    return txtToText(file);
  }
  throw new Error(`${file.name}: only .txt and .epub books are supported.`);
}

// Mirrors the device's SanitizeBookFilename (components/text_reader_service), so the page can
// tell before uploading which name the book will get and whether it replaces one.
export function deviceBookName(requested: string): string {
  let name = requested.replace(/^.*[\\/]/, '').replace(/\.(txt|epub)$/i, '');
  name = name.replace(/[^A-Za-z0-9\-_.(),'&!]+/g, ' ').trim();
  name = name.replace(/^[. ]+/, '').slice(0, 80).replace(/[. ]+$/, '');
  return `${name || 'book'}.txt`;
}
