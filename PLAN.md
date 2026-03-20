# DITA Content Editor — Architecture Plan

## Summary

A React + TypeScript hybrid DITA editor supporting **visual editing** (TipTap/ProseMirror) and **XML source view**, starting with **map** and **topic** types. Content is managed by a backend CMS accessible by UUID with hierarchy, read/write, and metadata APIs. XML parsing uses browser DOM APIs.

---

## 1. Project Setup

- **Separate repo** (not in locale-insights-react)
- React 18+ / TypeScript / Vite
- Key dependencies:
  - `@tiptap/react`, `@tiptap/core`, `@tiptap/starter-kit`
  - `@tiptap/pm` (ProseMirror access for custom node views)
  - CodeMirror 6 (`@codemirror/lang-xml`) for the source view
  - Zustand or Redux Toolkit for state management
  - React Router for navigation

---

## 2. Core Architecture

```
┌─────────────────────────────────────────────┐
│                   App Shell                  │
│  ┌───────────┐  ┌────────────────────────┐  │
│  │  Sidebar   │  │     Editor Area        │  │
│  │  (Map Tree)│  │  ┌──────────────────┐  │  │
│  │            │  │  │  Visual / Source  │  │  │
│  │  hierarchy │  │  │  Toggle Tabs      │  │  │
│  │  from CMS  │  │  ├──────────────────┤  │  │
│  │            │  │  │                  │  │  │
│  │  - map     │  │  │  TipTap Editor   │  │  │
│  │    - topic │  │  │  (visual mode)   │  │  │
│  │    - topic │  │  │       OR         │  │  │
│  │            │  │  │  CodeMirror      │  │  │
│  │            │  │  │  (source mode)   │  │  │
│  │            │  │  │                  │  │  │
│  │            │  │  ├──────────────────┤  │  │
│  │            │  │  │  Element Toolbar │  │  │
│  │            │  │  │  + Attributes    │  │  │
│  └───────────┘  │  └──────────────────┘  │  │
│                  └────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Layers

| Layer | Responsibility |
|---|---|
| **CMS Client** | Fetches/saves content by UUID, enumerates hierarchy, reads metadata |
| **DITA Document Model** | Browser DOMParser ↔ TipTap schema conversion (bidirectional) |
| **TipTap Schema** | Defines DITA elements as ProseMirror nodes/marks with nesting rules |
| **Visual Editor** | TipTap React editor with custom NodeViews for DITA elements |
| **Source Editor** | CodeMirror 6 with XML syntax highlighting and validation |
| **Sync Layer** | Keeps visual ↔ source representations in sync on mode switch |

---

## 3. CMS Integration Layer

```typescript
// Types for the CMS API
interface CMSClient {
  // Hierarchy
  listChildren(parentUuid: string): Promise<ContentNode[]>;
  getHierarchy(rootUuid: string): Promise<ContentTree>;

  // Content CRUD
  readContent(uuid: string): Promise<string>; // returns DITA XML string
  writeContent(uuid: string, xml: string): Promise<WriteResult>;

  // Metadata
  getMetadata(uuid: string): Promise<ContentMetadata>;
}

interface ContentNode {
  uuid: string;
  title: string;
  type: 'map' | 'topic';
  children?: ContentNode[];
}

interface ContentMetadata {
  uuid: string;
  title: string;
  type: string;
  lastModified: string;
  // extensible
  [key: string]: unknown;
}
```

- Implement as a React context provider wrapping the CMS client
- RTK Query or TanStack Query for caching, refetching, optimistic updates

---

## 4. DITA ↔ TipTap Conversion

### 4a. XML Parsing (Browser DOM APIs)

```typescript
function parseDitaXml(xmlString: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  // Check for parse errors
  const error = doc.querySelector('parsererror');
  if (error) throw new DitaParseError(error.textContent);
  return doc;
}

