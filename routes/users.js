var express = require('express');
var router = express.Router();
const { trace, context, propagation } =require( '@opentelemetry/api');
const { tracer } = require('../instrumentation');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  // const span = trace.getActiveSpan();
  const output = {};
  propagation.inject(context.active(), output);
  const { traceparent, tracestate } = output;
  // const childSpan = tracer.startSpan('somework', {
  //   attributes: {'code.function': 'getUsers'}
  // }, context.active());
  const response = await fetch("http://localhost:3001/test/?foo=bar", {
    headers: {
      traceparent,
      tracestate
    }
  });
  // childSpan.end();
  res.send('respond with a resource');
});

module.exports = router;
