// =============================================================================
// HOMEPAGE-JOURNAL.JS
// Renders the 3 most recent journal entries from JOURNAL_ENTRIES
// (defined in journal-data.js) into #homepage-article-list on index.html.
//
// To show more or fewer entries on the homepage, change HOMEPAGE_ENTRY_COUNT.
// =============================================================================

const HOMEPAGE_ENTRY_COUNT = 3;

document.addEventListener('DOMContentLoaded', function () {

  const list = document.getElementById('homepage-article-list');
  if (!list || typeof JOURNAL_ENTRIES === 'undefined') return;

  // Take the first N entries — array is newest-first in journal-data.js
  const entries = JOURNAL_ENTRIES.slice(0, HOMEPAGE_ENTRY_COUNT);

  const READ_ICON = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round" />
  </svg>`;

  entries.forEach(entry => {
    const container = document.createElement('div');
    container.className = 'ArticleCard-container';

    container.innerHTML = `
      <div data-card-hover>
        <div class="ArticleCard">
          <div class="ArticleCard-image">
            <img src="${entry.image}" alt="${entry.imageAlt}" loading="lazy" />
          </div>
          <div class="ArticleCard-copy">
            <div class="ArticleCard-details">
              <div class="ArticleCard-label">${entry.tag}</div>
              <div class="ArticleCard-date">${entry.date} | ${entry.readTime}</div>
            </div>
            <div class="ArticleCard-title">${entry.title}</div>
            <div class="ArticleCard-link">
              <a href="${entry.href}" class="CategoryDivider-link">
                Read entry ${READ_ICON}
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    list.appendChild(container);
  });

});
