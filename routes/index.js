var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('', async function(req, res, next) {
  console.log('kek2');
  const response = await fetch("http://localhost:3001/users/");
  console.log(response, 'kek');
  res.send('index', { title: 'Express2' });
});

module.exports = router;
