const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define a POST endpoint for the webhook
app.post('/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  res.status(200).send('Webhook received');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
