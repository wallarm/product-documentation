/*
 * Reset gitbook-plugin-collapsible-chapters expanding history on page load
 */

localStorage.removeItem('expChapters');

function injectScript(src, cb) {
    let script = document.createElement('script');

    script.src = src;
    script.async = true;
    cb && (script.onload = cb);
    document.body.append(script);
}


/*
 * Add Google Analytics
 */

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'UA-45499521-1');
injectScript('https://www.googletagmanager.com/gtag/js?id=UA-45499521-1');


/*
 * Add LeadFeeder
 */

window.ldfdr = window.ldfdr || {};
injectScript('https://lftracker.leadfeeder.com/lftracker_v1_kn9Eq4Rwz5KaRlvP.js');


/*
 * Add Influ2
 */

injectScript('https://www.influ2.com/tracker?clid=eb788f04-02ab-465b-85fa-fac796e0491d');

/*
 * Add HubSpot
 */

injectScript('https://js.hs-scripts.com/3989912.js');

/*
* Add LeadLander
*/

var sf14gv = 27823;
  (function() {
    var sf14g = document.createElement('script');
    sf14g.src = 'https://tracking.leadlander.com/lt.min.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(sf14g, s);
  })();
