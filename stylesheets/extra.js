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

injectScript('https://js.hs-scripts.com/3989912.js');

// Add LeadLander
var sf14gv = 27823;
  (function() {
    var sf14g = document.createElement('script');
    sf14g.src = 'https://tracking.leadlander.com/lt.min.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(sf14g, s);
  })();

// Show version selector only for Product guides
var rootVersion = '3.6';
var activeLinks = document.getElementsByClassName('md-tabs__link--active');
if (activeLinks[0].text === ' Product guides ') {
  document.getElementById('versionsDiv').style.display = 'inline-block'
}
else {
  document.getElementById('versionsDiv').style.display = 'none'
}
  
// Show the list of available WAF versions
function versionClicked (event) {
  if (document.getElementById('versionsList').style.display === 'none') {
    document.getElementById('versionsList').style.display = 'block'
    document.getElementById('versionsMain').classList.add("versions-main-active")
  } else {
    document.getElementById('versionsList').style.display = 'none'
    document.getElementById('versionsMain').classList.remove("versions-main-active")
  }
}

// Open the docs for selected WAF version and change value in the selector
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
      if (activeOptions[i].children[0].children[3].id != this.optionsId) {
      document.getElementById(activeOptions[i].children[0].children[3].id).style.display = 'none';
      activeOptions[i].classList.remove("option-active");
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
if (paths[1] == '2.18') {
  for (var i = 0; i < announceBar.length; i++) {
    announceBar[i].innerHTML = 'Wallarm node 2.18 and lower is not supported. We recommend <a href="/updating-migrating/what-is-new/" style="color:white; font-weight: bold;">upgrading</a> Wallarm API Security modules to the latest version.';
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
  document.body.classList.add("channeltivity");
  document.write('<link rel="stylesheet" type="text/css" href="iframe.css" />');
}
