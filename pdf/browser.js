const path = require('path'),
    url = require('url'),
    fs = require('fs'),
    puppeteer = require('puppeteer'),
    { eraseLines, cursorLeft } = require('ansi-escapes'),
    layouts = require('./layouts'),
    PDFMerger = require('pdf-merger-js');

const styles = { path: path.resolve(__dirname, './index.css') },
    pageBreak = '<div class="pdf-page-break"></div>';

let page;

function write(msg, lines = 0) {
    lines > 0 && (msg = eraseLines(lines) + cursorLeft + msg);
    process.stderr.write(msg);
}

async function getPageHTML({ id, href, path }) {
    await page.goto(href);
    await page.addStyleTag(styles);

    return page.evaluate((id, path, pageBreak) => {
        let $section = document.querySelector('.md-content');

        [...document.querySelectorAll('a')].forEach($a => { $a.dataset.dir = path; });
        let $header = document.getElementById('demo-videos');
        if ($header) $header.style.display='none';
        [...document.getElementsByClassName('video-wrapper')].forEach($video => { $video.style.display='none'; });
        [...document.querySelectorAll('[id]')].forEach($node => {
            let anchor = $node.getAttribute('id');
            $node.setAttribute('id', `${id}---${anchor}`)
        });
        $section.setAttribute('id', id);

        return $section.outerHTML + pageBreak;
    }, id, path, pageBreak);
}

