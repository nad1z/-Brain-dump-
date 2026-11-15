// Minimal ZIP reader for EPUB files: central directory + stored/deflated entries, decompressed
// with the browser's built-in DecompressionStream. No dependencies, so nothing extra is shipped
// to the device's flash.

export interface ZipEntry {
  name: string;
  method: number;
  compressedSize: number;
  localHeaderOffset: number;
}

const EOCD_SIGNATURE = 0x06054b50;
const CENTRAL_SIGNATURE = 0x02014b50;
const LOCAL_SIGNATURE = 0x04034b50;

export function listZipEntries(data: Uint8Array): Map<string, ZipEntry> {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  // The end-of-central-directory record is in the last 22 + 65535 bytes.
  let eocd = -1;
  for (let i = data.length - 22; i >= Math.max(0, data.length - 22 - 65535); i -= 1) {
    if (view.getUint32(i, true) === EOCD_SIGNATURE) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) {
    throw new Error('This file is not a valid EPUB (no ZIP directory found).');
  }
  const count = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  const decoder = new TextDecoder();
  const entries = new Map<string, ZipEntry>();
  for (let index = 0; index < count; index += 1) {
    if (offset + 46 > data.length || view.getUint32(offset, true) !== CENTRAL_SIGNATURE) {
      throw new Error('This EPUB is damaged (bad ZIP directory).');
    }
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localHeaderOffset = view.getUint32(offset + 42, true);
    const name = decoder.decode(data.subarray(offset + 46, offset + 46 + nameLength));
    entries.set(name, { name, method, compressedSize, localHeaderOffset });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

async function inflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function readZipEntry(data: Uint8Array, entry: ZipEntry): Promise<Uint8Array> {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const start = entry.localHeaderOffset;
  if (view.getUint32(start, true) !== LOCAL_SIGNATURE) {
    throw new Error(`This EPUB is damaged (${entry.name}).`);
  }
  const nameLength = view.getUint16(start + 26, true);
  const extraLength = view.getUint16(start + 28, true);
  const dataStart = start + 30 + nameLength + extraLength;
  const raw = data.subarray(dataStart, dataStart + entry.compressedSize);
  if (entry.method === 0) {
    return raw;
  }
  if (entry.method === 8) {
    return inflateRaw(raw);
  }
  throw new Error(`This EPUB uses an unsupported compression method (${entry.method}).`);
}

export async function readZipText(
  data: Uint8Array,
  entries: Map<string, ZipEntry>,
  name: string
): Promise<string> {
  const entry = entries.get(name);
  if (!entry) {
    throw new Error(`This EPUB is missing ${name}.`);
  }
  return new TextDecoder().decode(await readZipEntry(data, entry));
}
