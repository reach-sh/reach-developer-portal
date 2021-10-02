# Reach Developer Portal

This repository contains the source files and site generator for the Reach Developer Portal website.

## Deploy the site locally

1. Clone this repository to your computer:

    ```
    git clone https://github.com/reach-sh/reach-developer-portal.git
    ```

1. Change directory:

    ```
    cd reach-developer-portal
    ```

1. Convert source files to website files. (Node.js and npm are required. I use Node.js v16.3.0.)

    ```
    cd tools
    npm install
    npm run s1 && npm run s2 && npm run s3 && npm run s4
    node generator.js -t all
    ```

1. Install and run [http-server](https://www.npmjs.com/package/http-server):

    ```
    $ npm i --global http-server
    $ cd dev
    $ http-server -c-1
    ```

    The -c flag turns off server caching. If you plan to create/modify webpages and see the changes on refresh, you probably want to turn off browser caching, too. In Chrome, check Developer Tools > Network > Disable cache. Chrome clears this setting at exit.

    Hit CTRL-C to stop the server.

    You can also run *http-server* in the background using [pm2](https://www.npmjs.com/package/pm2):

    ```
    $ npm install pm2 -g
    $ pm2 start http-server --name http-server -- -c-1
    ```

    The `--` argument passes the `-c` flag to `http-server`.

    Helpful *pm2* commands:

    ```
    $ pm2 list     # list all processes
    $ pm2 stop 0   # stop process where id=0
    $ pm2 start 0  # start process where id=0
    ```
    
1. Browse to http://127.0.0.1:8080 or http://localhost:8080.

## Create a webpage

1. Create a page folder (e.g. colors-and-shapes):

    ```
    $ mkdir -p dev/pages/games/colors-and-shapes
    ```

1. Create an index.md file inside your page folder:

    ```
    $ touch dev/pages/games/colors-and-shapes/index.md
    ```

1. Add content to the index.md file. For sample content, browse to [sample](https://github.com/hagenhaus/reach-lang/blob/master/dev/pages/sample/index.md), click the Pencil icon, and copy.

1. Generate the webpage:

    ```
    $ node dev/tools/generator.js -t folder -d pages/games/colors-and-shapes
    ```

1. Browse to http://localhost:8080/pages/games/colors-and-shapes.

## Configure the webpage

Consider the following index.md file:

 ```
 # Colors and Shapes

Lorem ipsum dolor sit amet ...
```

Because this file specifies no frontmatter configuration options, the corresponding webpage reflects the default options:

<p><img src="./readme/page-options-defaults.png" width=800></p>

Adding frontmatter to an index.md file changes the presentation and/or behavior of the corresponding webpage. Note the added frontmatter:

```
---
author: Sarah Smiles
hasOtp: false
hasPageScrollbar: false
menuItem: mi-docs
publishedDate: 2021-09-30T14:00:00
---

# Colors and Shapes

Lorem ipsum dolor sit amet ...
```

The corresponding webpage reflects the newly specified options:

<p><img src="./readme/page-options-set.png" width=800></p>

Below is a table of the current page configuration options:

|Option|Type|Default|Description|
|-|-|-|-|
|author|string|null|Displays "By" + author.|
|hasOtp|boolean|true|Displays or hides the *On This Page* panel.|
|hasPageHeader|boolean|true|Displays or hides the title, icons, author, and publication date.|
|hasPageScrollbar|boolean|true|Displays or hides the page scrollbar. Scrolling works either way.|
|menuItem|string|null|Internal use at this point.|
|publishedDate|string|null|Displays or hides the publication date. Use 2021-09-30T14:00:00 GMT format.|

## About source files

Each webpage traces its source to a folder within the [books](https://github.com/hagenhaus/reach-lang/tree/master/dev/books) or [pages](https://github.com/hagenhaus/reach-lang/tree/master/dev/pages) directories.

<p><img src="./readme/folder-to-webpage.png" width=400></p>

The [books](https://github.com/hagenhaus/reach-lang/tree/master/dev/books) directory contains book, chapter, and leaf folders which correspond to book, chapter, and leaf webpages:

<p><img src="./readme/books.png" width=700></p>

The [pages](https://github.com/hagenhaus/reach-lang/tree/master/dev/pages) directory contains standalone and dummy folders. Standalone folders correspond to webpages. Dummy folders do not correspond to webpages. Instead, they provide a user-determined organizational hierarchy for standalone folders.

<p><img src="./readme/pages.png" width=700></p>

Each page folder (book, chapter, leaf, standalone) houses an index.md file containing the source for the webpage.

<p><img src="./readme/page-folder.png" width=300></p>

The index.md file conforms to [Github-flavored markdown](https://github.github.com/gfm/). It often begins with a hash symbol + space + page title:

```
# Demo Page
```

It may contain headings, paragraphs, lists, code snippets, tables, html, etc. as demonstrated on the [Demo Page](https://github.com/hagenhaus/reach-lang/blob/master/dev/pages/demo/index.md). It may also contain links to supplemental files (e.g. images) that reside in the same folder, and links to external resources (e.g. videos):

<p><img src="./readme/supplemental-files.png" width=600></p>

## Deploy the site publicly

1. Clone `https://github.com/reach-sh/reach-sh.github.io`.

1. Copy the following from *reach-lang* to *reach-sh.github.io*:

    * dev/index.html
    * dev/assets
    * dev/books
    * dev/pages

1. Push to *reach-sh.github.io*.

1. Browse to [reach-sh.github.io](https://reach-sh.github.io/pages/homepage/).

## About the site generator
