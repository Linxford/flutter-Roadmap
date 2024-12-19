const themes = {
    light: {
        primary: '#0468d7',
        secondary: '#64ffda',
        background: '#ffffff',
        cardBg: '#f5f5f5',
        text: '#2d3436',
        textSecondary: '#636e72'
    },
    dark: {
        primary: '#0468d7',
        secondary: '#64ffda',
        background: '#0a192f',
        cardBg: '#172a45',
        text: '#e6f1ff',
        textSecondary: '#8892b0'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    let activeFilters = {
        difficulty: 'all',
        type: 'all',
        search: ''
    };

    function createLoadingState() {
        return `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading resources...</p>
            </div>
        `;
    }

    function createErrorState(message = 'Error loading resources') {
        return `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                <button onclick="renderResources()" class="retry-btn">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }

    function renderResources() {
        const container = document.getElementById('resourcesContainer');
        if (!container) return;

        container.innerHTML = createLoadingState();

        try {
            setTimeout(() => { // Simulate loading for better UX
                let html = '';
                let hasResources = false;

                Object.entries(resources).forEach(([category, categoryData]) => {
                    if (categoryData.resources?.length > 0) {
                        categoryData.resources.forEach(resource => {
                            if (matchesFilters(resource)) {
                                html += createResourceCard(resource, category);
                                hasResources = true;
                            }
                        });
                    }
                });

                if (hasResources) {
                    container.innerHTML = html;
                    loadProgress(); // Load saved progress after rendering
                } else {
                    container.innerHTML = `
                        <div class="no-results">
                            <i class="fas fa-search"></i>
                            <p>No resources found matching your filters</p>
                            <button onclick="resetFilters()" class="reset-btn">
                                <i class="fas fa-undo"></i> Reset Filters
                            </button>
                        </div>
                    `;
                }
            }, 300);
        } catch (error) {
            console.error('Error rendering resources:', error);
            container.innerHTML = createErrorState();
        }
    }

    function matchesFilters(resource) {
        const matchesDifficulty = activeFilters.difficulty === 'all' || resource.difficulty === activeFilters.difficulty;
        const matchesType = activeFilters.type === 'all' || resource.type === activeFilters.type;
        const matchesSearch = !activeFilters.search || 
            resource.title.toLowerCase().includes(activeFilters.search.toLowerCase()) ||
            resource.description.toLowerCase().includes(activeFilters.search.toLowerCase());

        return matchesDifficulty && matchesType && matchesSearch;
    }

    function createResourceCard(resource, category) {
        return `
            <div class="resource-card" data-type="${resource.type}" data-difficulty="${resource.difficulty}">
                <div class="resource-header">
                    <div class="resource-type-badge ${resource.type}">
                        <i class="fas ${getResourceIcon(resource.type)}"></i>
                        ${resource.type}
                    </div>
                    <div class="resource-meta-top">
                        ${resource.platform ? `<span class="platform-badge">${resource.platform}</span>` : ''}
                        ${resource.isFree ? '<span class="free-badge">Free</span>' : ''}
                    </div>
                </div>
                
                <h3 class="resource-title">${resource.title}</h3>
                <p class="resource-description">${resource.description}</p>
                
                <div class="resource-meta">
                    ${resource.duration ? `
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            ${resource.duration}
                        </div>
                    ` : ''}
                    ${resource.creator ? `
                        <div class="meta-item">
                            <i class="fas fa-user"></i>
                            ${resource.creator}
                        </div>
                    ` : ''}
                    <div class="meta-item difficulty-${resource.difficulty}">
                        <i class="fas fa-signal"></i>
                        ${resource.difficulty}
                    </div>
                </div>
                
                <div class="resource-actions">
                    <a href="${resource.link}" class="primary-btn" target="_blank">
                        <i class="fas fa-external-link-alt"></i>
                        Start Learning
                    </a>
                    <label class="completion-toggle">
                        <input type="checkbox" class="complete-checkbox" onchange="updateProgress()">
                        <span>Mark Complete</span>
                    </label>
                </div>
            </div>
        `;
    }

    function getResourceIcon(type) {
        const icons = {
            video: 'fa-play-circle',
            documentation: 'fa-book',
            tutorial: 'fa-graduation-cap',
            tool: 'fa-tools',
            course: 'fa-chalkboard-teacher'
        };
        return icons[type] || 'fa-file';
    }

    function updateProgress() {
        const total = document.querySelectorAll('.complete-checkbox, .custom-checkbox').length;
        const completed = document.querySelectorAll('.complete-checkbox:checked, .custom-checkbox:checked').length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;

        // Update progress text
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('totalCount').textContent = total;
        
        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }

        // Save progress to localStorage
        saveProgress();
        updateTrackProgress();
    }

    function saveProgress() {
        const progress = {};
        document.querySelectorAll('.resource-card').forEach(card => {
            const resourceId = card.dataset.id;
            const isCompleted = card.querySelector('.complete-checkbox, .custom-checkbox').checked;
            progress[resourceId] = isCompleted;
        });
        localStorage.setItem('learningProgress', JSON.stringify(progress));
    }

    function loadProgress() {
        try {
            const progress = JSON.parse(localStorage.getItem('learningProgress')) || {};
            document.querySelectorAll('.resource-card').forEach(card => {
                const resourceId = card.dataset.id;
                if (progress[resourceId]) {
                    card.querySelector('.complete-checkbox, .custom-checkbox').checked = true;
                }
            });
            updateProgress();
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }

    function updateTrackProgress() {
        document.querySelectorAll('.track-btn').forEach(btn => {
            const track = btn.dataset.track;
            const trackResources = document.querySelectorAll(`.resource-card[data-track="${track}"]`);
            const completed = Array.from(trackResources).filter(card => 
                card.querySelector('.complete-checkbox').checked
            ).length;
            const percentage = trackResources.length ? Math.round((completed / trackResources.length) * 100) : 0;
            
            btn.querySelector('.progress-indicator').textContent = `${percentage}%`;
        });
    }

    // Event Listeners
    document.getElementById('searchInput').addEventListener('input', (e) => {
        activeFilters.search = e.target.value;
        renderResources();
    });

    document.getElementById('difficultyFilters').addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('#difficultyFilters .filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            activeFilters.difficulty = e.target.dataset.difficulty;
            renderResources();
        }
    });

    document.getElementById('typeFilters').addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('#typeFilters .filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            activeFilters.type = e.target.dataset.type;
            renderResources();
        }
    });

    // Initial render
    renderResources();

    // Add these functions to your existing script
    function initializeLearningTracks() {
        document.querySelectorAll('.track-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const track = btn.dataset.track;
                filterByTrack(track);
                updateTrackProgress(track);
            });
        });
    }

    function filterByTrack(track) {
        const resources = document.querySelectorAll('.resource-card');
        resources.forEach(card => {
            const belongsToTrack = card.dataset.track === track;
            card.style.display = belongsToTrack ? 'block' : 'none';
        });
    }

    function updateTrackProgress(track) {
        const trackResources = document.querySelectorAll(`.resource-card[data-track="${track}"]`);
        const completed = Array.from(trackResources).filter(card => 
            card.querySelector('.custom-checkbox').checked
        ).length;
        const percentage = (completed / trackResources.length) * 100;
        
        document.querySelector(`.track-btn[data-track="${track}"] .progress-indicator`)
            .textContent = `${Math.round(percentage)}%`;
    }

    function handleAdvancedFilters() {
        const durationFilter = document.getElementById('durationFilter');
        const priceFilters = document.querySelectorAll('.price-filters input');
        
        durationFilter.addEventListener('change', applyFilters);
        priceFilters.forEach(filter => filter.addEventListener('change', applyFilters));
    }

    function applyFilters() {
        const duration = document.getElementById('durationFilter').value;
        const freeChecked = document.querySelector('input[value="free"]').checked;
        const paidChecked = document.querySelector('input[value="paid"]').checked;
        
        const resources = document.querySelectorAll('.resource-card');
        resources.forEach(card => {
            const durationMatch = filterByDuration(card, duration);
            const priceMatch = filterByPrice(card, freeChecked, paidChecked);
            
            card.style.display = durationMatch && priceMatch ? 'block' : 'none';
        });
    }

    // Initialize new features
    initializeLearningTracks();
    handleAdvancedFilters();
    renderResources();

    // Theme handling
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'system';
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.value = savedTheme;
        
        function applyTheme(themeName) {
            const theme = themes[themeName === 'system' 
                ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                : themeName];
                
            Object.entries(theme).forEach(([property, value]) => {
                document.documentElement.style.setProperty(`--${property}`, value);
            });
        }

        themeToggle.addEventListener('change', (e) => {
            const newTheme = e.target.value;
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });

        // Initial theme application
        applyTheme(savedTheme);
    }

    initializeTheme();

    function renderMotivationalContent() {
        const { successStories, projectIdeas } = resources.motivationalContent;
        
        // Render success stories
        const storiesHtml = successStories.map(story => `
            <div class="motivation-card">
                <h3>${story.title}</h3>
                <p>${story.description}</p>
                <a href="${story.link}" target="_blank">Read More</a>
            </div>
        `).join('');
        
        // Render project ideas
        const ideasHtml = projectIdeas.map(idea => `
            <div class="project-card">
                <h3>${idea.title}</h3>
                <p>${idea.description}</p>
                <div class="project-meta">
                    <span class="difficulty ${idea.difficulty}">${idea.difficulty}</span>
                    <span class="time">${idea.estimatedTime}</span>
                </div>
                <div class="skills-required">
                    ${idea.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        `).join('');
        
        // Add to DOM
        document.getElementById('motivationalContent').innerHTML = storiesHtml + ideasHtml;
    }

    function filterByDuration(card, duration) {
        if (duration === 'all') return true;
        
        const resourceDuration = card.querySelector('.meta-item .fa-clock')?.parentElement?.textContent.trim();
        if (!resourceDuration) return false;

        const hours = parseFloat(resourceDuration.match(/\d+(\.\d+)?/)[0]);
        
        switch(duration) {
            case 'short': return hours < 2;
            case 'medium': return hours >= 2 && hours <= 5;
            case 'long': return hours > 5;
            default: return true;
        }
    }

    function filterByPrice(card, showFree, showPaid) {
        const isFree = card.querySelector('.free-badge') !== null;
        return (showFree && isFree) || (showPaid && !isFree);
    }

    function resetFilters() {
        // Reset all filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'all' || btn.dataset.difficulty === 'all' || btn.dataset.type === 'all') {
                btn.classList.add('active');
            }
        });

        // Reset search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';

        // Reset duration filter
        const durationFilter = document.getElementById('durationFilter');
        if (durationFilter) durationFilter.value = 'all';

        // Reset price filters
        document.querySelectorAll('.price-filters input').forEach(input => {
            input.checked = true;
        });

        // Reset active filters object
        activeFilters = {
            difficulty: 'all',
            type: 'all',
            search: ''
        };

        // Re-render resources
        renderResources();
    }

    function initialize() {
        // Initialize theme
        initializeTheme();
        
        // Initialize learning tracks
        initializeLearningTracks();
        
        // Initialize filters
        handleAdvancedFilters();
        
        // Initial render
        renderResources();
        
        // Add event listeners
        addEventListeners();
    }

    function addEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                activeFilters.search = e.target.value;
                renderResources();
            }, 300));
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filterType = e.target.dataset.difficulty ? 'difficulty' : 'type';
                const filterValue = e.target.dataset[filterType];
                
                document.querySelectorAll(`.filter-btn[data-${filterType}]`)
                    .forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                activeFilters[filterType] = filterValue;
                renderResources();
            });
        });
    }

    // Utility function for debouncing
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

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', initialize);
}); 