// --- DOM Elements ---
const appContainer = document.querySelector('.app-container');
const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');

// Note Elements
const notesListEl = document.getElementById('notes-list');
const noteTitleEl = document.getElementById('note-title');
const editorContent = document.getElementById('editor-content');
const editorToolbar = document.getElementById('editor-toolbar');
const searchInput = document.getElementById('search-input');
const addBtn = document.getElementById('add-note-btn');
const deleteBtn = document.getElementById('delete-note-btn');
const statusEl = document.getElementById('save-status');
const shareBtn = document.getElementById('share-btn');
const exportSingleBtn = document.getElementById('export-single-btn');
const exportAllBtn = document.getElementById('export-all-btn');
const importBtn = document.getElementById('import-btn');
const importInput = document.getElementById('import-input');
const fabAddBtn = document.getElementById('fab-add-note');

// Quill Editor Instance
let quill = null;

// Theme & Todo Elements
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const todoToggleBtn = document.getElementById('todo-toggle-btn');
const closeTodoBtn = document.getElementById('close-todo-btn');
const clearAllTodosBtn = document.getElementById('clear-all-todos-btn');
const todoListEl = document.getElementById('todo-list');
const newTodoInput = document.getElementById('new-todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');

// Settings Elements
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const deleteAllBtn = document.getElementById('delete-all-btn');

// AI Elements
const aiDock = document.getElementById('ai-dock');
const aiModelSelect = document.getElementById('ai-model-select');
const manageKeysLink = document.getElementById('manage-keys-link');
const aiPromptInput = document.getElementById('ai-prompt');
const aiGenerateBtn = document.getElementById('ai-generate-btn');
const aiLoading = document.getElementById('ai-loading');
const aiError = document.getElementById('ai-error');
const aiPreviewSection = document.getElementById('ai-preview-section');
const aiPreviewTitle = document.getElementById('ai-preview-title');
const aiPreviewContent = document.getElementById('ai-preview-content');
const aiApplyBtn = document.getElementById('ai-apply-btn');
const aiCancelBtn = document.getElementById('ai-cancel-btn');
const aiTodosPreviewSection = document.getElementById('ai-todos-preview-section');
const aiTodosPreviewList = document.getElementById('ai-todos-preview-list');
const aiTodosApplyBtn = document.getElementById('ai-todos-apply-btn');
const aiTodosCancelBtn = document.getElementById('ai-todos-cancel-btn');
const aiSnippetsMenu = document.getElementById('ai-snippets-menu');

// Default Snippets
const DEFAULT_AI_SNIPPETS = [
    { trigger: '/reformat', text: 'Reformat this code with proper indentation and style', description: 'Reformat code' },
    { trigger: '/correct', text: 'Is this correct?', description: 'Check correctness' },
    { trigger: '/explain', text: 'Explain this in detail', description: 'Get detailed explanation' },
    { trigger: '/simplify', text: 'Simplify this explanation', description: 'Make it simpler' },
    { trigger: '/debug', text: 'Help me debug this code', description: 'Debug assistance' },
    { trigger: '/optimize', text: 'Optimize this code for better performance', description: 'Code optimization' },
    { trigger: '/document', text: 'Add documentation to this code', description: 'Add documentation' },
    { trigger: '/test', text: 'Write unit tests for this code', description: 'Generate tests' },
    { trigger: '/refactor', text: 'Refactor this code following best practices', description: 'Refactor code' },
    { trigger: '/convert', text: 'Convert this code to', description: 'Convert language/format' },
    { trigger: '/fix', text: 'Fix the errors in this code', description: 'Fix errors' },
    { trigger: '/review', text: 'Review this code and suggest improvements', description: 'Code review' },
    { trigger: '/summary', text: 'Summarize this in bullet points', description: 'Create summary' },
    { trigger: '/todo', text: 'Create a todo list for this task', description: 'Generate todos' },
];

// Active Snippets (loaded from storage or defaults)
let AI_SNIPPETS = [...DEFAULT_AI_SNIPPETS];

// Settings Elements for AI
const enableOpenAI = document.getElementById('enable-openai');
const enableGemini = document.getElementById('enable-gemini');
const enableAnthropic = document.getElementById('enable-anthropic');
const enableXAI = document.getElementById('enable-xai');
const enableDeepSeek = document.getElementById('enable-deepseek');
const enableMistral = document.getElementById('enable-mistral');
const enableCohere = document.getElementById('enable-cohere');
const enableHuggingFace = document.getElementById('enable-huggingface');
const enableNvidia = document.getElementById('enable-nvidia');
const enableAlibaba = document.getElementById('enable-alibaba');

const openaiKeyContainer = document.getElementById('openai-key-container');
const geminiKeyContainer = document.getElementById('gemini-key-container');
const anthropicKeyContainer = document.getElementById('anthropic-key-container');
const xaiKeyContainer = document.getElementById('xai-key-container');
const deepseekKeyContainer = document.getElementById('deepseek-key-container');
const mistralKeyContainer = document.getElementById('mistral-key-container');
const cohereKeyContainer = document.getElementById('cohere-key-container');
const huggingfaceKeyContainer = document.getElementById('huggingface-key-container');
const nvidiaKeyContainer = document.getElementById('nvidia-key-container');
const alibabaKeyContainer = document.getElementById('alibaba-key-container');

const settingsOpenAIKey = document.getElementById('settings-openai-key');
const settingsGeminiKey = document.getElementById('settings-gemini-key');
const settingsAnthropicKey = document.getElementById('settings-anthropic-key');
const settingsXAIKey = document.getElementById('settings-xai-key');
const settingsDeepSeekKey = document.getElementById('settings-deepseek-key');
const settingsMistralKey = document.getElementById('settings-mistral-key');
const settingsCohereKey = document.getElementById('settings-cohere-key');
const settingsHuggingFaceKey = document.getElementById('settings-huggingface-key');
const settingsNvidiaKey = document.getElementById('settings-nvidia-key');
const settingsAlibabaKey = document.getElementById('settings-alibaba-key');
const systemInstructionEl = document.getElementById('system-instruction');
const saveSettingsBtn = document.getElementById('save-settings-btn');

// Snippets Settings Elements
const snippetsList = document.getElementById('snippets-list');
const addSnippetBtn = document.getElementById('add-snippet-btn');
const saveSnippetsBtn = document.getElementById('save-snippets-btn');
const resetSnippetsBtn = document.getElementById('reset-snippets-btn');

