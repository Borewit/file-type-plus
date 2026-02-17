import {readFile} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {Readable} from 'node:stream';
import {expect} from 'chai';

import {
  fileTypeFromBlob,
  fileTypeFromBuffer,
  fileTypeFromStream,
  fileTypeFromTokenizer
} from '../lib/node.js';

import {
  fileTypeFromFile,
  fileTypeFromStream as nodeFileTypeFromStream,
  fileTypeStream as nodeFileTypeStream
} from '../lib/node.js';
import {fileURLToPath} from "node:url";
import {fromBuffer, fromFile} from "strtok3";

function getFixtureUrl(fixtureFilename) {
  return new URL(`./fixture/${fixtureFilename}`, import.meta.url);
}

describe('file-type-plus', function () {

  describe('file recognition', () => {

    it('should detect binary file types', async function () {

      const buffer = await readFile(getFixtureUrl('fixture.bmp'));
      const blob = new Blob([buffer]);

      const result = await fileTypeFromBlob(blob);

      expect(result).to.exist;
      expect(result?.ext).to.equal('bmp');
      expect(result?.mime).to.equal('image/bmp');
    });

    it('should detect a PDF type', async function () {

      const buffer = await readFile(getFixtureUrl('tiny.pdf'));
      const blob = new Blob([buffer]);

      const result = await fileTypeFromBlob(blob);

      expect(result).to.exist;
      expect(result?.ext).to.equal('pdf');
      expect(result?.mime).to.equal('application/pdf');
    });

    it('should detect a PDF sub types', async function () {

      const buffer = await readFile(getFixtureUrl('fixture-normal.ai'));
      const blob = new Blob([buffer]);

      const result = await fileTypeFromBlob(blob);

      expect(result).to.exist;
      expect(result?.ext).to.equal('ai');
      expect(result?.mime).to.equal('application/illustrator');
    });

    it('should detect a CFBF (compound) files', async function () {

      const buffer = await readFile(getFixtureUrl('XOFF.PUB'));
      const blob = new Blob([buffer]);

      const result = await fileTypeFromBlob(blob);

      expect(result).to.exist;
      expect(result?.ext).to.equal('pub');
      expect(result?.mime).to.equal('application/x-mspublisher');
    });

    it('should detect a XML sub types', async function () {

      const buffer = await readFile(getFixtureUrl('tears_of_steel.smil'));
      const blob = new Blob([buffer]);

      const result = await fileTypeFromBlob(blob);

      expect(result).to.exist;
      expect(result?.ext).to.equal('smil');
      expect(result?.mime).to.equal('application/smil+xml');
    });

  });

  describe('supported input types', () => {

    it('node entry, should support tokenizer from Buffer', async function () {
      const buffer = await readFile(getFixtureUrl('fixture.bmp'));
      const tokenizer = fromBuffer(buffer);



      const result = await fileTypeFromTokenizer(tokenizer);

      expect(result).to.exist;
      expect(result?.ext).to.equal('bmp');
      expect(result?.mime).to.equal('image/bmp');
    });

    it('node entry, should support tokenizer from File', async function () {
      const path = fileURLToPath(getFixtureUrl('fixture-normal.ai'));
      const tokenizer = await fromFile(path);

      try {
        const result = await fileTypeFromTokenizer(tokenizer);

        expect(result).to.exist;
        expect(result?.ext).to.equal('ai');
        expect(result?.mime).to.equal('application/illustrator');
      } finally {
        await tokenizer.close();
      }
    });


    it('core, should support Buffer input', async function () {
      const buffer = await readFile(getFixtureUrl('fixture.bmp')); // Buffer
      const result = await fileTypeFromBuffer(buffer);

      expect(result).to.exist;
      expect(result?.ext).to.equal('bmp');
      expect(result?.mime).to.equal('image/bmp');
    });

    it('core, should support Uint8Array input', async function () {
      const buffer = await readFile(getFixtureUrl('fixture.bmp'));
      const uint8 = new Uint8Array(buffer);

      const result = await fileTypeFromBuffer(uint8);

      expect(result).to.exist;
      expect(result?.ext).to.equal('bmp');
      expect(result?.mime).to.equal('image/bmp');
    });

    it('core, should support ArrayBuffer input', async function () {
      const buffer = await readFile(getFixtureUrl('fixture.bmp'));
      // Convert Buffer to a tight ArrayBuffer view
      const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

      const result = await fileTypeFromBuffer(arrayBuffer);

      expect(result).to.exist;
      expect(result?.ext).to.equal('bmp');
      expect(result?.mime).to.equal('image/bmp');
    });

    it('core, should support Blob input', async function () {
      const buffer = await readFile(getFixtureUrl('fixture.bmp'));
      const blob = new Blob([buffer]);

      const result = await fileTypeFromBlob(blob);

      expect(result).to.exist;
      expect(result?.ext).to.equal('bmp');
      expect(result?.mime).to.equal('image/bmp');
    });

    it('core, should support Node Readable stream input', async function () {
      const stream = createReadStream(getFixtureUrl('fixture.bmp'));

      const result = await fileTypeFromStream(stream);

      expect(result).to.exist;
      expect(result?.ext).to.equal('bmp');
      expect(result?.mime).to.equal('image/bmp');
    });

    it('core, should support detection stream wrapping', async function () {
      const stream = createReadStream(getFixtureUrl('fixture.bmp'));

      const detectionStream = await nodeFileTypeStream(stream);

      expect(detectionStream).to.exist;
      expect(detectionStream.fileType).to.exist;
      expect(detectionStream.fileType?.ext).to.equal('bmp');
      expect(detectionStream.fileType?.mime).to.equal('image/bmp');

      // Make sure it’s still a readable stream
      expect(typeof detectionStream.pipe).to.equal('function');
    });

    it('node entry, should support file path input', async function () {
      const url = getFixtureUrl('fixture.bmp');

      const path = fileURLToPath(url);

      const result = await fileTypeFromFile(path);

      expect(result).to.exist;
      expect(result?.ext).to.equal('bmp');
      expect(result?.mime).to.equal('image/bmp');
    });

    it('node entry, should support Node stream input', async function () {
      const stream = createReadStream(getFixtureUrl('fixture.bmp'));

      const result = await nodeFileTypeFromStream(stream);

      expect(result).to.exist;
      expect(result?.ext).to.equal('bmp');
      expect(result?.mime).to.equal('image/bmp');
    });

    it('node entry, should support node detection stream wrapping', async function () {
      const stream = createReadStream(getFixtureUrl('fixture.bmp'));

      const detectionStream = await nodeFileTypeStream(stream);

      expect(detectionStream).to.exist;
      expect(detectionStream.fileType).to.exist;
      expect(detectionStream.fileType?.ext).to.equal('bmp');
      expect(detectionStream.fileType?.mime).to.equal('image/bmp');

      // Sanity: it remains a Node Readable
      expect(detectionStream).to.be.instanceOf(Readable);
    });

  });

});