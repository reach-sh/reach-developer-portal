import CleanCss from 'clean-css';
import fs from 'fs-extra';
import minify from 'minify';
import path from 'path';
import { fileURLToPath } from 'url';
import UglifyJS from 'uglify-js';
import yargs from 'yargs';

import axios from 'axios';
import shiki from 'shiki';

import rehypeFormat from 'rehype-format';
import rehypeRaw from 'rehype-raw'
import rehypeDocument from 'rehype-document';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkSlug from 'remark-slug';
import remarkToc from 'remark-toc';
import { unified } from 'unified';

import prependTocNode from './plugins/prepend-toc-node/index.js';
import joinCodeClasses from './plugins/join-code-classes/index.js';
import copyFmToConfig from './plugins/copy-fm-to-config/index.js';

import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cfg = fs.readJsonSync(`${__dirname}/generator.json`);

const srcDir = __dirname.replace('/tools', '');

const remoteGet_ = async (url) => {
  if ( url.startsWith(cfg.repoBase) ) {
    const n = url.replace(cfg.repoBase, `${__dirname}/../../reach-lang/`);
    try { return await fs.readFile(n, 'utf8'); }
    catch (e) {
      void(e);
    }
  }
  console.log(`Downloading ${url}`);
  return (await axios.get(url)).data;
};
const CACHE = {};
const remoteGet = async (url) => {
  if ( ! (url in CACHE) ) {
    CACHE[url] = await remoteGet_(url);
  }
  return CACHE[url];
};

/************************************************************************************************
* Parse command line
* For option details, https://github.com/yargs/yargs/blob/HEAD/docs/api.md.
************************************************************************************************/

const argv = yargs(process.argv.slice(2))
  .option('dir', {
    alias: 'd',
    describe: 'Specify dirpath.',
    type: 'string',
    default: ''
  })
  .option('edit', {
    alias: 'e',
    describe: 'Add edit button to page.',
    type: 'boolean',
    default: true
  })
  .option('help', {
    alias: 'h',
    describe: 'Show help.',
    type: 'boolean'
  })
  .option('language', {
    alias: 'l',
    describe: 'Specify language (e.g. en, zh).',
    type: 'string',
    default: 'en'
  })
  .option('refresh', {
    alias: 'r',
    describe: 'Add refresh button to page.',
    type: 'boolean',
    default: true
  })
  .option('type', {
    alias: 't',
    describe: 'Specify file type.',
    type: 'string',
    choices: ['all', 'base', 'book', 'css', 'folder', 'folders', 'js'],
    demandOption: true
  })
  .option('version', {
    alias: 'v',
    describe: 'Show version.',
    type: 'boolean'
  })
  .wrap(null)
  .example([
    ['$0'],
    ['$0 -t all'],
    ['$0 -t book -d books/demo'],
    ['$0 -t css'],
    ['$0 -t base -l en'],
    ['$0 -t folder -d en/books/demo'],
    ['$0 -t folders -d en/books/demo'],
    ['$0 -t js']
  ])
  .argv

/************************************************************************************************
* normalizeDir
************************************************************************************************/

const normalizeDir = (s) => {
  return s.endsWith('/') ? s.slice(0, -1) : s;
}

/************************************************************************************************
* processBook
************************************************************************************************/
const processBook = (baseDir, relDir) => {
  let folder = `${baseDir}/${relDir}`;
  console.log(`Building book ${relDir}`);
}

/************************************************************************************************
* processCss
************************************************************************************************/
const processCss = async () => {
  let iPath = `${srcDir}${cfg.iCssPath}`;
  let oPath = `${srcDir}${cfg.oCssPath}`;
  console.log(`Minifying ${cfg.iCssPath.slice(1)}`);
  let input = await fs.readFile(iPath, 'utf8');
  let options = { level: 2 };
  let output = new CleanCss(options).minify(input);
  await fs.writeFile(oPath, output.styles);
};

/************************************************************************************************
* processBase
************************************************************************************************/

const processBase = async (lang) => {
  let iPath = `${srcDir}/${lang}/base.html`;
  let oPath = `${srcDir}/${lang}/index.html`;
  console.log(`Minifying ${iPath}`);
  let options = { html: {}, };
  const output = await minify(iPath, options);
  await fs.writeFile(oPath, output);
};

/************************************************************************************************
* processJs
************************************************************************************************/

