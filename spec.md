# Dev Notebook – Architecture & Specification

## Overview
Chrome extension (MV3) that replaces the new tab page with a rich notebook app.  
Main files: `newtab.html`, `script.js` (~4675 lines), `styles.css` (3120 lines), `js/ai-providers.js` (527 lines), `js/db.js` (~700 lines).

**Storage: SQLite via sql.js WASM** (migrated from chrome.storage.local)

## Data Model

### Hierarchy
```
Workspaces → Projects → Items (notes | bookmarks | credentials | draws)
```
- **Workspaces**: `{ id, name, projects[] }`
- **Projects**: `{ id, name, items[] }`
- **Items** (polymorphic):
  - **Note**: `{ id, type:'note', title, body (Quill Delta JSON), created }`
  - **Bookmark**: `{ id, type:'bookmark', title, url, description, created }`
  - **Credential**: `{ id, type:'credential', title, username, password, notes, created }`
  - **Draw**: `{ id, type:'draw', title, drawUrl, created }`

### Global Data
- **Todos**: `{ id, text, completed, createdAt, completedAt }` — not workspace-scoped
- **AI Settings**: providers map, API keys, lastModel, systemInstruction
- **AI Snippets**: `{ trigger, text, description }` array
- **Chat History**: `{ role, content }[]`
- **UI State**: theme, activeWorkspaceId, activeProjectId, activeItemType, aiDockVisible

## Previous Storage (chrome.storage.local)
All data stored as flat keys in `chrome.storage.local`:
| Key | Type | Description |
|-----|------|-------------|
| `workspaces` | JSON array | All workspaces with nested projects & items |
| `todos` | JSON array | Global todo list |
| `theme` | string | 'light' / 'dark' / 'system' |
| `activeWorkspaceId` | string | Currently selected workspace |
| `activeProjectId` | string | Currently selected project |
| `activeItemType` | string | 'note' / 'bookmark' / 'credential' / 'draw' |
| `aiDockVisible` | boolean | AI dock panel visibility |
| `chatHistory` | JSON array | Chat conversation messages |
| `aiSettings` | JSON object | Provider config, API keys, etc. |
| `aiSnippets` | JSON array | Custom AI prompt snippets |

### Problems with Previous Storage
1. **Single blob**: Entire `workspaces` array (all items, all bodies) serialized/deserialized on every save
2. **No partial updates**: Changing one note title re-saves ALL data
3. **Memory overhead**: All note content loaded in memory at once
4. **10MB soft limit** on chrome.storage.local
5. **Slow cross-tab sync**: Full data replacement on every change event
6. **No indexing**: Search requires linear scan of in-memory array

## New Storage (SQLite via sql.js WASM)

### Database Schema
```sql
CREATE TABLE workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE items (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK(type IN ('note','bookmark','credential','draw')),
  title TEXT DEFAULT '',
  created TEXT,
  body TEXT,          -- note: Quill Delta JSON
  url TEXT,           -- bookmark
  description TEXT,   -- bookmark
  username TEXT,      -- credential
  password TEXT,      -- credential
  notes TEXT,         -- credential
  draw_url TEXT,      -- draw
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE todos (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  created_at INTEGER,
  completed_at INTEGER
);

CREATE TABLE chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

### Persistence
- sql.js runs SQLite in WASM, database lives in memory
- Periodically persisted to IndexedDB as a binary blob (Uint8Array)
- Debounced saves (300ms) to avoid excessive I/O during rapid edits
- Full DB export on `beforeunload`

### Migration
On first load, if `chrome.storage.local` has data but SQLite DB is empty:
1. Read all keys from chrome.storage.local
2. Insert into SQLite tables
3. Mark migration complete in settings table
4. Keep chrome.storage.local as backup (don't delete)

## Key Functions in script.js

### Initialization
- `DOMContentLoaded` → polls for Quill/hljs → `initializeQuill()` → `init()`
- `init()`: loads all data, migrates legacy flat notes → workspace structure, renders UI

### Data Persistence
- `saveWorkspaces()`: saves only navigation state (activeWorkspaceId, activeProjectId, activeItemType) via `DevNotebookDB.setSettings()`
- All CRUD operations use direct `DevNotebookDB.*` calls (granular per-row updates)
- `getItem(id)`: reads from SQLite, parses body JSON, returns object matching legacy format
- `getCurrentWorkspace()`/`getCurrentProject()`: query DevNotebookDB directly

### UI Rendering
- `renderSidebarControls()`: populates workspace/project `<select>` dropdowns
- `renderItemsList()`: rebuilds `#items-list` `<ul>` from scratch each call
- `openItemEditor(id)`: switches view panes, loads item into appropriate editor
- `renderTodoList()`: paginated todo rendering (15/page)

### Item Management
- `createNewItem()`: inserts at top of current project
- `deleteItems(ids)`: batch delete with cascade
- `setActiveItem(id)`: sets active + re-renders
- `handleItemClick(e, id)`: supports shift/ctrl multi-select

