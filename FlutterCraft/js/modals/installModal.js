export class InstallModal {
    constructor() {
        this.modal = document.getElementById('install-modal');
        this.currentOS = 'windows';
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.os-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchOS(tab.dataset.os));
        });
    }

    show() {
        this.modal.style.display = 'block';
    }

    close() {
        this.modal.style.display = 'none';
    }

    switchOS(os) {
        // Remove active class from current OS
        document.querySelector(`.os-tab[data-os="${this.currentOS}"]`)
            .classList.remove('active');
        document.querySelector(`.installation-steps[data-os="${this.currentOS}"]`)
            .classList.remove('active');

        // Add active class to new OS
        this.currentOS = os;
        document.querySelector(`.os-tab[data-os="${os}"]`)
            .classList.add('active');
        document.querySelector(`.installation-steps[data-os="${os}"]`)
            .classList.add('active');
    }
} 