# Plugins

```
import { readFileSync } from 'fs';

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkStringify from 'remark-stringify'

import buildConfig from './index.js';

const mdJson = readFileSync('example-json.md');
const mdYaml = readFileSync('example-yaml.md');
let cfgPath = './config.json';

const pipeline = async (md) => {
  unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkFrontmatter, ['yaml', { type: 'json', fence: { open: '{', close: '}' } }])
    .use(buildConfig, {path: cfgPath})
    .process(md)
    .then((output) => {
      //console.log(String(output));
      return 1;
    })
}

(async () => {
  await pipeline(mdJson);
  await pipeline(mdYaml);
})();
```

```
---
categories:
- Development
- VIM
date: "2012-04-06"
description: spf13-vim is a cross platform distribution of vim plugins and resources
  for Vim.
slug: spf13-vim-3-0-release-and-new-website
tags:
- .vimrc
- plugins
- spf13-vim
- vim
title: spf13-vim 3.0 release and new website
---

# Other markdown

Lorem ipsum dolor sit amete, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
```

https://github.com/unifiedjs/handbook

https://unifiedjs.com/learn/recipe/remove-node/