// AI Models Configuration
const ALL_MODELS = {
    openai: {
        name: 'OpenAI',
        models: [
            { id: 'gpt-5.1', name: 'GPT-5.1' },
            { id: 'gpt-5', name: 'GPT-5' },
            { id: 'gpt-4o', name: 'GPT-4o' },
            { id: 'gpt-o4-mini', name: 'GPT-o4-mini' },
            { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
            { id: 'gpt-4', name: 'GPT-4' },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
            { id: 'text-embedding-ada-002', name: 'Text Embedding Ada 002' }
        ]
    },
    gemini: {
        name: 'Google Gemini',
        models: [
            { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro' },
            { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
            { id: 'gemini-ultra', name: 'Gemini Ultra' },
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
            { id: 'gemma-2', name: 'Gemma 2' }
        ]
    },
    anthropic: {
        name: 'Anthropic',
        models: [
            { id: 'claude-opus-4.5', name: 'Claude Opus 4.5' },
            { id: 'claude-4.1', name: 'Claude 4.1' },
            { id: 'claude-4', name: 'Claude 4' },
            { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet' },
            { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet' },
            { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
            { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
            { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' }
        ]
    },
    xai: {
        name: 'xAI (Grok)',
        models: [
            { id: 'grok-5', name: 'Grok 5' },
            { id: 'grok-4', name: 'Grok-4' },
            { id: 'grok-beta', name: 'Grok Beta' }
        ]
    },
    deepseek: {
        name: 'DeepSeek',
        models: [
            { id: 'deepseek-v3.2', name: 'DeepSeek-V3.2' },
            { id: 'deepseek-v3.2-speciale', name: 'DeepSeek-V3.2-Speciale' },
            { id: 'deepseek-v3.1', name: 'DeepSeek V3.1' },
            { id: 'deepseek-r1', name: 'DeepSeek-R1' },
            { id: 'deepseek-chat', name: 'DeepSeek Chat' },
            { id: 'deepseek-coder', name: 'DeepSeek Coder' }
        ]
    },
    mistral: {
        name: 'Mistral AI',
        models: [
            { id: 'mistral-medium-3', name: 'Mistral Medium 3' },
            { id: 'pixtral-large', name: 'Pixtral Large' },
            { id: 'open-mixtral-8x22b', name: 'Mistral-8x22b' },
            { id: 'codestral-latest', name: 'Codestral' },
            { id: 'mistral-large-latest', name: 'Mistral Large' },
            { id: 'mistral-medium-latest', name: 'Mistral Medium' },
            { id: 'mistral-small-latest', name: 'Mistral Small' }
        ]
    },
    cohere: {
        name: 'Cohere',
        models: [
            { id: 'command-r-plus', name: 'Command R+' },
            { id: 'command-r', name: 'Command R' },
            { id: 'command', name: 'Command' }
        ]
    },
    huggingface: {
        name: 'Hugging Face (Open Models)',
        models: [
            { id: 'meta-llama/Llama-3-70b-chat-hf', name: 'Llama 3 70B' },
            { id: 'meta-llama/Llama-3-8b-chat-hf', name: 'Llama 3 8B' },
            { id: 'microsoft/Phi-3-mini-4k-instruct', name: 'Phi-3 Mini' },
            { id: 'bigscience/bloom', name: 'Bloom' },
            { id: 'mistralai/Mistral-7B-Instruct-v0.2', name: 'Mistral 7B' },
            { id: 'google/gemma-7b-it', name: 'Gemma 7B' }
        ]
    },
    nvidia: {
        name: 'NVIDIA',
        models: [
            { id: 'nvidia/alpamayo-r1', name: 'Alpamayo-R1' },
            { id: 'nvidia/nemotron-4-340b-instruct', name: 'Nemotron-4 340B' }
        ]
    },
    alibaba: {
        name: 'Alibaba Cloud (Qwen)',
        models: [
            { id: 'qwen-max', name: 'Qwen-Max (Qwen 3)' },
            { id: 'qwen-plus', name: 'Qwen-Plus' },
            { id: 'qwen-turbo', name: 'Qwen-Turbo' },
            { id: 'qwen1.5-110b-chat', name: 'Qwen1.5 110B' }
        ]
    }
};

// AI State
let aiSettings = {
    providers: {
        openai: true,
        gemini: true,
        anthropic: true,
        xai: true,
        deepseek: true,
        mistral: true,
        cohere: false,
        huggingface: false,
        nvidia: false,
        alibaba: false
    },
    openaiKey: '',
    geminiKey: '',
    anthropicKey: '',
    xaiKey: '',
    deepseekKey: '',
    mistralKey: '',
    cohereKey: '',
    huggingfaceKey: '',
    nvidiaKey: '',
    alibabaKey: '',
    lastModel: 'gpt-4o',
    systemInstruction: "You are a helpful assistant that generates notes. Please provide the response in JSON format with 'title' and 'content' fields. The content should be formatted in Markdown."
};

// --- State ---
let notes = [];
let activeNoteId = null;
let todos = [];
let currentTheme = 'system'; // 'light', 'dark', 'system'

// --- Initialization ---
// Wait for both DOM, Quill, and highlight.js to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking for Quill and highlight.js...');
    
    const checkLibraries = setInterval(() => {
        if (typeof Quill !== 'undefined' && typeof hljs !== 'undefined') {
            clearInterval(checkLibraries);
            console.log('All libraries loaded!');
            initializeQuill();
            init();
        }
    }, 100);
});

function initializeQuill() {
    // Initialize Quill with comprehensive toolbar
    quill = new Quill('#editor-content', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                ['blockquote', 'code-block'],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
            ],
            syntax: true
        },
        placeholder: 'Start typing...',
    });
    
    // Listen for text changes with debouncing
    let saveTimeout;
    quill.on('text-change', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            if (activeNoteId) {
                updateActiveNote();
            }
        }, 500);
    });
    
    // Enable image paste
    quill.root.addEventListener('paste', (e) => {
        const clipboardData = e.clipboardData;
        if (clipboardData && clipboardData.items) {
            for (let i = 0; i < clipboardData.items.length; i++) {
                if (clipboardData.items[i].type.indexOf('image') !== -1) {
                    e.preventDefault();
                    const blob = clipboardData.items[i].getAsFile();
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const range = quill.getSelection(true);
                        if (range) {
                            quill.insertEmbed(range.index, 'image', event.target.result);
                        }
                    };
                    reader.readAsDataURL(blob);
                    break;
                }
            }
        }
    });
}

