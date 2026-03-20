/** Core DITA type definitions */

export type DitaDocumentType = 'map' | 'topic';

export interface ContentNode {
  uuid: string;
  title: string;
  type: DitaDocumentType;
  children?: ContentNode[];
}

export interface ContentTree {
  root: ContentNode;
}

export interface ContentMetadata {
  uuid: string;
  title: string;
  type: string;
  lastModified: string;
  [key: string]: unknown;
}

export interface WriteResult {
  success: boolean;
  uuid: string;
  timestamp: string;
}

export class DitaParseError extends Error {
  constructor(message: string | null) {
    super(message ?? 'Unknown XML parse error');
    this.name = 'DitaParseError';
  }
}

/** Attribute bag for preserving unknown attributes during round-trip */
export type DitaAttributes = Record<string, string>;

/** Note types supported by DITA */
export type DitaNoteType =
  | 'note'
  | 'tip'
  | 'important'
  | 'remember'
  | 'restriction'
  | 'danger'
  | 'warning'
  | 'caution'
  | 'trouble'
  | 'notice'
  | 'attention'
  | 'fastpath'
  | 'other';
