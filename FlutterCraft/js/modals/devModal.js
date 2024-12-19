export class DevModal {
    constructor() {
        this.modal = document.getElementById('dev-modal');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelector('[data-modal="dev"]').addEventListener('click', () => this.show());
        document.querySelector('#dev-modal .modal-btn').addEventListener('click', () => this.close());
    }

    show() {
        this.modal.style.display = 'block';
    }

    close() {
        this.modal.style.display = 'none';
    }
} 