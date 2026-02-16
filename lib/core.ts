import {
  FileTypeParser as DefaultFileTypeParser,
  fileTypeFromBuffer as defaultFromBuffer,
  fileTypeFromBlob as defaultFromBlob,
  fileTypeFromStream as defaultFromStream,
  fileTypeStream as defaultStream,
  type Detector
} from 'file-type';

import {detectPdf} from '@file-type/pdf';
import {detectXml} from '@file-type/xml';
import {detectCfbf} from '@file-type/cfbf';

export interface FileTypePlusOptions {
  customDetectors?: Iterable<Detector>;
  signal?: AbortSignal;
}

const builtInDetectors: readonly Detector[] = [
  detectXml,
  detectPdf,
  detectCfbf
];

function mergeDetectors(custom?: Iterable<Detector>): Detector[] {
  return custom ? [...builtInDetectors, ...custom] : [...builtInDetectors];
}

/**
 * Drop-in replacement parser.
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
 * Core API, same names as file-type.
 */

export async function fileTypeFromBuffer(
  input: Parameters<typeof defaultFromBuffer>[0],
  options?: FileTypePlusOptions
) {
  return defaultFromBuffer(input, {
    ...options,
    customDetectors: mergeDetectors(options?.customDetectors)
  });
}

export async function fileTypeFromBlob(
  blob: Parameters<typeof defaultFromBlob>[0],
  options?: FileTypePlusOptions
) {
  return defaultFromBlob(blob, {
    ...options,
    customDetectors: mergeDetectors(options?.customDetectors)
  });
}

export async function fileTypeFromStream(
  stream: Parameters<typeof defaultFromStream>[0],
  options?: FileTypePlusOptions
) {
  return defaultFromStream(stream, {
    ...options,
    customDetectors: mergeDetectors(options?.customDetectors)
  });
}

export function fileTypeStream(
  stream: Parameters<typeof defaultStream>[0],
  options?: FileTypePlusOptions
) {
  return defaultStream(stream, {
    ...options,
    customDetectors: mergeDetectors(options?.customDetectors)
  });
}