const titles = {};

/**
 * Re-calculate section title when nested level was changed
 */
function recalculateSectionTitle($section) {
    const parts = [];
    let $card = document.getElementById($section.querySelector('[data-current]')?.dataset.for);
    while ($card) {
        parts.unshift($card.id);
        const $grid = $card.closest('.do-main, .do-nested');
        $card = document.getElementById($grid?.dataset.for);
    }

    const $title = $section.previousElementSibling;
    const $headerlink = $title.querySelector('.headerlink');

    $title.innerHTML = '';
    parts.forEach((id, i) => {
        const $part = document.createElement('span');
        $part.textContent = titles[id];
        if (i < parts.length - 1) $part.dataset.to = id;
        $title.append($part);
    });
    $title.append($headerlink);
}

/**
 * Make currently visible grid hidden and display another one grid
 */
function navigateToGrid($next) {
    const $section = $next.closest('.do-section');
    const $current = $section.querySelector('[data-current]');

    delete $current.dataset.current;
    $current.classList.toggle('do-hidden');

    $next.dataset.current = 'true';
    $next.classList.toggle('do-hidden');

    // Needed for animation purposes
    $section.style.height = getComputedStyle($next).height;

    recalculateSectionTitle($section);
}

/**
 * Card click listener
 */
function clickDeploymentCard(event) {
    const $section = event.currentTarget.closest('.do-section');
    const $next = $section.querySelector(`[data-for=${event.currentTarget.id}]`);
    navigateToGrid($next);
}

/**
 * Listen to click on the cards that have `id`.
 * Cards without `id` cannot navigate anywhere.
 */
document.querySelectorAll('.do-card[id]').forEach($node => {
    // Collect these cards titles for the breadcrumbs chain
    titles[$node.id] = $node.querySelector('h3').textContent.replace(/\n/g, ' ').trim();
    $node.addEventListener('click', clickDeploymentCard);
});

/**
 * Breadcrumbs click listener
 */
function clickBreadcrumb(event) {
    if (!event.target.dataset.to) return;
    const $section = event.currentTarget.nextElementSibling;
    navigateToGrid($section.querySelector(`[data-for=${event.target.dataset.to}]`));
}

/**
 * Listen to click on the section title
 */
document.querySelectorAll('h2').forEach($title => {
    // Collect section titles for the breadcrumbs chain
    titles[$title.id] = $title.childNodes[0].textContent.trim();
    $title.addEventListener('click', clickBreadcrumb);
});

/**
 * Setup missed markup before using the page
 */
document.querySelectorAll('.do-section').forEach($section => {
    const $main = $section.querySelector('.do-main');
    $main.dataset.current = 'true';
    $main.dataset.for = $section.previousElementSibling.id;

    $section.querySelectorAll('.do-nested').forEach($nested => {
        // `1 / span 999` is a hack to make the first card take the whole first column
        // if there are more than one row in a grid.
        const cards = $nested.querySelectorAll('.do-card');
        if (cards.length > 3) cards[0].style.gridRow = '1 / span 999';

        $nested.classList.add('do-hidden');
    });

    $section.style.height = getComputedStyle($main).height;
    $section.dataset.ready = 'true';
});

/**
 * Add "Back" buttons to the nested grids
 */
document.querySelectorAll('.do-nested .do-card:first-child').forEach($card => {
    const id = $card.closest('.do-nested').dataset.for;
    const $grid = document.getElementById(id).closest('.do-main, .do-nested');

    const $back = document.createElement('div');
    $back.classList.add('do-back');
    $back.addEventListener('click', () => { navigateToGrid($grid); });
    $card.append($back);
});