// Open external links in new tab
var links = document.links;

for(var i = 0; i < links.length; i++) {
  if (links[i].hostname != window.location.hostname) {
    links[i].target = '_blank';
    links[i].rel = 'noopener';
  }
}

function injectScript(src, cb) {
  let script = document.createElement('script');

  script.src = src;
  cb && (script.onload = cb);
  document.body.append(script);
}

// Add LeadFeeder
window.ldfdr = window.ldfdr || {};
injectScript('https://lftracker.leadfeeder.com/lftracker_v1_kn9Eq4Rwz5KaRlvP.js');

// Add HubSpot

if (window.location.href.indexOf("channeltivity-content") <= -1) {
  injectScript('https://js.hs-scripts.com/3989912.js');
}

// Show version selector only for Product guides
var rootVersion = '4.6';
var activeLinks = document.getElementsByClassName('md-tabs__link--active');
document.getElementById('versionsDiv').style.display = 'inline-block'

// else {
//   document.getElementById('versionsDiv').style.display = 'none'
// }

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
        if (tmp[1].startsWith('docs')) {
          window.top.location.href = window.location.pathname.replace('/'+'docs'+'/','/'+'docs'+'/'+version+'/');
        }
        else {
          window.top.location.href = window.location.pathname.replace('/','/'+version+'/');
        }
      }
      else {
          window.top.location.href = window.location.pathname.replace('/'+currentVersion+'/','/'+version+'/')
      }
    }
  }
}

// Collapse expanded menu items when a new item is expanded
var navClassName = ".md-nav__toggle";
var navigationElements = document.querySelectorAll(navClassName);

function getAllNavigationElements(element, selector){
  if(element.parentElement && element.parentElement.parentElement && element.parentElement.parentElement.children){
    var allChildren = element.parentElement.parentElement.children;
    for (let index = 0; index < allChildren.length; index++) {
      var child = allChildren[index];
      var navigationInput = child.querySelector(selector);
      if(navigationInput && navigationInput !== element){
        navigationInput.checked = false;
      }
    }
  }
}

navigationElements.forEach(el => {
  el.addEventListener('change', function(){
    getAllNavigationElements(this, navClassName);
  }, false);
})

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
var announceBar = document.getElementsByClassName("md-banner__inner");
if (paths[1] == '2.18' || paths[1] == '3.6') {
  for (var i = 0; i < announceBar.length; i++) {
    announceBar[i].innerHTML = 'Wallarm node 3.6 and lower are not supported. Please <a href="/updating-migrating/older-versions/what-is-new/" style="color:white; font-weight: bold;">upgrade</a> Wallarm modules to the latest version.';
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

(function(w,d,s,l,i){
  w[l]=w[l]||[];
  w[l].push({
    'gtm.start':new Date().getTime(),event:'gtm.js'
  });
  var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})
(window,document,'script','dataLayer','GTM-P8GHH8M');
// End Google Tag Manager

/*
* Listen to the main navigation clicks.
* */
document.querySelector('.md-nav--primary').addEventListener('click', () => {
  // Reset the "Deployment options" opened states
  localStorage.removeItem('do');
});


// Show the list of languages

var rootLanguage = 'en';

function languageClicked (event) {
  if (document.getElementById('languagesList').style.display === 'none') {
    document.getElementById('languagesList').style.display = 'block'
    document.getElementById('languagesMain').classList.add("languages-main-active")
  } else {
    document.getElementById('languagesList').style.display = 'none'
    document.getElementById('languagesMain').classList.remove("languages-main-active")
  }
}

// Open the docs for selected language and change value in the selector
function goToLanguage (event, currentLanguage, language) {
  event.preventDefault()

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
