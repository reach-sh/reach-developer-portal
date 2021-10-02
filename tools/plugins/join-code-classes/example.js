import { readFileSync } from 'fs';

import rehypeFormat from 'rehype-format';
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkSlug from 'remark-slug';
import remarkToc from 'remark-toc';
import { unified } from 'unified';

import joinCodeClasses from './index.js'

var md = readFileSync('example.md')

let html = null;
await unified()
  .use(remarkToc, { maxDepth: 2 })
  .use(remarkSlug)
  .use(joinCodeClasses)
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(`###### toc \n\n${md}`)
  .then((output) => {
    html = output;
  }, (error) => { throw error })

//console.log(String(html));