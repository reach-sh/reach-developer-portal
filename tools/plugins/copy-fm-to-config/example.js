import { readFileSync } from 'fs';

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkStringify from 'remark-stringify'

import copyFmToConfig from './index.js';

const md = readFileSync('example.md');
let cfgPath = './config.json';

await unified()
  .use(remarkParse)
  .use(remarkStringify)
  .use(remarkFrontmatter, ['yaml'])
  .use(copyFmToConfig, { path: cfgPath })
  .process(md)
  .then((output) => {
    //console.log(String(output));
  })

