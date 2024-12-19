import { MusicPlayer } from './components/musicPlayer.js';
import { PaymentHandler } from './components/paymentHandler.js';
import { ResourceManager } from './components/resourceManager.js';
import { WelcomeModal } from './modals/welcomeModal.js';
import { DevModal } from './modals/devModal.js';
import { SupportModal } from './modals/supportModal.js';
import { InstallModal } from './modals/installModal.js';
import { Storage } from './utils/storage.js';

class App {
    constructor() {
        this.musicPlayer = new MusicPlayer();
        this.paymentHandler = new PaymentHandler();
        this.resourceManager = new ResourceManager();
        this.welcomeModal = new WelcomeModal();
        this.devModal = new DevModal();
        this.supportModal = new SupportModal(this.paymentHandler);
        this.installModal = new InstallModal();
    }

    init() {
        // Initialize components
        this.paymentHandler.init();
        this.resourceManager.renderResources();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup global handlers
        window.closeModal = this.closeModal;
        window.showPaystackForm = () => this.supportModal.show();
        window.toggleMusicPlayer = () => this.musicPlayer.togglePlayer();
        window.toggleCompletion = (btn) => this.handleCompletion(btn);
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.resourceManager.filterResources(e.target.dataset.filter);
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.resourceManager.filterResources(
                    document.querySelector('.filter-btn.active').dataset.filter,
                    e.target.value
                );
            });
        }
    }

    handleCompletion(btn) {
        const card = btn.closest('.resource-card');
        btn.classList.toggle('completed');
        
        if (btn.classList.contains('completed')) {
            this.createConfetti(btn);
            this.updateProgress();
        }
    }

    createConfetti(element) {
        const rect = element.getBoundingClientRect();
        const colors = ['#64ffda', '#00bcd4', '#1a237e', '#0d47a1'];
        
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${rect.left + rect.width / 2}px`;
            confetti.style.top = `${rect.top}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    updateProgress() {
        const total = document.querySelectorAll('.complete-btn').length;
        const completed = document.querySelectorAll('.complete-btn.completed').length;
        const percentage = (completed / total) * 100;

        document.querySelector('.progress').style.width = `${percentage}%`;
        document.querySelector('.stat-number').textContent = completed;
        Storage.setItem('completedResources', completed);
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
}); 