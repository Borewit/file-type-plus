/**
 * Default entry point for @file-type/plus
 */

import {
  FileTypeParser as DefaultFileTypeParser,
  fileTypeFromBuffer as baseFileTypeFromBuffer,
  fileTypeFromBlob as baseFileTypeFromBlob,
  fileTypeFromStream as baseFileTypeFromStream,
  fileTypeFromTokenizer as baseFileTypeFromTokenizer,
  fileTypeStream as baseFileTypeStream,
  type Detector,
  type FileTypeOptions,
  type FileTypeResult,
  type StreamOptions,
  type AnyWebReadableStream,
  type AnyWebReadableByteStreamWithFileType
} from 'file-type';

import type {AnyWebByteStream, ITokenizer} from 'strtok3';

import {detectPdf} from '@file-type/pdf';
import {detectXml} from '@file-type/xml';
import {detectCfbf} from '@file-type/cfbf';

export interface FileTypePlusOptions {
  customDetectors?: Iterable<Detector>;
  signal?: AbortSignal;
}

const builtInDetectors: readonly Detector[] = [detectXml, detectPdf, detectCfbf];

function mergeDetectors(custom?: Iterable<Detector>): Detector[] {
  return custom ? [...builtInDetectors, ...custom] : [...builtInDetectors];
}

function withDetectors(options?: FileTypeOptions & FileTypePlusOptions): FileTypeOptions & FileTypePlusOptions {
  return {
    ...options,
    customDetectors: mergeDetectors(options?.customDetectors)
  };
}

/**
 * Drop-in replacement parser (same name as file-type)
 */
export class FileTypeParser extends DefaultFileTypeParser {
  public constructor(options?: FileTypePlusOptions) {
    super({
      ...options,
      customDetectors: mergeDetectors(options?.customDetectors)
    });
  }
}

/**
 * Core API, same names as `file-type`,
 * and aligned with primary-entry (web) typings.
 */

export function fileTypeFromBuffer(
  buffer: Uint8Array | ArrayBuffer,
  options?: FileTypeOptions & FileTypePlusOptions
): Promise<FileTypeResult | undefined> {
  return baseFileTypeFromBuffer(buffer, withDetectors(options));
}

export function fileTypeFromBlob(
  blob: Blob,
  options?: FileTypeOptions & FileTypePlusOptions
): Promise<FileTypeResult | undefined> {
  return baseFileTypeFromBlob(blob, withDetectors(options));
}

export function fileTypeFromStream(
  stream: AnyWebReadableStream<Uint8Array> | AnyWebReadableStream<Uint8Array<ArrayBufferLike>>,
  options?: FileTypeOptions & FileTypePlusOptions
): Promise<FileTypeResult | undefined> {
  return baseFileTypeFromStream(stream, withDetectors(options));
}

export function fileTypeFromTokenizer(
  tokenizer: ITokenizer,
  options?: FileTypeOptions & FileTypePlusOptions
): Promise<FileTypeResult | undefined> {
  // IMPORTANT: route through file-type function, but ensure detectors are included
  return baseFileTypeFromTokenizer(tokenizer, withDetectors(options));
}

export function fileTypeStream(
  webStream: AnyWebReadableStream<Uint8Array> | AnyWebReadableStream<Uint8Array<ArrayBufferLike>>,
  options?: StreamOptions & FileTypePlusOptions
): Promise<AnyWebReadableByteStreamWithFileType> {
  return baseFileTypeStream(webStream, {
    ...options,
    customDetectors: mergeDetectors(options?.customDetectors)
  } as any);
}
