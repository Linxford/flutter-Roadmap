export class SupportModal {
    constructor(paymentHandler) {
        this.modal = document.getElementById('paystack-modal');
        this.paymentHandler = paymentHandler;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('paystack-form');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    show() {
        this.modal.style.display = 'block';
    }

    close() {
        this.modal.style.display = 'none';
    }

    handleSubmit(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            amount: document.getElementById('amount').value
        };

        this.paymentHandler.handlePayment(formData);
    }
} 