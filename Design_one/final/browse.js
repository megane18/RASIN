// ===================================
// Browse Page - Filter & Search
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initBrowseFilters();
});

function initBrowseFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    
    if (!searchInput || !categoryFilter || !sortBy) return;
    
    // Search functionality
    searchInput.addEventListener('input', debounce(function(e) {
        filterInfluences();
    }, 300));
    
    // Category filter
    categoryFilter.addEventListener('change', function(e) {
        filterInfluences();
    });
    
    // Sort functionality
    sortBy.addEventListener('change', function(e) {
        sortInfluences(e.target.value);
    });
}

function filterInfluences() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategory = document.getElementById('categoryFilter').value.toLowerCase();
    
    const allCards = document.querySelectorAll('.influence-card');
    const categorySections = document.querySelectorAll('.category-section');
    
    // If filtering by category, hide/show entire sections
    if (selectedCategory) {
        categorySections.forEach(section => {
            const sectionCategory = section.getAttribute('data-category');
            if (sectionCategory === selectedCategory) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    } else {
        categorySections.forEach(section => {
            section.style.display = 'block';
        });
    }
    
    // Apply search filter
    allCards.forEach(card => {
        const title = card.querySelector('.influence-title')?.textContent.toLowerCase() || '';
        const excerpt = card.querySelector('.influence-excerpt')?.textContent.toLowerCase() || '';
        const category = card.querySelector('.influence-category')?.textContent.toLowerCase() || '';
        
        const matchesSearch = !searchTerm || 
            title.includes(searchTerm) || 
            excerpt.includes(searchTerm) ||
            category.includes(searchTerm);
        
        const matchesCategory = !selectedCategory || 
            category.includes(selectedCategory);
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide category sections if all cards are hidden
    categorySections.forEach(section => {
        const visibleCards = section.querySelectorAll('.influence-card[style="display: block;"], .influence-card:not([style*="display: none"])');
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        } else if (!selectedCategory || section.getAttribute('data-category') === selectedCategory) {
            section.style.display = 'block';
        }
    });
    
    // Show message if no results
    showNoResultsMessage();
}

function sortInfluences(sortType) {
    const categorySections = document.querySelectorAll('.category-section');
    
    categorySections.forEach(section => {
        const cards = Array.from(section.querySelectorAll('.influence-card'));
        
        cards.sort((a, b) => {
            switch(sortType) {
                case 'alphabetical':
                    const titleA = a.querySelector('.influence-title').textContent;
                    const titleB = b.querySelector('.influence-title').textContent;
                    return titleA.localeCompare(titleB);
                
                case 'sources':
                    const sourcesA = parseInt(a.querySelector('.influence-meta span:last-child').textContent.match(/\d+/)[0]);
                    const sourcesB = parseInt(b.querySelector('.influence-meta span:last-child').textContent.match(/\d+/)[0]);
                    return sourcesB - sourcesA; // Descending
                
                case 'oldest':
                    // In a real app, you'd sort by actual dates
                    // For now, keep current order (which represents oldest to newest)
                    return 0;
                
                case 'recent':
                default:
                    // Reverse order for most recent
                    return 0;
            }
        });
        
        // Re-append cards in sorted order
        const title = section.querySelector('.section-title');
        cards.forEach(card => {
            section.appendChild(card);
        });
        
        // Make sure title stays at top
        if (title) {
            section.insertBefore(title, section.firstChild);
        }
    });
}

function showNoResultsMessage() {
    const visibleCards = document.querySelectorAll('.influence-card:not([style*="display: none"])');
    let noResultsMsg = document.getElementById('noResultsMessage');
    
    if (visibleCards.length === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noResultsMessage';
            noResultsMsg.style.cssText = `
                background: white;
                padding: 3rem;
                border-radius: 8px;
                text-align: center;
                margin: 2rem 0;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `;
            noResultsMsg.innerHTML = `
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
                <h3 style="color: #003d82; margin-bottom: 0.5rem;">No Influences Found</h3>
                <p style="color: #666;">Try adjusting your search or filter criteria.</p>
            `;
            document.querySelector('main').appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else {
        if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
}

// Debounce function for search (already in main.js but repeated here for independence)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}