const processJs = async () => {
  let iPath = `${srcDir}${cfg.iJsPath}`;
  let oPath = `${srcDir}${cfg.oJsPath}`;
  console.log(`Minifying ${cfg.iJsPath.slice(1)}`);
  let input = await fs.readFile(iPath, 'utf8');
  let options = {};
  let output = new UglifyJS.minify(input, options);
  if (output.error) throw output.error;
  await fs.writeFile(oPath, output.code);
}

/************************************************************************************************
* evaluateCodeSnippet
************************************************************************************************/

const evaluateCodeSnippet = (code) => {
  const spec = {
    "numbered": true,
    "language": null, // indicates highlighted
    "url": null,      // indicates loaded
    "range": null     // indicates ranged
  };

  if (code.classList && code.classList.length == 1 && code.classList[0].startsWith('language')) {
    const arrLC = code.classList[0].replace('language-', '').split('_');
    for (let i = 0; i < arrLC.length; i++) {
      if (arrLC[i] == 'unnumbered' || arrLC[i] == 'nonum') {
        spec.numbered = false;
      } else {
        spec.language = arrLC[i];
      }
    }
  }

  const arr = code.textContent.trimEnd().split(/\r?\n/g);
  if (arr.length > 0) {
    const line1 = arr[0].replace(/\s+/g, '');
    if (line1.slice(0, 5) == 'load:') {
      const url = line1.slice(5);
      if (url.slice(0, 4) == 'http') { spec.url = url; }
      else { spec.url = `${cfg.repoBase}${url}`; }
      if (arr.length > 1) {
        const line2 = arr[1].replace(/\s+/g, '');
        if (line2.slice(0, 6) == 'range:') {
          spec.range = line2.slice(6);
        }
      }
    }
  }
  return spec;
}

/************************************************************************************************
* processCodeSnippet
************************************************************************************************/

const processCodeSnippet = (doc, pre, code, spec) => {
  let firstLineIndex = null;
  let lastLineIndex = null;
  if (spec.range) {
    let rangeArr = spec.range.split('-');
    firstLineIndex = rangeArr[0] - 1;
    if (rangeArr.length > 1) {
      lastLineIndex = rangeArr[1] - 1;
    }
  }

  let arr = code.textContent.split(/\r?\n/g);
  let olStr = '<ol class="snippet">';
  for (let i = 0; i < arr.length; i++) {

    if (firstLineIndex && i < firstLineIndex) {
      continue;
    } else if (lastLineIndex && lastLineIndex < i) {
      break;
    }

    olStr += `<li value="${i + 1}">${arr[i]}</li>`;

  }
  olStr += '</ol>';
  code.remove();
  let olEl = doc.createRange().createContextualFragment(olStr);
  pre.append(olEl);
  pre.classList.add('snippet');
  pre.classList.add(spec.numbered ? 'numbered' : 'unnumbered');
}

/************************************************************************************************
* transformReachDoc
************************************************************************************************/

const transformReachDoc = (md) => {
  const match1 = /# {#(.*)}/; // Example: # {#guide-ctransfers}
  const match2 = '```reach';
  const match3 = /\${toc}/;

  const mdArr = md.split('\n');
  md = '';
  for (let i = 0; i < mdArr.length; i++) {
    let line = mdArr[i];

    if (line.match(match1)) { line = line.replace(match1, '#'); }
    if (line.match(match2)) { line = line.replace(match2, '```js'); }
    if (line.match(match3)) { line = line.replace(match3, ''); }

    md += `${line}\n`;
  }
  return md;
}

/************************************************************************************************
* processFolder
************************************************************************************************/

