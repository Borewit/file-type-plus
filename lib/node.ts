/**
 * Node.js entry point for @file-type/plus
 *
 * Same public API shape as `file-type`'s Node entry point, but using the
 * extended detector set from ./core.js by default.
 */

import {FileTypeParser, type FileTypePlusOptions} from './core.js';
import {
  fileTypeFromTokenizer,
  supportedMimeTypes,
  supportedExtensions, AnyWebReadableStream
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

export async function fileTypeFromStream(
  stream: Parameters<FileTypeParser['fromStream']>[0],
  options?: FileTypePlusOptions
) {
  return new FileTypeParser(options).fromStream(stream);
}

export function fileTypeStream(
  readableStream: AnyWebReadableStream<Uint8Array<ArrayBufferLike>> | ReadStream,
  options: (Parameters<FileTypeParser['toDetectionStream']>[1] & FileTypePlusOptions) = {}
) {
  return new FileTypeParser(options).toDetectionStream(readableStream as any, options);
}

/**
 * Re-export the same metadata helpers as `file-type`'s Node entry point.
 * Note: We intentionally do NOT re-export fileTypeFromBuffer/fromBlob here,
 * those come from ./core.js and already include the default plus detectors.
 */
export {
  fileTypeFromTokenizer,
  supportedMimeTypes,
  supportedExtensions
};