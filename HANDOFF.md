# DITA Content Editor — Session Handoff Document

## Context

This work is being done inside the `Jorsek/locale-insights-react` repo on branch `claude/review-plan-8P80c`, but the **dita-creator** code is intended to live in its own repo (`samc-heretto/dita-creator`). It was built here because the Claude session only had access to this repo.

**Goal**: Transfer the `dita-creator-phase1/` directory and `PLAN.md` to the `samc-heretto/dita-creator` repo and continue development there.

---

## What Was Built

### Commit History (4 commits on top of master)

1. **`ff14c0c` — Architecture Plan** (`PLAN.md`)
   - Full architecture document covering hybrid visual/source DITA editor
   - 5-phase implementation roadmap
   - Technology choices: TipTap, CodeMirror 6, Zustand, TanStack Query
   - CMS integration design (UUID-based content CRUD + hierarchy)

2. **`b4ecd43` — Phase 1: Foundation** (project scaffolding + core logic)
   - Vite + React 19 + TypeScript project in `dita-creator-phase1/`
   - CMS client interface (`src/api/cms-client.ts`) with mock implementation returning sample DITA XML
   - CMS React context provider (`src/api/cms-provider.tsx`)
   - XML parsing via browser DOMParser/XMLSerializer (`src/editor/conversion/xml-parser.ts`)
   - TipTap/ProseMirror schema for DITA topic elements (`src/editor/schema/topic-schema.ts`):
     - Nodes: `ditaTopic`, `ditaTitle`, `ditaBody`, `ditaP`, `ditaSection`, `ditaOl`, `ditaUl`, `ditaLi`, `ditaNote`, `ditaImage`
     - Marks: `ditaBold`, `ditaItalic`, `ditaUnderline`, `ditaPh`, `ditaXref`
   - Bidirectional XML ↔ TipTap JSON conversion (`xml-to-tiptap.ts`, `tiptap-to-xml.ts`)
   - Unknown attribute preservation via `ditaAttrs` bag for round-trip fidelity
   - App shell with sidebar hierarchy browser, editor tabs, mode toggle (all CSS modules)
   - Zustand UI store (`src/state/ui-store.ts`) for tabs, sidebar, active document
   - TanStack Query client (`src/state/query-client.ts`)
   - DITA type definitions (`src/types/dita.ts`)
   - **10 passing round-trip tests** (`src/editor/conversion/round-trip.test.ts`)

3. **`2e66a29` — Phase 2: Topic Editor** (visual + source editing)
   - `DitaEditor.tsx` — main editor component with visual/source mode switching
   - Visual editor (`src/editor/visual/DitaVisualEditor.tsx`):
     - TipTap integration with custom DITA schema
     - EditorToolbar: bold, italic, underline, insert paragraph/section/list/note
     - AttributePanel: shows/edits attributes of selected node including ditaAttrs bag
   - Source editor (`src/editor/source/DitaSourceEditor.tsx`):
     - CodeMirror 6 with XML syntax highlighting, code folding, search
   - Mode switching: visual ↔ source with XML validation (prevents switch if malformed)
   - Save to CMS via Ctrl+S or Save button with dirty state tracking
   - Editor tabs for multiple open documents
   - Collapsible sidebar with reopen button
   - All styled with CSS modules including DITA-specific note callout colors

4. **`562561d` — CI Workflow** (`.github/workflows/ci.yml`)
   - GitHub Actions: lint → type-check → test → build
   - Runs on push to main and PRs

---

## What Has NOT Been Built Yet (Phases 3-5)

### Phase 3: Map Editor
- TipTap schema for `<map>` (topicref, topichead, mapref)
- Tree-based map editor with drag-and-drop (`@dnd-kit/sortable`)
- UUID picker for adding topicrefs
- Map ↔ XML conversion

### Phase 4: App Shell Polish
- Sidebar hierarchy browser connected to real CMS API
- Tab management improvements (dirty state prompts on close)
- Keyboard shortcuts (Ctrl+Shift+V toggle mode)

### Phase 5: Polish
- Context-aware element insertion menu (based on cursor position / schema)
- Copy/paste handling (HTML → DITA conversion)
- Image support (upload via CMS + insert)
- Undo/redo across mode switches
- Error handling and validation feedback

---

## Key Technical Details

### Dependencies (from `dita-creator-phase1/package.json`)
- React 19, TypeScript, Vite
- `@tiptap/react`, `@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/pm`
- `@codemirror/lang-xml`, `codemirror`, `@codemirror/state`, `@codemirror/view`
- `@tanstack/react-query`
- `zustand`
- Vitest for testing

