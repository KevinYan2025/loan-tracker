const express = require('express');
const app = express();

// ...existing code...

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// ...existing code...

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
