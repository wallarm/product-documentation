const titles = {};
let state;

try {
    state = JSON.parse(localStorage.getItem('do')) || {};
} catch {
    state = {};
    localStorage.setItem('do', JSON.stringify(state));
}

/**
 * Update the navigation history of the sections
 */
const updateStateItem = value => {
    if (value.length === 1) delete state[value[0]];
    else state[value[0]] = value;

    localStorage.setItem('do', JSON.stringify(state));
}

/**
 * Re-calculate section title state when nested level was changed
 */
function recalculateSectionTitleState($section) {
    const parts = [];
    let $card = document.getElementById($section.querySelector('[data-current]')?.dataset.for);

    while ($card) {
        parts.unshift($card.id);
        const $grid = $card.closest('.do-main, .do-nested');
        $card = document.getElementById($grid?.dataset.for);
    }

    updateStateItem(parts);
}

/**
 * Make currently visible grid hidden and display another one grid
 */
function navigateToGrid(cardID) {
    const $next = document.querySelector(`[data-for=${cardID}]`);
    if (!$next) return;

    const $section = $next.closest('.do-section');
    const $current = $section.querySelector('[data-current]');

    delete $current.dataset.current;
    $current.classList.toggle('do-hidden');

    $next.dataset.current = 'true';
    $next.classList.toggle('do-hidden');

    // Needed for animation purposes
    $section.style.height = getComputedStyle($next).height;

    recalculateSectionTitleState($section);
}

/**
 * Card click listener
 */
function clickDeploymentCard(event) {
    navigateToGrid(event.currentTarget.id);
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
    if (event.target.dataset.to) navigateToGrid(event.target.dataset.to);
}

/**
 * Listen to click on the section title
 */
document.querySelectorAll('h2, h3').forEach($title => {
    // Collect section titles for the breadcrumbs chain
    titles[$title.id] = $title.childNodes[0].textContent.trim();
    $title.addEventListener('click', clickBreadcrumb);
});

/**
 * Add "Back" buttons to the nested grids
 */
document.querySelectorAll('.do-nested .do-card:first-child').forEach($card => {
    const id = $card.closest('.do-nested').dataset.for;
    const $grid = document.getElementById(id).closest('.do-main, .do-nested');

    const $back = document.createElement('div');
    $back.classList.add('do-back');
    $back.addEventListener('click', () => { navigateToGrid($grid.dataset.for); });
    $card.append($back);
});

/**
 * Setup missed markup before using the page
 */
document.querySelectorAll('.do-section').forEach($section => {
    const $main = $section.querySelector('.do-main');

    // Skip over <p> if it exists before the section, and find the h2/h3 tag
    let $header = $section.previousElementSibling;
    while ($header && $header.tagName === 'P') {
        $header = $header.previousElementSibling;
    }

    // Set the dataset.for if the header is found and is either h2 or h3
    if ($header && ($header.tagName === 'H2' || $header.tagName === 'H3')) {
        $main.dataset.for = $header.id;
    }

    $main.dataset.current = 'true';

    $section.querySelectorAll('.do-nested').forEach($nested => {
        // `1 / span N` is a hack to make the first card take the whole first column
        // if there is more than one row in a grid.
        const cards = $nested.querySelectorAll('.do-card');
        if (cards.length > 3) cards[0].style.gridRow = `1 / span ${Math.ceil((cards.length - 1) / 2)}`;

        $nested.classList.add('do-hidden');
    });

    $section.style.height = getComputedStyle($main).height;
    $section.dataset.ready = 'true';
});

// Restore previously navigated sections
Object.values(state).forEach(parts => {
    navigateToGrid(parts[parts.length - 1]);
});

function debounce(cb, timeout = 0) {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => cb(...args), timeout);
    };
}

// Watch window resize and re-calculate section heights
window.addEventListener('resize', debounce(() => {
    document.querySelectorAll('.do-section').forEach($section => {
        const $current = $section.querySelector('[data-current]');
        $section.style.height = getComputedStyle($current).height;
    });
}, 200));
