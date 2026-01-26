// Open external links in new tab
var links = document.links;

for(var i = 0; i < links.length; i++) {
  if (links[i].hostname != window.location.hostname) {
    links[i].target = '_blank';
    links[i].rel = 'noopener';
  }
}

window.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.md-container');
  container.style.visibility = 'visible';
});

document.addEventListener('DOMContentLoaded', function() {
  let main = document.querySelector(".md-main");
  let isHomepage = location.pathname === "/" || location.pathname === "/ja/" || location.pathname === "/4.4/" || location.pathname === "/4.2/" || location.pathname === "/4.6/" || location.pathname === "/4.8/" | location.pathname === "/4.10/" || location.pathname === "/5.x/" || location.pathname === "/tr/" || location.pathname === "/pt-br/" || location.pathname === "/ar/" || location.pathname === "/index.html";
  if (main) {
    if (isHomepage) {
      main.classList.add('homepage');
    } else {
      main.classList.remove('homepage');
    }
  }
});

// Detect platform for search hotkey indicator
(function() {
  var platform = navigator.platform.toLowerCase();
  if (platform.indexOf('win') !== -1) {
    document.documentElement.classList.add('platform-windows');
  } else if (platform.indexOf('linux') !== -1) {
    document.documentElement.classList.add('platform-linux');
  } else if (platform.indexOf('mac') !== -1) {
    document.documentElement.classList.add('platform-mac');
  }
})();

// Ctrl+K / Cmd+K keyboard shortcut for search (works across all keyboard layouts)
document.addEventListener('keydown', function(e) {
  // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    var searchToggle = document.getElementById('__search');
    if (searchToggle) {
      searchToggle.checked = true;
      // Focus the search input
      setTimeout(function() {
        var searchInput = document.querySelector('.md-search__input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }, 100);
    }
  }
});

function injectScript(src, cb) {
  let script = document.createElement('script');

  script.src = src;
  cb && (script.onload = cb);
  document.body.append(script);
}

// Add LeadFeeder
window.ldfdr = window.ldfdr || {};
injectScript('https://lftracker.leadfeeder.com/lftracker_v1_kn9Eq4Rwz5KaRlvP.js');

// Version selection

var rootVersion = '6.x';

let pathsLang = window.location.pathname.split('/');

if (pathsLang[1] === 'tr' || pathsLang[1] === 'pt-br' || pathsLang[1] === 'ja' || pathsLang[1] === 'ar') {
  document.getElementById('versionsDiv').style.display = 'none';
}
else {
  document.getElementById('versionsDiv').style.display = 'inline-block';
}

// Show the list of available Wallarm versions

function versionClicked (event) {
  if (document.getElementById('versionsList').style.display === 'none') {
    document.getElementById('versionsList').style.display = 'block'
    document.getElementById('versionsMain').classList.add("versions-main-active")
  } else {
    document.getElementById('versionsList').style.display = 'none'
    document.getElementById('versionsMain').classList.remove("versions-main-active")
  }
}

// Open the docs for selected Wallarm version and change value in the selector
function goToVersion (event, currentVersion, version) {
  event.preventDefault()

  if (currentVersion === version) {
    window.location.reload(false);
  }
  else {
    let tmp = window.location.pathname.split('/');
    window.top.location.href = tmp.join('/');

    if (version === rootVersion) {
      window.top.location.href = window.location.pathname.replace('/'+currentVersion+'/','/');
    } else {
      if (currentVersion === rootVersion) {
          window.top.location.href = window.location.pathname.replace('/','/'+version+'/');
      }
      else {
          window.top.location.href = window.location.pathname.replace('/'+currentVersion+'/','/'+version+'/')
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  const addButtons = document.querySelectorAll('.md-header__button[for="__search"]');

  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.body.classList.toggle('scrolllock');
    });
  });

  const removeButton = document.querySelector('.md-search__icon[for="__search"]');
  if (removeButton) {
    removeButton.addEventListener('click', () => {
      document.body.classList.remove('scrolllock');
    });
  }
});

// Stop scrolling if sidebar is open
document.addEventListener('DOMContentLoaded', (event) => {
  const sidebarToggle = document.querySelector('.md-header__button[for="__drawer"]');
  const overlay = document.querySelector('.md-overlay');

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      if (document.documentElement.style.overflow === 'hidden') {
        document.documentElement.style.overflow = 'visible';
      } else {
        document.documentElement.style.overflow = 'hidden';
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      document.documentElement.style.overflow = 'visible';
    });
  }
});