async function getTOC(docsUrl) {
    await page.goto(docsUrl);

    return page.evaluate(docsUrl => {
        const $summary = document.querySelector('.md-nav__list');

        function parse(nodes, data, depth = 0) {
            [...nodes].forEach($node => {
                if ($node.classList.contains('header')) {
                    data.push({ type: 'header', title: $node.textContent.trim(), depth });
                }

                if ($node.classList.contains('md-nav__item')) {
                    let children = [...$node.children];
                        
                    const titleElement = $node.getElementsByClassName('md-nav__link')[0];
                    let item = {
                        type: 'chapter',
                        level: depth,
                        title: titleElement.textContent.trim(),
                        depth
                    };
                    const hrefElement = $node.getElementsByTagName('a')[0];

                    const subnav = $node.getElementsByTagName('nav')[0];
                    if (hrefElement && !subnav) {
                        let href = hrefElement.getAttribute('href');
                        item.id = href.replace(/\./g, '-').replace(/\//g, '--').replace(/#/g, '---');
                        item.path =  hrefElement.getAttribute('href');
                        item.href = `${docsUrl}${item.path}`
                    }
                    data.push(item);

                    if(subnav) {
                        const subnavList = subnav.getElementsByClassName('md-nav__list')[0];
                        if(subnavList){
                            parse(subnavList.children, data, depth + 1);
                        }
                    }
                }
            });
        }

        let toc = [];

        parse($summary.children, toc);

        return Promise.resolve(toc);
    }, docsUrl);
}

async function collectData(toc) {
    write('• Collecting data...\n');

    for (let i = 0; i < toc.length; i++) {
        let item = toc[i];
        var demoVid=new RegExp("demo-videos");
        var apiFir=new RegExp("api-firewall");

        if (demoVid.test(item.href) || apiFir.test(item.href)) {
            write('Demo videos or API Firewall docs skipped\n', 1);
        }
        else {
            if (!item.id) continue;

            let p = Math.round(i / (toc.length - 1) * 100);

            write(`• Collecting data... ${p}%\n  ${item.path}\n  ${item.title}`, 2);

            item.html = await getPageHTML(item);
        }
    }
}

async function generateHTML(toc, parts) {
    write('✔ Data is collected\n• Preparing a ToC...', 2);

    let html = '';
    var demoVid=new RegExp("demo-videos");
    var apiFir=new RegExp("api-firewall");

    html += '<h1>Table of contents</h1><ul id="toc">';

    toc.forEach(item => {
        if (demoVid.test(item.href) || apiFir.test(item.href)) {
            write('Demo videos or API Firewall docs skipped\n', 1);
        }
        else {
            if (item.type === 'header') {
                html += `<li><h3>${item.title}</h3></li>\n`;
                
            }

            if (item.type === 'chapter' && item.title != 'Demo videos' && item.title != 'API Firewall guides' && item.title != 'Demos') {
                if (item.id) {
                    html += `<li class="depth depth-${item.depth}"><a href="#${item.id}">${item.title}</a></li>\n`;
                } else {
                    html += `<li class="chapter depth depth-${item.depth}">${item.title}</li>\n`;
                }
            }
            // else {
            //     write('djdj');
            // }
    }
    });

    html += '</ul>' + pageBreak;

    write('✔ ToC is ready\n• Merging pages...', 1);
    html += toc.map(item => item.html || '').join('');

    return html;
}

async function generatePDF(docsUrl, html, origin, parts) {
    await page.goto(docsUrl);
    await page.addStyleTag(styles);

    let links = await page.evaluate((html, origin) => {
        const regexp = new RegExp(origin);

        document.body.innerHTML = html;
        // termtabs
        [...document.querySelectorAll('.tabbed-set')].forEach($termtabs => {
            $termtabs.classList.remove('tabbed-set');
            const labels = $termtabs.getElementsByTagName('label');
            const blocks = $termtabs.getElementsByClassName('tabbed-content');

            [...labels].forEach(($tab) => {
                $tab.classList.add('label');
            });

            [...blocks].forEach((block) => {
                block.classList.remove('tabbed-content');
            });

            [...$termtabs.getElementsByTagName('input')].forEach(el => el.remove());
        });


        return [...document.querySelectorAll('a')]
            .filter($a => !$a.classList.contains('plugin-anchor') && regexp.test($a.href) && !!$a.dataset.dir)
            .map(($a, i) => {
                let id = `inner-link-${i}`;

                $a.setAttribute('id', id);

                return [
                    id,
                    $a.getAttribute('href'),
                    $a.dataset.dir
                ];
            });
    }, html, origin);

    links = links.map(([id, href, dir]) => [
        id,
        `#${url.resolve(dir, href).replace(/\./g, '-').replace(/\//g, '--').replace(/#/g, '---')}`
    ]);

    await page.evaluate(links => {
        links.forEach(([id, href]) => {
            let $a = document.getElementById(id);
            if (!$a) return;

            $a.removeAttribute('id');
            $a.setAttribute('href', href);
        });

        return document.body.innerHTML;
    }, links);

    write('✔ Pages are merged\n• Generating a PDF...', 1);

    return page.pdf({
        path: 'tmp/docs.pdf',
        format: 'A4',
        printBackground: true,
        margin: { top: 100, right: 62, bottom: 60, left: 62 },
        displayHeaderFooter: true,
        headerTemplate: parts.header,
        footerTemplate: parts.footer
    });
}

async function generateIndexPDF(parts) {
    let html = `
        ${parts.index}
        ${pageBreak}
    `;

    await page.setContent(html);
    await page.addStyleTag(styles);

    return page.pdf({
        path: 'tmp/index.pdf',
        format: 'A4',
        printBackground: true
    });
}

module.exports.generatePDF = async ({ origin }) => {
    if (!origin) throw new Error('Origin is required!');

    const docsUrl = `${origin}${/\/$/.test(origin) ? '' : '/'}`,
        parts = layouts["structure"] || {};

    !fs.existsSync('tmp') && fs.mkdirSync('tmp');

    const browser = await puppeteer.launch({
        // headless: false
    });

    page = await browser.newPage();

    await generateIndexPDF(parts);

    let toc = await getTOC(docsUrl);
    await collectData(toc);
    let html = await generateHTML(toc, parts);
    await generatePDF(docsUrl, html, origin, parts);
    write ('PDF is done!\n', 1)

    browser.close();
};