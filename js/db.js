/**
 * db.js – SQLite Storage Layer for Dev Notebook
 * Uses sql.js (SQLite compiled to WASM) with IndexedDB persistence.
 */

const DevNotebookDB = (() => {
    const IDB_NAME = 'DevNotebookSQLite';
    const IDB_STORE = 'database';
    const IDB_KEY = 'main';
    const SCHEMA_VERSION = 2;

    let db = null;
    let _ready = null;
    let _persistTimer = null;
    const PERSIST_DEBOUNCE = 300; // ms

    // ── Initialisation ──────────────────────────────────────────────

    function init() {
        if (_ready) return _ready;
        _ready = _boot();
        return _ready;
    }

    async function _boot() {
        const wasmUrl = chrome.runtime.getURL('js/sql-wasm.wasm');
        const SQL = await initSqlJs({ locateFile: () => wasmUrl });

        // Try loading persisted DB from IndexedDB
        const saved = await _idbLoad();
        if (saved) {
            db = new SQL.Database(new Uint8Array(saved));
            _ensureSchema();
        } else {
            db = new SQL.Database();
            _createSchema();
        }

        // Persist on page unload
        window.addEventListener('beforeunload', () => _persistSync());

        return true;
    }

    function _createSchema() {
        db.run(`
            CREATE TABLE IF NOT EXISTS workspaces (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                sort_order INTEGER DEFAULT 0
            );
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                workspace_id TEXT NOT NULL,
                name TEXT NOT NULL,
                sort_order INTEGER DEFAULT 0,
                FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS items (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                type TEXT NOT NULL CHECK(type IN ('note','bookmark','credential','draw')),
                title TEXT DEFAULT '',
                created TEXT,
                body TEXT,
                url TEXT,
                description TEXT,
                username TEXT,
                password TEXT,
                notes TEXT,
                draw_url TEXT,
                sort_order INTEGER DEFAULT 0,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS todos (
                id TEXT PRIMARY KEY,
                text TEXT NOT NULL,
                completed INTEGER DEFAULT 0,
                created_at INTEGER,
                completed_at INTEGER
            );
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            );
            CREATE INDEX IF NOT EXISTS idx_projects_workspace ON projects(workspace_id);
            CREATE INDEX IF NOT EXISTS idx_items_project ON items(project_id);
            CREATE INDEX IF NOT EXISTS idx_items_type ON items(project_id, type);

            CREATE TABLE IF NOT EXISTS bookmark_folders (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                name TEXT NOT NULL,
                parent_id TEXT,
                sort_order INTEGER DEFAULT 0,
                created TEXT,
                chrome_id TEXT,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            );
            CREATE INDEX IF NOT EXISTS idx_bookmark_folders_project ON bookmark_folders(project_id);
        `);

        // Migration: add folder_id column to items if it doesn't exist
        try {
            db.run('ALTER TABLE items ADD COLUMN folder_id TEXT');
        } catch(e) {
            // Column already exists, ignore
        }

        _setSetting('schema_version', SCHEMA_VERSION);
        _schedulePersist();
    }

    function _ensureSchema() {
        // Make sure all tables exist (idempotent)
        _createSchema();
    }

    // ── IndexedDB Persistence ───────────────────────────────────────

    function _idbOpen() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(IDB_NAME, 1);
            req.onupgradeneeded = () => {
                req.result.createObjectStore(IDB_STORE);
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function _idbLoad() {
        try {
            const idb = await _idbOpen();
            return new Promise((resolve, reject) => {
                const tx = idb.transaction(IDB_STORE, 'readonly');
                const store = tx.objectStore(IDB_STORE);
                const req = store.get(IDB_KEY);
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => reject(req.error);
            });
        } catch {
            return null;
        }
    }

    async function _idbSave(data) {
        const idb = await _idbOpen();
        return new Promise((resolve, reject) => {
            const tx = idb.transaction(IDB_STORE, 'readwrite');
            const store = tx.objectStore(IDB_STORE);
            store.put(data, IDB_KEY);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    function _schedulePersist() {
        if (_persistTimer) clearTimeout(_persistTimer);
        _persistTimer = setTimeout(() => {
            _persistAsync();
        }, PERSIST_DEBOUNCE);
    }

    async function _persistAsync() {
        if (!db) return;
        try {
            const data = db.export();
            await _idbSave(data.buffer);
        } catch (e) {
            console.error('[DB] Persist error:', e);
        }
    }

    function _persistSync() {
        // Best-effort synchronous persist (beforeunload)
        if (!db) return;
        try {
            const data = db.export();
            // Use sync IDB via micro-task (won't always complete)
            _idbSave(data.buffer).catch(() => {});
        } catch (e) {
            console.error('[DB] Sync persist error:', e);
        }
    }

    // ── Settings helpers ────────────────────────────────────────────

    function _setSetting(key, value) {
        const val = typeof value === 'string' ? value : JSON.stringify(value);
        db.run('INSERT OR REPLACE INTO settings(key, value) VALUES(?, ?)', [key, val]);
    }

    function _getSetting(key, fallback = null) {
        const rows = db.exec('SELECT value FROM settings WHERE key = ?', [key]);
        if (rows.length === 0 || rows[0].values.length === 0) return fallback;
        const raw = rows[0].values[0][0];
        try { return JSON.parse(raw); } catch { return raw; }
    }

    // ── Generic SQL helpers ─────────────────────────────────────────

    function _queryAll(sql, params = []) {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }

    function _queryOne(sql, params = []) {
        const rows = _queryAll(sql, params);
        return rows.length > 0 ? rows[0] : null;
    }

    function _run(sql, params = []) {
        db.run(sql, params);
        _schedulePersist();
    }

    function _runBatch(statements) {
        db.run('BEGIN TRANSACTION');
        try {
            for (const [sql, params] of statements) {
                db.run(sql, params || []);
            }
            db.run('COMMIT');
        } catch (e) {
            db.run('ROLLBACK');
            throw e;
        }
        _schedulePersist();
    }

    // ── Workspaces ──────────────────────────────────────────────────

    function getWorkspaces() {
        return _queryAll('SELECT * FROM workspaces ORDER BY sort_order, rowid');
    }

    function getWorkspace(id) {
        return _queryOne('SELECT * FROM workspaces WHERE id = ?', [id]);
    }

    function createWorkspace(id, name) {
        const maxOrder = _queryOne('SELECT COALESCE(MAX(sort_order),0) as m FROM workspaces');
        _run('INSERT INTO workspaces(id, name, sort_order) VALUES(?, ?, ?)', [id, name, (maxOrder?.m || 0) + 1]);
    }

    function updateWorkspace(id, name) {
        _run('UPDATE workspaces SET name = ? WHERE id = ?', [name, id]);
    }

    function deleteWorkspace(id) {
        // Cascade: delete projects and their items
        const projects = getProjects(id);
        const stmts = [];
        for (const p of projects) {
            stmts.push(['DELETE FROM items WHERE project_id = ?', [p.id]]);
        }
        stmts.push(['DELETE FROM projects WHERE workspace_id = ?', [id]]);
        stmts.push(['DELETE FROM workspaces WHERE id = ?', [id]]);
        _runBatch(stmts);
    }

    // ── Projects ────────────────────────────────────────────────────

    function getProjects(workspaceId) {
        return _queryAll('SELECT * FROM projects WHERE workspace_id = ? ORDER BY sort_order, rowid', [workspaceId]);
    }

    function getProject(id) {
        return _queryOne('SELECT * FROM projects WHERE id = ?', [id]);
    }

    function createProject(id, workspaceId, name) {
        const maxOrder = _queryOne('SELECT COALESCE(MAX(sort_order),0) as m FROM projects WHERE workspace_id = ?', [workspaceId]);
        _run('INSERT INTO projects(id, workspace_id, name, sort_order) VALUES(?, ?, ?, ?)',
            [id, workspaceId, name, (maxOrder?.m || 0) + 1]);
    }

    function updateProject(id, name) {
        _run('UPDATE projects SET name = ? WHERE id = ?', [name, id]);
    }

    function deleteProject(id) {
        _runBatch([
            ['DELETE FROM items WHERE project_id = ?', [id]],
            ['DELETE FROM projects WHERE id = ?', [id]]
        ]);
    }

    // ── Items ───────────────────────────────────────────────────────

    function getItems(projectId, type = null) {
        if (type) {
            return _queryAll(
                'SELECT id, project_id, type, title, created, url, description, username, draw_url, sort_order FROM items WHERE project_id = ? AND type = ? ORDER BY sort_order DESC, rowid DESC',
                [projectId, type]
            );
        }
        return _queryAll(
            'SELECT id, project_id, type, title, created, url, description, username, draw_url, sort_order FROM items WHERE project_id = ? ORDER BY sort_order DESC, rowid DESC',
            [projectId]
        );
    }

    /** Get item with full body (for editing) */
    function getItem(id) {
        return _queryOne('SELECT * FROM items WHERE id = ?', [id]);
    }

    /** Get item metadata only (for list display) */
    function getItemMeta(id) {
        return _queryOne('SELECT id, project_id, type, title, created, url, description, username, draw_url FROM items WHERE id = ?', [id]);
    }

    /** Get a lightweight preview snippet for list display */
    function getItemPreview(id) {
        const row = _queryOne('SELECT id, type, title, body, url, username, draw_url FROM items WHERE id = ?', [id]);
        if (!row) return null;
        // Generate preview text
        let preview = '';
        if (row.type === 'note') {
            if (row.body) {
                try {
                    const delta = JSON.parse(row.body);
                    if (delta && delta.ops) {
                        preview = delta.ops.map(op => typeof op.insert === 'string' ? op.insert : '').join('').substring(0, 60);
                    }
                } catch {
                    preview = String(row.body).substring(0, 60).replace(/<[^>]*>/g, '');
                }
            }
        } else if (row.type === 'bookmark') {
            preview = row.url || '';
        } else if (row.type === 'credential') {
            preview = row.username || '********';
        } else if (row.type === 'draw') {
            preview = row.draw_url || 'Tap to open';
        }
        return { ...row, preview };
    }

    function createItem(item) {
        const body = item.body ? (typeof item.body === 'string' ? item.body : JSON.stringify(item.body)) : null;
        _run(
            `INSERT INTO items(id, project_id, type, title, created, body, url, description, username, password, notes, draw_url, sort_order, folder_id)
             VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                item.id,
                item.project_id || item.projectId,
                item.type,
                item.title || '',
                item.created || new Date().toISOString(),
                body,
                item.url || null,
                item.description || null,
                item.username || null,
                item.password || null,
                item.notes || null,
                item.draw_url || item.drawUrl || null,
                item.sort_order || 0,
                item.folder_id || null
            ]
        );
    }

    function updateItem(id, changes) {
        const allowed = ['title', 'body', 'url', 'description', 'username', 'password', 'notes', 'draw_url', 'sort_order', 'folder_id'];
        const sets = [];
        const params = [];
        for (const [k, v] of Object.entries(changes)) {
            if (allowed.includes(k)) {
                sets.push(`${k} = ?`);
                if (k === 'body' && typeof v === 'object') {
                    params.push(JSON.stringify(v));
                } else {
                    params.push(v);
                }
            }
        }
        if (sets.length === 0) return;
        params.push(id);
        _run(`UPDATE items SET ${sets.join(', ')} WHERE id = ?`, params);
    }

    function deleteItem(id) {
        _run('DELETE FROM items WHERE id = ?', [id]);
    }

    function deleteItems(ids) {
        if (ids.length === 0) return;
        const placeholders = ids.map(() => '?').join(',');
        _run(`DELETE FROM items WHERE id IN (${placeholders})`, ids);
    }

    function searchItems(projectId, type, term) {
        const like = `%${term}%`;
        if (type) {
            return _queryAll(
                `SELECT id, project_id, type, title, created, url, description, username, draw_url
                 FROM items WHERE project_id = ? AND type = ? AND (title LIKE ? OR body LIKE ? OR url LIKE ? OR username LIKE ? OR description LIKE ?)
                 ORDER BY sort_order DESC, rowid DESC`,
                [projectId, type, like, like, like, like, like]
            );
        }
        return _queryAll(
            `SELECT id, project_id, type, title, created, url, description, username, draw_url
             FROM items WHERE project_id = ? AND (title LIKE ? OR body LIKE ? OR url LIKE ? OR username LIKE ? OR description LIKE ?)
             ORDER BY sort_order DESC, rowid DESC`,
            [projectId, like, like, like, like, like]
        );
    }

    function getItemCountByType(projectId, type) {
        const row = _queryOne('SELECT COUNT(*) as cnt FROM items WHERE project_id = ? AND type = ?', [projectId, type]);
        return row ? row.cnt : 0;
    }

    // ── Todos ───────────────────────────────────────────────────────

    function getTodos() {
        return _queryAll('SELECT * FROM todos ORDER BY completed ASC, created_at DESC');
    }

    function createTodo(todo) {
        _run('INSERT INTO todos(id, text, completed, created_at, completed_at) VALUES(?, ?, ?, ?, ?)',
            [todo.id, todo.text, todo.completed ? 1 : 0, todo.createdAt || Date.now(), todo.completedAt || null]);
    }

    function updateTodo(id, changes) {
        const sets = [];
        const params = [];
        if ('text' in changes) { sets.push('text = ?'); params.push(changes.text); }
        if ('completed' in changes) { sets.push('completed = ?'); params.push(changes.completed ? 1 : 0); }
        if ('completed_at' in changes || 'completedAt' in changes) {
            sets.push('completed_at = ?');
            params.push(changes.completed_at || changes.completedAt || null);
        }
        if (sets.length === 0) return;
        params.push(id);
        _run(`UPDATE todos SET ${sets.join(', ')} WHERE id = ?`, params);
    }

    function deleteTodo(id) {
        _run('DELETE FROM todos WHERE id = ?', [id]);
    }

    function deleteAllTodos() {
        _run('DELETE FROM todos');
    }

    // ── Chat History ────────────────────────────────────────────────

    function getChatHistory() {
        return _queryAll('SELECT * FROM chat_messages ORDER BY id ASC');
    }

    function addChatMessage(role, content) {
        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
        _run('INSERT INTO chat_messages(role, content) VALUES(?, ?)', [role, contentStr]);
    }

    function clearChatHistory() {
        _run('DELETE FROM chat_messages');
    }

    // ── Settings ────────────────────────────────────────────────────

    function getSetting(key, fallback = null) {
        return _getSetting(key, fallback);
    }

    function setSetting(key, value) {
        _setSetting(key, value);
        _schedulePersist();
    }

    function getSettings(keys) {
        const result = {};
        for (const k of keys) {
            result[k] = _getSetting(k);
        }
        return result;
    }

    function setSettings(obj) {
        const stmts = [];
        for (const [k, v] of Object.entries(obj)) {
            const val = typeof v === 'string' ? v : JSON.stringify(v);
            stmts.push(['INSERT OR REPLACE INTO settings(key, value) VALUES(?, ?)', [k, val]]);
        }
        _runBatch(stmts);
    }

    // ── Migration from chrome.storage.local ─────────────────────────

    async function migrateFromChromeStorage() {
        const migrated = _getSetting('migrated_from_chrome_storage');
        if (migrated) return false;

        console.log('[DB] Checking for chrome.storage.local data to migrate...');

        const data = await new Promise(resolve => {
            chrome.storage.local.get(null, resolve);
        });

        if (!data || Object.keys(data).length === 0) {
            _setSetting('migrated_from_chrome_storage', true);
            _schedulePersist();
            return false;
        }

        console.log('[DB] Migrating from chrome.storage.local...');
        db.run('BEGIN TRANSACTION');

        try {
            // Migrate workspaces
            if (data.workspaces && Array.isArray(data.workspaces)) {
                for (let wIdx = 0; wIdx < data.workspaces.length; wIdx++) {
                    const ws = data.workspaces[wIdx];
                    db.run('INSERT OR IGNORE INTO workspaces(id, name, sort_order) VALUES(?, ?, ?)',
                        [ws.id, ws.name, wIdx]);

                    if (ws.projects && Array.isArray(ws.projects)) {
                        for (let pIdx = 0; pIdx < ws.projects.length; pIdx++) {
                            const proj = ws.projects[pIdx];
                            db.run('INSERT OR IGNORE INTO projects(id, workspace_id, name, sort_order) VALUES(?, ?, ?, ?)',
                                [proj.id, ws.id, proj.name, pIdx]);

                            if (proj.items && Array.isArray(proj.items)) {
                                for (let iIdx = 0; iIdx < proj.items.length; iIdx++) {
                                    const item = proj.items[iIdx];
                                    const bodyStr = item.body
                                        ? (typeof item.body === 'object' ? JSON.stringify(item.body) : item.body)
                                        : null;
                                    db.run(
                                        `INSERT OR IGNORE INTO items(id, project_id, type, title, created, body, url, description, username, password, notes, draw_url, sort_order)
                                         VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                        [
                                            item.id,
                                            proj.id,
                                            item.type || 'note',
                                            item.title || '',
                                            item.created || new Date().toISOString(),
                                            bodyStr,
                                            item.url || null,
                                            item.description || null,
                                            item.username || null,
                                            item.password || null,
                                            item.notes || null,
                                            item.drawUrl || null,
                                            proj.items.length - iIdx // Reverse order so first items have highest sort
                                        ]
                                    );
                                }
                            }
                        }
                    }
                }
            }

            // Migrate todos
            if (data.todos && Array.isArray(data.todos)) {
                for (const todo of data.todos) {
                    db.run('INSERT OR IGNORE INTO todos(id, text, completed, created_at, completed_at) VALUES(?, ?, ?, ?, ?)',
                        [todo.id, todo.text, todo.completed ? 1 : 0, todo.createdAt || Date.now(), todo.completedAt || null]);
                }
            }

            // Migrate chat history
            if (data.chatHistory && Array.isArray(data.chatHistory)) {
                for (const msg of data.chatHistory) {
                    const contentStr = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
                    db.run('INSERT INTO chat_messages(role, content) VALUES(?, ?)',
                        [msg.role, contentStr]);
                }
            }

            // Migrate settings
            const settingsKeys = ['theme', 'activeWorkspaceId', 'activeProjectId', 'activeItemType', 'aiDockVisible'];
            for (const key of settingsKeys) {
                if (data[key] !== undefined) {
                    const val = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
                    db.run('INSERT OR REPLACE INTO settings(key, value) VALUES(?, ?)', [key, val]);
                }
            }

            // Migrate AI settings
            if (data.aiSettings) {
                db.run('INSERT OR REPLACE INTO settings(key, value) VALUES(?, ?)',
                    ['aiSettings', JSON.stringify(data.aiSettings)]);
            }

            // Migrate AI snippets
            if (data.aiSnippets) {
                db.run('INSERT OR REPLACE INTO settings(key, value) VALUES(?, ?)',
                    ['aiSnippets', JSON.stringify(data.aiSnippets)]);
            }

            _setSetting('migrated_from_chrome_storage', true);
            db.run('COMMIT');
            _schedulePersist();

            console.log('[DB] Migration complete!');
            return true;
        } catch (e) {
            db.run('ROLLBACK');
            console.error('[DB] Migration failed:', e);
            throw e;
        }
    }

    // ── Export / Import helpers ──────────────────────────────────────

    function exportAll() {
        const workspacesList = getWorkspaces();
        const exportData = {
            workspaces: workspacesList.map(ws => ({
                ...ws,
                projects: getProjects(ws.id).map(proj => ({
                    ...proj,
                    items: _queryAll('SELECT * FROM items WHERE project_id = ? ORDER BY sort_order DESC, rowid DESC', [proj.id]).map(item => {
                        // Parse body back to object if possible
                        if (item.body) {
                            try { item.body = JSON.parse(item.body); } catch {}
                        }
                        return item;
                    })
                }))
            })),
            todos: getTodos().map(t => ({
                id: t.id,
                text: t.text,
                completed: !!t.completed,
                createdAt: t.created_at,
                completedAt: t.completed_at
            })),
            exportDate: new Date().toISOString(),
            version: '2.0'
        };
        return exportData;
    }

    function forcePersist() {
        return _persistAsync();
    }

    // ── Bookmark Folders ────────────────────────────────────────────

    function getBookmarkFolders(projectId, parentId = null) {
        if (parentId) {
            return _queryAll(
                'SELECT * FROM bookmark_folders WHERE project_id = ? AND parent_id = ? ORDER BY sort_order ASC, rowid ASC',
                [projectId, parentId]
            );
        }
        return _queryAll(
            'SELECT * FROM bookmark_folders WHERE project_id = ? AND (parent_id IS NULL OR parent_id = \'\') ORDER BY sort_order ASC, rowid ASC',
            [projectId]
        );
    }

    function getAllBookmarkFolders(projectId) {
        return _queryAll(
            'SELECT * FROM bookmark_folders WHERE project_id = ? ORDER BY sort_order ASC, rowid ASC',
            [projectId]
        );
    }

    function getBookmarkFolder(id) {
        return _queryOne('SELECT * FROM bookmark_folders WHERE id = ?', [id]);
    }

    function createBookmarkFolder(folder) {
        _run(
            `INSERT INTO bookmark_folders(id, project_id, name, parent_id, sort_order, created, chrome_id)
             VALUES(?, ?, ?, ?, ?, ?, ?)`,
            [
                folder.id,
                folder.project_id,
                folder.name,
                folder.parent_id || null,
                folder.sort_order || 0,
                folder.created || new Date().toISOString(),
                folder.chrome_id || null
            ]
        );
    }

    function updateBookmarkFolder(id, changes) {
        const allowed = ['name', 'parent_id', 'sort_order', 'chrome_id'];
        const sets = [];
        const params = [];
        for (const [k, v] of Object.entries(changes)) {
            if (allowed.includes(k)) {
                sets.push(`${k} = ?`);
                params.push(v);
            }
        }
        if (sets.length === 0) return;
        params.push(id);
        _run(`UPDATE bookmark_folders SET ${sets.join(', ')} WHERE id = ?`, params);
    }

    function deleteBookmarkFolder(id) {
        // Move items in this folder to unfiled
        _run('UPDATE items SET folder_id = NULL WHERE folder_id = ?', [id]);
        // Move child folders to parent
        const folder = getBookmarkFolder(id);
        const parentId = folder ? folder.parent_id : null;
        _run('UPDATE bookmark_folders SET parent_id = ? WHERE parent_id = ?', [parentId, id]);
        _run('DELETE FROM bookmark_folders WHERE id = ?', [id]);
    }

    function getBookmarksByFolder(projectId, folderId) {
        if (folderId) {
            return _queryAll(
                'SELECT id, project_id, type, title, created, url, description, folder_id, sort_order FROM items WHERE project_id = ? AND type = \'bookmark\' AND folder_id = ? ORDER BY sort_order DESC, rowid DESC',
                [projectId, folderId]
            );
        }
        // Unfiled bookmarks (no folder)
        return _queryAll(
            'SELECT id, project_id, type, title, created, url, description, folder_id, sort_order FROM items WHERE project_id = ? AND type = \'bookmark\' AND (folder_id IS NULL OR folder_id = \'\') ORDER BY sort_order DESC, rowid DESC',
            [projectId]
        );
    }

    // ── Public API ──────────────────────────────────────────────────

    return {
        init,
        migrateFromChromeStorage,
        forcePersist,

        // Workspaces
        getWorkspaces,
        getWorkspace,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,

        // Projects
        getProjects,
        getProject,
        createProject,
        updateProject,
        deleteProject,

        // Items
        getItems,
        getItem,
        getItemMeta,
        getItemPreview,
        createItem,
        updateItem,
        deleteItem,
        deleteItems,
        searchItems,
        getItemCountByType,

        // Todos
        getTodos,
        createTodo,
        updateTodo,
        deleteTodo,
        deleteAllTodos,

        // Chat
        getChatHistory,
        addChatMessage,
        clearChatHistory,

        // Settings
        getSetting,
        setSetting,
        getSettings,
        setSettings,

        // Bookmark Folders
        getBookmarkFolders,
        getAllBookmarkFolders,
        getBookmarkFolder,
        createBookmarkFolder,
        updateBookmarkFolder,
        deleteBookmarkFolder,
        getBookmarksByFolder,

        // Export
        exportAll
    };
})();
