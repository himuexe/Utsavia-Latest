const stripe = require('../config/stripe');
const validatePincode = async (req, res) => {
  const { pincode } = req.params;

  // Validate pincode format
  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ error: "Invalid pincode format. Please provide a 6-digit pincode." });
  }

  try {
    const response = await fetch(`http://postalpincode.in/api/pincode/${pincode}`);

    // Check if the response is OK (status code 200)
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch data from the external API." });
    }

    const data = await response.json();


    // Return the data if everything is fine
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error); // Log the error for debugging
    res.status(500).json({ error: "An error occurred while fetching data. Please try again later." });
  }
};

const createPayment = async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents and ensure integer
      currency,
      metadata: {
        userId: req.user._id.toString(), // Add user ID for reference
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({ error: error.message });
  }
}

const webHook =async (req, res) => {
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
        // Here you can update your booking/order status
        // You can access the user ID from paymentIntent.metadata.userId
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        // Handle failed payment
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

module.exports = {validatePincode , createPayment , webHook};