const processFolder = async (baseDir, relDir) => {

  let lang = relDir.split('/')[0];
  let folder = `${baseDir}/${relDir}`;
  let mdPath = `${folder}/${cfg.mdFile}`;
  let cfgPath = `${folder}/${cfg.cfgFile}`;
  let pagePath = `${folder}/${cfg.pageFile}`;
  let otpPath = `${folder}/${cfg.otpFile}`;

  console.log(`Building page ${relDir}`);

  // Create fresh config file with default values.
  let configJson = {};
  configJson.author = null;
  configJson.background = 'white';
  configJson.bookPath = null;
  configJson.bookTitle = null;
  configJson.chapters = null;
  configJson.hasOtp = true;
  configJson.hasCustomBase = false;
  configJson.hasEditBtn = argv.e;
  configJson.hasPageHeader = true;
  configJson.hasPageScrollbar = true;
  configJson.hasRefreshBtn = argv.r;
  configJson.menuItem = null;
  configJson.pages = null;
  configJson.pathname = null;
  configJson.publishedDate = null;
  configJson.title = null;
  await fs.writeFile(cfgPath, JSON.stringify(configJson, null, 2));

  /*
  const docOptions = {
    "title": "Reach Developer Portal",
    "link": [
      { "rel": "icon", "type": "image/png", "href": "/assets/favicon.png" },
      { "rel": "stylesheet", "type": "text/css", "href": "https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" },
      { "rel": "stylesheet", "type": "text/css", "href": "https://use.fontawesome.com/releases/v5.6.3/css/all.css" },
      { "rel": "stylesheet", "type": "text/css", "href": "/assets/styles.min.css" }
    ]
  };
  */

  let md = await fs.readFile(mdPath, 'utf8');

  // If src == remote, get the remote markdown..
  const re = /---([\s\S]*?)---/;
  const fm = md.match(re);
  if (fm) {
    const fmArr = fm[0].split('\n');
    for (let i = 0; i < fmArr.length; i++) {
      const s = fmArr[i].replaceAll(' ', '').trim();
      if (s.substring(0, 4) === 'src:') {
        const target = `${cfg.repoSrcDir}${s.substring(4)}`;
        const url = `${cfg.repoBase}${target}`;
        const content = (await remoteGet(url));
        md = fm[0] + '\n' + transformReachDoc(content);
        break;
      }
    }
  }

  // markdown-to-html pipeline.
  const output = await unified()
    .use(remarkParse) // Parse markdown to Markdown Abstract Syntax Tree (MDAST).
    .use(remarkFrontmatter) // Prepend YAML node with frontmatter.
    .use(copyFmToConfig, { path: cfgPath }) // Remove YAML node and write frontmatter to config file.
    .use(prependTocNode) // Prepend Heading, level 6, value "toc".
    //.use(() => (tree) => { console.dir(tree); })
    .use(remarkToc, { maxDepth: 2 }) // Build toc list under the heading.
    //.use(() => (tree) => { console.dir(JSON.stringify(tree.children[1].children, null, 2)); })
    .use(remarkSlug) // Create IDs (acting as anchors) for headings throughout the document.
    .use(joinCodeClasses) // Concatenate (using _) class names for code elements.
    .use(remarkGfm) // Normalize Github Flavored Markdown so it can be converted to html.
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert MDAST to html.
    .use(rehypeRaw) // Copy over html embedded in markdown.
    //.use(rehypeDocument, docOptions) // Adds full-page html tags.
    .use(rehypeFormat) // Prettify html.
    .use(rehypeStringify) // Serialize html.
    .process(md); // Push the markdown through the pipeline.

  //console.log(String(output));

  const doc = new JSDOM(output).window.document;

  // Process OTP.
  if (doc.getElementById('toc')) {
    doc.getElementById('toc').remove();
    const otpEl = doc.querySelector('ul');
    otpEl.querySelectorAll('li').forEach(el => el.classList.add('dynamic'));
    otpEl.querySelectorAll('ul').forEach(el => el.classList.add('dynamic'));
    otpEl.querySelectorAll('p').forEach(el => {
      const p = el.parentNode;
      while (el.firstChild) { p.insertBefore(el.firstChild, el); }
      p.removeChild(el);
    })
    await fs.writeFile(otpPath, `<ul>${otpEl.innerHTML.trim()}</ul>`);
    otpEl.remove();
  }

  // Read config.json.
  configJson = await fs.readJson(cfgPath);

  // Update config.json with title and pathname.
  const title = doc.querySelector('h1').textContent;
  doc.querySelector('h1').remove();
  configJson.title = title;
  configJson.pathname = folder;

  // Update config.json with book information.
  if (configJson.bookTitle) {
    configJson.bookPath = relDir;
  } else {
    const pArray = folder.split('/');
    if (pArray.includes('books')) {
      const bArray = pArray.slice(0, pArray.indexOf('books') + 2);
      const bPath = bArray.join('/');
      const bIdArray = pArray.slice(pArray.indexOf('books') - 1, pArray.indexOf('books') + 2);
      configJson.bookPath = bIdArray.join('/');
      const bookConfigJsonFile = `${bPath}/config.json`;
      const bookConfigJson = await fs.readJson(bookConfigJsonFile);
      configJson.bookTitle = bookConfigJson.bookTitle;
    }
  }

  // Write config.json.
  await fs.writeFile(cfgPath, JSON.stringify(configJson, null, 2));

  // Adjust image urls.
  doc.querySelectorAll('img').forEach(img => {
    img.src = `/${relDir}/${img.src}`;
  });

  // Process code snippets.
  const preArray = doc.querySelectorAll('pre');
  for (let i = 0; i < preArray.length; i++) {
    const pre = preArray[i];
    const code = pre.querySelector('code');

    // Evaluate code snippet
    if (!code) { continue; }
    const spec = evaluateCodeSnippet(code);

    // Get remote content if specified.
    if (spec.url) {
      code.textContent = await remoteGet(spec.url);
    }

    // Replace < and > with code.
    code.textContent = code.textContent/*.replaceAll('<', '&lt;').replaceAll('>', '&gt;')*/.trimEnd();

    // Highlight the content if specified.
    // https://github.com/shikijs/shiki/blob/main/docs/themes.md
    // https://github.com/shikijs/shiki/blob/main/docs/languages.md
    if (spec.language) {
      await shiki.getHighlighter({ theme: 'github-light' })
        .then(highlighter => {
          code.textContent = highlighter.codeToHtml(code.textContent, spec.language)
            //.replace('<pre class="shiki" style="background-color: #282A36"><code>', '') // dracula
            .replace('<pre class="shiki" style="background-color: #ffffff"><code>', '') // github-light
            .replaceAll('<span class="line">', '')
            .replaceAll('</span></span>', '</span>')
            .replace('</code></pre>', '');
        });
    }

    processCodeSnippet(doc, pre, code, spec);
  }

  // Create soft link in this folder to index.html file at root.
  if(configJson.hasCustomBase == false) {
    try { await fs.unlink(`${folder}/index.html`); } catch (e) { void(e); }
    const backstepCount = relDir.split('/').length - 1;
    let backstepUrl = '';
    for (let i=0; i < backstepCount; i++) {
      backstepUrl = backstepUrl + '../';
    }
    const target = `${backstepUrl}index.html`;
    const symlink = `${folder}/index.html`;
    await fs.symlink(target, symlink);
  }

  // Write DOM to file.
  await fs.writeFile(pagePath, doc.body.innerHTML.trim());
}

