var express = require('express');
var router = express.Router();
const { trace } =require( '@opentelemetry/api');

/* GET users listing. */
router.get('/', function(req, res, next) {
    const span = trace.getActiveSpan();
    span.setAttributes({
        'app.payment.amount': 'kek',
      });
  res.send('test');
});

module.exports = router;