async function init() {
    const data = await chrome.storage.local.get(['notes', 'todos', 'theme']);
    notes = data.notes || [];
    todos = data.todos || [];
    currentTheme = data.theme || 'system';
    
    // Initialize Notes - Always create a new note when opening a new tab
    notes.sort((a, b) => b.updatedAt - a.updatedAt);
    renderNotesList();
    createNewNote();

    // Initialize Todos
    renderTodoList();

    // Initialize Theme
    applyTheme(currentTheme);
}

// --- Cross-Tab Synchronization ---
// Listen for changes in chrome.storage from other tabs
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
        let shouldUpdateNotes = false;
        let shouldUpdateTodos = false;
        
        if (changes.notes) {
            notes = changes.notes.newValue || [];
            shouldUpdateNotes = true;
        }
        
        if (changes.todos) {
            todos = changes.todos.newValue || [];
            shouldUpdateTodos = true;
        }
        
        if (changes.theme) {
            currentTheme = changes.theme.newValue || 'system';
            applyTheme(currentTheme);
        }
        
        // Update UI if data changed
        if (shouldUpdateNotes) {
            renderNotesList();
            
            // If the active note still exists, refresh it
            if (activeNoteId && notes.find(n => n.id === activeNoteId)) {
                const note = notes.find(n => n.id === activeNoteId);
                if (note && quill) {
                    // Only update if not currently typing (to avoid disrupting user)
                    if (!quill.hasFocus()) {
                        noteTitleEl.value = note.title;
                        try {
                            if (note.body && typeof note.body === 'object' && note.body.ops) {
                                quill.setContents(note.body);
                            } else if (note.body && note.body.startsWith('{')) {
                                const delta = JSON.parse(note.body);
                                quill.setContents(delta);
                            } else {
                                quill.setText(note.body || '');
                            }
                        } catch (e) {
                            quill.setText(note.body || '');
                        }
                    }
                }
            } else if (activeNoteId && !notes.find(n => n.id === activeNoteId)) {
                // Active note was deleted in another tab
                if (notes.length > 0) {
                    setActiveNote(notes[0].id);
                } else {
                    createNewNote();
                }
            }
        }
        
        if (shouldUpdateTodos) {
            renderTodoList();
        }
    }
});

// --- Notification System ---
const notificationEl = document.getElementById('notification');
let notificationTimeout;

function showNotification(message, type = 'info', duration = 3000) {
    // Clear any existing timeout
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    
    notificationEl.textContent = message;
    notificationEl.className = 'notification show ' + type;
    
    notificationTimeout = setTimeout(() => {
        notificationEl.className = 'notification';
    }, duration);
}

// --- Note Management ---
function isNoteEmpty(note) {
    // If a title is not null (has content, even whitespace), consider it a note
    if (note.title && note.title.length > 0) {
        return false;
    }

    const title = (note.title || '').trim();
    let bodyText = '';
    if (note.body && typeof note.body === 'object' && note.body.ops) {
        bodyText = note.body.ops.map(op => op.insert || '').join('').trim();
    } else {
        bodyText = (note.body || '').trim();
    }
    return title.length === 0 && bodyText.length === 0;
}

function createNewNote() {
    // Ensure current note is up to date with UI before checking
    if (activeNoteId) {
        const noteIndex = notes.findIndex(n => n.id === activeNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex].title = noteTitleEl.value;
        }
    }

    // If current active note is empty, reuse it instead of creating a new one
    if (activeNoteId) {
        const currentNote = notes.find(n => n.id === activeNoteId);
        if (currentNote && isNoteEmpty(currentNote)) {
            noteTitleEl.focus();
            return;
        }
    }

    const newNote = {
        id: Date.now().toString(),
        title: '',
        body: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    
    notes.unshift(newNote);
    activeNoteId = newNote.id;
    
    saveNotes();
    renderNotesList();
    
    // Reset editor
    noteTitleEl.value = '';
    if (quill) quill.setText('');
    
    // Focus title
    noteTitleEl.focus();
}

function updateActiveNote() {
    if (!activeNoteId) return;
    
    const noteIndex = notes.findIndex(n => n.id === activeNoteId);
    if (noteIndex === -1) return;
    
    const updatedNote = {
        ...notes[noteIndex],
        title: noteTitleEl.value,
        body: quill.getContents(), // Save as Delta object
        updatedAt: Date.now()
    };
    
    // Update in place (do not move to top)
    notes[noteIndex] = updatedNote;
    
    saveNotes();
    renderNotesList();
    
    statusEl.textContent = 'Saved';
    statusEl.style.opacity = '1';
    setTimeout(() => {
        statusEl.style.opacity = '0.5';
    }, 1000);
}

function deleteActiveNote() {
    if (!activeNoteId) return;
    
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(n => n.id !== activeNoteId);
        saveNotes();
        
        if (notes.length > 0) {
            setActiveNote(notes[0].id);
        } else {
            createNewNote();
        }
    }
}

function setActiveNote(id) {
    // If switching away from an empty note, remove it
    if (activeNoteId && activeNoteId !== id) {
        const prevNoteIndex = notes.findIndex(n => n.id === activeNoteId);
        if (prevNoteIndex !== -1) {
            const prevNote = notes[prevNoteIndex];
            if (isNoteEmpty(prevNote)) {
                notes.splice(prevNoteIndex, 1);
                saveNotes();
            }
        }
    }

    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    activeNoteId = id;
    noteTitleEl.value = note.title;
    
    // Handle different body formats (legacy text vs Delta)
    try {
        if (note.body && typeof note.body === 'object' && note.body.ops) {
            quill.setContents(note.body);
        } else if (note.body && note.body.startsWith('{')) {
            // Try parsing JSON string
            const delta = JSON.parse(note.body);
            quill.setContents(delta);
        } else {
            quill.setText(note.body || '');
        }
    } catch (e) {
        console.error('Error setting content:', e);
        quill.setText(note.body || '');
    }
    
    renderNotesList();
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        appContainer.classList.remove('sidebar-open');
    }
}

function saveNotes() {
    // Filter out empty notes before saving to storage
    const validNotes = notes.filter(n => !isNoteEmpty(n));
    chrome.storage.local.set({ notes: validNotes });
}

