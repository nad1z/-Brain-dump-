// EPUB -> plain text, done in the browser so the device never has to unzip or parse HTML
// (saves its CPU, RAM and battery). The result keeps paragraphs as blank-line-separated
// blocks, which the device's reader turns into paragraph breaks.
import { listZipEntries, readZipText } from './zip';

const BLOCK_TAGS = new Set([
  'p', 'div', 'section', 'article', 'header', 'footer', 'blockquote', 'li', 'ul', 'ol',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'table', 'tr', 'figure', 'figcaption', 'hr',
]);
const SKIP_TAGS = new Set(['script', 'style', 'head', 'title', 'nav']);

function resolvePath(base: string, href: string): string {
  const parts = (base ? `${base}/${href}` : href).split('/');
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

function parseXml(text: string): Document {
  return new DOMParser().parseFromString(text, 'application/xml');
}

function byLocalName(root: Document | Element, name: string): Element[] {
  return Array.from(root.getElementsByTagName('*')).filter(el => el.localName === name);
}

// Walks a chapter's body, emitting text with blank lines between block elements.
export function htmlToText(body: Element): string {
  const paragraphs: string[] = [];
  let current = '';
  const flush = () => {
    const text = current.replace(/[\s\u00a0]+/g, ' ').trim();
    if (text) {
      paragraphs.push(text);
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
    const element = node as Element;
    const tag = element.localName.toLowerCase();
    if (SKIP_TAGS.has(tag)) {
      return;
    }
    if (tag === 'br') {
      current += ' ';
      return;
    }
    const block = BLOCK_TAGS.has(tag);
    if (block) {
      flush();
    }
    element.childNodes.forEach(walk);
    if (block) {
      flush();
    }
  };
  walk(body);
  flush();
  return paragraphs.join('\n\n');
}

export interface ConvertedBook {
  title: string;
  text: string;
}

export async function epubToText(file: ArrayBuffer): Promise<ConvertedBook> {
  const data = new Uint8Array(file);
  const entries = listZipEntries(data);

  const container = parseXml(await readZipText(data, entries, 'META-INF/container.xml'));
  const rootfile = byLocalName(container, 'rootfile')[0]?.getAttribute('full-path');
  if (!rootfile) {
    throw new Error('This EPUB does not say where its contents are.');
  }
  const opfDir = rootfile.includes('/') ? rootfile.slice(0, rootfile.lastIndexOf('/')) : '';
  const opf = parseXml(await readZipText(data, entries, rootfile));

  const title = byLocalName(opf, 'title')[0]?.textContent?.trim() ?? '';
  const manifest = new Map<string, string>();
  for (const item of byLocalName(opf, 'item')) {
    const id = item.getAttribute('id');
    const href = item.getAttribute('href');
    if (id && href) {
      manifest.set(id, resolvePath(opfDir, decodeURIComponent(href)));
    }
  }

  const chapters: string[] = [];
  for (const itemref of byLocalName(opf, 'itemref')) {
    const path = manifest.get(itemref.getAttribute('idref') ?? '');
    if (!path || !entries.has(path)) {
      continue;
    }
    const markup = await readZipText(data, entries, path);
    let doc = new DOMParser().parseFromString(markup, 'application/xhtml+xml');
    if (doc.getElementsByTagName('parsererror').length > 0) {
      doc = new DOMParser().parseFromString(markup, 'text/html');
    }
    const body = byLocalName(doc, 'body')[0] ?? doc.documentElement;
    const text = htmlToText(body);
    if (text) {
      chapters.push(text);
    }
  }
  if (chapters.length === 0) {
    throw new Error('No readable text was found in this EPUB.');
  }
  const text = (title ? `${title}\n\n` : '') + chapters.join('\n\n');
  return { title, text };
}
