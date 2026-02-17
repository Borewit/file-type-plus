/**
 * Node.js entry point for @file-type/plus
 *
 * Same public API shape as `file-type`'s Node entry point, but using the
 * extended detector set from ./core.js by default.
 */

import {FileTypeParser, type FileTypePlusOptions} from './core.js';
import {
  fileTypeFromTokenizer as baseFileTypeFromTokenizer,
  supportedMimeTypes,
  supportedExtensions,
  type AnyWebReadableStream
} from 'file-type';
import {ReadStream} from "node:fs";

// Re-export the core API (fileTypeFromBuffer/fromBlob/fromStream/fileTypeStream + FileTypeParser)
export * from './core.js';

/**
 * Node-only convenience helpers, aligned with `file-type`'s Node entry point.
 */
export async function fileTypeFromFile(
  path: string,
  options?: FileTypePlusOptions
) {
  return new FileTypeParser(options).fromFile(path);
}

export async function fileTypeFromStream(stream: AnyWebReadableStream<Uint8Array> | AnyWebReadableStream<Uint8Array<ArrayBufferLike>> | ReadStream,
                                         options?: FileTypePlusOptions) {
  return (new FileTypeParser(options)).fromStream(stream);
}

export async function fileTypeFromTokenizer(
  tokenizer: Parameters<typeof baseFileTypeFromTokenizer>[0],
  options?: FileTypePlusOptions
) {
  return new FileTypeParser(options).fromTokenizer(tokenizer);
}

export function fileTypeStream(
  readableStream: AnyWebReadableStream<Uint8Array<ArrayBufferLike>> | ReadStream,
  options: (Parameters<FileTypeParser['toDetectionStream']>[1] & FileTypePlusOptions) = {}
) {
  return new FileTypeParser(options).toDetectionStream(readableStream as any, options);
}

export {
  supportedMimeTypes,
  supportedExtensions
};
