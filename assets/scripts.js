const currentPage = {
  folder: null,
  bookPath: null,
  hasOtp: false,
  src: null
};

let updateOtp = false;
const github = 'https://github.com/reach-sh/reach-developer-portal/blob/master';

const pathnameToId = (pathname) => { return pathname.replace(/^\/|\/$/g, '').replace(/\//g, '_'); }
const idToPathName = (id) => { return id.replace(/_/g, '/'); }

let lang = window.navigator.language.split('-')[0];
const homepage = `/${lang}/pages/homepage/`;

/************************************************************************************************
* getWinWidth
************************************************************************************************/

const getWinWidthStr = () => {
  let s = window.innerWidth;
  if (s >= 1200) { return 'xl' }
  else if (s >= 992) { return 'lg' }
  else if (s >= 768) { return 'md' }
  else if (s >= 576) { return 'sm' }
  else return 'xs'
}

const maxColWidth = '280px';
let winWidth = getWinWidthStr();

/************************************************************************************************
* establishDisplay
************************************************************************************************/

const establishDisplay = () => {
  if (currentPage.bookPath) {
    if (winWidth == 'xl') {
      document.getElementById('book-col').style.display = 'block';
      document.getElementById('book-col').style.maxWidth = maxColWidth;
      document.querySelector('div.show-book-col').style.display = 'none';
    } else if (winWidth == 'lg' || winWidth == 'md') {
      document.getElementById('book-col').style.display = 'block';
      document.getElementById('book-col').style.maxWidth = maxColWidth;
      document.querySelector('div.show-book-col').style.display = 'none';
    } else if (winWidth == 'sm' || winWidth == 'xs') {
      document.getElementById('book-col').style.display = 'none';
      document.getElementById('book-col').style.maxWidth = 'none';
      document.querySelector('div.show-book-col').style.display = 'block';
    }
  }

  if (currentPage.hasOtp) {
    if (winWidth == 'xl') {
      document.getElementById('otp-col').style.display = 'block';
      document.getElementById('otp-col').style.maxWidth = maxColWidth;
      document.querySelector('button.show-otp-col').style.display = 'none';
    } else if (winWidth == 'lg' || winWidth == 'md') {
      document.getElementById('otp-col').style.display = 'none';
      document.getElementById('otp-col').style.maxWidth = maxColWidth;
      document.querySelector('button.show-otp-col').style.display = 'block';
    } else if (winWidth == 'sm' || winWidth == 'xs') {
      document.getElementById('otp-col').style.display = 'none';
      document.getElementById('otp-col').style.maxWidth = 'none';
      document.querySelector('button.show-otp-col').style.display = 'block';
    }
  }
}

/************************************************************************************************
* window horizontal resize
************************************************************************************************/

window.addEventListener('resize', () => {
  let newWinWidth = getWinWidthStr();
  if (winWidth != newWinWidth) {
    winWidth = newWinWidth;
    establishDisplay();
  }
});

/************************************************************************************************
* getWebpage
* folder examples:
*   /pages/demo/
*   /books/demo/birds/owls/
* hash examples:
*   #create-a-project
************************************************************************************************/

const getWebpage = async (folder, hash, updateHistory) => {

  folder = folder == '/' || folder == `/${lang}/` ? homepage : folder;
  const url = `${window.location.origin}${folder}`;
  const configJsonUrl = `${url}config.json`;
  const pageHtmlUrl = `${url}page.html`;
  const otpHtmlUrl = `${url}otp.html`;
  const folderId = pathnameToId(folder);

  //console.log(`${folder}${hash}`);
  //console.log(configJsonUrl);
  //console.log(pageHtmlUrl);
  //console.log(otpHtmlUrl);
  //console.log(folderId);

  try {

    let configJson = (await axios.get(configJsonUrl)).data;
    let pageHtml = (await axios.get(pageHtmlUrl)).data;
    let otpHtml = (await axios.get(otpHtmlUrl)).data;
    //console.log(JSON.stringify(configJson, null, 2));
    //console.log(pageHtml);
    //console.log(otpHtml);

    // Book or different book?
    if (configJson.bookPath && configJson.bookPath != currentPage.bookPath) {
      document.getElementById('about-this-book').innerHTML = configJson.bookTitle;
      let bookHtml = document.createRange().createContextualFragment((await axios.get(`${window.location.origin}/${configJson.bookPath}/book.html`)).data);
      document.querySelectorAll('#book-col div.dynamic').forEach(n => n.remove());
      document.querySelector('#book-col').append(bookHtml);

      // On click chapter-icon.
      document.querySelectorAll('#book-col i.chapter-icon').forEach(el => {
        el.addEventListener('click', (event) => {
          const item = event.target;
          let pages = item.closest('div.chapter').querySelector('div.pages');
          if (item.classList.contains('fa-angle-right')) {
            item.classList.remove('fa-angle-right');
            item.classList.add('fa-angle-down');
            pages.style.display = 'block';
          } else {
            item.classList.remove('fa-angle-down');
            item.classList.add('fa-angle-right');
            pages.style.display = 'none';
          }
        });
      });

      // On click book-col chapter-title or page-title.
      document.querySelectorAll('#book-col div.chapter-title, #book-col div.page-title').forEach(el => {
        el.addEventListener('click', (event) => {
          followLink(`/${idToPathName(event.target.id)}/`);
        });
      });
    }
    currentPage.bookPath = configJson.bookPath;

    // Write page title.
    document.querySelector('div.hh-viewer-wrapper span.title').textContent = configJson.title;

    // Update and show/hide edit btn.
    currentPage.src = `${github}${folder}index.md`;
    if (configJson.hasEditBtn) {
      document.querySelector('div.hh-page-header button.edit-btn').style.display = 'block';
    } else {
      document.querySelector('div.hh-page-header button.edit-btn').style.display = 'none';
    }

    // Show/hide refresh btn.
    if (configJson.hasRefreshBtn) {
      document.querySelector('div.hh-page-header button.refresh').style.display = 'block';
    } else {
      document.querySelector('div.hh-page-header button.refresh').style.display = 'none';
    }

    // Write author
    if (configJson.author) {
      document.querySelector('div.hh-viewer-wrapper span.author').innerHTML = `By ${configJson.author}`;
    } else {
      document.querySelector('div.hh-viewer-wrapper span.author').innerHTML = '';
    }

    // Write published data
    if (configJson.publishedDate) {
      let date = new Date(configJson.publishedDate)
      if (document.querySelector('div.hh-viewer-wrapper span.author').innerHTML) {
        document.querySelector('div.hh-viewer-wrapper span.published-date').innerHTML = `on ${date.toLocaleDateString()}`;
      } else {
        document.querySelector('div.hh-viewer-wrapper span.published-date').innerHTML = `Published on ${date.toLocaleDateString()}`;
      }
    } else {
      document.querySelector('div.hh-viewer-wrapper span.published-date').innerHTML = '';
    }

    // Write page html.
    pageHtml = document.createRange().createContextualFragment(pageHtml);
    document.querySelector('div.hh-viewer-wrapper div.hh-viewer').textContent = '';
    document.querySelector('div.hh-viewer-wrapper div.hh-viewer').append(pageHtml);

    // Show/hide page scrollbar
    if (configJson.hasPageScrollbar) {
      document.getElementById('page-col').classList.remove('noscroll');
    } else {
      document.getElementById('page-col').classList.add('noscroll');
    }

    // On click link on page.
    document.querySelectorAll('div.hh-viewer-wrapper div.hh-viewer a').forEach(el => {
      el.addEventListener('click', (event) => {
        event.preventDefault();
        followLink(event.target.closest('a').href);
      });
    });

    // Write otp html.
    if (configJson.hasOtp) {
      document.querySelectorAll('#otp-col ul ul.dynamic').forEach(n => { n.remove(); });
      document.querySelectorAll('#otp-col ul li.dynamic').forEach(n => { n.remove(); });
      const otpUl = document.querySelector('#otp-col ul');
      const otpDoc = document.createRange().createContextualFragment(otpHtml);
      otpDoc.querySelector('ul').querySelectorAll(':scope > li').forEach((el, index) => {
        if (index == 0) {
          let ul = el.querySelector('ul');
          if (ul) {
            otpUl.querySelector('li').append(ul);
          }
        } else {
          otpUl.append(el);
        }
      })
    }
    currentPage.hasOtp = configJson.hasOtp;

    // On click link on otp.
    document.querySelectorAll('#otp-col li.dynamic a').forEach(el => {
      el.addEventListener('click', (event) => {
        event.preventDefault();
        followLink(event.target.href);
      });
    });

    // Adjust navbar active indicator.
    if (configJson.menuItem) {
      if (!document.getElementById(configJson.menuItem).classList.contains('active')) {
        document.querySelectorAll('header a').forEach(el => { el.classList.remove('active'); });
        document.getElementById(configJson.menuItem).classList.add('active');
      }
    } else {
      document.querySelectorAll('header a').forEach(el => { el.classList.remove('active'); });
    }

    // Adjust book-col active indicators.
    document.querySelectorAll('#book-col div.chapter-title, #book-col div.page-title').forEach(el => {
      el.classList.remove('active');
    });

    let el = document.getElementById(folderId);
    if (el) {
      el.classList.add('active');
      let chapter = el.closest('div.chapter');
      let pages = chapter.querySelector('div.pages');
      if (pages.hasChildNodes()) {
        let icon = chapter.querySelector('i.chapter-icon');
        icon.classList.remove('fa-angle-right');
        icon.classList.add('fa-angle-down');
        pages.style.display = 'block';
      }
    }

    // Establish correct display values.
    establishDisplay();

    // Display book.
    if (configJson.bookPath) {
      document.getElementById('book-col').classList.remove('banish');
      document.querySelector('div.show-book-col').classList.remove('banish');
    } else {
      document.getElementById('book-col').classList.add('banish');
      document.querySelector('div.show-book-col').classList.add('banish');
    }

    // Display page.
    if (configJson.hasPageHeader) { document.querySelector('div.hh-page-header').style.display = 'block'; }
    else { document.querySelector('div.hh-page-header').style.display = 'none'; }
    document.getElementById('page-col').style.display = 'block';

    // Display OTP.
    if (configJson.hasOtp) {
      document.getElementById('otp-col').classList.remove('banish');
      document.querySelector('button.show-otp-col').classList.remove('banish');
    } else {
      document.getElementById('otp-col').classList.add('banish');
      document.querySelector('button.show-otp-col').classList.add('banish');
    }

    // Scroll to proper place and update history
    currentPage.folder = `${folder}`;
    if (hash && hash !== '#on-this-page') {
      document.getElementById(hash.substring(1)).scrollIntoView();
      window.history.pushState(null, null, `${window.location.origin}${folder}${hash}`);
    } else {
      document.getElementById('page-col').scrollTo(0, 0);
      window.history.pushState('{}', '', `${window.location.origin}${folder}`);
    }

  } catch (error) {
    console.log(error);
  }
}

/************************************************************************************************
* followLink
* href is a full or partial path that starts with /. It may have a hash.
************************************************************************************************/

const followLink = async (href) => {
  let a = document.createElement('a');
  a.href = href;

  if (a.hostname === window.location.hostname) {
    if (currentPage.folder == a.pathname && a.hash) {
      if (a.hash === '#on-this-page') {
        history.pushState(null, null, currentPage.folder);
        document.getElementById('page-col').scrollTo(0, 0);
      } else {
        history.pushState(null, null, a.hash);
        document.getElementById(a.hash.substring(1)).scrollIntoView();
      }
    }
    else {
      await getWebpage(a.pathname, null, true);
    }
  } else {
    window.open(a.href, '_blank').focus();
  }
}

/************************************************************************************************
* window onpopstate
************************************************************************************************/

window.onpopstate = function (event) {
  let a = document.createElement('a');
  a.href = document.location.href;
  getWebpage(a.pathname, null, false);
};

/************************************************************************************************
* book and otp listeners
************************************************************************************************/

document.querySelector('button.hide-book-icon').addEventListener('click', (event) => {
  if (winWidth == 'sm' || winWidth == 'xs') {
    document.getElementById('page-col').style.display = 'block';
  }
  document.getElementById('book-col').style.display = 'none';
  document.querySelector('div.show-book-col').style.display = 'block';
});

document.querySelector('button.show-book-col').addEventListener('click', (event) => {
  if (winWidth == 'sm' || winWidth == 'xs') {
    document.getElementById('page-col').style.display = 'none';
  }
  document.getElementById('book-col').style.display = 'block';
  document.querySelector('div.show-book-col').style.display = 'none';
});

document.querySelector('button.hide-otp-icon').addEventListener('click', (event) => {
  if (winWidth == 'sm' || winWidth == 'xs') {
    document.getElementById('page-col').style.display = 'block';
  }
  document.getElementById('otp-col').style.display = 'none';
  document.querySelector('button.show-otp-col').style.display = 'block';
});

document.querySelector('button.show-otp-col').addEventListener('click', (event) => {
  if (winWidth == 'sm' || winWidth == 'xs') {
    document.getElementById('page-col').style.display = 'none';
  }
  document.getElementById('otp-col').style.display = 'block';
  document.querySelector('button.show-otp-col').style.display = 'none';
});

/************************************************************************************************
* on click
************************************************************************************************/

document.querySelectorAll('header a.navbar-brand').forEach(el => {
  el.addEventListener('click', (event) => {
    event.preventDefault();
    followLink(event.currentTarget.href);
  });
});

document.querySelectorAll('header a.follow').forEach(el => {
  el.addEventListener('click', (event) => {
    event.preventDefault();
    followLink(event.currentTarget.href);
  });
});

document.querySelector("#otp-col a[href='#on-this-page']").addEventListener('click', (event) => {
  event.preventDefault();
  followLink('#on-this-page');
});

document.querySelector('div.hh-viewer-wrapper button.edit-btn').addEventListener('click', (event) => {
  event.preventDefault();
  followLink(currentPage.src);
});

document.querySelector('div.hh-page-header button.refresh').addEventListener('click', (event) => {
  event.preventDefault();
  getWebpage(window.location.pathname, null, false);
});

document.getElementById('about-this-book').addEventListener('click', (event) => {
  event.preventDefault();
  getWebpage(`/${currentPage.bookPath}/`, null, true);
});

/************************************************************************************************
* onPageColScroll
************************************************************************************************/

document.getElementById('page-col').addEventListener('scroll', function (event) {
  if (!document.querySelectorAll('#otp-col li.dynamic').length) {
    event.target.onscroll = null;
  } else if (updateOtp == false) {
    updateOtp = true;
  } else {
    let found = false;

    let a = document.querySelectorAll('#page-col div.hh-viewer h1, #page-col div.hh-viewer h2');
    if (a.length) {
      for (let i = a.length - 1; i >= 0; i--) {
        let rect = a[i].getBoundingClientRect();
        if (rect.y <= 80.0) {
          found = true;
          let link = document.querySelector('#otp-col ul li a[href="' + "#" + a[i].id + '"]');
          if (!link.classList.contains('active')) {
            document.querySelector('#otp-col a.active').classList.remove('active');
            link.classList.add('active');
            window.history.pushState(null, null, `${window.location.origin}${currentPage.folder}#${a[i].id}`);
          }
          break;
        }
      }
      if (found == false) {
        if (!document.querySelector("#otp-col a[href='#on-this-page']").classList.contains('active')) {
          document.querySelector('#otp-col a.active').classList.remove('active');
          document.querySelector("#otp-col a[href='#on-this-page']").classList.add('active');
        }
      }
    }
  }
});

/************************************************************************************************
* on load
************************************************************************************************/

//console.log(window.location.origin);
//console.log(window.location.href);
//console.log(window.location.pathname);
getWebpage(window.location.pathname, window.location.hash, true);
