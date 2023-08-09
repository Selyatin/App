/* eslint-disable no-unused-vars */
function toggleHeaderMenu() {
    const lhn = document.getElementById('lhn');
    const lhnContent = document.getElementById('lhn-content');
    const anguleUpIcon = document.getElementById('angle-up-icon');
    const barsIcon = document.getElementById('bars-icon');
    if (lhnContent.className === 'expanded') {
        // Collapse the LHN in mobile
        lhn.className = '';
        lhnContent.className = '';
        barsIcon.classList.remove('hide');
        anguleUpIcon.classList.add('hide');
        document.body.classList.remove('disable-scrollbar');
    } else {
        // Expand the LHN in mobile
        lhn.className = 'expanded';
        lhnContent.className = 'expanded';
        barsIcon.classList.add('hide');
        anguleUpIcon.classList.remove('hide');
        document.body.classList.add('disable-scrollbar');
    }
}

/**
 * Clamp a number in a range.
 *
 * @param {Number} num
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

/**
 * Check if a number is in a range.
 *
 * @param {Number} num
 * @param {Number} min
 * @param {Number} max
 * @returns {Boolean}
 */
function isInRange(num, min, max) {
    return num >= min && num <= max;
}
/**
 * Checks if the user has navigated within the docs using internal links and uses browser history to navigate back.
 * If a page is directly accessed (e.g., via deep link, bookmark, or opened in a new tab),the user will be navigated
 * back to the relevant hub page of that article.
 */
function navigateBack() {
    const currentHost = window.location.host;
    const referrer = document.referrer;

    if (referrer.includes(currentHost) && window.history.length > 1) {
        window.history.back();
        return;
    }

    const hubs = JSON.parse(document.getElementById('hubs-data').value);
    const hubToNavigate = hubs.find((hub) => window.location.pathname.includes(hub)); // eslint-disable-line rulesdir/prefer-underscore-method
    if (hubToNavigate) {
        window.location.href = `/hubs/${hubToNavigate}`;
    } else {
        window.location.href = '/';
    }

    // Add a little delay to avoid showing the previous content in a fraction of a time
    setTimeout(toggleHeaderMenu, 250);
}

function injectFooterCopywrite() {
    const footer = document.getElementById('footer-copywrite-date');
    footer.innerHTML = `&copy;2008-${new Date().getFullYear()} Expensify, Inc.`;
}

function openSidebar() {
    document.getElementById('sidebar-layer').style.display = 'block';
    document.getElementById('gsc-i-id1').placeholder = 'Search for something...';

    // Make body unscrollable
    const yAxis = document.documentElement.style.getPropertyValue('y-axis');
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${yAxis}`;
}

// Function to close the sidebar
function closeSidebar() {
    document.getElementById('sidebar-layer').style.display = 'none';

    // Make the body scrollable again
    const body = document.body;
    const scrollY = body.style.top;

    // Reset the position and top styles of the body element
    body.style.position = '';
    body.style.top = '';

    // Scroll to the original scroll position
    window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
}

// Function to change SVG viewBox from Google
function changeSVGViewBoxGoogle() {
    // Get all inline Google SVG elements on the page
    const svgsGoogle = document.querySelectorAll('svg');
    // eslint-disable-next-line no-console
    console.log(`There are ${svgsGoogle.length} Divs in Document!`);

    // Iterate through each SVG element
    Array.from(svgsGoogle).forEach(svg => {
        // Set the viewBox attribute to "0 0 20 20"
        svg.setAttribute('viewBox', '0 0 20 20');
    });
}

// Need to wait up until page is load, so the svg viewBox can be changed
window.addEventListener('load', () => {
    changeSVGViewBoxGoogle();
});

window.addEventListener('DOMContentLoaded', () => {
    injectFooterCopywrite();

    // Handle open & close the sidebar
    const buttonOpenSidebar = document.getElementById('toggle-search-open');
    if (buttonOpenSidebar) {
        buttonOpenSidebar.addEventListener('click', openSidebar);
    }

    const buttonCloseSidebar = document.getElementById('toggle-search-close');
    if (buttonCloseSidebar) {
        buttonCloseSidebar.addEventListener('click', closeSidebar);
    }

    if (window.tocbot) {
        window.tocbot.init({
            // Where to render the table of contents.
            tocSelector: '.article-toc',

            // Where to grab the headings to build the table of contents.
            contentSelector: '.article-toc-content',

            // Disable the collapsible functionality of the library by
            // setting the maximum number of heading levels (6)
            collapseDepth: 6,

            // Main class to add to lists.
            listClass: 'lhn-items',

            // Main class to add to links.
            linkClass: 'link',

            // Class to add to active links,
            // the link corresponding to the top most heading on the page.
            activeLinkClass: 'selected-article',

            // Headings offset between the headings and the top of the document (requires scrollSmooth enabled)
            headingsOffset: 80,
            scrollSmoothOffset: -80,
            scrollSmooth: true,

            // If there is a fixed article scroll container, set to calculate titles' offset
            scrollContainer: 'content-area',

            // onclick function to apply to all links in toc. will be called with
            // the event as the first parameter, and this can be used to stop,
            // propagation, prevent default or perform action
            onClick() {
                toggleHeaderMenu();
            },
        });
    }

    document.getElementById('header-button').addEventListener('click', toggleHeaderMenu);

    // Back button doesn't exist on all the pages
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', navigateBack);
    }

    const articleContent = document.getElementById('article-content');
    const lhnContent = document.getElementById('lhn-content');
    lhnContent.addEventListener('wheel', (e) => {
        const scrollTop = lhnContent.scrollTop;
        const isScrollingPastLHNTop = e.deltaY < 0 && scrollTop === 0;
        const isScrollingPastLHNBottom = e.deltaY > 0 && isInRange(lhnContent.scrollHeight - lhnContent.offsetHeight, scrollTop - 1, scrollTop + 1);
        if (isScrollingPastLHNTop || isScrollingPastLHNBottom) {
            e.preventDefault();
        }
    });
    window.addEventListener('scroll', (e) => {
        const scrollingElement = e.target.scrollingElement;
        const scrollPercentageInArticleContent = clamp(scrollingElement.scrollTop - articleContent.offsetTop, 0, articleContent.scrollHeight) / articleContent.scrollHeight;
        lhnContent.scrollTop = scrollPercentageInArticleContent * lhnContent.scrollHeight;

        // Count property of y-axis to keep scroll position & reference it later for making the body fixed when sidebar opened
        document.documentElement.style.setProperty('y-axis', `${window.scrollY}px`);
    });
});
