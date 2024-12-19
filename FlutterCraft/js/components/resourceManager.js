export class ResourceManager {
    constructor() {
        this.resources = [
            {
                title: "Flutter Installation Guide",
                description: "Official guide for setting up Flutter development environment with step-by-step instructions",
                type: "documentation",
                link: "https://docs.flutter.dev/get-started/install",
                difficulty: "beginner"
            },
            {
                title: "Dart Programming Language",
                description: "Master Dart fundamentals with interactive examples and exercises",
                type: "course",
                link: "https://dartpad.dev/",
                difficulty: "beginner"
            },
            // ... other resources from poe-preview.html
        ];
    }

    createResourceCard(resource, index) {
        return `
            <div class="resource-card" data-type="${resource.type}" style="animation-delay: ${index * 100}ms">
                <div class="card-header">
                    <img src="https://img.icons8.com/fluency/48/flutter.png" width="24" alt="flutter"/>
                    <span class="category">${resource.type}</span>
                </div>
                <h3>${resource.title}</h3>
                <p>${resource.description}</p>
                <div class="card-footer">
                    <button class="complete-btn" onclick="toggleCompletion(this)">
                        <img src="https://img.icons8.com/fluency/48/checkmark.png" width="20" alt="complete"/>
                        Mark Complete
                    </button>
                    <a href="${resource.link}" class="resource-link" target="_blank">Start Learning</a>
                </div>
            </div>
        `;
    }

    renderResources() {
        const container = document.querySelector('.resources-grid');
        if (!container) return;
        
        container.innerHTML = this.resources
            .map((resource, index) => this.createResourceCard(resource, index))
            .join('');
    }

    filterResources(type = 'all', searchTerm = '') {
        const cards = document.querySelectorAll('.resource-card');
        cards.forEach(card => {
            const cardType = card.dataset.type;
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            const matchesType = type === 'all' || cardType === type;
            const matchesSearch = title.includes(searchTerm.toLowerCase()) || 
                                description.includes(searchTerm.toLowerCase());

            card.style.display = matchesType && matchesSearch ? 'block' : 'none';
        });
    }
} 