### Auto-save (Quill)
- `quill.on('text-change')` → 500ms debounce → save active note
- `noteTitleEl.on('input')` → immediate list re-render + 500ms debounce save

### AI System
- 11 providers: OpenAI, Gemini, Anthropic, xAI, DeepSeek, Mistral, Cohere, HuggingFace, NVIDIA, Alibaba, WebAI (Chrome built-in)
- Streaming chat writes directly to Quill editor with markdown parsing
- AI snippets (`/` triggers) for quick prompts
- Settings stored in `aiSettings` object
- Chat history persisted for continuity

### Cross-Tab Sync
- **BroadcastChannel** (`devnotebook_sync`) replaces `chrome.storage.onChanged`
- `notifySyncPeers()` broadcasts after every DB mutation
- Receiver reloads todos, refreshes item lists, and re-checks theme

### Theme
- Toggle between 'light' and 'dark' (no 'system' runtime, just stores)
- `applyTheme()`: toggles `.light-mode` class on `<body>`

### Export/Import
- Single item export as JSON
- Full backup: all workspaces + todos as JSON
- Import: handles workspaces backup, single items, legacy notes, todos
- Drag & drop JSON import supported

### Other Features
- Excalidraw integration via embedded iframe (`draw/index.html`)
- Photo editor via embedded iframe (`photoeditor/photoeditor.html`)
- Quill rich text editor with syntax highlighting (hljs)
- Markdown shortcuts in editor (headers, lists, blockquotes)
- Code block auto-detection and formatting
- AI-powered media generation (images/videos)

## Performance Optimizations Applied
1. **Granular saves**: Only modified rows updated in SQLite (not entire dataset)
2. **Lazy body loading**: Item list shows metadata only; body loaded on select
3. **Debounced DB persist**: SQLite memory → IndexedDB batched at 300ms
4. **DOM diffing for lists**: Update existing `<li>` elements instead of full rebuild
5. **Indexed queries**: SQLite indexes on foreign keys and type columns
6. **Transaction batching**: Bulk operations wrapped in transactions
7. **Deferred AI init**: AI module loaded only when dock first opened
8. **Code highlighting debounce**: Prevents redundant re-highlighting

## File Structure
```
manifest.json          – Extension manifest (MV3)
newtab.html            – Main HTML (chrome_url_overrides.newtab)
script.js              – Core app logic (4700+ lines)
styles.css             – All styling
js/
  ai-providers.js      – AI API call logic
  db.js                – SQLite abstraction layer (NEW)
  sql-wasm.js          – sql.js WASM loader (NEW)
  sql-wasm.wasm        – SQLite WASM binary (NEW)
css/
  quill.snow.css       – Quill editor theme
  vs2015.min.css       – hljs syntax theme
draw/                  – Excalidraw embedded app
photoeditor/           – Photo editor embedded app
```

## Constants & IDs
- Workspace IDs: `ws_` + timestamp
- Project IDs: `proj_` + timestamp
- Item IDs: timestamp string (`Date.now().toString()`)
- Todo IDs: timestamp + random alphanumeric
- Quill editor container: `#editor-content`
- Items list: `#items-list`
- All view panes have class `.view-pane`

## Migration Status (Complete)

### What Changed
| Area | Before | After |
|------|--------|-------|
| Storage engine | `chrome.storage.local` (JSON blobs) | SQLite via sql.js WASM |
| Persistence layer | Direct chrome API calls | `DevNotebookDB.*` abstraction in `js/db.js` |
| DB persistence | N/A | IndexedDB (`devnotebook_sqlite`) with 300ms debounce |
| Cross-tab sync | `chrome.storage.onChanged` | `BroadcastChannel('devnotebook_sync')` |
| Save granularity | Full workspaces array on every change | Individual row INSERT/UPDATE |
| Item list loading | All bodies loaded upfront | Metadata-only; body loaded on select |
| Todo history | Undeclared `todoHistory` variable (bug) | `getCompletedTodos()` computed from `todos` array |
| Unused globals | `let workspaces = []`, `saveTodos()` | Removed |

### DevNotebookDB API (33 methods)
```
init, migrateFromChromeStorage, forcePersist
getWorkspaces, getWorkspace, createWorkspace, updateWorkspace, deleteWorkspace
getProjects, getProject, createProject, updateProject, deleteProject
getItems, getItem, getItemMeta, getItemPreview, createItem, updateItem, deleteItem, deleteItems, searchItems, getItemCountByType
getTodos, createTodo, updateTodo, deleteTodo, deleteAllTodos
getChatHistory, addChatMessage, clearChatHistory
getSetting, setSetting, getSettings, setSettings
exportAll
```

### CSP Update
`manifest.json` CSP now includes `'wasm-unsafe-eval'` for WASM execution.

### Remaining `chrome.storage` in manifest
The `storage` permission is retained in `manifest.json` for one-time migration from chrome.storage.local to SQLite. Can be removed after all users have migrated.