function renderNotesList() {
    notesListEl.innerHTML = '';
    
    // Filter notes based on search
    const searchTerm = searchInput.value.toLowerCase();
    const filteredNotes = notes.filter(note => {
        const title = (note.title || '').toLowerCase();
        // For body search, we need to extract text from Delta if it's an object
        let bodyText = '';
        if (note.body && typeof note.body === 'object' && note.body.ops) {
            bodyText = note.body.ops.map(op => op.insert || '').join('').toLowerCase();
        } else {
            bodyText = (note.body || '').toLowerCase();
        }
        return title.includes(searchTerm) || bodyText.includes(searchTerm);
    });
    
    filteredNotes.forEach(note => {
        const li = document.createElement('li');
        li.className = 'note-item';
        if (note.id === activeNoteId) {
            li.classList.add('active');
        }
        
        const title = note.title || 'Untitled Note';
        const date = new Date(note.updatedAt).toLocaleDateString();
        
        // Preview text
        let preview = 'No content';
        if (note.body) {
            if (typeof note.body === 'object' && note.body.ops) {
                preview = note.body.ops.map(op => op.insert || '').join('').substring(0, 50);
            } else if (typeof note.body === 'string') {
                preview = note.body.substring(0, 50);
            }
        }
        if (preview.length >= 50) preview += '...';
        
        li.innerHTML = `
            <div class="note-title">${escapeHtml(title)}</div>
            <div class="note-preview">${escapeHtml(preview)}</div>
            <div class="note-date">${date}</div>
        `;
        
        li.addEventListener('click', () => setActiveNote(note.id));
        notesListEl.appendChild(li);
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// --- Todo Management ---
function createTodo(text) {
    if (!text) return;
    
    const newTodo = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        text: text,
        completed: false,
        createdAt: Date.now()
    };
    
    todos.unshift(newTodo);
    saveTodos();
    renderTodoList();
}

function addTodo() {
    const text = newTodoInput.value.trim();
    if (!text) return;
    createTodo(text);
    newTodoInput.value = '';
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodoList();
    }
}

function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this todo?')) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        renderTodoList();
        showNotification('Todo deleted', 'success');
    }
}

function clearAllTodos() {
    if (todos.length === 0) return;
    
    if (confirm('Are you sure you want to clear all todos?')) {
        todos = [];
        saveTodos();
        renderTodoList();
        showNotification('All todos cleared', 'success');
    }
}

function saveTodos() {
    chrome.storage.local.set({ todos: todos });
}

