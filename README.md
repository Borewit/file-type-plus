[![NPM version](https://img.shields.io/npm/v/@file-type/plus.svg)](https://npmjs.org/package/@file-type/plus)
[![CI](https://github.com/Borewit/file-type-plus/actions/workflows/ci.yml/badge.svg)](https://github.com/Borewit/file-type-plus/actions/workflows/ci.yml)
[![npm downloads](http://img.shields.io/npm/dm/@file-type/plus.svg)](https://npmcharts.com/compare/@file-type/plus?start=365)

# @file-type/plus

In addition to [file-type](https://github.com/sindresorhus/file-type), 
which focuses on mostly binary file signature detection, 
@file-type/plus also supports structured and container-based formats such as:
- CFBF compound documents, such as `.doc`, `.xls`, `.ppt`, `.pub`
- PDF subtypes, such as Adobe Illustrator .ai
- XML-based formats, such as SVG, SMIL, RSS

It behaves exactly like [file-type](https://github.com/sindresorhus/file-type), but automatically enables:
- [@file-type/pdf](https://github.com/Borewit/file-type-pdf)
- [@file-type/xml](https://github.com/Borewit/file-type-xml)
- [@file-type/cfbf](https://github.com/Borewit/file-type-xml)

## Install

```shell
npm install @file-type/plus
```

## Usage

### From Buffer
```js
import {fileTypeFromBuffer} from '@file-type/plus';

const result = await fileTypeFromBuffer(buffer);

console.log(result);
// { ext: 'pdf', mime: 'application/pdf' }
```

### From Blob
```js
import {fileTypeFromBlob} from '@file-type/plus';

const result = await fileTypeFromBlob(blob);
```

### From Stream
```js
import {fileTypeFromStream} from '@file-type/plus';
import {createReadStream} from 'node:fs';

const stream = createReadStream('file.pdf');
const result = await fileTypeFromStream(stream);
```

### Detection Stream
```js
import {fileTypeStream} from '@file-type/plus';

const detectionStream = await fileTypeStream(stream);

console.log(detectionStream.fileType);
```

## Node specific API
```js
import {fileTypeFromFile} from '@file-type/plus/node';

const result = await fileTypeFromFile('document.doc');
```
