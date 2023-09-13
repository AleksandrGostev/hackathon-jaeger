const { context, getSpan, getSpanContext, trace } =require( '@opentelemetry/api');
const {NodeTracerProvider} =require( '@opentelemetry/node');
const {registerInstrumentations} =require( '@opentelemetry/instrumentation');
const {JaegerExporter} =require( '@opentelemetry/exporter-jaeger');
const {SimpleSpanProcessor, BatchSpanProcessor, ConsoleSpanExporter} =require( '@opentelemetry/tracing');
const { ExpressInstrumentation } =require( '@aspecto/opentelemetry-instrumentation-express');
const { HttpInstrumentation } =require( '@opentelemetry/instrumentation-http');

const tracerProvider = new NodeTracerProvider ();

registerInstrumentations({
    tracerProvider: tracerProvider,
    instrumentations: [
        new ExpressInstrumentation(),
        new HttpInstrumentation(),
    ]
});

// Initialize the exporter. 
const options = {
    serviceName: process.env.NAME ?? 'sports',
    tags: [], // optional
    // You can use the default UDPSender
    //host: 'localhost', // optional
    //port: 6832, // optional
    // OR you can use the HTTPSender as follows
    //14250 : model.proto not working 
    endpoint: process.env.OTEL_EXPORTER_JAEGER_ENDPOINT,
    maxPacketSize: 65000 // optional
}

/**
 * 
 * Configure the span processor to send spans to the exporter
 * The SimpleSpanProcessor does no batching and exports spans
 * immediately when they end. For most production use cases,
 * OpenTelemetry recommends use of the BatchSpanProcessor.
 */
tracerProvider.addSpanProcessor(new BatchSpanProcessor(new JaegerExporter(options)));
//tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

/**
 * Registering the provider with the API allows it to be discovered
 * and used by instrumentation libraries. The OpenTelemetry API provides
 * methods to set global SDK implementations, but the default SDK provides
 * a convenience method named `register` which registers same defaults
 * for you.
 *
 * By default the NodeTracerProvider uses Trace Context for propagation
 * and AsyncHooksScopeManager for context management. To learn about
 * customizing this behavior, see API Registration Options below.
 */
// Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
tracerProvider.register();

const tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME);

const addTraceId = (req, res, next) => {
    const spanContext = getSpanContext(context.active());
    req.traceId = spanContext && spanContext.traceId;
    next();
};

module.exports = {tracer, addTraceId};