// Mobile nav fix:
// Our custom nav template expands L1/L2 by default (inputs are checked),
// which can leave the Material mobile drawer "drilled down" into a random subtree
// (often the last expanded one, e.g. "FAQ"). When opening the drawer on mobile,
// reset the nav toggles to the active page's path.
function resetMobileDrawerNavigationToActivePath() {
  // Match Material's breakpoint where the drawer is used
  if (!window.matchMedia || !window.matchMedia("(max-width: 76.1875em)").matches) return;

  const sidebar = document.querySelector('.md-sidebar--primary');
  if (!sidebar) return;

  const navRoot =
    sidebar.querySelector('[data-md-component="navigation"]') ||
    sidebar.querySelector('.md-nav--primary');
  if (!navRoot) return;

  const allToggles = Array.from(navRoot.querySelectorAll('input.md-nav__toggle[data-md-toggle^="nav-"]'));
  if (!allToggles.length) return;

  // Find the active page link in the nav
  const activeLink = navRoot.querySelector('a.md-nav__link--active');
  if (!activeLink) {
    // Home or edge case: show root level (no drill-down)
    allToggles.forEach(t => (t.checked = false));
    return;
  }

  // Collect toggles on the active path (ancestors of the active link)
  const keep = new Set();
  let node = activeLink;
  while (node) {
    const nested = node.closest && node.closest('.md-nav__item--nested');
    if (!nested) break;

    // The toggle is an immediate child of the nested <li> in our template
    const toggle = Array.from(nested.children).find(
      el => el && el.matches && el.matches('input.md-nav__toggle')
    );
    if (toggle) keep.add(toggle);

    node = nested.parentElement;
  }

  allToggles.forEach(t => (t.checked = keep.has(t)));
}

document.addEventListener('DOMContentLoaded', () => {
  const drawerToggle = document.getElementById('__drawer');
  if (!drawerToggle) return;

  drawerToggle.addEventListener('change', () => {
    if (drawerToggle.checked) resetMobileDrawerNavigationToActivePath();
  });
});

// Open the Help block

function helpClicked (event) {
  if (document.getElementById('helpList').style.display === 'none') {
    document.getElementById('helpList').style.display = 'block'
    document.getElementById('helpMain').classList.add("help-main-active")
  } else {
    document.getElementById('helpList').style.display = 'none'
    document.getElementById('helpMain').classList.remove("help-main-active")
  }
}

// Always stick left navigation to the bottom of the header
document.addEventListener('DOMContentLoaded', () => {
  const updateSidebarPosition = () => {
    const sidebar = document.querySelector('.md-sidebar--primary');
    const header = document.querySelector('.md-header');
    const headerRect = header.getBoundingClientRect();
    const headerBottom = headerRect.bottom;
    document.documentElement.style.setProperty('--header-bottom', `${headerBottom}px`);
  };

  // call on load
  updateSidebarPosition();

  const toggleButton = document.querySelector('.md-header__button[for="__drawer"]');
  toggleButton.addEventListener('click', updateSidebarPosition);

  // call on window resize
  window.addEventListener('resize', updateSidebarPosition);
});





// Custom accordion behavior disabled - using MkDocs Material's native behavior
// If you want to re-enable custom accordion (collapse siblings when expanding):
// Uncomment the code below

/*
function getAllNavigationElements(element, selector){
  if(element.parentElement && element.parentElement.parentElement && element.parentElement.parentElement.children){
    let allChildren = element.parentElement.parentElement.children;
    for (let index = 0; index < allChildren.length; index++) {
      let child = allChildren[index];
      let navigationInput = child.querySelector(selector);
      if (navigationInput && navigationInput !== element){
        navigationInput.checked = false;
        navigationInput.parentElement.classList.remove('md-nav__item--expanded');
      }
    }
  }
}

document.addEventListener('change', function(event) {
  if (event.target.matches('.md-nav__toggle')) {
    getAllNavigationElements(event.target, '.md-nav__toggle');
    if (event.target.checked) {
      event.target.parentElement.classList.add('md-nav__item--expanded');
    } else {
      event.target.parentElement.classList.remove('md-nav__item--expanded');
    }
  }
}, false);
*/


// Expand and collapse supported platform cards on click

function platformClicked (event, platformId) {
  event.preventDefault();
  optionsId = platformId + 'Id';
  var activeOptions=document.getElementsByClassName('option-active');
  // console.log(this);

  if (activeOptions.length != 0) {
    for (let index = 0; index < activeOptions.length; index++) {
      if (activeOptions[index].children[0].children[3].id != this.optionsId) {
      document.getElementById(activeOptions[index].children[0].children[3].id).style.display = 'none';
      activeOptions[index].classList.remove("option-active");
      }
      else { console.log(this.optionsId) }
    }
    if (document.getElementById(optionsId).style.display === 'none') {
      document.getElementById(optionsId).style.display = 'block';
      document.getElementById(platformId).parentNode.classList.add("option-active");
    }
    else {
      document.getElementById(optionsId).style.display = 'none';
      document.getElementById(platformId).parentNode.classList.remove("option-active");
    }
  }
  else {
    if (document.getElementById(optionsId).style.display === 'none') {
      document.getElementById(optionsId).style.display = 'block';
      document.getElementById(platformId).parentNode.classList.add("option-active");
    }
    else {
      document.getElementById(optionsId).style.display = 'none';
      document.getElementById(platformId).parentNode.classList.remove("option-active");
    }
  }
}

