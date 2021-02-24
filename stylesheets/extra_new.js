// Open external links in new tab
var links = document.links;

for(var i = 0; i < links.length; i++) {
  if (links[i].hostname != window.location.hostname) {
    links[i].target = '_blank';
    links[i].rel = 'noopener';
  } 
}

// Add Clearbit
function injectScript(src, cb) {
  let script = document.createElement('script');

  script.src = src;
  cb && (script.onload = cb);
  document.body.append(script);
}

function initClearbit() {
  let reveal_gtag_map = {
      send_page_view: false,
      custom_map: {
          dimension1: 'type',
          dimension2: 'companyName',
          dimension3: 'companyDomain',
          dimension4: 'companyIndustry',
          dimension5: 'companySubIndustry',
          dimension6: 'companyEmployeesRange',
          dimension7: 'companyEstimatedAnnualRevenue',
          dimension8: 'companyAlexaRank',
          dimension9: 'companyCity',
          dimension10: 'companyState',
          dimension11: 'companyCountry',
          dimension12: 'companySicCode',
          dimension13: 'companyTech'
      }
  }

  gtag('config', 'UA-45499521-1', reveal_gtag_map);

  let reveal_data_map = {},
      nonCompany = "(Non-Company)",
      reveal = window.reveal;

  if (reveal === null || reveal.company === null) {
      reveal_data_map = {
          non_interaction: true,
          type: reveal ? reveal.type : nonCompany,
          companyName: nonCompany,
          companyDomain: nonCompany,
          companyIndustry:nonCompany,
          companySubIndustry: nonCompany,
          companyEmployeesRange: nonCompany,
          companyEstimatedAnnualRevenue: nonCompany,
          companyAlexaRank: nonCompany,
          companyCity: nonCompany,
          companyState: nonCompany,
          companyCountry: nonCompany,
          companySicCode: nonCompany,
          companyTech: nonCompany
      };
  } else {
      let company = reveal.company;

      reveal_data_map = {
          non_interaction: true,
          type: reveal.type,
          companyName: company.name,
          companyDomain: company.domain,
          companyIndustry: company.category.industry,
          companySubIndustry: company.category.subIndustry,
          companyEmployeesRange: company.metrics.employeesRange,
          companyEstimatedAnnualRevenue: company.metrics.estimatedAnnualRevenue,
          companyAlexaRank: company.metrics.alexaGlobalRank,
          companyCity: company.geo.city,
          companyState: company.geo.state,
          companyCountry: company.geo.country,
          companySicCode: company.category.sicCode,
          companyTech: company.tech
      };
  }

  gtag('event', 'Clearbit', reveal_data_map);
}

injectScript('https://reveal.clearbit.com/v1/companies/reveal?authorization=pk_80545ea927108087193f8bfbac6682de&variable=reveal', initClearbit);


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

// Show version selector only for WAF guides
var rootVersion = '2.18';
var activeLinks = document.getElementsByClassName('md-tabs__link--active');
if (activeLinks[0].text === ' Guides ') {
  document.getElementById('versionsDiv').style.display = 'inline-block'
}
else {
  // Change the link to FAQ and Wallarm API articles editing
  if (activeLinks[0].text === ' FAQ ') {
    var githubLink = document.getElementsByClassName("md-content__button md-icon");
    var wrongLink = "https://github.com/wallarm/product-docs-en/edit/master/docs/latest/faq/";
    var correctLink = "https://github.com/wallarm/product-docs-en/edit/master/faq/docs/"; 
    if (githubLink[0].href.startsWith(wrongLink)) { 
      var newGithubLink = githubLink[0].href.replace(wrongLink, correctLink);
      githubLink[0].setAttribute('href',newGithubLink); 
      }
  }
  if (activeLinks[0].text === ' Wallarm API ') {
    var githubLink = document.getElementsByClassName("md-content__button md-icon");
    var wrongLink_api = "https://github.com/wallarm/product-docs-en/edit/master/docs/latest/api/";
    var correctLink_api = "https://github.com/wallarm/product-docs-en/edit/master/api/docs/";
    if (githubLink[0].href.startsWith(wrongLink_api)) {
      var newGithubLink = githubLink[0].href.replace(wrongLink_api, correctLink_api);
      githubLink[0].setAttribute('href',newGithubLink);
    }
  }
  if (activeLinks[0].text === ' Demo videos ') {
    var githubLink = document.getElementsByClassName("md-content__button md-icon");
    var wrongLink_videos = "https://github.com/wallarm/product-docs-en/edit/master/docs/latest/demo-videos/";
    var correctLink_videos = "https://github.com/wallarm/product-docs-en/edit/master/demo-videos/docs/";
    if (githubLink[0].href.startsWith(wrongLink_videos)) {
      var newGithubLink = githubLink[0].href.replace(wrongLink_videos, correctLink_videos);
      githubLink[0].setAttribute('href',newGithubLink);
    }
  }
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