function serializeDitaXml(doc: Document): string {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}
```

### 4b. TipTap Schema for Topic

Define ProseMirror nodes for core DITA elements:

| DITA Element | ProseMirror Node | Content Model |
|---|---|---|
| `<topic>` | `ditaTopic` | `title body` |
| `<title>` | `ditaTitle` | `inline*` |
| `<body>` | `ditaBody` | `(ditaP \| ditaSection \| ditaOl \| ditaUl \| ditaNote \| ditaTable)*` |
| `<p>` | `ditaP` | `inline*` |
| `<section>` | `ditaSection` | `ditaTitle? (ditaP \| ditaOl \| ditaUl \| ditaNote)*` |
| `<ol>` | `ditaOl` | `ditaLi+` |
| `<ul>` | `ditaUl` | `ditaLi+` |
| `<li>` | `ditaLi` | `(ditaP \| inline)*` |
| `<note>` | `ditaNote` | `(ditaP \| inline)*` — with `type` attribute |
| `<ph>` | `ditaPh` (mark) | inline |
| `<b>`, `<i>`, `<u>` | marks | inline |
| `<xref>` | `ditaXref` (mark) | inline — with `href`, `scope`, `format` attrs |
| `<image>` | `ditaImage` | leaf node — `href`, `alt` attrs |

### 4c. TipTap Schema for Map

| DITA Element | ProseMirror Node | Content Model |
|---|---|---|
| `<map>` | `ditaMap` | `ditaTitle? ditaTopicref*` |
| `<title>` | `ditaTitle` | `inline*` |
| `<topicref>` | `ditaTopicref` | `ditaTopicref*` — with `href`, `navtitle`, `uuid` attrs |
| `<topichead>` | `ditaTopichead` | `ditaTopicref*` — with `navtitle` attr |
| `<mapref>` | `ditaMapref` | leaf — with `href` attr |

### 4d. Bidirectional Conversion

```typescript
// XML DOM → TipTap JSON
function xmlToTipTap(xmlDoc: Document, schema: Schema): JSONContent;

// TipTap JSON → XML string
function tipTapToXml(doc: JSONContent): string;
```

Walk the XML DOM tree recursively, mapping each element to its TipTap node type. Preserve unknown attributes in a generic `attrs.ditaAttrs` bag so they round-trip without loss.

---

## 5. Editor Components

### 5a. Visual Editor (TipTap)

```
<DitaVisualEditor>
  ├── <EditorToolbar />          — bold, italic, insert element, etc.
  ├── <EditorContent />          — TipTap's React component
  ├── <AttributePanel />         — shows/edits attrs of selected node
  └── <ElementInsertMenu />      — context-aware "insert element" dropdown
</DitaVisualEditor>
```

Custom NodeViews for:
- `<note>` — rendered with colored callout based on `type` attribute
- `<image>` — rendered as actual image with alt text overlay
- `<xref>` — rendered as a clickable link or UUID reference chip
- `<topicref>` (in map) — rendered as a draggable tree item

### 5b. Source Editor (CodeMirror 6)

```
<DitaSourceEditor>
  ├── CodeMirror instance with XML language support
  ├── Line numbers, folding, search
  └── Validation gutter (well-formedness checks via DOMParser)