// Cancel collapsing and expanding spported platform cards when clicking the links inside these cards

function noAction(event) {
  event.stopImmediatePropagation();
  return false;
}

// Highlight the search string if URL contains ?search

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('search');
var searchBar = document.getElementsByClassName('md-search__input');

if(myParam !== null) {
  document.getElementById("__search").checked = true;
}

// Show warning about deprecated version if it is opened

let paths = window.location.pathname.split('/');
var announceBar = document.getElementsByClassName("md-banner");
var announceBarText = document.getElementsByClassName("md-banner__inner");
if (paths[1] == '2.18' || paths[1] == '3.6') {
  for (var i = 0; i < announceBar.length; i++) {
    announceBar[i].style.display="block";
    announceBarText[i].innerHTML = 'Wallarm node 3.6 and lower are not supported. Please <a href="/updating-migrating/older-versions/what-is-new/" style="color:white; font-weight: bold;">upgrade</a> Wallarm modules to the latest version.';
 }
}

// ZoomInfo script

(function() {
    var zi = document.createElement('script');
    zi.type = 'text/javascript';
    zi.async = true;
    zi.referrerPolicy = 'unsafe-url';
    zi.src = 'https://ws.zoominfo.com/pixel/612ca1c28ffa1e00155b2895';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(zi, s);
})();

// iframe for Partner Portal

if (window.location.href.indexOf("channeltivity-content") > -1) {
  toggleChannelTivityClass();
  resizeObserve();
}

function toggleChannelTivityClass() {
  document.body.classList.add("channeltivity");
}

function resizeObserve() {
  if (!inIframe()) {
    return;
  }

  const CONTAINER_CLASS_NAME = ".md-content";
  const containerNode = document.querySelector(CONTAINER_CLASS_NAME);
  let latestHeight;

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const cr = entry.contentRect;

      if (latestHeight !== cr.height) {
        latestHeight = cr.height;
        resizeMessagePostToParentIframe(cr.height);
      }
    }
  });

  resizeObserver.observe(containerNode)
}

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function resizeMessagePostToParentIframe(height) {
  const message = {
    type: 'wallarmDocsContentHeight',
    result: {
      height: `${height}px`,
      url: `${document.location.host}${document.location.pathname}`
    }
  };

  window.parent.postMessage(message, '*');
}

// Google Tag Manager

(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NQC7GWFL');

// End Google Tag Manager

/*
* Listen to the main navigation clicks.
* */
document.querySelector('.md-nav--primary').addEventListener('click', () => {
  // Reset the "Deployment options" opened states
  localStorage.removeItem('do');
});

// Heap

if (window.location.hostname === "docs.wallarm.com") {
  window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
  heap.load("1543582484");
}

// Show the list of languages

var rootLanguage = 'en';

function getCurrentLanguage() {
  const button = document.getElementById('languagesMain');
  if (button && button.dataset && button.dataset.currentLanguage) {
    return button.dataset.currentLanguage;
  }
  return rootLanguage;
}

function languageClicked (event) {
  if (document.getElementById('languagesList').style.display === 'none') {
    document.getElementById('languagesList').style.display = 'block'
    document.getElementById('languagesMain').classList.add("languages-main-active")
  } else {
    document.getElementById('languagesList').style.display = 'none'
    document.getElementById('languagesMain').classList.remove("languages-main-active")
  }
}

document.addEventListener('click', (event) => {
  const languagesDiv = document.getElementById('languagesDiv');
  const languagesList = document.getElementById('languagesList');
  const languagesMain = document.getElementById('languagesMain');

  if (!languagesDiv || !languagesList || !languagesMain) return;
  if (languagesDiv.contains(event.target)) return;
  if (languagesList.style.display !== 'block') return;

  languagesList.style.display = 'none';
  languagesMain.classList.remove("languages-main-active");
});

// Open the docs for selected language and change value in the selector
function goToLanguage (event, language) {
  event.preventDefault()
  const currentLanguage = getCurrentLanguage();

  if (currentLanguage === language) {
    window.location.reload(false);
  }
  else {
    let tmp = window.location.pathname.split('/');
    window.top.location.href = tmp.join('/');
    if (language === rootLanguage) {
      window.top.location.href = window.location.pathname.replace('/'+currentLanguage+'/','/');
    } else {
      if (currentLanguage === rootLanguage) {
        if (tmp[1].startsWith('docs')) {
          window.top.location.href = window.location.pathname.replace('/'+'docs'+'/','/'+'docs'+'/'+language+'/');
        }
        else {
          window.top.location.href = window.location.pathname.replace('/','/'+language+'/');
        }
      }
      else {
          window.top.location.href = window.location.pathname.replace('/'+currentLanguage+'/','/'+language+'/')
      }
    }
  }
}
