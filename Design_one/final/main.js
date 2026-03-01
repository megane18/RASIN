// ===================================
// Rasin Archive - Main JavaScript
// ===================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initForms();
    initInfluenceCards();
    initShareButtons();
    initSourceManager();
    initFileUpload();
});

// ===================================
// Navigation
// ===================================

function initNavigation() {
    // Highlight active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// Influence Cards
// ===================================

function initInfluenceCards() {
    const cards = document.querySelectorAll('.influence-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // In a real app, this would navigate to the detail page
            // For now, we'll just demonstrate the interaction
            const title = this.querySelector('.influence-title')?.textContent;
            console.log('Clicked on:', title);
            
            // Navigate to detail page (in a real app)
            // window.location.href = 'influence-detail.html?id=' + influenceId;
        });
    });
    
    // Category boxes
    const categoryBoxes = document.querySelectorAll('.category-box');
    
    categoryBoxes.forEach(box => {
        box.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.querySelector('.category-name')?.textContent;
            console.log('Filtering by category:', category);
            
            // In a real app, this would filter the influences
            // window.location.href = 'browse.html?category=' + category;
        });
    });
}

// ===================================
// Form Handling
// ===================================

function initForms() {
    const submitForm = document.querySelector('form');
    
    if (submitForm) {
        submitForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                const formData = collectFormData(this);
                submitInfluence(formData);
            }
        });
    }
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#d21034';
            
            // Add error message if not already present
            if (!field.nextElementSibling?.classList.contains('error-message')) {
                const errorMsg = document.createElement('p');
                errorMsg.className = 'error-message';
                errorMsg.style.color = '#d21034';
                errorMsg.style.fontSize = '0.85rem';
                errorMsg.style.marginTop = '0.3rem';
                errorMsg.textContent = 'This field is required';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
        } else {
            field.style.borderColor = '#ddd';
            
            // Remove error message if present
            const errorMsg = field.nextElementSibling;
            if (errorMsg?.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }
    });
    
    // Validate at least 2 sources
    const sources = form.querySelectorAll('.source-entry');
    if (sources.length < 2) {
        alert('Please provide at least 2 sources to support your submission.');
        isValid = false;
    }
    
    return isValid;
}

function collectFormData(form) {
    const formData = {
        title: form.querySelector('input[type="text"]').value,
        category: form.querySelector('select').value,
        summary: form.querySelectorAll('textarea')[0].value,
        description: form.querySelectorAll('textarea')[1].value,
        startPeriod: form.querySelectorAll('.timeline-inputs input')[0].value,
        endPeriod: form.querySelectorAll('.timeline-inputs input')[1].value,
        geographicFlow: form.querySelector('input[placeholder*="Haiti"]').value,
        keyFigures: form.querySelector('input[placeholder*="Webert Sicot"]')?.value || '',
        sources: [],
        misconceptions: form.querySelector('textarea[placeholder*="misattributed"]')?.value || '',
        whyItMatters: form.querySelectorAll('textarea[placeholder*="important"]')[0]?.value || '',
        submitterName: form.querySelectorAll('input[type="text"]')[form.querySelectorAll('input[type="text"]').length - 1].value,
        submitterEmail: form.querySelector('input[type="email"]').value,
        relationship: form.querySelectorAll('textarea')[form.querySelectorAll('textarea').length - 1].value,
        timestamp: new Date().toISOString()
    };
    
    // Collect sources
    const sourceEntries = form.querySelectorAll('.source-entry');
    sourceEntries.forEach(entry => {
        const source = {
            type: entry.querySelector('select').value,
            citation: entry.querySelectorAll('textarea')[0].value,
            url: entry.querySelector('input[type="url"]')?.value || ''
        };
        formData.sources.push(source);
    });
    
    return formData;
}

