export const opticEngine = require('./domain.js');

const {contexts, diff} = opticEngine.com.useoptic;

export const ShapesCommands = contexts.shapes.Commands;
export const ShapesHelper = contexts.shapes.ShapesHelper();
export const RequestsHelper = contexts.requests.RequestsServiceHelper();
export const ContentTypesHelper = contexts.requests.ContentTypes();
export const NaiveSummary = diff.NaiveSummary();

export const RfcCommands = contexts.rfc.Commands;
export const RequestsCommands = contexts.requests.Commands;
export const RfcCommandContext = contexts.rfc.RfcCommandContext;
export const ScalaJSHelpers = opticEngine.ScalaJSHelpers;

export const Facade = contexts.rfc.RfcServiceJSFacade();
export const Queries = (eventStore: any, service: any, aggregateId: string) => new opticEngine.Queries(eventStore, service, aggregateId);


export function commandsToJson(commands: any[]) {
  return commands.map(x => JSON.parse(opticEngine.CommandSerialization.toJsonString(x)));
}

export function commandsFromJson(commands: any[]) {
  return opticEngine.CommandSerialization.fromJsonString(JSON.stringify(commands));
}

export function commandsToJs(commandSequence: any) {
  return opticEngine.CommandSerialization.toJs(commandSequence);
}

export function commandToJs(command: any) {
  return opticEngine.CommandSerialization.toJs(command);
}

export const JsonHelper = diff.JsonHelper();

function fromJs(x: any) {
  if (typeof x === 'undefined') {
    return JsonHelper.toNone();
  }
  return JsonHelper.toSome(JsonHelper.fromString(JSON.stringify(x)));
}

export const mapScala = (collection: any) => (handler: any) => {
  return ScalaJSHelpers.toJsArray(collection).map(handler);
};

export const everyScala = (collection: any) => (handler: any) => {
  return ScalaJSHelpers.toJsArray(collection).every(handler);
};
export const lengthScala = (collection: any) => {
  return ScalaJSHelpers.toJsArray(collection).length;
};

const {ApiInteraction, ApiRequest, ApiResponse} = diff;

export function extractContentType(headers: IHeader[], fallback: string | null) {
  return headers.find(x => x.name === 'content-type')?.value || fallback;
}

export function extractRequestAndResponseBodyAsJs(sample: IApiInteraction) {
  const requestContentType = extractContentType(sample.request.headers, null);
  const responseContentType = extractContentType(sample.response.headers, null);
  const requestBody = sample.request.body.asJsonString ? JSON.parse(sample.request.body.asJsonString) : (sample.request.body.asText ? sample.request.body.asText : undefined);
  const responseBody = sample.response.body.asJsonString ? JSON.parse(sample.response.body.asJsonString) : (sample.response.body.asText ? sample.response.body.asText : undefined);
  console.log({
    sample,
    requestContentType,
    requestBody,
    responseBody,
    responseContentType
  });
  return {
    requestContentType,
    requestBody,
    responseBody,
    responseContentType
  };
}

export function toInteraction(sample: IApiInteraction) {
  const requestContentType = extractContentType(sample.request.headers, '*/*');
  const responseContentType = extractContentType(sample.response.headers, '*/*');

  const requestBody = sample.request.body.asJsonString ? fromJs(JSON.parse(sample.request.body.asJsonString)) : (sample.request.body.asText ? fromJs(sample.request.body.asText) : JsonHelper.toNone());
  const responseBody = sample.response.body.asJsonString ? fromJs(JSON.parse(sample.response.body.asJsonString)) : (sample.response.body.asText ? fromJs(sample.response.body.asText) : JsonHelper.toNone());
  console.log({
    sample,
    requestContentType,
    requestBody,
    responseBody,
    responseContentType
  });
  return ApiInteraction(
    ApiRequest(sample.request.path, sample.request.method, sample.request.queryString || '', requestContentType, requestBody),
    ApiResponse(sample.response.statusCode, responseContentType, responseBody)
  );
}

export const InteractionDiffer = diff.InteractionDiffer;
export const RequestDiffer = diff.RequestDiffer();
export const Interpreters = diff.interpreters;
export const PluginRegistry = diff.PluginRegistry;
export const QueryStringDiffer = diff.query.QueryStringDiffer;
export const {JsQueryStringParser} = opticEngine;
export const OasProjectionHelper = contexts.rfc.projections.OASProjectionHelper();

import {checkDiffOrUnrecognizedPath} from './check-diff';
import {IApiInteraction, IHeader} from './domain-types/optic-types';

export {
  checkDiffOrUnrecognizedPath
};

export * from './domain-types/optic-types';
