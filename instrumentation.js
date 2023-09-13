/*instrumentation.js*/
// Require dependencies
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { context, getSpan, getSpanContext, trace } =require( '@opentelemetry/api');
const { ConsoleSpanExporter, BatchSpanProcessor, } = require('@opentelemetry/sdk-trace-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} = require('@opentelemetry/sdk-metrics');

const {Resource} = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { ExpressInstrumentation } = require('opentelemetry-instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

const exporter = new OTLPTraceExporter({
    // optional - default url is http://localhost:4318/v1/traces
    // url: 'http://localhost:4318/v1/traces',
    headers: {foo: 'Bar'}
});

const sdk = new NodeSDK({
    // traceExporter: new ConsoleSpanExporter(),
    traceExporter: exporter,
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: process.env.NAME ?? 'sports'
    }),
    // spanProcessor: new BatchSpanProcessor(exporter),
//   metricReader: new PeriodicExportingMetricReader({
//     exporter: new ConsoleMetricExporter(),
//   }),
//   instrumentations: [new HttpInstrumentation()],
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

const tracer = trace.getTracer(process.env.NAME ?? 'sports');

module.exports = {tracer};