function submitInfluence(formData) {
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // In a real app, this would send to a backend API
    console.log('Submitting influence:', formData);
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 3rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            text-align: center;
            z-index: 10000;
        `;
        successMsg.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 1rem;">✓</div>
            <h2 style="color: #003d82; margin-bottom: 1rem;">Submission Received!</h2>
            <p style="color: #666; margin-bottom: 2rem;">Thank you for contributing to the Rasin Archive. We'll review your submission and get back to you within 7-10 days.</p>
            <button onclick="window.location.href='index.html'" style="
                background: #d21034;
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 4px;
                font-weight: bold;
                cursor: pointer;
            ">Return to Home</button>
        `;
        
        // Add overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(successMsg);
        
        // Reset form
        document.querySelector('form').reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// ===================================
// Source Manager
// ===================================

function initSourceManager() {
    const addSourceBtn = document.querySelector('.add-source-btn');
    
    if (addSourceBtn) {
        addSourceBtn.addEventListener('click', function() {
            const sourceCount = document.querySelectorAll('.source-entry').length + 1;
            const newSource = createSourceEntry(sourceCount);
            
            // Insert before the "Add Source" button
            this.parentNode.insertBefore(newSource, this);
        });
    }
}

function createSourceEntry(number) {
    const sourceEntry = document.createElement('div');
    sourceEntry.className = 'source-entry';
    sourceEntry.innerHTML = `
        <div class="source-number">Source #${number} <span class="required">*</span></div>
        <div class="form-group">
            <label>Source Type</label>
            <select required>
                <option value="">Select type...</option>
                <option value="recording">Music Recording/Album</option>
                <option value="interview">Interview/Quote</option>
                <option value="academic">Academic Paper</option>
                <option value="documentary">Documentary/Film</option>
                <option value="article">News/Magazine Article</option>
                <option value="book">Book</option>
                <option value="oral">Oral History/Family Account</option>
                <option value="archive">Archive/Historical Document</option>
            </select>
        </div>
        <div class="form-group">
            <label>Source Citation/Description</label>
            <textarea placeholder="Provide full details about this source" required></textarea>
        </div>
        <div class="form-group">
            <label>URL (if available)</label>
            <input type="url" placeholder="https://">
        </div>
        <button type="button" class="remove-source-btn" onclick="removeSource(this)" style="
            background: #dc3545;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        ">Remove Source</button>
    `;
    
    return sourceEntry;
}

function removeSource(button) {
    const sourceEntry = button.closest('.source-entry');
    sourceEntry.remove();
    
    // Renumber remaining sources
    const sources = document.querySelectorAll('.source-entry');
    sources.forEach((source, index) => {
        source.querySelector('.source-number').innerHTML = 
            `Source #${index + 1} <span class="required">*</span>`;
    });
}

// ===================================
// File Upload
// ===================================

function initFileUpload() {
    const uploadArea = document.querySelector('.file-upload-area');
    
    if (uploadArea) {
        // Create hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = 'image/*,audio/*,.pdf,.doc,.docx';
        fileInput.style.display = 'none';
        uploadArea.appendChild(fileInput);
        
        // Click to upload
        uploadArea.addEventListener('click', function(e) {
            if (e.target !== fileInput) {
                fileInput.click();
            }
        });
        
        // Handle file selection
        fileInput.addEventListener('change', function(e) {
            handleFiles(e.target.files);
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.background = '#e8f4f8';
            this.style.borderColor = '#d21034';
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.background = '#f8f9fa';
            this.style.borderColor = '#003d82';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.background = '#f8f9fa';
            this.style.borderColor = '#003d82';
            handleFiles(e.dataTransfer.files);
        });
    }
}

function handleFiles(files) {
    const fileList = Array.from(files);
    
    // Create file list display
    let fileListHTML = '<div style="margin-top: 1rem; text-align: left;">';
    fileListHTML += '<strong>Uploaded Files:</strong><ul style="margin-top: 0.5rem;">';
    
    fileList.forEach(file => {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        fileListHTML += `<li style="margin-bottom: 0.3rem;">
            ${file.name} (${fileSize} MB)
        </li>`;
    });
    
    fileListHTML += '</ul></div>';
    
    // Update upload area
    const uploadArea = document.querySelector('.file-upload-area');
    const existingList = uploadArea.querySelector('div');
    
    if (existingList) {
        existingList.remove();
    }
    
    uploadArea.insertAdjacentHTML('beforeend', fileListHTML);
    
    console.log('Files ready for upload:', fileList);
}

// ===================================
// Share Buttons
// ===================================

function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.textContent.trim();
            
            if (text.includes('Share')) {
                shareInfluence();
            } else if (text.includes('Save')) {
                saveInfluence();
            }
        });
    });
}

function shareInfluence() {
    const url = window.location.href;
    const title = document.querySelector('.influence-title')?.textContent || 'Haitian Influence';
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: 'Check out this documented Haitian cultural influence on Rasin Archive',
            url: url
        }).catch(err => console.log('Share cancelled'));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}

function saveInfluence() {
    const influenceTitle = document.querySelector('.influence-title')?.textContent;
    
    // In a real app, this would save to user's account
    console.log('Saving influence:', influenceTitle);
    
    // Visual feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Saved';
    btn.style.background = '#155724';
    btn.style.color = 'white';
    btn.style.borderColor = '#155724';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = 'white';
        btn.style.color = '#003d82';
        btn.style.borderColor = '#003d82';
    }, 2000);
}

// ===================================
// Search Functionality (placeholder)
// ===================================

function searchInfluences(query) {
    // In a real app, this would search the database
    console.log('Searching for:', query);
    
    // Filter visible cards
    const cards = document.querySelectorAll('.influence-card');
    cards.forEach(card => {
        const title = card.querySelector('.influence-title')?.textContent.toLowerCase();
        const excerpt = card.querySelector('.influence-excerpt')?.textContent.toLowerCase();
        
        if (title?.includes(query.toLowerCase()) || excerpt?.includes(query.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===================================
// Stats Counter Animation
// ===================================

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 20);
    });
}

// Trigger animation when stats come into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
});

const statsBox = document.querySelector('.stats-box');
if (statsBox) {
    observer.observe(statsBox);
}

// ===================================
// Utility Functions
// ===================================

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Truncate text
function truncate(text, length) {
    if (text.length <= length) return text;
    return text.substr(0, length) + '...';
}

// Debounce function for search
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