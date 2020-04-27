var links = document.links;

for(var i = 0; i < links.length; i++) {
  if (links[i].hostname != window.location.hostname) {
    links[i].target = '_blank';
    links[i].rel = 'noopener';
  } 
}
/*
 * Add Clearbit
 */
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


/*
* Add LeadFeeder
*/

window.ldfdr = window.ldfdr || {};
injectScript('https://lftracker.leadfeeder.com/lftracker_v1_kn9Eq4Rwz5KaRlvP.js');


/*
* Add Influ2
*/

injectScript('https://www.influ2.com/tracker?clid=eb788f04-02ab-465b-85fa-fac796e0491d');