function renderTodoList() {
    todoListEl.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''}>
            <span>${escapeHtml(todo.text)}</span>
            <button class="delete-todo-btn">
                <span class="material-icons" style="font-size: 16px;">close</span>
            </button>
        `;
        
        const checkbox = li.querySelector('input');
        checkbox.addEventListener('change', () => toggleTodo(todo.id));
        
        const deleteBtn = li.querySelector('.delete-todo-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTodo(todo.id);
        });
        
        todoListEl.appendChild(li);
    });
}

// --- Theme Management ---
function toggleTheme() {
    if (currentTheme === 'dark') {
        currentTheme = 'light';
    } else {
        currentTheme = 'dark';
    }
    applyTheme(currentTheme);
    chrome.storage.local.set({ theme: currentTheme });
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        themeToggleBtn.querySelector('span').textContent = 'dark_mode';
    } else {
        document.body.classList.remove('light-mode');
        themeToggleBtn.querySelector('span').textContent = 'light_mode';
    }
}

// --- Event Listeners ---
toggleSidebarBtn.addEventListener('click', () => {
    appContainer.classList.toggle('sidebar-open');
});

addBtn.addEventListener('click', createNewNote);
fabAddBtn.addEventListener('click', createNewNote);
deleteBtn.addEventListener('click', deleteActiveNote);

// Update note title on input
noteTitleEl.addEventListener('input', () => {
    if (activeNoteId) {
        updateActiveNote();
    }
});

searchInput.addEventListener('input', renderNotesList);

todoToggleBtn.addEventListener('click', () => {
    appContainer.classList.toggle('todo-open');
});

closeTodoBtn.addEventListener('click', () => {
    appContainer.classList.remove('todo-open');
});

clearAllTodosBtn.addEventListener('click', clearAllTodos);

addTodoBtn.addEventListener('click', addTodo);
newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

themeToggleBtn.addEventListener('click', toggleTheme);

settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'block';
    // Load AI settings into inputs when opening settings
    loadAISettings();
});

closeSettingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

deleteAllBtn.addEventListener('click', () => {
    if (confirm('WARNING: This will delete ALL notes and to-dos permanently. Are you sure?')) {
        notes = [];
        todos = [];
        activeNoteId = null;
        chrome.storage.local.set({ notes, todos });
        renderNotesList();
        renderTodoList();
        createNewNote();
        showNotification('All data deleted', 'error');
        settingsModal.style.display = 'none';
    }
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
    // AI Modal is draggable/modeless, so we don't close on outside click
});

// Share/Export/Import
shareBtn.addEventListener('click', shareCurrentNote);
exportSingleBtn.addEventListener('click', exportSingleNote);
exportAllBtn.addEventListener('click', exportAllNotes);

importBtn.addEventListener('click', () => {
    importInput.click();
});

importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        importNotebookFile(file);
    }
    // Reset input
    importInput.value = '';
});

// Drag and Drop Import
document.body.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

document.body.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
            importNotebookFile(file);
        } else {
            showNotification('Please drop a valid JSON notebook file', 'error');
        }
    }
});

// --- Share/Export/Import Logic ---
async function shareCurrentNote() {
    if (!activeNoteId) {
        showNotification('No note selected to share', 'error');
        return;
    }
    
    const note = notes.find(n => n.id === activeNoteId);
    if (!note) return;
    
    // Extract text from Quill Delta format
    let bodyText = '';
    if (note.body && typeof note.body === 'object' && note.body.ops) {
        bodyText = note.body.ops.map(op => op.insert || '').join('');
    } else if (typeof note.body === 'string') {
        bodyText = note.body;
    }
    
    const shareText = `${note.title ? note.title + '\n\n' : ''}${bodyText}`;
    
    // Try using Web Share API if available
    if (navigator.share) {
        try {
            await navigator.share({
                title: note.title || 'Untitled Note',
                text: shareText
            });
        } catch (err) {
            // User cancelled or error occurred
            if (err.name !== 'AbortError') {
                copyToClipboard(shareText);
            }
        }
    } else {
        // Fallback to clipboard
        copyToClipboard(shareText);
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Note copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showNotification('Note copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy note', 'error');
    }
    document.body.removeChild(textarea);
}

function exportSingleNote() {
    if (!activeNoteId) {
        showNotification('No note selected to export', 'error');
        return;
    }
    
    const note = notes.find(n => n.id === activeNoteId);
    if (!note) return;
    
    const data = {
        note: note,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = (note.title || 'Untitled').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Note exported successfully!', 'success');
}

function exportAllNotes() {
    const data = {
        notes: notes,
        todos: todos,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dev-notebook-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Notebook exported successfully!', 'success');
}

function importNotebookFile(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            // Basic validation - check for single note or multiple notes/todos
            if (!data.notes && !data.todos && !data.note) {
                showNotification('Invalid notebook file', 'error');
                return;
            }

            let importedNotesCount = 0;
            let importedTodosCount = 0;

            // Save current note before importing
            if (activeNoteId) {
                updateActiveNote();
            }

            let newNoteId = null;

            // Handle single note import (from export single)
            if (data.note && typeof data.note === 'object') {
                const newNote = {
                    ...data.note,
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9) // Generate new ID to avoid collisions
                };
                notes = [newNote, ...notes];
                importedNotesCount = 1;
                newNoteId = newNote.id; // Store the ID to switch to it
            }

            // Handle multiple notes import (from export all)
            if (data.notes && Array.isArray(data.notes)) {
                const newNotes = data.notes.map(note => ({
                    ...note,
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9) // Generate new ID to avoid collisions
                }));
                notes = [...notes, ...newNotes];
                importedNotesCount = newNotes.length;
            }

            if (data.todos && Array.isArray(data.todos)) {
                const newTodos = data.todos.map(todo => ({
                    ...todo,
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9) // Generate new ID
                }));
                todos = [...todos, ...newTodos];
                importedTodosCount = newTodos.length;
            }
            
            await chrome.storage.local.set({ notes, todos });
            
            // Re-initialize UI
            renderNotesList();
            renderTodoList();
            
            // If single note was imported, switch to it immediately
            if (newNoteId) {
                setActiveNote(newNoteId);
                showNotification('Imported 1 note successfully!', 'success');
            } else {
                // If we imported notes and there were no notes before, select the first one
                if (notes.length > 0 && !activeNoteId) {
                    setActiveNote(notes[0].id);
                }
                showNotification(`Imported ${importedNotesCount} note${importedNotesCount !== 1 ? 's' : ''} and ${importedTodosCount} to-do${importedTodosCount !== 1 ? 's' : ''} successfully!`, 'success');
            }

        } catch (err) {
            console.error(err);
            showNotification('Error importing notebook: ' + err.message, 'error');
        }
    };
    reader.readAsText(file);
}

// --- AI Assistant Logic ---

// Load AI Settings
async function loadAISettings() {
    const data = await chrome.storage.local.get(['aiSettings']);
    if (data.aiSettings) {
        // Merge saved settings with defaults (handling new providers structure)
        aiSettings = { ...aiSettings, ...data.aiSettings };
        
        // Ensure providers object exists if migrating from old settings
        if (!aiSettings.providers) {
            aiSettings.providers = {
                openai: true,
                gemini: true,
                anthropic: true,
                xai: true,
                deepseek: true,
                mistral: true,
                cohere: false,
                huggingface: false,
                nvidia: false,
                alibaba: false
            };
        }
    }

    // Populate Settings UI
    if (enableOpenAI) enableOpenAI.checked = aiSettings.providers.openai;
    if (enableGemini) enableGemini.checked = aiSettings.providers.gemini;
    if (enableAnthropic) enableAnthropic.checked = aiSettings.providers.anthropic;
    if (enableXAI) enableXAI.checked = aiSettings.providers.xai;
    if (enableDeepSeek) enableDeepSeek.checked = aiSettings.providers.deepseek;
    if (enableMistral) enableMistral.checked = aiSettings.providers.mistral;
    if (enableCohere) enableCohere.checked = aiSettings.providers.cohere;
    if (enableHuggingFace) enableHuggingFace.checked = aiSettings.providers.huggingface;
    if (enableNvidia) enableNvidia.checked = aiSettings.providers.nvidia;
    if (enableAlibaba) enableAlibaba.checked = aiSettings.providers.alibaba;

    // Toggle Key Containers
    toggleKeyContainer(openaiKeyContainer, aiSettings.providers.openai);
    toggleKeyContainer(geminiKeyContainer, aiSettings.providers.gemini);
    toggleKeyContainer(anthropicKeyContainer, aiSettings.providers.anthropic);
    toggleKeyContainer(xaiKeyContainer, aiSettings.providers.xai);
    toggleKeyContainer(deepseekKeyContainer, aiSettings.providers.deepseek);
    toggleKeyContainer(mistralKeyContainer, aiSettings.providers.mistral);
    toggleKeyContainer(cohereKeyContainer, aiSettings.providers.cohere);
    toggleKeyContainer(huggingfaceKeyContainer, aiSettings.providers.huggingface);
    toggleKeyContainer(nvidiaKeyContainer, aiSettings.providers.nvidia);
    toggleKeyContainer(alibabaKeyContainer, aiSettings.providers.alibaba);

    // Fill Keys
    if (settingsOpenAIKey) settingsOpenAIKey.value = aiSettings.openaiKey || '';
    if (settingsGeminiKey) settingsGeminiKey.value = aiSettings.geminiKey || '';
    if (settingsAnthropicKey) settingsAnthropicKey.value = aiSettings.anthropicKey || '';
    if (settingsXAIKey) settingsXAIKey.value = aiSettings.xaiKey || '';
    if (settingsDeepSeekKey) settingsDeepSeekKey.value = aiSettings.deepseekKey || '';
    if (settingsMistralKey) settingsMistralKey.value = aiSettings.mistralKey || '';
    if (settingsCohereKey) settingsCohereKey.value = aiSettings.cohereKey || '';
    if (settingsHuggingFaceKey) settingsHuggingFaceKey.value = aiSettings.huggingfaceKey || '';
    if (settingsNvidiaKey) settingsNvidiaKey.value = aiSettings.nvidiaKey || '';
    if (settingsAlibabaKey) settingsAlibabaKey.value = aiSettings.alibabaKey || '';
    if (systemInstructionEl) systemInstructionEl.value = aiSettings.systemInstruction || '';

    // Load custom snippets
    await loadSnippets();

    // Update Dropdown
    updateModelDropdown();
}

// Load Snippets from storage
async function loadSnippets() {
    const data = await chrome.storage.local.get(['aiSnippets']);
    if (data.aiSnippets && Array.isArray(data.aiSnippets)) {
        AI_SNIPPETS = data.aiSnippets;
    } else {
        AI_SNIPPETS = [...DEFAULT_AI_SNIPPETS];
    }
    
    // Update UI
    renderSnippetsList();
}

// Render snippets list in settings
function renderSnippetsList() {
    if (!snippetsList) return;
    
    snippetsList.innerHTML = AI_SNIPPETS.map((snippet, index) => `
        <div class="snippet-editor-item" data-index="${index}">
            <input type="text" class="snippet-trigger" value="${snippet.trigger}" placeholder="/trigger">
            <input type="text" class="snippet-text" value="${snippet.text}" placeholder="Snippet text">
            <input type="text" class="snippet-description" value="${snippet.description}" placeholder="Description">
            <button class="remove-snippet-btn" title="Remove">
                <span class="material-icons" style="font-size: 18px;">delete</span>
            </button>
        </div>
    `).join('');
    
    // Add event listeners for remove buttons
    snippetsList.querySelectorAll('.remove-snippet-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => removeSnippet(index));
    });
}

// Add new empty snippet
function addSnippet() {
    AI_SNIPPETS.push({
        trigger: '/new',
        text: 'New snippet text',
        description: 'New snippet'
    });
    renderSnippetsList();
}

// Remove snippet
function removeSnippet(index) {
    if (AI_SNIPPETS.length <= 1) {
        showNotification('You must have at least one snippet', 'error');
        return;
    }
    AI_SNIPPETS.splice(index, 1);
    renderSnippetsList();
}

// Save Snippets
async function saveSnippets() {
    if (!snippetsList) return;
    
    const snippets = [];
    const items = snippetsList.querySelectorAll('.snippet-editor-item');
    
    items.forEach(item => {
        const trigger = item.querySelector('.snippet-trigger').value.trim();
        const text = item.querySelector('.snippet-text').value.trim();
        const description = item.querySelector('.snippet-description').value.trim();
        
        if (trigger && text && description) {
            snippets.push({ trigger, text, description });
        }
    });
    
    if (snippets.length === 0) {
        showNotification('Please add at least one valid snippet', 'error');
        return;
    }
    
    AI_SNIPPETS = snippets;
    await chrome.storage.local.set({ aiSnippets: snippets });
    renderSnippetsList();
    showNotification('Snippets saved successfully!');
}

// Reset Snippets to defaults
async function resetSnippets() {
    AI_SNIPPETS = [...DEFAULT_AI_SNIPPETS];
    await chrome.storage.local.set({ aiSnippets: AI_SNIPPETS });
    renderSnippetsList();
    showNotification('Snippets reset to defaults!');
}

function toggleKeyContainer(container, enabled) {
    if (container) {
        if (enabled) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    }
}

function updateModelDropdown() {
    if (!aiModelSelect) return;

    aiModelSelect.innerHTML = '';
    let hasEnabledProvider = false;

    for (const [providerKey, providerData] of Object.entries(ALL_MODELS)) {
        if (aiSettings.providers[providerKey]) {
            hasEnabledProvider = true;
            const optgroup = document.createElement('optgroup');
            optgroup.label = providerData.name;

            providerData.models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.name;
                optgroup.appendChild(option);
            });

            aiModelSelect.appendChild(optgroup);
        }
    }

    if (!hasEnabledProvider) {
        const option = document.createElement('option');
        option.textContent = 'No providers enabled';
        option.disabled = true;
        aiModelSelect.appendChild(option);
        aiDock.style.display = 'none'; // Hide dock if nothing enabled
    } else {
        aiDock.style.display = 'block';
        // Restore last used model if it exists in the new list
        if (aiSettings.lastModel) {
            // Check if the last model is still valid (provider enabled)
            const options = Array.from(aiModelSelect.options);
            const modelExists = options.some(opt => opt.value === aiSettings.lastModel);
            if (modelExists) {
                aiModelSelect.value = aiSettings.lastModel;
            } else if (options.length > 0) {
                aiModelSelect.selectedIndex = 0;
                aiSettings.lastModel = aiModelSelect.value;
                chrome.storage.local.set({ aiSettings });
            }
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadAISettings();
});

// Provider Toggles
const setupProviderToggle = (checkbox, container) => {
    if (checkbox && container) {
        checkbox.addEventListener('change', (e) => {
            toggleKeyContainer(container, e.target.checked);
        });
    }
};

setupProviderToggle(enableOpenAI, openaiKeyContainer);
setupProviderToggle(enableGemini, geminiKeyContainer);
setupProviderToggle(enableAnthropic, anthropicKeyContainer);
setupProviderToggle(enableXAI, xaiKeyContainer);
setupProviderToggle(enableDeepSeek, deepseekKeyContainer);
setupProviderToggle(enableMistral, mistralKeyContainer);
setupProviderToggle(enableCohere, cohereKeyContainer);
setupProviderToggle(enableHuggingFace, huggingfaceKeyContainer);
setupProviderToggle(enableNvidia, nvidiaKeyContainer);
setupProviderToggle(enableAlibaba, alibabaKeyContainer);

if (manageKeysLink) {
    manageKeysLink.addEventListener('click', (e) => {
        e.preventDefault();
        // aiModal.style.display = 'none'; // No longer needed
        settingsModal.style.display = 'block';
    });
}

if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', async () => {
        aiSettings.providers.openai = enableOpenAI ? enableOpenAI.checked : false;
        aiSettings.providers.gemini = enableGemini ? enableGemini.checked : false;
        aiSettings.providers.anthropic = enableAnthropic ? enableAnthropic.checked : false;
        aiSettings.providers.xai = enableXAI ? enableXAI.checked : false;
        aiSettings.providers.deepseek = enableDeepSeek ? enableDeepSeek.checked : false;
        aiSettings.providers.mistral = enableMistral ? enableMistral.checked : false;
        aiSettings.providers.cohere = enableCohere ? enableCohere.checked : false;
        aiSettings.providers.huggingface = enableHuggingFace ? enableHuggingFace.checked : false;
        aiSettings.providers.nvidia = enableNvidia ? enableNvidia.checked : false;
        aiSettings.providers.alibaba = enableAlibaba ? enableAlibaba.checked : false;

        aiSettings.openaiKey = settingsOpenAIKey.value.trim();
        aiSettings.geminiKey = settingsGeminiKey.value.trim();
        aiSettings.anthropicKey = settingsAnthropicKey.value.trim();
        aiSettings.xaiKey = settingsXAIKey.value.trim();
        aiSettings.deepseekKey = settingsDeepSeekKey.value.trim();
        aiSettings.mistralKey = settingsMistralKey.value.trim();
        aiSettings.cohereKey = settingsCohereKey.value.trim();
        aiSettings.huggingfaceKey = settingsHuggingFaceKey.value.trim();
        aiSettings.nvidiaKey = settingsNvidiaKey.value.trim();
        aiSettings.alibabaKey = settingsAlibabaKey.value.trim();
        aiSettings.systemInstruction = systemInstructionEl.value.trim();
        
        await chrome.storage.local.set({ aiSettings });
        updateModelDropdown();
        showNotification('Settings saved successfully!', 'success');
        settingsModal.style.display = 'none';
    });
}

if (addSnippetBtn) {
    addSnippetBtn.addEventListener('click', addSnippet);
}

if (saveSnippetsBtn) {
    saveSnippetsBtn.addEventListener('click', saveSnippets);
}

if (resetSnippetsBtn) {
    resetSnippetsBtn.addEventListener('click', () => {
        if (confirm('Reset all snippets to defaults? This will delete your custom snippets.')) {
            resetSnippets();
        }
    });
}

if (aiModelSelect) {
    aiModelSelect.addEventListener('change', () => {
        aiSettings.lastModel = aiModelSelect.value;
        chrome.storage.local.set({ aiSettings });
    });
}

if (aiCancelBtn) {
    aiCancelBtn.addEventListener('click', () => {
        aiPreviewSection.classList.add('hidden');
        aiPromptInput.value = '';
    });
}

if (aiTodosApplyBtn) {
    aiTodosApplyBtn.addEventListener('click', () => {
        const todosJson = aiTodosPreviewSection.dataset.todos;
        
        if (todosJson) {
            try {
                const generatedTodos = JSON.parse(todosJson);
                if (generatedTodos.length > 0) {
                    generatedTodos.forEach(task => createTodo(task));
                    showNotification(`Added ${generatedTodos.length} tasks`, 'success');
                    if (!appContainer.classList.contains('todo-open')) {
                        appContainer.classList.add('todo-open');
                    }
                }
            } catch (e) {
                console.error('Failed to parse todos:', e);
            }
        }
        
        aiTodosPreviewSection.classList.add('hidden');
        aiTodosPreviewSection.dataset.todos = '';
        aiPromptInput.value = '';
    });
}

if (aiTodosCancelBtn) {
    aiTodosCancelBtn.addEventListener('click', () => {
        aiTodosPreviewSection.classList.add('hidden');
        aiTodosPreviewSection.dataset.todos = '';
    });
}

if (aiPromptInput) {
    let selectedSnippetIndex = -1;
    let filteredSnippets = [];

    // Show snippets menu
    const showSnippetsMenu = (filter = '') => {
        filteredSnippets = AI_SNIPPETS.filter(snippet => 
            snippet.trigger.toLowerCase().includes(filter.toLowerCase()) ||
            snippet.text.toLowerCase().includes(filter.toLowerCase()) ||
            snippet.description.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredSnippets.length === 0) {
            aiSnippetsMenu.classList.add('hidden');
            return;
        }

        aiSnippetsMenu.innerHTML = filteredSnippets.map((snippet, index) => `
            <div class="snippet-item" data-index="${index}">
                <div class="snippet-title">${snippet.trigger}</div>
                <div class="snippet-description">${snippet.description}</div>
            </div>
        `).join('');

        aiSnippetsMenu.classList.remove('hidden');
        selectedSnippetIndex = -1;
    };

    // Hide snippets menu
    const hideSnippetsMenu = () => {
        aiSnippetsMenu.classList.add('hidden');
        selectedSnippetIndex = -1;
        filteredSnippets = [];
    };

    // Insert snippet
    const insertSnippet = (snippet) => {
        const cursorPos = aiPromptInput.selectionStart;
        const text = aiPromptInput.value;
        const lastSlashIndex = text.lastIndexOf('/', cursorPos);
        
        const beforeSlash = text.substring(0, lastSlashIndex);
        const afterCursor = text.substring(cursorPos);
        
        aiPromptInput.value = beforeSlash + snippet.text + afterCursor;
        const newCursorPos = beforeSlash.length + snippet.text.length;
        aiPromptInput.setSelectionRange(newCursorPos, newCursorPos);
        aiPromptInput.focus();
        hideSnippetsMenu();
    };

    // Handle input
    aiPromptInput.addEventListener('input', (e) => {
        const cursorPos = aiPromptInput.selectionStart;
        const text = aiPromptInput.value;
        const lastSlashIndex = text.lastIndexOf('/', cursorPos);
        
        if (lastSlashIndex !== -1 && lastSlashIndex === cursorPos - 1) {
            // Just typed /
            showSnippetsMenu('');
        } else if (lastSlashIndex !== -1) {
            const afterSlash = text.substring(lastSlashIndex, cursorPos);
            if (afterSlash.startsWith('/') && !afterSlash.includes(' ')) {
                showSnippetsMenu(afterSlash);
            } else {
                hideSnippetsMenu();
            }
        } else {
            hideSnippetsMenu();
        }
    });

    // Handle keydown
    aiPromptInput.addEventListener('keydown', (e) => {
        if (aiSnippetsMenu.classList.contains('hidden')) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                aiGenerateBtn.click();
            }
            return;
        }

        // Snippets menu is visible
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedSnippetIndex = Math.min(selectedSnippetIndex + 1, filteredSnippets.length - 1);
                updateSelectedSnippet();
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedSnippetIndex = Math.max(selectedSnippetIndex - 1, -1);
                updateSelectedSnippet();
                break;
            case 'Enter':
            case 'Tab':
                e.preventDefault();
                if (selectedSnippetIndex >= 0 && selectedSnippetIndex < filteredSnippets.length) {
                    insertSnippet(filteredSnippets[selectedSnippetIndex]);
                } else if (filteredSnippets.length > 0) {
                    insertSnippet(filteredSnippets[0]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                hideSnippetsMenu();
                break;
        }
    });

    // Update selected snippet highlight
    const updateSelectedSnippet = () => {
        const items = aiSnippetsMenu.querySelectorAll('.snippet-item');
        items.forEach((item, index) => {
            if (index === selectedSnippetIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.classList.remove('selected');
            }
        });
    };

    // Handle click on snippet
    aiSnippetsMenu.addEventListener('click', (e) => {
        const snippetItem = e.target.closest('.snippet-item');
        if (snippetItem) {
            const index = parseInt(snippetItem.dataset.index);
            insertSnippet(filteredSnippets[index]);
        }
    });

    // Hide menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!aiPromptInput.contains(e.target) && !aiSnippetsMenu.contains(e.target)) {
            hideSnippetsMenu();
        }
    });
}

if (aiGenerateBtn) {
    aiGenerateBtn.addEventListener('click', async () => {
        const model = aiModelSelect.value;
        const prompt = aiPromptInput.value.trim();
        
        // Determine provider and key
        let provider = '';
        let apiKey = '';
        
        if (model.startsWith('gpt') || model.startsWith('text-embedding')) {
            provider = 'openai';
            apiKey = aiSettings.openaiKey;
        } else if (model.startsWith('gemini') || model.startsWith('gemma') || model.startsWith('alphafold')) {
            provider = 'gemini';
            apiKey = aiSettings.geminiKey;
        } else if (model.startsWith('claude')) {
            provider = 'anthropic';
            apiKey = aiSettings.anthropicKey;
        } else if (model.startsWith('grok')) {
            provider = 'xai';
            apiKey = aiSettings.xaiKey;
        } else if (model.startsWith('deepseek')) {
            provider = 'deepseek';
            apiKey = aiSettings.deepseekKey;
        } else if (model.startsWith('mistral') || model.startsWith('pixtral') || model.startsWith('codestral') || model.startsWith('open-mixtral')) {
            provider = 'mistral';
            apiKey = aiSettings.mistralKey;
        } else if (model.startsWith('command')) {
            provider = 'cohere';
            apiKey = aiSettings.cohereKey;
        } else if (model.startsWith('meta-llama') || model.startsWith('microsoft/Phi') || model.startsWith('bigscience') || model.startsWith('mistralai') || model.startsWith('google/gemma')) {
            provider = 'huggingface';
            apiKey = aiSettings.huggingfaceKey;
        } else if (model.startsWith('nvidia')) {
            provider = 'nvidia';
            apiKey = aiSettings.nvidiaKey;
        } else if (model.startsWith('qwen')) {
            provider = 'alibaba';
            apiKey = aiSettings.alibabaKey;
        }

        if (!provider) {
            showAIError(`The model '${model}' is not currently supported with a direct API integration.`);
            return;
        }

        if (!apiKey) {
            showAIError(`API Key for ${provider} is missing. Please configure it in Settings.`);
            return;
        }
        if (!prompt) {
            showAIError('Please enter a prompt');
            return;
        }

        // Save last used model
        aiSettings.lastModel = model;
        chrome.storage.local.set({ aiSettings });

        // UI State
        aiLoading.classList.remove('hidden');
        aiError.classList.add('hidden');
        aiPreviewSection.classList.add('hidden');
        aiGenerateBtn.disabled = true;
        // aiGenerateBtn.innerHTML = '<span class="material-icons spin">refresh</span>'; // Optional: change icon while loading

        try {
            const outputType = document.getElementById('ai-type-select').value;
            let baseInstruction = aiSettings.systemInstruction || "You are a helpful assistant.";
            
            let formatInstruction = "";
            if (outputType === 'todo') {
                formatInstruction = " Please provide the response as a JSON object with a 'todos' field containing an array of task strings. Do not include title or content fields.";
            } else if (outputType === 'both') {
                formatInstruction = " Please provide the response in JSON format with 'title', 'content' (Markdown paragraphs), and a 'todos' field (array of strings).";
            } else {
                formatInstruction = " Please provide the response in JSON format with 'title' and 'content' (Markdown paragraphs) fields.";
            }

            const systemInstruction = baseInstruction + formatInstruction;
            const result = await callAIProvider(provider, apiKey, model, prompt, systemInstruction);
            
            // Parse result (expecting JSON with title and content, or just text)
            let title = 'AI Generated Note';
            let content = result;
            let generatedTodos = [];
            let isJson = false;

            // Try to parse as JSON if the AI returned JSON
            try {
                // Clean up markdown code blocks if present
                const jsonStr = result.replace(/\`\`\`json\n?|\n?\`\`\`/g, '');
                const parsed = JSON.parse(jsonStr);
                isJson = true;
                if (parsed.title) title = parsed.title;
                if (parsed.content) content = parsed.content;
                if (parsed.todos && Array.isArray(parsed.todos)) generatedTodos = parsed.todos;
            } catch (e) {
                // Not JSON, use first line as title if short
                const lines = result.split('\n');
                if (lines.length > 0 && lines[0].length < 50) {
                    title = lines[0];
                    content = lines.slice(1).join('\n');
                }
            }

            // Show todos in separate section if generated
            if (generatedTodos.length > 0) {
                aiTodosPreviewList.innerHTML = generatedTodos.map((task, i) => 
                    `<div>${i + 1}. ${escapeHtml(task)}</div>`
                ).join('');
                aiTodosPreviewSection.dataset.todos = JSON.stringify(generatedTodos);
                aiTodosPreviewSection.classList.remove('hidden');
            } else {
                aiTodosPreviewSection.classList.add('hidden');
            }

            // Show note preview if not todo-only mode
            if (outputType !== 'todo') {
                aiPreviewTitle.value = title;
                aiPreviewContent.innerText = content; 
                
                // Store for application
                aiPreviewSection.dataset.title = title;
                aiPreviewSection.dataset.content = content;
                aiPreviewSection.dataset.outputType = outputType;

                aiPreviewSection.classList.remove('hidden');
            } else {
                aiPreviewSection.classList.add('hidden');
            }
        } catch (error) {
            showAIError(error.message);
        } finally {
            aiLoading.classList.add('hidden');
            aiGenerateBtn.disabled = false;
            // aiGenerateBtn.innerHTML = '<span class="material-icons">arrow_upward</span>'; // Restore icon
        }
    });
}

if (aiApplyBtn) {
    aiApplyBtn.addEventListener('click', () => {
        const title = aiPreviewSection.dataset.title;
        const content = aiPreviewSection.dataset.content;
        
        if (title) noteTitleEl.value = title;
        if (content) {
            quill.setText(content);
        }
        updateActiveNote();
        
        aiPromptInput.value = '';
        aiPreviewSection.classList.add('hidden');
        showNotification('Note generated successfully!', 'success');
    });
}

function showAIError(msg) {
    aiError.textContent = msg;
    aiError.classList.remove('hidden');
}

// --- AI Modal Drag Logic Removed (Fixed Bottom Layout) ---
// The AI Dock is now fixed at the bottom and does not require dragging.

// --- Settings Modal Drag Logic ---
const settingsModalContent = settingsModal.querySelector('.modal-content');
const settingsModalHeader = settingsModal.querySelector('.modal-header');

if (settingsModalContent && settingsModalHeader) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    settingsModalHeader.addEventListener("mousedown", dragStart);
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("mousemove", drag);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === settingsModalHeader || settingsModalHeader.contains(e.target)) {
            isDragging = true;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, settingsModalContent);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(calc(-50% + ${xPos}px), calc(-50% + ${yPos}px))`;
    }
}
