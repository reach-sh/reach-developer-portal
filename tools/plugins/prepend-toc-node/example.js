import { readFileSync } from 'fs';

import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import prependTocNode from './index.js';

const md = readFileSync('example.md');

await unified()
  .use(remarkParse)
  .use(prependTocNode)
  .use(() => (tree) => { console.log(tree); })
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify)
  .process(md)
  .then((output) => {
  }, (error) => { throw error })