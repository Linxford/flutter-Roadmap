let PaystackPop;

export const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof PaystackPop !== 'undefined') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => {
      PaystackPop = window.PaystackPop;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.head.appendChild(script);
  });
};

export const initializePaystack = async ({
  email,
  amount,
  metadata,
  callback,
  onClose
}) => {
  try {
    if (!PaystackPop) {
      await loadPaystackScript();
    }

    const handler = PaystackPop.setup({
      key: 'pk_live_fb79c505bc33c72dd606410314e10d954cadee64', // Your Paystack public key
      email,
      amount,
      currency: 'GHS',
      ref: 'flutter_' + Math.floor(Math.random() * 1000000000 + 1),
      metadata,
      callback,
      onClose
    });

    handler.openIframe();
  } catch (error) {
    console.error('Paystack initialization error:', error);
    throw error;
  }
};

// Preload Paystack script
if (typeof window !== 'undefined') {
  loadPaystackScript().catch(error => {
    console.warn('Failed to preload Paystack:', error);
  });
}
