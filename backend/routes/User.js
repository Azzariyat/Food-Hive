const express = require('express');
const router = express.Router();

// Contoh endpoint sementara
router.get('/', (req, res) => {
  res.send('User route working');
});

module.exports = router;