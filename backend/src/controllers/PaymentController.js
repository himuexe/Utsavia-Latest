const stripe = require('../config/stripe');
const razorpay = require('../config/razorpay');

const createPayment = async (req, res) => {
  try {
    const { amount, currency = 'inr', paymentMethod = 'stripe' } = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Invalid amount. Amount must be greater than 0." });
    }

    if (paymentMethod === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          userId: req.userId.toString(),
          checkoutType: req.body.checkoutType,
        }
      });

      return res.json({
        clientSecret: paymentIntent.client_secret,
        paymentMethod: 'stripe'
      });
    } else if (paymentMethod === 'razorpay') {
      const options = {
        amount: Math.round(amount * 100), // Convert to paise
        currency: currency.toUpperCase(), // Ensure currency is in uppercase
        receipt: `receipt_${req.userId}`,
        payment_capture: 1 // Auto-capture payment
      };

      const order = await razorpay.orders.create(options);
      return res.json({
        orderId: order.id,
        paymentMethod: 'razorpay'
      });
    
    } else {
      return res.status(400).json({ error: "Invalid payment method" });
    }
  } catch (error) {
    console.error('Payment Intent Error:', error); // Log the error
    res.status(500).json({ error: error.message });
  }
};
const webHook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata.userId;

        // Update booking/order status in your database
        console.log(`Payment succeeded for user ${userId}`);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        const failedUserId = failedPayment.metadata.userId;

        // Handle failed payment
        console.log(`Payment failed for user ${failedUserId}`);
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

module.exports = { createPayment, webHook };