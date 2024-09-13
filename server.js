const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');  // CORS middleware

const app = express();
const stripe = Stripe('sk_test_51Pw26CRpXM9ALFeGTpTumYxg7TSz4oivUbtmc7g2CUUhySO9cnzvSmsUEVHn9HL3uVhwo1XOe2nipbk4UlWPjfb400BlKSECrr');  // Your Stripe Secret Key

// Middleware to handle CORS and JSON body parsing
app.use(cors());
app.use(bodyParser.json());

// Serve static HTML files (frontend)
app.use(express.static('public'));  // Ensure your HTML file is in the "public" folder

// Endpoint to process payment
app.post('/process_payment', async (req, res) => {
  const { token, amount } = req.body;  // Get token and amount from the frontend

  if (!token || !amount) {
    return res.status(400).json({ success: false, message: 'Payment token and amount are required' });
  }

  try {
    const charge = await stripe.charges.create({
      amount: amount,  // Amount in cents (100 cents = 1 USD)
      currency: 'usd',
      source: token,
      description: 'Custom Payment',
    });

    res.json({ success: true, charge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
