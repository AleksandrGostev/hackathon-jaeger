var express = require('express');
var router = express.Router();
const { trace, propagation, context } =require( '@opentelemetry/api');

/* GET users listing. */
router.get('/', function(req, res, next) {
    const tracestate = req.headers['tracestate'];
    const traceparent = req.headers['traceparent'];
    let activeContext = propagation.extract(context.active(), {tracestate, traceparent});
    let tracer = trace.getTracer(process.env.NAME);
    let span = tracer.startSpan(
        'kek',
        {
          attributes: {},
        },
        activeContext,
      );
      
      // Set the created span as active in the deserialized context.
      trace.setSpan(activeContext, span);
    // const span = trace.getActiveSpan();
    // span.setAttributes({
    //     'app.payment.amount': 'kek',
    //   });
    // span.end();
  res.send('test');
});

module.exports = router;
