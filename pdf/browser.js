const path = require('path'),
    fs = require('fs'),
    puppeteer = require('puppeteer'),
    { eraseLines, cursorLeft } = require('ansi-escapes'),
    layouts = require('./layouts');

const styles = { path: path.resolve(__dirname, './index.css') },
    pageBreak = '<div class="pdf-page-break"></div>';

let page;

function write(msg, lines = 0) {
    lines > 0 && (msg = eraseLines(lines) + cursorLeft + msg);
    process.stderr.write(msg);
}

async function getPageHTML({ id, href, path }) {
    await page.goto(href, { waitUntil: 'networkidle0', timeout: 90000 });
    await page.addStyleTag(styles);

    return page.evaluate((id, path, pageBreak) => {
        document.querySelectorAll('.md-consent__inner, .video-wrapper').forEach(el => el.remove());
        const $header = document.getElementById('demo-videos');
        if ($header) $header.remove();

        const $section = document.querySelector('.md-content');
        if (!$section) return '';

        [...document.querySelectorAll('[id]')].forEach($node => {
            const anchor = $node.getAttribute('id');
            $node.setAttribute('id', `${id}---${anchor}`);
        });

        $section.setAttribute('id', id);
        return $section.outerHTML + pageBreak;
    }, id, path, pageBreak);
}

async function getTOC(docsUrl) {
    await page.goto(docsUrl, { waitUntil: 'networkidle0' });

    return page.evaluate(docsUrl => {
        const $summary = document.querySelector('.md-nav__list');
        const toc = [];

        function parse(nodes, data, depth = 0) {
            [...nodes].forEach($node => {
                if ($node.classList.contains('header')) {
                    data.push({ type: 'header', title: $node.textContent.trim(), depth });
                }

                if ($node.classList.contains('md-nav__item')) {
                    const titleElement = $node.querySelector('.md-nav__link');
                    const hrefElement = $node.querySelector('a');
                    const subnav = $node.querySelector('nav .md-nav__list');

                    const item = {
                        type: 'chapter',
                        level: depth,
                        title: titleElement?.textContent.trim(),
                        depth
                    };

                    if (hrefElement && !subnav) {
                        const href = hrefElement.getAttribute('href');
                        item.id = href.replace(/\./g, '-').replace(/\//g, '--').replace(/#/g, '---');
                        item.path = href;
                        item.href = docsUrl + href;
                    }

                    data.push(item);

                    if (subnav) {
                        parse(subnav.children, data, depth + 1);
                    }
                }
            });
        }

        parse($summary.children, toc);
        return toc;
    }, docsUrl);
}

async function collectData(toc) {
    write('• Collecting data...\n');

    for (let i = 0; i < toc.length; i++) {
        const item = toc[i];
        if (!item.href || !item.id) continue;

        if (/demo-videos|api-firewall/.test(item.href)) {
            write(`⏭ Skipping: ${item.href}\n`, 1);
            continue;
        }

        const p = Math.round((i / toc.length) * 100);
        write(`• Collecting... ${p}%\n  ${item.path}\n  ${item.title}`, 2);

        try {
            item.html = await getPageHTML(item);
        } catch (e) {
            write(`⚠️ Failed to fetch ${item.href}\n`, 1);
            item.html = '';
        }
    }
}

async function generateHTML(toc, parts) {
    write('✔ Data collected\n• Generating ToC and full HTML...', 1);

    let html = '<h1>Table of Contents</h1><ul id="toc">';

    toc.forEach(item => {
        if (!item.href || !item.id || !item.html) return;
        if (/demo-videos|api-firewall/.test(item.href)) return;

        if (item.type === 'header') {
            html += `<li><h3>${item.title}</h3></li>\n`;
        } else if (item.type === 'chapter') {
            html += `<li class="depth depth-${item.depth}"><a href="#${item.id}">${item.title}</a></li>\n`;
        }
    });

    html += '</ul>' + pageBreak;
    html += toc.map(item => item.html || '').join('');

    return html;
}

async function generatePDF(docsUrl, html, origin, parts) {
    // Загружаем head + CSS с сайта, чтобы не терять стили
    await page.goto(docsUrl, { waitUntil: 'networkidle0' });

    // Подключаем твой index.css
    await page.addStyleTag(styles);

    // Вставляем подготовленный HTML внутрь body
    await page.evaluate(innerHtml => {
        document.body.innerHTML = innerHtml;
    }, html);

    write('✔ Final HTML loaded\n• Generating PDF...\n', 1);

    await page.pdf({
        path: 'tmp/docs.pdf',
        format: 'A4',
        printBackground: true,
        margin: { top: 100, right: 62, bottom: 60, left: 62 },
        displayHeaderFooter: true,
        headerTemplate: parts.header,
        footerTemplate: parts.footer
    });
}

module.exports.generatePDF = async ({ origin }) => {
    if (!origin) throw new Error('Origin is required!');

    const docsUrl = `${origin}${/\/$/.test(origin) ? '' : '/'}`;
    const parts = layouts['structure'] || {};

    if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');

    const browser = await puppeteer.launch({ headless: 'new' });
    page = await browser.newPage();

    const toc = await getTOC(docsUrl);
    await collectData(toc);
    const html = await generateHTML(toc, parts);
    await generatePDF(docsUrl, html, origin, parts);

    write('✔ PDF is done!\n');
    await browser.close();
};