</DitaSourceEditor>
```

### 5c. Mode Switching

- Toggle between Visual and Source tabs
- On switch **to source**: serialize TipTap doc → XML string → load into CodeMirror
- On switch **to visual**: parse XML from CodeMirror → validate → load into TipTap
- If XML in source is malformed, show error and prevent switch to visual

---

## 6. Map Editor Specifics

The map editor is structurally different from topic editing:

- **Tree-based UI**: topicrefs displayed as a draggable/sortable tree
- **Drag and drop** reordering of topicrefs
- **Add topicref**: opens a UUID picker (backed by CMS `listChildren` / search)
- **Inline navtitle editing**: click to edit topicref labels
- **Nested maps**: mapref nodes link to other maps (open in new tab/panel)

This could use TipTap with a custom NodeView for the tree, or a separate tree component (e.g., `@dnd-kit/sortable`) that operates directly on the XML DOM model. The latter is likely simpler for the map case.

---

## 7. State Management

```
┌─────────────────────────────────────┐
│            Global State             │
│  ┌───────────┐  ┌───────────────┐  │
│  │ CMS Cache  │  │ Open Tabs     │  │
│  │ (TanStack  │  │ (active docs, │  │
│  │  Query)    │  │  dirty state) │  │
│  └───────────┘  └───────────────┘  │
│  ┌───────────┐  ┌───────────────┐  │
│  │ UI State   │  │ Editor State  │  │
│  │ (sidebar,  │  │ (managed by   │  │
│  │  panels)   │  │  TipTap per   │  │
│  │            │  │  document)    │  │
│  └───────────┘  └───────────────┘  │
└─────────────────────────────────────┘
```

- **TanStack Query** for CMS data (content, hierarchy, metadata) — handles caching, background refetch, optimistic updates
- **Zustand** for UI state (which tabs are open, sidebar collapsed, active panel)
- **TipTap** manages its own editor state per document instance
- **Dirty tracking**: compare current TipTap doc JSON against last-saved version

---

## 8. File/Folder Structure

```
src/
├── api/
│   ├── cms-client.ts          # CMS API client implementation
│   ├── cms-provider.tsx       # React context for CMS client
│   └── types.ts               # API types (ContentNode, etc.)
├── editor/
│   ├── schema/
│   │   ├── topic-schema.ts    # TipTap node/mark definitions for topics
│   │   ├── map-schema.ts      # TipTap node definitions for maps
│   │   └── common-marks.ts    # Shared inline marks (bold, italic, xref)
│   ├── conversion/
│   │   ├── xml-to-tiptap.ts   # XML DOM → TipTap JSON
│   │   ├── tiptap-to-xml.ts   # TipTap JSON → XML string
│   │   └── round-trip.test.ts # Critical: ensure XML survives round-trip
│   ├── extensions/
│   │   ├── dita-topic.ts      # TipTap extension for topic editing
│   │   ├── dita-map.ts        # TipTap extension for map editing
│   │   └── dita-note.ts       # Custom node view for <note>
│   ├── visual/
│   │   ├── DitaVisualEditor.tsx
│   │   ├── EditorToolbar.tsx
│   │   ├── AttributePanel.tsx
│   │   └── ElementInsertMenu.tsx
│   └── source/
│       └── DitaSourceEditor.tsx
├── map/
│   ├── MapTreeEditor.tsx       # Tree-based map editor
│   ├── TopicrefNode.tsx        # Draggable topicref item
│   └── UuidPicker.tsx          # Search/browse CMS to pick content
├── shell/
│   ├── AppShell.tsx            # Main layout
│   ├── Sidebar.tsx             # Hierarchy browser
│   ├── EditorTabs.tsx          # Tab management for open docs
│   └── ModeToggle.tsx          # Visual/Source toggle
├── state/
│   ├── ui-store.ts             # Zustand store for UI state
│   └── query-client.ts         # TanStack Query configuration
├── types/
│   └── dita.ts                 # DITA type definitions
├── App.tsx
└── main.tsx
```

---

## 9. Implementation Phases

### Phase 1: Foundation
1. Project scaffolding (Vite + React + TS)
2. CMS client interface + mock implementation
3. XML parsing utilities (DOMParser/XMLSerializer)
4. TipTap schema for `<topic>` (title, body, p, section, lists, note)
5. Bidirectional conversion: XML ↔ TipTap
6. Round-trip tests

### Phase 2: Topic Editor
7. Visual editor component with TipTap
8. Basic toolbar (bold, italic, insert paragraph/section/note)
9. Attribute panel for selected node
10. Source editor with CodeMirror 6
11. Mode switching (visual ↔ source)
12. Save to CMS (writeContent)

### Phase 3: Map Editor
13. TipTap schema for `<map>` (topicref, topichead, mapref)
14. Tree-based map editor with drag-and-drop
15. UUID picker for adding topicrefs
16. Map ↔ XML conversion

### Phase 4: App Shell
17. Sidebar hierarchy browser (from CMS)
18. Tab management for multiple open documents
19. Dirty state tracking + save/discard prompts
20. Keyboard shortcuts (Ctrl+S save, Ctrl+Shift+V toggle mode)

### Phase 5: Polish
21. Element insertion menu (context-aware based on cursor position)
22. Copy/paste handling (HTML → DITA conversion)
23. Image support (upload via CMS + insert)
24. Undo/redo across mode switches
25. Error handling and validation feedback

---

## 10. Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| XML parsing | Browser DOMParser | No dependencies, fast, handles DITA well |
| Visual editor | TipTap (ProseMirror) | Schema enforcement, NodeViews, React integration |
| Source editor | CodeMirror 6 | Best-in-class code editor, XML support |
| State management | TanStack Query + Zustand | Query for server state, Zustand for UI — lightweight |
| Unknown attributes | Preserved in attr bag | Ensures round-trip fidelity for attrs editor doesn't know about |
| Map editing | Separate tree component | Maps are structural, not prose — tree UI is more natural |
| Backend validation | Server is source of truth | Editor schema is guidance, backend enforces strict validity |

---

## 11. Critical Risk: Round-Trip Fidelity

The #1 technical risk is that converting XML → TipTap → XML loses or corrupts content. Mitigations:

1. **Preserve unknown elements** as opaque blocks (render as gray boxes in visual mode, fully visible in source)
2. **Preserve unknown attributes** in a generic bag that gets serialized back
3. **Preserve processing instructions and comments** as special nodes
4. **Extensive round-trip tests**: parse XML, convert to TipTap, convert back, compare. Must be byte-equivalent (or semantically equivalent with whitespace normalization)
5. **Source mode as escape hatch**: users can always switch to source to handle anything the visual editor can't
