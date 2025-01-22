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
    const { amount, currency = 'inr' } = req.body;

    // Use req.userId instead of req.user.id
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: req.userId.toString(), // Use req.userId here
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment Intent Error:', error);
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
        // Example: await BookingModel.updateOne({ userId }, { status: 'paid' });
        console.log(`Payment succeeded for user ${userId}`);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        const failedUserId = failedPayment.metadata.userId;

        // Handle failed payment
        // Example: await BookingModel.updateOne({ userId: failedUserId }, { status: 'failed' });
        console.log(`Payment failed for user ${failedUserId}`);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

module.exports = {validatePincode , createPayment , webHook};