### Architecture Diagram
```
App Shell
├── Sidebar (CMS hierarchy tree, collapsible)
├── EditorTabs (multiple open documents)
└── DitaEditor (per document)
    ├── ModeToggle (Visual / Source tabs)
    ├── DitaVisualEditor (TipTap)
    │   ├── EditorToolbar
    │   ├── EditorContent (TipTap React)
    │   └── AttributePanel
    └── DitaSourceEditor (CodeMirror 6)
```

### Data Flow
1. Sidebar loads hierarchy from CMS → user clicks a topic
2. CMS client fetches XML by UUID → stored in TanStack Query cache
3. XML parsed via DOMParser → converted to TipTap JSON → loaded into editor
4. User edits in visual mode (TipTap manages state)
5. On save: TipTap JSON → converted to XML → CMS `writeContent(uuid, xml)`
6. On mode switch to source: TipTap → XML → CodeMirror
7. On mode switch to visual: CodeMirror XML → validate → TipTap

### Critical Design: Round-Trip Fidelity
- Unknown XML attributes preserved in `ditaAttrs` bag on each node
- Conversion tests ensure XML → TipTap → XML produces equivalent output
- Source mode serves as escape hatch for anything visual editor can't handle

### CMS Client Interface
The CMS client (`src/api/cms-client.ts`) has a mock implementation. To connect to a real CMS:
- Replace `MockCMSClient` with a real implementation of the `CMSClient` interface
- The interface supports: `listChildren`, `getHierarchy`, `readContent`, `writeContent`, `getMetadata`
- All content is identified by UUID

---

## File Listing (all under `dita-creator-phase1/`)

```
.github/workflows/ci.yml          # CI pipeline
index.html                         # Vite entry
package.json                       # Dependencies and scripts
vite.config.ts                     # Vite config
vitest.config.ts                   # Test config
tsconfig.json / tsconfig.app.json / tsconfig.node.json

src/
├── main.tsx                       # App entry
├── App.tsx                        # Root component with providers
├── index.css                      # Global styles
├── test-setup.ts                  # Test setup
├── api/
│   ├── cms-client.ts              # CMS client interface + mock
│   ├── cms-provider.tsx           # React context provider
│   └── types.ts                   # API types
├── editor/
│   ├── DitaEditor.tsx             # Main editor (visual/source toggle)
│   ├── DitaEditor.module.css
│   ├── schema/
│   │   └── topic-schema.ts        # TipTap node/mark defs for DITA topic
│   ├── conversion/
│   │   ├── xml-parser.ts          # DOMParser wrapper
│   │   ├── xml-to-tiptap.ts       # XML → TipTap JSON
│   │   ├── tiptap-to-xml.ts       # TipTap JSON → XML
│   │   └── round-trip.test.ts     # 10 round-trip fidelity tests
│   ├── visual/
│   │   ├── DitaVisualEditor.tsx   # TipTap editor component
│   │   ├── DitaVisualEditor.module.css
│   │   ├── EditorToolbar.tsx      # Formatting + insert toolbar
│   │   ├── EditorToolbar.module.css
│   │   ├── AttributePanel.tsx     # Node attribute inspector
│   │   └── AttributePanel.module.css
│   └── source/
│       ├── DitaSourceEditor.tsx   # CodeMirror XML editor
│       └── DitaSourceEditor.module.css
├── shell/
│   ├── AppShell.tsx               # Main layout
│   ├── AppShell.module.css
│   ├── Sidebar.tsx                # Hierarchy tree
│   ├── Sidebar.module.css
│   ├── EditorTabs.tsx             # Tab bar
│   ├── EditorTabs.module.css
│   ├── ModeToggle.tsx             # Visual/Source toggle
│   └── ModeToggle.module.css
├── state/
│   ├── ui-store.ts                # Zustand store
│   └── query-client.ts            # TanStack Query config
└── types/
    └── dita.ts                    # DITA TypeScript types
```

---

## Instructions for Next Session

1. **Transfer code to `samc-heretto/dita-creator`**:
   - Copy `dita-creator-phase1/` contents to root of dita-creator repo
   - Copy `PLAN.md` to the new repo
   - Run `npm install` and `npm test` to verify (10 tests should pass)

2. **Continue with Phase 3** (Map Editor) per the plan in `PLAN.md` section 9

3. **The full architecture plan is in `PLAN.md`** — it covers all 5 phases, schema definitions, CMS integration design, and key design decisions

4. **No npm install was run in this session** — dependencies are declared but not installed (no `node_modules/` or `package-lock.json` in the phase1 directory)