/************************************************************************************************
* findAndProcessFolder
************************************************************************************************/

const findAndProcessFolder = async (folder) => {
  const fileArr = await fs.readdir(folder);
  await Promise.all(fileArr.map(async (p) => {
    if (p === 'index.md') {
      const baseDir = normalizeDir(srcDir);
      let relDir = normalizeDir(folder.replace(baseDir, ''));
      relDir = relDir.startsWith('/') ? relDir.slice(1) : relDir;
      return await processFolder(baseDir, relDir);
    } else {
      const absolute = path.join(folder, p);
      if ((await fs.stat(absolute)).isDirectory()) {
        return await findAndProcessFolder(absolute);
      }
    }
  }));
};

/************************************************************************************************
* findAndProcessFolders
************************************************************************************************/

const findAndProcessFolders = async (folder) =>
  await findAndProcessFolder(folder);

/************************************************************************************************
* Process specified type.
************************************************************************************************/

(async () => {
  const goals = [];
  if ( argv.t === 'base' ) {
    goals.push(processBase(argv.l));
  }
  if ( argv.t === 'book' ) {
    goals.push(processBook(normalizeDir(srcDir), normalizeDir(argv.d)));
  }
  if ( argv.t === 'css' || argv.t === 'all' ) {
    goals.push(processCss());
  }
  if ( argv.t === 'js' || argv.t === 'all' ) {
    goals.push(processJs());
  }
  if ( argv.t === 'folder' ) {
    goals.push(processFolder(normalizeDir(srcDir), normalizeDir(argv.d)));
  }
  if ( argv.t === 'folders' ) {
    goals.push(findAndProcessFolders(`${normalizeDir(srcDir)}/${normalizeDir(argv.d)}`));
  }
  if ( argv.t === 'all' ) {
    goals.push(processBase('en'));
    // Need to add --ignore flag.
    goals.push(findAndProcessFolders(`${normalizeDir(srcDir)}`));
  }
  await Promise.all(goals);
})();
