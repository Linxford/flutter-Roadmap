export class PaymentHandler {
    constructor() {
        this.paystackKey = 'pk_live_fb79c505bc33c72dd606410314e10d954cadee64';
    }

    async init() {
        try {
            await this.loadPaystackScript();
        } catch (error) {
            console.warn('Failed to preload Paystack:', error);
        }
    }

    loadPaystackScript() {
        return new Promise((resolve, reject) => {
            if (typeof PaystackPop !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Paystack script'));
            document.head.appendChild(script);
        });
    }

    async handlePayment(data) {
        try {
            if (typeof PaystackPop === 'undefined') {
                await this.loadPaystackScript();
            }

            const handler = PaystackPop.setup({
                key: this.paystackKey,
                email: data.email,
                amount: parseFloat(data.amount) * 100, // Convert to pesewas
                currency: 'GHS',
                ref: 'flutter_' + Math.floor((Math.random() * 1000000000) + 1),
                metadata: {
                    name: data.name,
                    phone: data.phone
                },
                callback: (response) => {
                    this.onPaymentSuccess(response);
                },
                onClose: () => {
                    console.log('Payment window closed');
                }
            });
            
            handler.openIframe();
        } catch (error) {
            console.error('Payment initialization error:', error);
            alert('Unable to initialize payment. Please try again later.');
        }
    }

    onPaymentSuccess(response) {
        alert('Thanks for your support! Transaction reference: ' + response.reference);
    }
} 