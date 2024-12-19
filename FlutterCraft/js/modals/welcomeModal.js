export class WelcomeModal {
    constructor() {
        this.modal = document.getElementById('welcome-modal');
        this.init();
    }

    init() {
        if (!localStorage.getItem('welcomed')) {
            this.show();
            localStorage.setItem('welcomed', 'true');
        }
    }

    show() {
        this.modal.style.display = 'block';
    }

    close() {
        this.modal.style.display = 'none';
    }
} 