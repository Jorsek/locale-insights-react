import { DitaParseError } from '../../types/dita';

/**
 * Parse a DITA XML string into a DOM Document using the browser's DOMParser.
 */
export function parseDitaXml(xmlString: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const error = doc.querySelector('parsererror');
  if (error) {
    throw new DitaParseError(error.textContent);
  }
  return doc;
}

/**
 * Serialize a DOM Document back to an XML string.
 */
export function serializeDitaXml(doc: Document): string {
  const serializer = new XMLSerializer();
  let xml = serializer.serializeToString(doc);

  // Ensure XML declaration is present
  if (!xml.startsWith('<?xml')) {
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml;
  }

  return xml;
}

/**
 * Extract all attributes from an element as a plain object.
 */
export function getElementAttributes(el: Element): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const attr of el.attributes) {
    attrs[attr.name] = attr.value;
  }
  return attrs;
}
