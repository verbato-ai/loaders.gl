// loaders.gl, MIT license

import {XMLLoader} from '@loaders.gl/xml';

export type WMTSCapabilities = {};

/**
 * Parses a typed data structure from raw XML for `GetCapabilities` response
 * @note Error handlings is fairly weak
 */
export function parseWMTSCapabilities(text: string, options): WMTSCapabilities {
  // Remove namespaces in XML
  options = {...options, xml: {...options?.xml, removeNSPrefix: true}};
  const parsedXML = XMLLoader.parseTextSync?.(text, options);
  const xmlCapabilities: any = parsedXML.Capabilities || parsedXML;
  return uncapitalizeKeys(xmlCapabilities);
}

function uncapitalizeKeys(object: any): any {
  if (object && typeof object === 'object') {
    const newObject = {};
    for (const [key, value] of Object.entries(object)) {
      newObject[uncapitalize(key)] = uncapitalizeKeys(value);
    }
    return newObject;
  }
  return object;
}

/**
 * Uncapitalize first letter of a string
 * @param {string} str
 * @returns {string}
 */
function uncapitalize(str: string): string {
  return typeof str === 'string' ? str.charAt(0).toLowerCase() + str.slice(1) : str;
}
