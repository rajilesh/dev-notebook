// --- DOM Elements ---
const appContainer = document.querySelector('.app-container');
const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
const excalidraw = document.getElementById('excalidraw');
const excalidrawBaseSrc = excalidraw ? excalidraw.getAttribute('src') : 'draw/index.html';
const photoeditor = document.getElementById('photoeditor');

// Note Elements
// Legacy notesListEl removed
const noteTitleEl = document.getElementById('note-title');
const editorContent = document.getElementById('editor-content');
const editorToolbar = document.getElementById('editor-toolbar');
const searchInput = document.getElementById('search-input');
// Legacy addBtn removed
const deleteBtn = document.getElementById('delete-note-btn');
const statusEl = document.getElementById('save-status');
const openDrawBtn = document.getElementById('open-draw-btn');
const openPhotoeditorBtn = document.getElementById('open-photoeditor-btn');
const backToAppBtn = document.getElementById('back-to-app-btn');
const shareBtn = document.getElementById('share-btn');
const exportSingleBtn = document.getElementById('export-single-btn');
const exportAllBtn = document.getElementById('export-all-btn');
const importBtn = document.getElementById('import-btn');
const importInput = document.getElementById('import-input');
const fabAddBtn = document.getElementById('fab-add-note');
const aiToggleBtn = document.getElementById('ai-toggle-btn');
const fabAIBtn = document.getElementById('fab-ai-btn');

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
const todoPrevBtn = document.getElementById('todo-prev-btn');
const todoNextBtn = document.getElementById('todo-next-btn');
const todoPageInfo = document.getElementById('todo-page-info');

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
const aiStopBtn = document.getElementById('ai-stop-btn');
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
const webaiStatus = document.getElementById('webai-status');
const webaiStatusText = document.getElementById('webai-status-text');
const webaiDownloadBtn = document.getElementById('webai-download-btn');
const webaiCancelBtn = document.getElementById('webai-cancel-btn');
const webaiProgress = document.getElementById('webai-progress');
const webaiProgressLabel = document.getElementById('webai-progress-label');
const webaiManageBtn = document.getElementById('webai-manage-btn');
const webaiHelpBtn = document.getElementById('webai-help-btn');

// Chat Mode Elements
const aiTypeSelect = document.getElementById('ai-type-select');
const aiChatContainer = document.getElementById('ai-chat-container');
const aiChatMessages = document.getElementById('ai-chat-messages');
const aiChatInput = document.getElementById('ai-chat-input');
const aiChatSendBtn = document.getElementById('ai-chat-send-btn');
const aiChatAttachBtn = document.getElementById('ai-chat-attach-btn');
const aiChatFileInput = document.getElementById('ai-chat-file-input');
const aiChatAttachments = document.getElementById('ai-chat-attachments');
const webaiStorageModal = document.getElementById('webai-storage-modal');
const closeWebaiStorageBtn = document.getElementById('close-webai-storage-btn');
const webaiDeleteBtn = document.getElementById('webai-delete-btn');
const webaiStorageEstimate = document.getElementById('webai-storage-estimate');
const webaiStatusSummary = document.getElementById('webai-status-summary');
const webaiModelsList = document.getElementById('webai-models-list');
const webaiGuidesList = document.getElementById('webai-guides-list');
const webaiDownloadBtnModal = document.getElementById('webai-download-btn-modal');
const webaiCancelBtnModal = document.getElementById('webai-cancel-btn-modal');
let webAIIntentActive = false;
let aiDockActive = false;
let aiInitialized = false;

// Keep AI dock hidden until explicitly opened to avoid eager loading
if (aiDock) {
    aiDock.style.display = 'none';
}

function resetAIDockPosition() {
    if (!aiDock) return;
    aiDock.style.left = '';
    aiDock.style.top = '';
    aiDock.style.bottom = '';
    aiDock.style.transform = '';
    localStorage.removeItem('aiDockPosition');
}

function ensureAIDockInViewport() {
    if (!aiDock) return;
    const rect = aiDock.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // If more than half the dock is off-screen, reset to default position
    if (rect.right < 50 || rect.left > vw - 50 || rect.bottom < 0 || rect.top > vh - 20) {
        resetAIDockPosition();
    }
}

function setAIDockVisibility(visible, { persist = true } = {}) {
    if (!aiDock) return;
    aiDock.style.display = visible ? 'block' : 'none';
    aiDockActive = visible;
    if (aiToggleBtn) aiToggleBtn.classList.toggle('active', visible);
    if (visible) {
        ensureAIDockInViewport();
        ensureAIInitialized();
    }
    if (persist) DevNotebookDB.setSetting('aiDockVisible', visible);
}

async function ensureAIInitialized() {
    if (aiInitialized) return;
    aiInitialized = true;
    await loadAISettings();
}

// Media Generation Elements
const mediaGenerationModal = document.getElementById('media-generation-modal');
const closeMediaModal = document.getElementById('close-media-modal');
const mediaModalTitle = document.getElementById('media-modal-title');
const mediaPreviewArea = document.getElementById('media-preview-area');
const mediaLoading = document.getElementById('media-loading');
const generatedImage = document.getElementById('generated-image');
const generatedVideo = document.getElementById('generated-video');
const mediaActions = document.getElementById('media-actions');
const mediaPromptInput = document.getElementById('media-prompt-input');
const imageOptions = document.getElementById('image-options');
const videoOptions = document.getElementById('video-options');
const imageSizeSelect = document.getElementById('image-size-select');
const imageQualitySelect = document.getElementById('image-quality-select');
const videoDurationSelect = document.getElementById('video-duration-select');
const videoResolutionSelect = document.getElementById('video-resolution-select');
const generateMediaBtn = document.getElementById('generate-media-btn');
const downloadMediaBtn = document.getElementById('download-media-btn');
const insertMediaBtn = document.getElementById('insert-media-btn');
const regenerateMediaBtn = document.getElementById('regenerate-media-btn');
const mediaProviderInfo = document.getElementById('media-provider-info');
const mediaProviderText = document.getElementById('media-provider-text');

// Chat State
let chatHistory = [];
let chatAttachedFiles = [];
let isStreamingChat = false;
let aiAbortController = null;

// WebAI download state
let webaiDownloadSession = null;
let webaiDownloadCanceled = false;

// Media State
let currentMediaType = 'image';
let currentMediaUrl = null;

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
const enableWebAI = document.getElementById('enable-webai');
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
const webaiKeyContainer = document.getElementById('webai-key-container');
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

// --- Workspaces / Projects / Resources Elements ---
const workspaceSelect = document.getElementById('workspace-select');
const addWorkspaceBtn = document.getElementById('add-workspace-btn');
const editWorkspaceBtn = document.getElementById('edit-workspace-btn');
const deleteWorkspaceBtn = document.getElementById('delete-workspace-btn');

const projectSelect = document.getElementById('project-select');
const addProjectBtn = document.getElementById('add-project-btn');
const editProjectBtn = document.getElementById('edit-project-btn');
const deleteProjectBtn = document.getElementById('delete-project-btn');

const resourceTabs = document.querySelectorAll('.tab-btn');
const addItemBtn = document.getElementById('add-item-btn');
const itemsListEl = document.getElementById('items-list');

// Editors
const bookmarkEditor = document.getElementById('bookmark-editor');
const bookmarkTitleInput = document.getElementById('bookmark-title-input');
const bookmarkUrlInput = document.getElementById('bookmark-url-input');
const bookmarkDescInput = document.getElementById('bookmark-desc-input');
const saveBookmarkBtn = document.getElementById('save-bookmark-btn');
const visitBookmarkBtn = document.getElementById('visit-bookmark-btn');

const credentialEditor = document.getElementById('credential-editor');
const credentialTitleInput = document.getElementById('credential-title-input');
const credentialUsernameInput = document.getElementById('credential-username-input');
const credentialPasswordInput = document.getElementById('credential-password-input');
const credentialNotesInput = document.getElementById('credential-notes-input');
const saveCredentialBtn = document.getElementById('save-credential-btn');
const togglePasswordBtn = document.getElementById('toggle-password-visibility');
const copyBtns = document.querySelectorAll('.copy-btn');

// AI Models Configuration
const ALL_MODELS = {
    webai: {
        name: 'Google Web AI (On-device)',
        models: [
            { id: 'chrome-gemini-nano', name: 'Gemini Nano (Chrome built-in)' },
            { id: 'chrome-prompt-api', name: 'Chrome Prompt API' },
            { id: 'chrome-summarizer', name: 'Chrome Summarizer API' }
        ]
    },
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
        webai: true,
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
    webaiKey: '',
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

// Draw State (used for creating new canvases)
let drawCollabLinkUrl = '';


// --- State ---
let activeWorkspaceId = null;
let activeProjectId = null;
let activeItemType = 'note'; // 'note', 'bookmark', 'credential'
let activeItemId = null; // Replaces activeNoteId
let selectedItemIds = new Set(); // For Multi-selection
let lastPrimaryView = { type: 'note', itemId: null };


// Legacy state for migration reference (will be removed/unused after migration)

let todos = [];
let currentTheme = 'light'; // 'light', 'dark'
let currentTodoPage = 1;
const todosPerPage = 15;

// --- Initialization ---
// Wait for DOM, Quill, highlight.js, and SQLite DB to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing DB and checking libraries...');

    // Start DB init immediately (parallel with library check)
    const dbReady = DevNotebookDB.init().then(() => {
        console.log('SQLite DB ready');
        return DevNotebookDB.migrateFromChromeStorage();
    }).then(migrated => {
        if (migrated) console.log('Data migrated from chrome.storage.local to SQLite');
    });

    const checkLibraries = setInterval(() => {
        if (typeof Quill !== 'undefined' && typeof hljs !== 'undefined') {
            clearInterval(checkLibraries);
            console.log('All libraries loaded!');
            initializeQuill();
            // Wait for DB before init
            dbReady.then(() => init()).catch(e => {
                console.error('DB init failed, falling back:', e);
                init();
            });
        }
    }, 100);
});

// Helper function to highlight all code blocks
function highlightCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.ql-syntax');
    codeBlocks.forEach((block) => {
        // Skip if already highlighted and content hasn't changed
        const currentContent = block.textContent;
        if (block.dataset.lastContent === currentContent && block.classList.contains('hljs')) {
            return;
        }

        // Store current content
        block.dataset.lastContent = currentContent;

        // Remove previous highlighting classes
        block.removeAttribute('data-highlighted');
        block.className = 'ql-syntax';

        // Apply new highlighting
        try {
            hljs.highlightElement(block);
        } catch (e) {
            console.error('Highlighting error:', e);
        }
    });
}

function initializeQuill() {
    // Make highlight.js available globally for Quill
    window.hljs = hljs;

    // Configure highlight.js for syntax highlighting
    hljs.configure({
        languages: ['javascript', 'python', 'java', 'c', 'cpp', 'csharp', 'ruby', 'go',
            'rust', 'swift', 'kotlin', 'php', 'html', 'css', 'scss', 'sql',
            'bash', 'shell', 'powershell', 'typescript', 'json', 'xml', 'yaml',
            'markdown', 'dockerfile', 'nginx', 'apache', 'r', 'matlab', 'perl']
    });

    // Initialize Quill with Notion-like setup (no visible toolbar, floating toolbar on selection)
    quill = new Quill('#editor-content', {
        theme: 'snow',
        modules: {
            toolbar: {
                container: [
                    // Hidden toolbar – used programmatically by floating toolbar
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'font': [] }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'align': [] }],
                    ['blockquote', 'code-block'],
                    ['link', 'image', 'video'],
                    ['clean']
                ],
                handlers: {
                    'code-block': function () {
                        const range = this.quill.getSelection();
                        if (range) {
                            const format = this.quill.getFormat(range);
                            this.quill.format('code-block', !format['code-block']);
                        }
                    }
                }
            },
            syntax: true  // Enable syntax highlighting module
        },
        placeholder: "Press '/' for commands…",
    });

    // Initial highlight
    setTimeout(() => {
        highlightCodeBlocks();
    }, 100);

    // Note: Highlighting is handled by scanAndFormatCodeBlocks in the text-change listener below
    // No need for separate highlighting listener here to avoid blinking


    // Also highlight when editor gains focus (for pasted content)
    quill.on('selection-change', function (range, oldRange, source) {
        if (range) {
            highlightCodeBlocks();
        }
    });

    // Listen for text changes with debouncing
    let saveTimeout;
    quill.on('text-change', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            if (activeItemId) {
                const item = getItem(activeItemId);
                if (item && item.type === 'note') {
                    DevNotebookDB.updateItem(activeItemId, {
                        title: noteTitleEl.value,
                        body: quill.getContents()
                    });
                    notifySyncPeers();
                }
            }
        }, 500);
    });

    // Note Title Listener
    noteTitleEl.addEventListener('input', () => {
        if (activeItemId) {
            DevNotebookDB.updateItem(activeItemId, { title: noteTitleEl.value });
            renderItemsList();
        }
    });

    // Tab from title → focus editor content
    noteTitleEl.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            if (quill) {
                quill.focus();
                quill.setSelection(0, 0);
            }
        }
    });

    // Tab from editor → focus first toolbar button
    quill.root.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !e.shiftKey) {
            const firstToolbarBtn = document.querySelector('.editor-header .actions .icon-btn');
            if (firstToolbarBtn) {
                e.preventDefault();
                firstToolbarBtn.focus();
            }
        }
        // Shift+Tab from editor → focus title
        if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            noteTitleEl.focus();
        }
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

    // Add keyboard shortcuts for markdown-style formatting
    quill.keyboard.addBinding({
        key: 'B',
        shortKey: true,
        handler: function (range, context) {
            this.quill.format('bold', !context.format.bold);
        }
    });

    quill.keyboard.addBinding({
        key: 'I',
        shortKey: true,
        handler: function (range, context) {
            this.quill.format('italic', !context.format.italic);
        }
    });

    quill.keyboard.addBinding({
        key: 'U',
        shortKey: true,
        handler: function (range, context) {
            this.quill.format('underline', !context.format.underline);
        }
    });

    quill.keyboard.addBinding({
        key: 'E',
        shortKey: true,
        shiftKey: true,
        handler: function (range, context) {
            this.quill.format('code-block', !context.format['code-block']);
        }
    });

    // Smart auto-formatting with code detection
    let autoFormatTimeout;
    quill.on('text-change', function (delta, oldDelta, source) {
        if (source === 'user') {
            scanAndFormatCodeBlocks(quill);

            // Normal magic formatting debounce
            clearTimeout(autoFormatTimeout);
            autoFormatTimeout = setTimeout(() => {
                handleMagicFormatting(quill);
            }, 500);

            // Slash command detection
            handleSlashTrigger(delta);
        }
    });

    // Initialize Notion-like features
    initNotionFeatures();
}

// ==========================================
//  NOTION-LIKE EDITOR FEATURES
// ==========================================

// --- Slash Command Definitions ---
const SLASH_COMMANDS = [
    // Basic blocks
    { section: 'Basic blocks', icon: 'notes',          title: 'Text',            desc: 'Plain text block',                   action: 'text' },
    { section: 'Basic blocks', icon: 'title',           title: 'Heading 1',       desc: 'Large section heading',              action: 'h1' },
    { section: 'Basic blocks', icon: 'title',           title: 'Heading 2',       desc: 'Medium section heading',             action: 'h2' },
    { section: 'Basic blocks', icon: 'title',           title: 'Heading 3',       desc: 'Small section heading',              action: 'h3' },
    { section: 'Basic blocks', icon: 'format_list_bulleted', title: 'Bullet List', desc: 'Create a bulleted list',           action: 'bullet' },
    { section: 'Basic blocks', icon: 'format_list_numbered', title: 'Numbered List', desc: 'Create a numbered list',         action: 'ordered' },
    { section: 'Basic blocks', icon: 'check_box',       title: 'To-do List',      desc: 'Track tasks with checkboxes',        action: 'check' },
    { section: 'Basic blocks', icon: 'expand_more',     title: 'Toggle',          desc: 'Collapsible toggle block',           action: 'toggle' },
    { section: 'Basic blocks', icon: 'format_quote',    title: 'Quote',           desc: 'Capture a quote',                    action: 'quote' },
    { section: 'Basic blocks', icon: 'horizontal_rule', title: 'Divider',         desc: 'Visual divider line',                action: 'divider' },
    { section: 'Basic blocks', icon: 'info',            title: 'Callout',         desc: 'Highlighted info block',             action: 'callout' },

    // Media & embeds
    { section: 'Media',        icon: 'code',            title: 'Code Block',      desc: 'Write code with syntax highlighting',action: 'code' },
    { section: 'Media',        icon: 'table_chart',     title: 'Table',           desc: 'Insert a spreadsheet-like table',    action: 'table' },
    { section: 'Media',        icon: 'image',           title: 'Image',           desc: 'Upload or embed an image',           action: 'image' },
    { section: 'Media',        icon: 'smart_display',   title: 'Video',           desc: 'Embed a video',                      action: 'video' },

    // Inline
    { section: 'Inline',       icon: 'data_object',     title: 'Inline Code',     desc: 'Mark text as code',                  action: 'inline-code' },
    { section: 'Inline',       icon: 'link',            title: 'Link',            desc: 'Add a hyperlink',                    action: 'link' },
];

let slashMenuOpen = false;
let slashMenuIndex = 0;
let slashMenuFiltered = [...SLASH_COMMANDS];
let slashStartIndex = -1;  // position where '/' was typed

function initNotionFeatures() {
    initFloatingToolbar();
    initBlockHandle();
    initSlashMenuEvents();
    initTableSizePicker();
}

// --- Slash Command Menu ---
function initSlashMenuEvents() {
    // Close menu on outside click
    document.addEventListener('mousedown', (e) => {
        const menu = document.getElementById('slash-menu');
        if (slashMenuOpen && menu && !menu.contains(e.target)) {
            closeSlashMenu();
        }
    });

    // Quill keydown handler for slash menu navigation while typing
    quill.root.addEventListener('keydown', (e) => {
        if (slashMenuOpen) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                navigateSlashMenu(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                navigateSlashMenu(-1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                executeSlashCommand(slashMenuFiltered[slashMenuIndex]);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeSlashMenu();
            } else if (e.key === 'Backspace') {
                // Check if we would delete the slash itself
                setTimeout(() => {
                    const sel = quill.getSelection();
                    if (sel && sel.index <= slashStartIndex) {
                        closeSlashMenu();
                    } else if (slashMenuOpen && sel) {
                        // Re-filter after backspace
                        const typed = quill.getText(slashStartIndex + 1, sel.index - slashStartIndex - 1);
                        filterSlashMenu(typed);
                    }
                }, 10);
            }
        }
    });
}

function handleSlashTrigger(delta) {
    if (!quill) return;
    const sel = quill.getSelection();
    if (!sel) return;

    // Check if user just typed '/' at the cursor
    if (delta && delta.ops) {
        const lastOp = delta.ops[delta.ops.length - 1];
        if (lastOp && lastOp.insert === '/') {
            // Check if it's start of line or preceded by whitespace
            const idx = sel.index;
            const text = quill.getText(0, idx);
            const charBefore = text[idx - 2]; // idx-1 is the '/', idx-2 is char before
            if (idx === 1 || charBefore === '\n' || charBefore === undefined || charBefore === ' ') {
                slashStartIndex = idx - 1;
                openSlashMenu();
                return;
            }
        }
    }

    // If slash menu is open, filter based on text after /
    if (slashMenuOpen) {
        const sel2 = quill.getSelection();
        if (sel2) {
            const typed = quill.getText(slashStartIndex + 1, sel2.index - slashStartIndex - 1);
            filterSlashMenu(typed);
        }
    }
}

function openSlashMenu() {
    const menu = document.getElementById('slash-menu');
    if (!menu || !quill) return;

    const bounds = quill.getBounds(quill.getSelection().index);
    const editorRect = quill.root.closest('.ql-container').getBoundingClientRect();

    let top = editorRect.top + bounds.top + bounds.height + 4;
    let left = editorRect.left + bounds.left;

    // Ensure it stays in viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (left + 320 > vw) left = vw - 330;
    if (left < 8) left = 8;
    if (top + 380 > vh) top = editorRect.top + bounds.top - 390;

    menu.style.top = top + 'px';
    menu.style.left = left + 'px';
    menu.style.display = 'flex';

    slashMenuOpen = true;
    slashMenuIndex = 0;
    slashMenuFiltered = [...SLASH_COMMANDS];
    renderSlashMenuItems();

    const searchInput = document.getElementById('slash-menu-input');
    if (searchInput) {
        searchInput.value = '';
        // Don't steal focus from quill so we can detect backspace
    }
}

function closeSlashMenu() {
    const menu = document.getElementById('slash-menu');
    if (menu) menu.style.display = 'none';
    slashMenuOpen = false;
    slashStartIndex = -1;

    // Also close table picker
    const tp = document.getElementById('table-size-picker');
    if (tp) tp.style.display = 'none';
}

function filterSlashMenu(query) {
    const q = (query || '').toLowerCase().trim();
    slashMenuFiltered = q
        ? SLASH_COMMANDS.filter(cmd => cmd.title.toLowerCase().includes(q) || cmd.desc.toLowerCase().includes(q))
        : [...SLASH_COMMANDS];
    slashMenuIndex = 0;
    renderSlashMenuItems();
}

function navigateSlashMenu(dir) {
    if (slashMenuFiltered.length === 0) return;
    slashMenuIndex = (slashMenuIndex + dir + slashMenuFiltered.length) % slashMenuFiltered.length;
    renderSlashMenuItems();
    // Scroll active into view
    const activeEl = document.querySelector('.slash-menu-item.active');
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
}

function renderSlashMenuItems() {
    const container = document.getElementById('slash-menu-items');
    if (!container) return;

    let html = '';
    let currentSection = '';
    slashMenuFiltered.forEach((cmd, i) => {
        if (cmd.section !== currentSection) {
            currentSection = cmd.section;
            html += `<div class="slash-menu-section-title">${currentSection}</div>`;
        }
        html += `
            <div class="slash-menu-item ${i === slashMenuIndex ? 'active' : ''}" data-index="${i}">
                <div class="slash-menu-item-icon">
                    <span class="material-symbols-rounded">${cmd.icon}</span>
                </div>
                <div class="slash-menu-item-text">
                    <div class="slash-menu-item-title">${cmd.title}</div>
                    <div class="slash-menu-item-desc">${cmd.desc}</div>
                </div>
            </div>`;
    });

    if (slashMenuFiltered.length === 0) {
        html = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:13px;">No results</div>';
    }

    container.innerHTML = html;

    // Click handlers
    container.querySelectorAll('.slash-menu-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            slashMenuIndex = parseInt(item.dataset.index);
            container.querySelectorAll('.slash-menu-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
        });
        item.addEventListener('click', () => {
            executeSlashCommand(slashMenuFiltered[parseInt(item.dataset.index)]);
        });
    });
}

function deleteSlashText() {
    // Delete the "/" and any filter text typed after it
    if (slashStartIndex >= 0 && quill) {
        const sel = quill.getSelection();
        const end = sel ? sel.index : slashStartIndex + 1;
        const len = end - slashStartIndex;
        if (len > 0) {
            quill.deleteText(slashStartIndex, len, 'user');
        }
    }
}

function executeSlashCommand(cmd) {
    if (!cmd || !quill) return;

    deleteSlashText();
    closeSlashMenu();

    const idx = quill.getSelection() ? quill.getSelection().index : quill.getLength() - 1;

    switch (cmd.action) {
        case 'text':
            quill.formatLine(idx, 1, { header: false, list: false, blockquote: false, 'code-block': false }, 'user');
            break;
        case 'h1':
            quill.formatLine(idx, 1, 'header', 1, 'user');
            break;
        case 'h2':
            quill.formatLine(idx, 1, 'header', 2, 'user');
            break;
        case 'h3':
            quill.formatLine(idx, 1, 'header', 3, 'user');
            break;
        case 'bullet':
            quill.formatLine(idx, 1, 'list', 'bullet', 'user');
            break;
        case 'ordered':
            quill.formatLine(idx, 1, 'list', 'ordered', 'user');
            break;
        case 'check':
            quill.formatLine(idx, 1, 'list', 'check', 'user');
            break;
        case 'quote':
            quill.formatLine(idx, 1, 'blockquote', true, 'user');
            break;
        case 'code':
            quill.formatLine(idx, 1, 'code-block', true, 'user');
            break;
        case 'divider':
            insertDivider(idx);
            break;
        case 'callout':
            insertCallout(idx);
            break;
        case 'toggle':
            insertToggle(idx);
            break;
        case 'table':
            showTableSizePicker(idx);
            return; // Don't focus quill yet
        case 'image':
            triggerImageUpload();
            break;
        case 'video':
            promptVideoEmbed(idx);
            break;
        case 'inline-code':
            quill.format('code', true, 'user');
            break;
        case 'link': {
            const url = prompt('Enter URL:');
            if (url) {
                quill.format('link', url, 'user');
            }
            break;
        }
    }

    quill.focus();
}

// --- Block insertions ---
function insertDivider(idx) {
    quill.insertText(idx, '\n', 'user');
    quill.insertEmbed(idx, 'divider', true, 'user');
    quill.insertText(idx + 1, '\n', 'user');
    quill.setSelection(idx + 2, 0);
}

// Register divider blot for Quill
(function registerDividerBlot() {
    if (typeof Quill === 'undefined') {
        // Retry after Quill loads
        const iv = setInterval(() => {
            if (typeof Quill !== 'undefined') {
                clearInterval(iv);
                doRegister();
            }
        }, 100);
    } else {
        doRegister();
    }

    function doRegister() {
        const BlockEmbed = Quill.import('blots/block/embed');
        class DividerBlot extends BlockEmbed {
            static create() {
                const node = super.create();
                return node;
            }
        }
        DividerBlot.blotName = 'divider';
        DividerBlot.tagName = 'hr';
        DividerBlot.className = 'notion-divider';
        Quill.register(DividerBlot);
    }
})();

// Register table wrapper blot for Quill (Quill 1.x has no native table support)
(function registerTableBlot() {
    if (typeof Quill === 'undefined') {
        const iv = setInterval(() => {
            if (typeof Quill !== 'undefined') {
                clearInterval(iv);
                doRegister();
            }
        }, 100);
    } else {
        doRegister();
    }

    function doRegister() {
        const BlockEmbed = Quill.import('blots/block/embed');
        class TableWrapperBlot extends BlockEmbed {
            static create(value) {
                const node = super.create();
                if (typeof value === 'string' && value.length > 0) {
                    node.innerHTML = value;
                }
                node.setAttribute('contenteditable', 'false');
                // Allow editing within individual cells
                setTimeout(() => {
                    node.querySelectorAll('td, th').forEach(cell => {
                        cell.setAttribute('contenteditable', 'true');
                    });
                }, 0);
                return node;
            }
            static value(node) {
                return node.innerHTML;
            }
        }
        TableWrapperBlot.blotName = 'notion-table';
        TableWrapperBlot.tagName = 'DIV';
        TableWrapperBlot.className = 'notion-table-wrapper';
        Quill.register(TableWrapperBlot);
    }
})();

function insertCallout(idx) {
    const calloutHTML = `<div class="notion-callout"><span class="notion-callout-icon">💡</span><div class="notion-callout-content" contenteditable="true">Type something…</div></div>`;
    quill.clipboard.dangerouslyPasteHTML(idx, calloutHTML, 'user');
    quill.setSelection(idx + 1, 0);
}

function insertToggle(idx) {
    const toggleHTML = `<details class="notion-toggle"><summary>Toggle heading</summary><div class="toggle-content"><p>Content goes here…</p></div></details>`;
    quill.clipboard.dangerouslyPasteHTML(idx, toggleHTML, 'user');
    quill.setSelection(idx + 1, 0);
}

function triggerImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const idx = quill.getSelection() ? quill.getSelection().index : quill.getLength() - 1;
            quill.insertEmbed(idx, 'image', e.target.result, 'user');
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

function promptVideoEmbed(idx) {
    const url = prompt('Enter video URL (YouTube, Vimeo, etc.):');
    if (url) {
        quill.insertEmbed(idx, 'video', url, 'user');
        quill.insertText(idx + 1, '\n', 'user');
        quill.setSelection(idx + 2, 0);
    }
}


// --- Table insertion ---
function initTableSizePicker() {
    const grid = document.getElementById('table-size-grid');
    if (!grid) return;

    // Create 6x6 grid
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            const cell = document.createElement('div');
            cell.className = 'table-size-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('mouseenter', () => highlightTableGrid(r, c));
            cell.addEventListener('click', () => {
                insertTable(r + 1, c + 1);
            });
            grid.appendChild(cell);
        }
    }
}

let _tableSizePickerIdx = 0;

function showTableSizePicker(idx) {
    _tableSizePickerIdx = idx;
    const picker = document.getElementById('table-size-picker');
    const menu = document.getElementById('slash-menu');
    if (!picker) return;

    // Position next to slash menu
    if (menu) {
        const rect = menu.getBoundingClientRect();
        picker.style.top = rect.top + 'px';
        picker.style.left = (rect.right + 8) + 'px';
    }

    picker.style.display = 'block';
    highlightTableGrid(-1, -1);

    // Close on outside click
    const handler = (e) => {
        if (!picker.contains(e.target)) {
            picker.style.display = 'none';
            document.removeEventListener('mousedown', handler);
        }
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 10);
}

function highlightTableGrid(row, col) {
    const label = document.getElementById('table-size-label');
    const cells = document.querySelectorAll('#table-size-grid .table-size-cell');

    cells.forEach(cell => {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        if (r <= row && c <= col) {
            cell.classList.add('highlighted');
        } else {
            cell.classList.remove('highlighted');
        }
    });

    if (row >= 0 && col >= 0) {
        label.textContent = `${col + 1} × ${row + 1}`;
    } else {
        label.textContent = 'Select size';
    }
}

function insertTable(rows, cols) {
    const picker = document.getElementById('table-size-picker');
    if (picker) picker.style.display = 'none';
    closeSlashMenu();

    if (!quill) return;
    const idx = _tableSizePickerIdx || (quill.getSelection() ? quill.getSelection().index : quill.getLength() - 1);

    // Build inner HTML for the table (without the wrapper div — the blot creates that)
    let innerHtml = '<table class="notion-table"><thead><tr>';
    for (let c = 0; c < cols; c++) {
        innerHtml += `<th contenteditable="true">Column ${c + 1}</th>`;
    }
    innerHtml += '</tr></thead><tbody>';
    for (let r = 0; r < rows - 1; r++) {
        innerHtml += '<tr>';
        for (let c = 0; c < cols; c++) {
            innerHtml += '<td contenteditable="true"></td>';
        }
        innerHtml += '</tr>';
    }
    innerHtml += '</tbody></table>';
    innerHtml += '<div class="notion-table-actions">';
    innerHtml += '<button data-table-action="add-row" title="Add Row"><span class="material-symbols-rounded">add</span> Row</button>';
    innerHtml += '<button data-table-action="add-col" title="Add Column"><span class="material-symbols-rounded">add</span> Column</button>';
    innerHtml += '<button data-table-action="remove-row" title="Remove Row"><span class="material-symbols-rounded">remove</span> Row</button>';
    innerHtml += '<button data-table-action="remove-col" title="Remove Column"><span class="material-symbols-rounded">remove</span> Column</button>';
    innerHtml += '</div>';

    // Use insertEmbed so the registered TableWrapperBlot handles it
    quill.insertEmbed(idx, 'notion-table', innerHtml, 'user');
    quill.setSelection(idx + 1, 0);
    quill.focus();

    // Attach table action handlers via event delegation (after next paint)
    setTimeout(() => {
        attachTableActionHandlers();
    }, 50);
}

// Re-attach handlers to all table action buttons (idempotent — uses data flag)
function attachTableActionHandlers() {
    if (!quill) return;
    quill.root.querySelectorAll('.notion-table-wrapper .notion-table-actions button[data-table-action]').forEach(btn => {
        if (btn._tableHandlerBound) return;
        btn._tableHandlerBound = true;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.tableAction;
            if (action === 'add-row') addTableRow(btn);
            else if (action === 'add-col') addTableCol(btn);
            else if (action === 'remove-row') removeTableRow(btn);
            else if (action === 'remove-col') removeTableCol(btn);
        });
    });
}

// Table manipulation functions
function addTableRow(btn) {
    const wrapper = btn.closest('.notion-table-wrapper');
    const table = wrapper.querySelector('table');
    const tbody = table.querySelector('tbody') || table;
    const cols = table.querySelector('tr').children.length;
    const row = document.createElement('tr');
    for (let i = 0; i < cols; i++) {
        const td = document.createElement('td');
        td.contentEditable = 'true';
        row.appendChild(td);
    }
    tbody.appendChild(row);
}

function addTableCol(btn) {
    const wrapper = btn.closest('.notion-table-wrapper');
    const table = wrapper.querySelector('table');
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, i) => {
        const cell = document.createElement(i === 0 ? 'th' : 'td');
        cell.contentEditable = 'true';
        if (i === 0) cell.textContent = `Col ${row.children.length + 1}`;
        row.appendChild(cell);
    });
}

function removeTableRow(btn) {
    const wrapper = btn.closest('.notion-table-wrapper');
    const table = wrapper.querySelector('table');
    const rows = table.querySelectorAll('tbody tr');
    if (rows.length > 0) rows[rows.length - 1].remove();
}

function removeTableCol(btn) {
    const wrapper = btn.closest('.notion-table-wrapper');
    const table = wrapper.querySelector('table');
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        if (row.children.length > 1) row.lastElementChild.remove();
    });
}

// --- Floating Toolbar (on text selection) ---
function initFloatingToolbar() {
    const ft = document.getElementById('floating-toolbar');
    if (!ft || !quill) return;

    // Selection change → show/hide toolbar
    quill.on('selection-change', (range, oldRange, source) => {
        if (range && range.length > 0) {
            showFloatingToolbar(range);
        } else {
            hideFloatingToolbar();
        }
    });

    // Format buttons
    ft.querySelectorAll('button[data-format]').forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault(); // prevent losing selection
            const format = btn.dataset.format;
            const value = btn.dataset.value;

            if (format === 'color' || format === 'background') {
                showFTColorPicker(format, btn);
                return;
            }

            const sel = quill.getSelection();
            if (!sel) return;

            if (format === 'link') {
                const currentLink = quill.getFormat(sel).link;
                const url = prompt('Enter URL:', currentLink || 'https://');
                if (url !== null) {
                    quill.format('link', url || false, 'user');
                }
            } else if (format === 'header') {
                const currentHeader = quill.getFormat(sel).header;
                const newVal = parseInt(value);
                quill.format('header', currentHeader === newVal ? false : newVal, 'user');
            } else if (format === 'list') {
                const currentList = quill.getFormat(sel).list;
                quill.format('list', currentList === value ? false : value, 'user');
            } else if (format === 'blockquote') {
                const cur = quill.getFormat(sel).blockquote;
                quill.format('blockquote', !cur, 'user');
            } else if (format === 'code') {
                const cur = quill.getFormat(sel).code;
                quill.format('code', !cur, 'user');
            } else {
                const cur = quill.getFormat(sel)[format];
                quill.format(format, !cur, 'user');
            }

            updateFTActiveStates();
        });
    });
}

function showFloatingToolbar(range) {
    const ft = document.getElementById('floating-toolbar');
    if (!ft || !quill) return;

    const bounds = quill.getBounds(range.index, range.length);
    const editorRect = quill.root.closest('.ql-container').getBoundingClientRect();

    const top = editorRect.top + bounds.top - ft.offsetHeight - 8;
    const left = editorRect.left + bounds.left + (bounds.width / 2) - (ft.offsetWidth / 2);

    // Clamp to viewport
    const clampLeft = Math.max(8, Math.min(left, window.innerWidth - ft.offsetWidth - 8));
    const clampTop = top < 8 ? editorRect.top + bounds.top + bounds.height + 8 : top;

    ft.style.top = clampTop + 'px';
    ft.style.left = clampLeft + 'px';
    ft.style.display = 'flex';

    updateFTActiveStates();
}

function hideFloatingToolbar() {
    const ft = document.getElementById('floating-toolbar');
    if (ft) ft.style.display = 'none';

    const cp = document.getElementById('ft-color-picker');
    if (cp) cp.style.display = 'none';
}

function updateFTActiveStates() {
    const ft = document.getElementById('floating-toolbar');
    if (!ft || !quill) return;
    const sel = quill.getSelection();
    if (!sel) return;
    const fmt = quill.getFormat(sel);

    ft.querySelectorAll('button[data-format]').forEach(btn => {
        const format = btn.dataset.format;
        const value = btn.dataset.value;
        let active = false;

        if (format === 'header') {
            active = fmt.header === parseInt(value);
        } else if (format === 'list') {
            active = fmt.list === value;
        } else if (format === 'color' || format === 'background') {
            active = !!fmt[format];
        } else {
            active = !!fmt[format];
        }

        btn.classList.toggle('ft-active', active);
    });
}

// --- Color Picker for floating toolbar ---
const FT_COLORS = [
    '#000000', '#434343', '#666666', '#999999', '#cccccc',
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6',
    '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#84cc16',
    null // null = remove color
];

function showFTColorPicker(formatType, anchorBtn) {
    const picker = document.getElementById('ft-color-picker');
    const grid = document.getElementById('ft-color-grid');
    if (!picker || !grid) return;

    grid.innerHTML = '';
    FT_COLORS.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'ft-color-swatch';
        if (color) {
            swatch.style.background = color;
        } else {
            swatch.style.background = 'var(--bg-editor)';
            swatch.style.borderColor = 'var(--border)';
            swatch.title = 'Remove';
            swatch.innerHTML = '✕';
            swatch.style.display = 'flex';
            swatch.style.alignItems = 'center';
            swatch.style.justifyContent = 'center';
            swatch.style.fontSize = '10px';
            swatch.style.color = 'var(--text-muted)';
        }
        swatch.addEventListener('mousedown', (e) => {
            e.preventDefault();
            quill.format(formatType, color, 'user');
            picker.style.display = 'none';
        });
        grid.appendChild(swatch);
    });

    const rect = anchorBtn.getBoundingClientRect();
    picker.style.top = (rect.bottom + 4) + 'px';
    picker.style.left = (rect.left - 40) + 'px';
    picker.style.display = 'block';
}


// --- Block Handle (+ button on hover) ---
function initBlockHandle() {
    const handle = document.getElementById('block-handle');
    if (!handle || !quill) return;

    const addBtn = handle.querySelector('.block-handle-btn');

    let hoveredLine = -1;

    // Show handle on mousemove over editor
    quill.root.addEventListener('mousemove', (e) => {
        const editorRect = quill.root.getBoundingClientRect();
        const containerRect = quill.root.closest('.ql-container').getBoundingClientRect();

        // Find which block element the mouse is over
        const y = e.clientY;
        const blocks = quill.root.querySelectorAll(':scope > *');
        let found = false;

        for (const block of blocks) {
            const rect = block.getBoundingClientRect();
            if (y >= rect.top && y <= rect.bottom) {
                const handleLeft = containerRect.left + 8;
                const handleTop = rect.top + (rect.height / 2) - 14;

                handle.style.left = handleLeft + 'px';
                handle.style.top = handleTop + 'px';
                handle.classList.add('visible');
                handle.style.display = 'flex';

                // Store the blot index for insertion
                const blot = Quill.find(block);
                if (blot) {
                    const idx = quill.getIndex(blot);
                    hoveredLine = idx;
                }

                found = true;
                break;
            }
        }

        if (!found) {
            handle.classList.remove('visible');
        }
    });

    // Hide when mouse leaves editor area
    quill.root.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!handle.matches(':hover')) {
                handle.classList.remove('visible');
            }
        }, 300);
    });

    // + button opens slash menu at that line
    addBtn.addEventListener('click', () => {
        if (hoveredLine >= 0) {
            quill.setSelection(hoveredLine, 0);
            // Simulate slash: insert `/` and trigger menu
            quill.insertText(hoveredLine, '/', 'user');
            slashStartIndex = hoveredLine;
            openSlashMenu();
        }
    });

    // --- Drag and Reorder Blocks ---
    const dragBtn = handle.querySelector('.block-drag-btn');
    let draggedBlock = null;
    let dragPlaceholder = null;

    if (dragBtn) {
        dragBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (hoveredLine < 0) return;

            // Find the block element being dragged
            const blocks = quill.root.querySelectorAll(':scope > *');
            for (const block of blocks) {
                const blot = Quill.find(block);
                if (blot && quill.getIndex(blot) === hoveredLine) {
                    draggedBlock = block;
                    break;
                }
            }
            if (!draggedBlock) return;

            draggedBlock.classList.add('block-dragging');
            handle.classList.remove('visible');

            const onMouseMove = (moveE) => {
                const y = moveE.clientY;
                // Clear previous drop indicators
                quill.root.querySelectorAll('.block-drag-over').forEach(el => el.classList.remove('block-drag-over'));

                // Find which block we're hovering over
                const allBlocks = quill.root.querySelectorAll(':scope > *');
                for (const block of allBlocks) {
                    if (block === draggedBlock) continue;
                    const rect = block.getBoundingClientRect();
                    if (y >= rect.top && y <= rect.bottom) {
                        const mid = rect.top + rect.height / 2;
                        if (y < mid) {
                            block.classList.add('block-drag-over');
                        } else {
                            // Show indicator on the next sibling or on this block's bottom
                            const next = block.nextElementSibling;
                            if (next && next !== draggedBlock) {
                                next.classList.add('block-drag-over');
                            } else {
                                block.classList.add('block-drag-over');
                            }
                        }
                        dragPlaceholder = block;
                        break;
                    }
                }
            };

            const onMouseUp = (upE) => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                // Clear visuals
                if (draggedBlock) draggedBlock.classList.remove('block-dragging');
                quill.root.querySelectorAll('.block-drag-over').forEach(el => el.classList.remove('block-drag-over'));

                if (!draggedBlock || !dragPlaceholder || draggedBlock === dragPlaceholder) {
                    draggedBlock = null;
                    dragPlaceholder = null;
                    return;
                }

                // Determine source and target indices in Quill delta
                const srcBlot = Quill.find(draggedBlock);
                const dstBlot = Quill.find(dragPlaceholder);
                if (!srcBlot || !dstBlot) {
                    draggedBlock = null;
                    dragPlaceholder = null;
                    return;
                }

                const srcIdx = quill.getIndex(srcBlot);
                const srcLen = srcBlot.length();
                const dstIdx = quill.getIndex(dstBlot);

                // Get the content of the dragged block
                const draggedContent = quill.getContents(srcIdx, srcLen);

                // Perform the move: delete source, then insert at destination
                if (srcIdx < dstIdx) {
                    // Moving down: insert first, then delete
                    quill.updateContents({
                        ops: [
                            { retain: srcIdx },
                            { delete: srcLen },
                        ]
                    }, 'user');
                    const adjustedDst = dstIdx - srcLen;
                    const insertOps = [{ retain: adjustedDst }];
                    draggedContent.ops.forEach(op => insertOps.push(op));
                    quill.updateContents({ ops: insertOps }, 'user');
                } else {
                    // Moving up: delete first, then insert
                    quill.updateContents({
                        ops: [
                            { retain: srcIdx },
                            { delete: srcLen },
                        ]
                    }, 'user');
                    const insertOps = [{ retain: dstIdx }];
                    draggedContent.ops.forEach(op => insertOps.push(op));
                    quill.updateContents({ ops: insertOps }, 'user');
                }

                draggedBlock = null;
                dragPlaceholder = null;
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }
}

// Global scanner for markdown code blocks
function scanAndFormatCodeBlocks(quillInstance) {
    const fullText = quillInstance.getText();
    // Improved regex to capture code blocks more reliably
    // Matches: ```lang (optional) + newline(s) + content + newline(s) + ```
    // Also handles cases with spaces/tabs around backticks
    const codeBlockRegex = /```\s*([a-zA-Z0-9+\-#]*)\s*[\r\n]+([\s\S]*?)[\r\n]+\s*```/g;

    const matches = [];
    let match;
    while ((match = codeBlockRegex.exec(fullText)) !== null) {
        matches.push({
            index: match.index,
            length: match[0].length,
            lang: match[1] || '',
            content: match[2],
            fullMatch: match[0]
        });
    }

    if (matches.length > 0) {
        // Process in reverse order to avoid index invalidation
        matches.reverse().forEach(match => {
            // Re-verify text in case of race conditions
            // (Simple check since we are synchronous mostly)
            const currentTextLen = quillInstance.getLength();
            if (match.index + match.length <= currentTextLen) {
                quillInstance.deleteText(match.index, match.length, 'silent');
                quillInstance.insertText(match.index, match.content, 'silent');
                quillInstance.formatLine(match.index, match.content.length, 'code-block', true, 'silent');
            }
        });

        setTimeout(highlightCodeBlocks, 100);
    }
}

function handleMagicFormatting(quillInstance) {
    const selection = quillInstance.getSelection();
    if (!selection) return;

    // Get the current line content
    const [line, offset] = quillInstance.getLine(selection.index);
    if (!line) return;

    const text = line.domNode.textContent;
    const trimmedText = text.trim();
    const lineStart = quillInstance.getIndex(line);

    // --- 1. JSON Detection & Formatting ---
    // Check if it looks like a JSON object or array
    if ((trimmedText.startsWith('{') && trimmedText.endsWith('}')) ||
        (trimmedText.startsWith('[') && trimmedText.endsWith(']'))) {
        try {
            const parsed = JSON.parse(trimmedText);
            // Basic validation: ensure it's not just "[]" or "{}" or a simple number
            if ((typeof parsed === 'object' && parsed !== null) &&
                (Object.keys(parsed).length > 0 || Array.isArray(parsed))) {

                const formattedJSON = JSON.stringify(parsed, null, 2);
                replaceWithCodeBlock(quillInstance, lineStart, text.length, formattedJSON, 'json');
                return;
            }
        } catch (e) {
            // Not valid JSON
        }
    }

    // --- 2. HTML Detection & Formatting ---
    // Look for standard HTML tags or full structures
    const isHTML = /<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>|<([a-z][a-z0-9]*)\b[^>]*\/>/i.test(trimmedText);
    const hasTags = /<[a-z][\s\S]*>/i.test(trimmedText) && (trimmedText.includes('</') || trimmedText.includes('/>'));

    if ((isHTML || hasTags) && trimmedText.length > 5) {
        const formattedHTML = formatHTML(trimmedText);
        replaceWithCodeBlock(quillInstance, lineStart, text.length, formattedHTML, 'html');
        return;
    }

    // --- 3. Explicit Code Fence (```lang) ---
    const codeFenceMatch = text.match(/^```(\w+)?$/);
    if (codeFenceMatch && offset === text.length) {
        const lang = codeFenceMatch[1] || '';
        quillInstance.deleteText(lineStart, text.length);

        // Enter code block mode
        quillInstance.insertText(lineStart, '\n', 'user');
        quillInstance.formatLine(lineStart, 1, 'code-block', true, 'user');

        // Move selection to start of line
        quillInstance.setSelection(lineStart, 0, 'silent');
        return;
    }

    // --- 4. Programming Language Detection ---
    // We only trigger this if the line is substantial (prevent false positives on short text)
    if (trimmedText.length > 10) {
        const patterns = [
            // JS/TS
            { lang: 'javascript', regex: /^(const|let|var|function|class|import|export|if|for|while|return|async|await|=>)\s/ },
            { lang: 'javascript', regex: /console\.(log|error|warn|info)\(/ },
            // Python
            { lang: 'python', regex: /^(def|class|import|from|if|elif|else:|for|while|try:|except:|print)\s/ },
            // SQL
            { lang: 'sql', regex: /^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|FROM|WHERE|JOIN)\s/i },
            // Bash
            { lang: 'bash', regex: /^(npm|pip|git|docker|sudo|apt|brew|cd|ls|echo|cat)\s/ },
            // PHP
            { lang: 'php', regex: /^(\$|function|class|public|private|protected|namespace|echo)\s/ },
            // CSS
            { lang: 'css', regex: /^([.#]?[a-zA-Z0-9_-]+)\s*\{/ }
        ];

        for (const pattern of patterns) {
            if (pattern.regex.test(trimmedText)) {
                // Check if already in code block
                const format = quillInstance.getFormat(lineStart);
                if (!format['code-block']) {
                    replaceWithCodeBlock(quillInstance, lineStart, text.length, text, pattern.lang);
                    return;
                }
            }
        }
    }

    // --- 5. Markdown Shortcuts ---
    handleMarkdownShortcuts(quillInstance, text, lineStart, offset);
}

// Helper: Replace text range with a formatted code block
function replaceWithCodeBlock(quill, index, length, content, language) {
    // Delete original text
    quill.deleteText(index, length);

    // Insert new content
    // We update content with newline if needed, but usually just proper formatting
    quill.insertText(index, content);

    // Apply code-block format to the inserted range
    quill.formatLine(index, content.length, 'code-block', true);

    // Trigger highlight
    setTimeout(highlightCodeBlocks, 10);
}

// Helper: Simple HTML Formatter
function formatHTML(html) {
    let formatted = '';
    const pad = '  ';
    let indent = 0;
    // Split by tags but keep delimiters
    const tokens = html.split(/(<[^>]+>)/).filter(s => s.trim().length > 0);

    tokens.forEach(token => {
        let padding = '';
        if (token.match(/^<\//)) indent = Math.max(0, indent - 1);

        for (let i = 0; i < indent; i++) padding += pad;

        // Don't modify content inside tags too much, just indentation
        formatted += padding + token + '\n';

        // Increase indent for opening tags that aren't self-closing or void
        if (token.match(/^<[a-z]/i) &&
            !token.match(/\/>$/) &&
            !token.match(/^(<br|<hr|<img|<input|<meta|<link)/i) &&
            !token.match(/^<\//)) {
            indent++;
        }
    });
    return formatted.trim();
}

function handleMarkdownShortcuts(quill, text, lineStart, offset) {
    // Headers (#)
    const headerMatch = text.match(/^(#{1,6})\s/);
    if (headerMatch && offset === headerMatch[0].length) {
        quill.deleteText(lineStart, headerMatch[0].length);
        quill.formatLine(lineStart, 1, 'header', headerMatch[1].length);
    }

    // Blockquote (>)
    if (text.match(/^>\s/) && offset === 2) {
        quill.deleteText(lineStart, 2);
        quill.formatLine(lineStart, 1, 'blockquote', true);
    }

    // Bullet List (-, *)
    if (text.match(/^[-*]\s/) && offset === 2) {
        quill.deleteText(lineStart, 2);
        quill.formatLine(lineStart, 1, 'list', 'bullet');
    }

    // Ordered List (1.)
    const orderedMatch = text.match(/^1\.\s/);
    if (orderedMatch && offset === 3) {
        quill.deleteText(lineStart, 3);
        quill.formatLine(lineStart, 1, 'list', 'ordered');
    }

    // Task List ([ ])
    const taskMatch = text.match(/^\[\s?\]\s/);
    if (taskMatch && offset === taskMatch[0].length) {
        quill.deleteText(lineStart, taskMatch[0].length);
        quill.formatLine(lineStart, 1, 'list', 'check');
    }
}

async function init() {
    // Load settings from SQLite
    const settings = DevNotebookDB.getSettings(['theme', 'activeWorkspaceId', 'activeProjectId', 'activeItemType', 'aiDockVisible']);

    // Theme
    currentTheme = settings.theme || 'light';
    applyTheme(currentTheme);
    try { localStorage.setItem('devnotebook-theme', currentTheme); } catch(e) {}

    // Todos from SQLite
    todos = DevNotebookDB.getTodos().map(t => ({
        id: t.id, text: t.text,
        completed: !!t.completed,
        createdAt: t.created_at,
        completedAt: t.completed_at
    }));
    renderTodoList();

    // Load workspaces from SQLite
    const allWs = DevNotebookDB.getWorkspaces();

    if (allWs.length === 0) {
        // Create default workspace + project
        const wsId = 'ws_' + Date.now();
        const projId = 'proj_' + Date.now();
        DevNotebookDB.createWorkspace(wsId, 'Personal');
        DevNotebookDB.createProject(projId, wsId, 'General');
        activeWorkspaceId = wsId;
        activeProjectId = projId;
        DevNotebookDB.setSettings({ activeWorkspaceId: wsId, activeProjectId: projId });
        console.log('Created default workspace.');
    } else {
        activeWorkspaceId = settings.activeWorkspaceId || allWs[0].id;

        // Validate workspace exists
        const wsExists = allWs.find(w => w.id === activeWorkspaceId);
        if (!wsExists) activeWorkspaceId = allWs[0].id;

        const projects = DevNotebookDB.getProjects(activeWorkspaceId);
        if (projects.length > 0) {
            activeProjectId = settings.activeProjectId || projects[0].id;
            // Validate project exists in this workspace
            if (!projects.find(p => p.id === activeProjectId)) {
                activeProjectId = projects[0].id;
            }
        } else {
            const projId = 'proj_' + Date.now();
            DevNotebookDB.createProject(projId, activeWorkspaceId, 'General');
            activeProjectId = projId;
        }
    }

    // Restore active item type
    if (settings.activeItemType) {
        activeItemType = settings.activeItemType;
        resourceTabs.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === activeItemType);
        });
    }

    // Restore AI dock visibility
    const aiVis = settings.aiDockVisible;
    if (aiVis !== undefined && aiVis !== null && aiDock) {
        setAIDockVisibility(aiVis, { persist: false });
    } else if (aiDock) {
        setAIDockVisibility(false, { persist: false });
    }

    // Restore chat history from SQLite
    const chatRows = DevNotebookDB.getChatHistory();
    if (chatRows.length > 0) {
        chatHistory = chatRows.map(r => {
            let content = r.content;
            try { content = JSON.parse(content); } catch {}
            return { role: r.role, content };
        });
        renderChatHistory();
    }

    // Render UI
    renderSidebarControls();
    renderItemsList();

    // Initialize bookmark manager
    initBookmarkManager();

    // Show dashboard on load with browser bookmarks
    showDashboard();
}

// --- Dashboard ---
function showDashboard() {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;

    // Hide all editors
    document.querySelectorAll('.view-pane').forEach(el => el.classList.add('hidden'));
    const quillToolbar = document.querySelector('.ql-toolbar');
    if (quillToolbar) quillToolbar.style.display = 'none';

    // Show dashboard
    dashboard.classList.add('active');
    document.body.classList.add('dashboard-mode');

    // Set greeting
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';
    document.getElementById('dashboard-greeting-text').textContent = greeting;

    // Set date
    const now = new Date();
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dashboard-date').textContent = now.toLocaleDateString('en-US', opts);

    // Load local bookmarks
    renderDashboardBookmarks();

    // Load browser bookmarks
    renderBrowserBookmarks();
}

function hideDashboard() {
    const dashboard = document.getElementById('dashboard');
    if (dashboard) dashboard.classList.remove('active');
}

function renderDashboardBookmarks(folderId) {
    const grid = document.getElementById('dashboard-bookmark-grid');
    const backBtn = document.getElementById('dashboard-bookmarks-back');
    if (!grid) return;

    if (!activeProjectId) {
        grid.innerHTML = `
            <div class="bookmark-card-empty">
                <span class="material-symbols-rounded">bookmark_border</span>
                Select a project to see bookmarks.
            </div>`;
        return;
    }

    // Get folders and bookmarks from local DB
    const parentFolderId = folderId || null;
    const folders = DevNotebookDB.getBookmarkFolders(activeProjectId, parentFolderId);
    let bookmarks;
    if (folderId) {
        bookmarks = DevNotebookDB.getBookmarksByFolder(activeProjectId, folderId);
    } else {
        // Show unfiled bookmarks at root level
        bookmarks = DevNotebookDB.getBookmarksByFolder(activeProjectId, null);
    }

    grid.innerHTML = '';

    // Show back button if inside a folder
    if (backBtn) {
        backBtn.style.display = folderId ? 'flex' : 'none';
    }

    // Update section title with folder name
    const sectionTitle = document.getElementById('dashboard-bm-section-title');
    if (sectionTitle) {
        if (folderId) {
            const currentFolder = DevNotebookDB.getBookmarkFolder(folderId);
            sectionTitle.textContent = currentFolder ? currentFolder.name : 'Bookmarks';
        } else {
            sectionTitle.textContent = 'Bookmarks';
        }
    }

    if (folders.length === 0 && bookmarks.length === 0) {
        grid.innerHTML = `
            <div class="bookmark-card-empty">
                <span class="material-symbols-rounded">bookmark_border</span>
                No bookmarks yet. Click <strong>Add Bookmark</strong> to create one.
            </div>`;
        return;
    }

    // Render folders first
    folders.forEach(folder => {
        const card = document.createElement('div');
        card.className = 'bookmark-card bookmark-folder-card';
        card.dataset.folderId = folder.id;
        const items = DevNotebookDB.getBookmarksByFolder(activeProjectId, folder.id);
        const count = items.length;
        card.innerHTML = `
            <div class="bookmark-card-favicon bookmark-folder-icon">
                <span class="material-symbols-rounded">folder</span>
            </div>
            <div class="bookmark-card-info">
                <div class="bookmark-card-title">${escapeHtml(folder.name || 'Untitled Folder')}</div>
                <div class="bookmark-card-url">${count} item${count !== 1 ? 's' : ''}</div>
            </div>
            <span class="bm-folder-badge">${count}</span>
            <span class="material-symbols-rounded bookmark-card-arrow">chevron_right</span>
            <div class="bookmark-card-actions">
                <button class="bookmark-card-action-btn" title="Rename folder" data-action="rename" data-folder-id="${folder.id}">
                    <span class="material-symbols-rounded">edit</span>
                </button>
                <button class="bookmark-card-action-btn danger" title="Delete folder" data-action="delete" data-folder-id="${folder.id}">
                    <span class="material-symbols-rounded">close</span>
                </button>
            </div>
        `;
        card.addEventListener('click', (e) => {
            if (e.target.closest('.bookmark-card-actions')) return;
            navigateBookmarkFolder(folder.id);
        });
        // Rename folder handler
        card.querySelector('[data-action="rename"]').addEventListener('click', (e) => {
            e.stopPropagation();
            const newName = prompt('Rename folder:', folder.name);
            if (newName === null || !newName.trim()) return;
            DevNotebookDB.updateBookmarkFolder(folder.id, { name: newName.trim() });
            const currentFolderId = _bmFolderHistory.length > 0
                ? _bmFolderHistory[_bmFolderHistory.length - 1]
                : undefined;
            renderDashboardBookmarks(currentFolderId);
            showNotification('Folder renamed');
        });
        // Delete folder handler
        card.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
            e.stopPropagation();
            if (!confirm('Delete this folder? Bookmarks inside will become unfiled.')) return;
            DevNotebookDB.deleteBookmarkFolder(folder.id);
            const currentFolderId = _bmFolderHistory.length > 0
                ? _bmFolderHistory[_bmFolderHistory.length - 1]
                : undefined;
            renderDashboardBookmarks(currentFolderId);
            showNotification('Folder deleted');
        });
        grid.appendChild(card);
    });

    // Render bookmark links
    bookmarks.forEach(bm => {
        const card = document.createElement('div');
        card.className = 'bookmark-card';
        card.dataset.bmId = bm.id;
        card.dataset.url = bm.url || '';
        const favicon = bm.url ? getFaviconUrl(bm.url) : '';
        card.innerHTML = `
            <div class="bookmark-card-favicon">
                ${favicon ? `<img src="${favicon}" alt="">` : ''}
                <span class="material-symbols-rounded" ${favicon ? 'style="display:none"' : ''}>language</span>
            </div>
            <div class="bookmark-card-info">
                <div class="bookmark-card-title">${escapeHtml(bm.title || bm.url || 'Untitled')}</div>
                <div class="bookmark-card-url">${escapeHtml(bm.url ? getDomain(bm.url) : '')}</div>
            </div>
            <div class="bookmark-card-actions">
                <button class="bookmark-card-action-btn" title="Move to folder" data-action="move" data-bm-id="${bm.id}">
                    <span class="material-symbols-rounded">drive_file_move</span>
                </button>
                <button class="bookmark-card-action-btn" title="Edit bookmark" data-action="edit" data-bm-id="${bm.id}">
                    <span class="material-symbols-rounded">edit</span>
                </button>
                <button class="bookmark-card-action-btn danger" title="Delete bookmark" data-action="delete" data-bm-id="${bm.id}">
                    <span class="material-symbols-rounded">close</span>
                </button>
            </div>
        `;
        // Click to open URL (but not when clicking actions)
        card.addEventListener('click', (e) => {
            if (e.target.closest('.bookmark-card-actions')) return;
            if (bm.url) window.open(bm.url, '_blank');
        });
        // Handle favicon error
        const img = card.querySelector('img');
        if (img) {
            img.addEventListener('error', function() {
                this.style.display = 'none';
                this.nextElementSibling.style.display = 'flex';
            });
        }
        // Move to folder handler
        card.querySelector('[data-action="move"]').addEventListener('click', (e) => {
            e.stopPropagation();
            _showMoveToFolderMenu(bm.id, card);
        });
        // Edit bookmark handler
        card.querySelector('[data-action="edit"]').addEventListener('click', (e) => {
            e.stopPropagation();
            dashboardBmShowPopup(bm.id);
        });
        // Delete bookmark handler
        card.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
            e.stopPropagation();
            if (!confirm('Delete this bookmark?')) return;
            DevNotebookDB.deleteItem(bm.id);
            const currentFolderId = _bmFolderHistory.length > 0
                ? _bmFolderHistory[_bmFolderHistory.length - 1]
                : undefined;
            renderDashboardBookmarks(currentFolderId);
            renderItemsList();
            showNotification('Bookmark deleted');
        });
        grid.appendChild(card);
    });

    // Setup drag & drop
    _setupBookmarkDragDrop(grid);
}

// --- Drag & Drop for local bookmarks into folders ---
function _setupBookmarkDragDrop(grid) {
    const dropzone = document.getElementById('dashboard-bm-dropzone');
    const currentFolderId = _bmFolderHistory.length > 0
        ? _bmFolderHistory[_bmFolderHistory.length - 1]
        : null;

    // Build the folder drop targets for the drop zone bar
    function showDropZone() {
        if (!dropzone || !activeProjectId) return;
        const allFolders = DevNotebookDB.getAllBookmarkFolders(activeProjectId);
        // Show targets: "Unfiled" (root) + all folders except the current one
        let html = '';
        // If inside a folder, show "Unfiled" option to move to root
        if (currentFolderId) {
            html += `<div class="bm-dropzone-target" data-drop-folder="">
                <span class="material-symbols-rounded">home</span>
                <span>Unfiled</span>
            </div>`;
        }
        allFolders.forEach(f => {
            if (f.id === currentFolderId) return; // Skip the folder we're currently in
            html += `<div class="bm-dropzone-target" data-drop-folder="${f.id}">
                <span class="material-symbols-rounded">folder</span>
                <span>${escapeHtml(f.name)}</span>
            </div>`;
        });

        if (!html) return; // No targets to show
        dropzone.innerHTML = `<div class="bm-dropzone-label"><span class="material-symbols-rounded">drive_file_move</span> Drop into folder:</div><div class="bm-dropzone-targets">${html}</div>`;
        dropzone.style.display = 'flex';
        // Ensure the drop zone is visible to the user
        dropzone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Wire drop targets
        dropzone.querySelectorAll('.bm-dropzone-target').forEach(target => {
            target.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                target.classList.add('bm-drop-target');
            });
            target.addEventListener('dragleave', () => {
                target.classList.remove('bm-drop-target');
            });
            target.addEventListener('drop', (e) => {
                e.preventDefault();
                target.classList.remove('bm-drop-target');
                const bmId = e.dataTransfer.getData('text/plain');
                const targetFolderId = target.dataset.dropFolder;
                if (!bmId) return;
                DevNotebookDB.updateItem(bmId, { folder_id: targetFolderId || null });
                hideDropZone();
                const viewFolderId = _bmFolderHistory.length > 0
                    ? _bmFolderHistory[_bmFolderHistory.length - 1]
                    : undefined;
                renderDashboardBookmarks(viewFolderId);
                bmRenderBookmarks();
                bmRenderFolders();
                const folderName = targetFolderId
                    ? (DevNotebookDB.getBookmarkFolder(targetFolderId)?.name || 'folder')
                    : 'Unfiled';
                showNotification(`Moved to ${folderName}`);
            });
        });
    }

    function hideDropZone() {
        if (dropzone) {
            dropzone.style.display = 'none';
            dropzone.innerHTML = '';
        }
    }

    // Make bookmark cards draggable
    const bmCards = grid.querySelectorAll('.bookmark-card:not(.bookmark-folder-card)');
    bmCards.forEach(card => {
        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', (e) => {
            const bmId = card.dataset.bmId;
            if (!bmId) { e.preventDefault(); return; }
            e.dataTransfer.setData('text/plain', bmId);
            e.dataTransfer.setData('application/x-bookmark-id', bmId);
            e.dataTransfer.effectAllowed = 'move';
            setTimeout(() => {
                card.classList.add('bm-dragging');
                grid.classList.add('bm-drag-active');
                showDropZone();
            }, 0);
        });
        card.addEventListener('dragend', () => {
            card.classList.remove('bm-dragging');
            grid.classList.remove('bm-drag-active');
            grid.querySelectorAll('.bm-drop-before, .bm-drop-after').forEach(el => {
                el.classList.remove('bm-drop-before', 'bm-drop-after');
            });
            document.querySelectorAll('.bm-drop-target').forEach(el => el.classList.remove('bm-drop-target'));
            hideDropZone();
        });

        // Reorder: dragover on sibling bookmark cards
        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (card.classList.contains('bm-dragging')) return;

            // Remove old indicators from all cards
            grid.querySelectorAll('.bm-drop-before, .bm-drop-after').forEach(el => {
                el.classList.remove('bm-drop-before', 'bm-drop-after');
            });

            // Determine if we should insert before or after this card
            const rect = card.getBoundingClientRect();
            const midX = rect.left + rect.width / 2;
            const insertBefore = e.clientX < midX;

            card.classList.add(insertBefore ? 'bm-drop-before' : 'bm-drop-after');
            card._bmInsertBefore = insertBefore;
        });

        card.addEventListener('dragleave', (e) => {
            if (!card.contains(e.relatedTarget)) {
                card.classList.remove('bm-drop-before', 'bm-drop-after');
            }
        });

        // Reorder: drop on sibling bookmark card
        card.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const draggedBmId = e.dataTransfer.getData('text/plain');
            if (!draggedBmId || draggedBmId === card.dataset.bmId) return;

            grid.querySelectorAll('.bm-drop-before, .bm-drop-after').forEach(el => {
                el.classList.remove('bm-drop-before', 'bm-drop-after');
            });
            hideDropZone();

            // Compute new order: collect current card order, move dragged card
            const allCards = Array.from(grid.querySelectorAll('.bookmark-card:not(.bookmark-folder-card)'));
            const orderedIds = allCards.map(c => c.dataset.bmId).filter(Boolean);

            // Remove dragged from current position
            const fromIdx = orderedIds.indexOf(draggedBmId);
            if (fromIdx === -1) return;
            orderedIds.splice(fromIdx, 1);

            // Find target position
            const targetIdx = orderedIds.indexOf(card.dataset.bmId);
            if (targetIdx === -1) return;
            const insertIdx = card._bmInsertBefore ? targetIdx : targetIdx + 1;
            orderedIds.splice(insertIdx, 0, draggedBmId);

            // Assign sort_order descending (highest = first shown)
            const total = orderedIds.length;
            orderedIds.forEach((id, i) => {
                DevNotebookDB.updateItem(id, { sort_order: total - i });
            });

            const viewFolderId = _bmFolderHistory.length > 0
                ? _bmFolderHistory[_bmFolderHistory.length - 1]
                : undefined;
            renderDashboardBookmarks(viewFolderId);
            showNotification('Bookmarks reordered');
        });
    });

    // Also allow reorder drop on the grid itself (for dropping at the end)
    grid.addEventListener('dragover', (e) => {
        if (e.target === grid || e.target.closest('.bookmark-card') === null) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }
    });
    grid.addEventListener('drop', (e) => {
        if (e.target !== grid && e.target.closest('.bookmark-card') !== null) return;
        e.preventDefault();
        const draggedBmId = e.dataTransfer.getData('text/plain');
        if (!draggedBmId) return;

        grid.querySelectorAll('.bm-drop-before, .bm-drop-after').forEach(el => {
            el.classList.remove('bm-drop-before', 'bm-drop-after');
        });
        hideDropZone();

        // Move dragged to end
        const allCards = Array.from(grid.querySelectorAll('.bookmark-card:not(.bookmark-folder-card)'));
        const orderedIds = allCards.map(c => c.dataset.bmId).filter(Boolean);
        const fromIdx = orderedIds.indexOf(draggedBmId);
        if (fromIdx === -1) return;
        orderedIds.splice(fromIdx, 1);
        orderedIds.push(draggedBmId);

        const total = orderedIds.length;
        orderedIds.forEach((id, i) => {
            DevNotebookDB.updateItem(id, { sort_order: total - i });
        });

        const viewFolderId = _bmFolderHistory.length > 0
            ? _bmFolderHistory[_bmFolderHistory.length - 1]
            : undefined;
        renderDashboardBookmarks(viewFolderId);
        showNotification('Bookmarks reordered');
    });

    // Make folder cards drop targets
    grid.querySelectorAll('.bookmark-folder-card').forEach(folderCard => {
        folderCard.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'move';
            folderCard.classList.add('bm-drop-target');
        });
        folderCard.addEventListener('dragleave', (e) => {
            // Only remove highlight if we're actually leaving the folder card
            if (!folderCard.contains(e.relatedTarget)) {
                folderCard.classList.remove('bm-drop-target');
            }
        });
        folderCard.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            folderCard.classList.remove('bm-drop-target');
            const bmId = e.dataTransfer.getData('text/plain');
            const folderId = folderCard.dataset.folderId;
            if (!bmId || !folderId) return;
            // Move bookmark into this folder
            DevNotebookDB.updateItem(bmId, { folder_id: folderId });
            hideDropZone();
            const currentFolderView = _bmFolderHistory.length > 0
                ? _bmFolderHistory[_bmFolderHistory.length - 1]
                : undefined;
            renderDashboardBookmarks(currentFolderView);
            if (typeof bmRenderBookmarks === 'function') bmRenderBookmarks();
            if (typeof bmRenderFolders === 'function') bmRenderFolders();
            showNotification('Bookmark moved to folder');
        });
    });
}

// --- "Move to folder" popup menu (alternative to drag & drop) ---
function _showMoveToFolderMenu(bmId, anchorEl) {
    // Remove any existing menu
    document.querySelectorAll('.bm-move-menu').forEach(m => m.remove());

    if (!activeProjectId) return;
    const allFolders = DevNotebookDB.getAllBookmarkFolders(activeProjectId);
    const currentFolderId = _bmFolderHistory.length > 0
        ? _bmFolderHistory[_bmFolderHistory.length - 1]
        : null;

    // Get the bookmark's current folder
    const bm = DevNotebookDB.getItem(bmId);
    const bmCurrentFolder = bm ? bm.folder_id : null;

    const menu = document.createElement('div');
    menu.className = 'bm-move-menu';

    let html = '<div class="bm-move-menu-title">Move to…</div>';

    // Show "Unfiled" option if bookmark is currently in a folder
    if (bmCurrentFolder) {
        html += `<button class="bm-move-menu-item" data-target-folder="">
            <span class="material-symbols-rounded">home</span>
            <span>Unfiled (root)</span>
        </button>`;
    }

    allFolders.forEach(f => {
        if (f.id === bmCurrentFolder) return; // skip current folder
        html += `<button class="bm-move-menu-item" data-target-folder="${f.id}">
            <span class="material-symbols-rounded">folder</span>
            <span>${escapeHtml(f.name)}</span>
        </button>`;
    });

    if (!allFolders.length && !bmCurrentFolder) {
        html += '<div class="bm-move-menu-empty">No folders yet. Create one first.</div>';
    }

    menu.innerHTML = html;

    // Position the menu near the anchor element
    document.body.appendChild(menu);
    const rect = anchorEl.getBoundingClientRect();
    menu.style.top = (rect.bottom + 4) + 'px';
    menu.style.left = rect.left + 'px';

    // Adjust if menu would go off-screen
    requestAnimationFrame(() => {
        const menuRect = menu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth - 12) {
            menu.style.left = (window.innerWidth - menuRect.width - 12) + 'px';
        }
        if (menuRect.bottom > window.innerHeight - 12) {
            menu.style.top = (rect.top - menuRect.height - 4) + 'px';
        }
    });

    // Handle folder selection
    menu.querySelectorAll('.bm-move-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetFolderId = item.dataset.targetFolder;
            DevNotebookDB.updateItem(bmId, { folder_id: targetFolderId || null });
            menu.remove();
            const viewFolderId = _bmFolderHistory.length > 0
                ? _bmFolderHistory[_bmFolderHistory.length - 1]
                : undefined;
            renderDashboardBookmarks(viewFolderId);
            if (typeof bmRenderBookmarks === 'function') bmRenderBookmarks();
            if (typeof bmRenderFolders === 'function') bmRenderFolders();
            const folderName = targetFolderId
                ? (DevNotebookDB.getBookmarkFolder(targetFolderId)?.name || 'folder')
                : 'Unfiled';
            showNotification(`Moved to ${folderName}`);
        });
    });

    // Close menu on outside click
    function closeMenu(e) {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', closeMenu, true);
        }
    }
    setTimeout(() => document.addEventListener('click', closeMenu, true), 0);
}

function getFaviconUrl(url) {
    try {
        const u = new URL(url);
        return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=32`;
    } catch {
        return '';
    }
}

function getDomain(url) {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return url;
    }
}

// --- Browser Bookmarks Section ---
let _browserBmFolderHistory = [];

function renderBrowserBookmarks(folderId) {
    const grid = document.getElementById('browser-bookmark-grid');
    const backBtn = document.getElementById('browser-bookmarks-back');
    const section = document.getElementById('dashboard-browser-bookmarks-section');
    if (!grid) return;

    // Check if chrome.bookmarks API is available
    if (typeof chrome === 'undefined' || !chrome.bookmarks) {
        if (section) section.style.display = 'none';
        return;
    }
    if (section) section.style.display = '';

    const render = (nodes) => {
        grid.innerHTML = '';
        const folders = [];
        const links = [];
        nodes.forEach(node => {
            if (node.children) {
                if (node.children.length > 0) folders.push(node);
            } else if (node.url) {
                links.push(node);
            }
        });

        if (backBtn) {
            backBtn.style.display = folderId ? 'flex' : 'none';
        }

        if (folders.length === 0 && links.length === 0) {
            grid.innerHTML = `
                <div class="bookmark-card-empty">
                    <span class="material-symbols-rounded">bookmark_border</span>
                    No browser bookmarks
                </div>`;
            return;
        }

        folders.forEach(folder => {
            const card = document.createElement('div');
            card.className = 'bookmark-card bookmark-folder-card browser-bm-folder';
            const count = _countChromeBookmarks(folder);
            card.innerHTML = `
                <div class="bookmark-card-favicon bookmark-folder-icon">
                    <span class="material-symbols-rounded">folder</span>
                </div>
                <div class="bookmark-card-info">
                    <div class="bookmark-card-title">${escapeHtml(folder.title || 'Untitled Folder')}</div>
                    <div class="bookmark-card-url">${count} item${count !== 1 ? 's' : ''}</div>
                </div>
                <span class="material-symbols-rounded bookmark-card-arrow">chevron_right</span>
            `;
            card.addEventListener('click', () => {
                _browserBmFolderHistory.push(folderId || null);
                renderBrowserBookmarks(folder.id);
            });
            grid.appendChild(card);
        });

        links.forEach(link => {
            const card = document.createElement('a');
            card.className = 'bookmark-card browser-bm-link';
            card.href = link.url;
            card.target = '_blank';
            card.rel = 'noopener';
            const favicon = getFaviconUrl(link.url);
            card.innerHTML = `
                <div class="bookmark-card-favicon">
                    <img src="${favicon}" alt="">
                    <span class="material-symbols-rounded" style="display:none;">language</span>
                </div>
                <div class="bookmark-card-info">
                    <div class="bookmark-card-title">${escapeHtml(link.title || link.url)}</div>
                    <div class="bookmark-card-url">${escapeHtml(getDomain(link.url))}</div>
                </div>
            `;
            const img = card.querySelector('img');
            if (img) {
                img.addEventListener('error', function() {
                    this.style.display = 'none';
                    this.nextElementSibling.style.display = 'flex';
                });
            }
            grid.appendChild(card);
        });
    };

    if (folderId) {
        chrome.bookmarks.getChildren(folderId, (children) => {
            const processed = [];
            let pending = children.length;
            if (pending === 0) { render([]); return; }
            children.forEach(child => {
                if (child.url) {
                    processed.push(child);
                    pending--;
                    if (pending === 0) render(processed);
                } else {
                    chrome.bookmarks.getSubTree(child.id, (subtree) => {
                        processed.push(subtree[0]);
                        pending--;
                        if (pending === 0) render(processed);
                    });
                }
            });
        });
    } else {
        chrome.bookmarks.getTree((tree) => {
            if (!tree || !tree[0] || !tree[0].children) {
                render([]);
                return;
            }
            render(tree[0].children);
        });
    }
}

function _countChromeBookmarks(node) {
    let count = 0;
    if (node.url) return 1;
    if (node.children) {
        node.children.forEach(c => { count += _countChromeBookmarks(c); });
    }
    return count;
}

// Wire browser bookmarks back button
document.getElementById('browser-bookmarks-back')?.addEventListener('click', () => {
    const prev = _browserBmFolderHistory.pop();
    renderBrowserBookmarks(prev || undefined);
});

// Bookmark folder navigation history
let _bmFolderHistory = [];

function navigateBookmarkFolder(folderId) {
    _bmFolderHistory.push(folderId);
    renderDashboardBookmarks(folderId);
}

function navigateBookmarkBack() {
    _bmFolderHistory.pop(); // remove current
    const prev = _bmFolderHistory.length > 0 ? _bmFolderHistory[_bmFolderHistory.length - 1] : undefined;
    if (prev !== undefined) {
        renderDashboardBookmarks(prev);
    } else {
        _bmFolderHistory = [];
        renderDashboardBookmarks();
    }
}

// Wire back button
document.getElementById('dashboard-bookmarks-back')?.addEventListener('click', navigateBookmarkBack);

// Dashboard: New Folder button (creates a local bookmark folder)
document.getElementById('dashboard-add-folder-btn')?.addEventListener('click', () => {
    const name = prompt('New folder name:');
    if (!name || !name.trim()) return;
    if (!activeProjectId) {
        showNotification('Select a project first');
        return;
    }

    const parentFolderId = _bmFolderHistory.length > 0
        ? _bmFolderHistory[_bmFolderHistory.length - 1]
        : null;

    const folder = {
        id: 'bmf_' + Date.now(),
        project_id: activeProjectId,
        name: name.trim(),
        parent_id: parentFolderId || null,
        sort_order: 0,
        created: new Date().toISOString()
    };
    DevNotebookDB.createBookmarkFolder(folder);

    const currentFolderId = _bmFolderHistory.length > 0
        ? _bmFolderHistory[_bmFolderHistory.length - 1]
        : undefined;
    renderDashboardBookmarks(currentFolderId);
    showNotification('Folder created');
});

// --- Dashboard Add Bookmark Mini Popup ---
let _dashboardBmEditId = null;

function dashboardBmShowPopup(editId) {
    const popup = document.getElementById('dashboard-bm-popup');
    const titleInput = document.getElementById('dashboard-bm-title');
    const urlInput = document.getElementById('dashboard-bm-url');
    const folderSelect = document.getElementById('dashboard-bm-folder');
    const popupTitle = document.getElementById('dashboard-bm-popup-title');
    if (!popup) return;

    _dashboardBmEditId = editId || null;

    // Populate folder select
    if (folderSelect && activeProjectId) {
        const folders = DevNotebookDB.getAllBookmarkFolders(activeProjectId);
        folderSelect.innerHTML = '<option value="">No Folder</option>';
        folders.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.id;
            opt.textContent = f.name;
            folderSelect.appendChild(opt);
        });
        // Default to current browsed folder
        const currentFolderId = _bmFolderHistory.length > 0
            ? _bmFolderHistory[_bmFolderHistory.length - 1]
            : '';
        folderSelect.value = currentFolderId || '';
    }

    if (editId) {
        popupTitle.textContent = 'Edit Bookmark';
        const item = getItem(editId);
        if (item) {
            titleInput.value = item.title || '';
            urlInput.value = item.url || '';
            if (folderSelect) folderSelect.value = item.folder_id || '';
        }
    } else {
        popupTitle.textContent = 'Add Bookmark';
        titleInput.value = '';
        urlInput.value = '';
    }

    popup.style.display = 'block';
    setTimeout(() => urlInput.focus(), 50);
}

function dashboardBmHidePopup() {
    const popup = document.getElementById('dashboard-bm-popup');
    if (popup) popup.style.display = 'none';
    _dashboardBmEditId = null;
}

function dashboardBmSave() {
    const titleInput = document.getElementById('dashboard-bm-title');
    const urlInput = document.getElementById('dashboard-bm-url');
    const folderSelect = document.getElementById('dashboard-bm-folder');

    const title = titleInput.value.trim();
    let url = urlInput.value.trim();
    const folderId = folderSelect ? folderSelect.value : '';

    if (!url) {
        showNotification('URL is required');
        urlInput.focus();
        return;
    }

    // Auto-prefix https if no protocol
    if (url && !/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    if (_dashboardBmEditId) {
        DevNotebookDB.updateItem(_dashboardBmEditId, {
            title: title || url,
            url: url,
            folder_id: folderId || null
        });
        showNotification('Bookmark updated');
    } else {
        if (!activeProjectId) {
            showNotification('Select a project first');
            return;
        }
        const newItem = {
            id: 'bm_' + Date.now(),
            project_id: activeProjectId,
            type: 'bookmark',
            title: title || url,
            url: url,
            description: '',
            folder_id: folderId || null,
            created: new Date().toISOString()
        };
        DevNotebookDB.createItem(newItem);
        showNotification('Bookmark added');
    }

    dashboardBmHidePopup();
    const currentFolderId = _bmFolderHistory.length > 0
        ? _bmFolderHistory[_bmFolderHistory.length - 1]
        : undefined;
    renderDashboardBookmarks(currentFolderId);
    renderItemsList();
}

// Wire popup buttons
document.getElementById('dashboard-add-bookmark-btn')?.addEventListener('click', () => dashboardBmShowPopup(null));
document.getElementById('dashboard-bm-popup-close')?.addEventListener('click', dashboardBmHidePopup);
document.getElementById('dashboard-bm-popup-cancel')?.addEventListener('click', dashboardBmHidePopup);
document.getElementById('dashboard-bm-popup-save')?.addEventListener('click', dashboardBmSave);

// Allow Enter key to save from URL field
document.getElementById('dashboard-bm-url')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        dashboardBmSave();
    }
});

// Brand click -> show dashboard
document.getElementById('sidebar-brand-btn')?.addEventListener('click', () => {
    activeItemId = null;
    selectedItemIds.clear();
    renderItemsList();
    showDashboard();
});

// Dashboard quick actions
document.getElementById('dashboard-new-note')?.addEventListener('click', () => {
    activeItemType = 'note';
    resourceTabs.forEach(btn => btn.classList.toggle('active', btn.dataset.type === 'note'));
    renderItemsList();
    createNewItem();
});

document.getElementById('dashboard-new-whiteboard')?.addEventListener('click', () => {
    appContainer.classList.add('sidebar-open');
    activeItemType = 'draw';
    resourceTabs.forEach(btn => btn.classList.toggle('active', btn.dataset.type === 'draw'));
    renderItemsList();
    createNewItem();
});

document.getElementById('dashboard-open-sidebar')?.addEventListener('click', () => {
    appContainer.classList.add('sidebar-open');
});

// --- Data Persistence ---
function saveWorkspaces() {
    // With SQLite, individual operations are already persisted.
    // This function now only saves active navigation state.
    DevNotebookDB.setSettings({
        activeWorkspaceId: activeWorkspaceId,
        activeProjectId: activeProjectId,
        activeItemType: activeItemType
    });
}

// --- Helper Accessors ---
function getCurrentWorkspace() {
    if (!activeWorkspaceId) return null;
    return DevNotebookDB.getWorkspace(activeWorkspaceId);
}

function getCurrentProject() {
    if (!activeProjectId) return null;
    return DevNotebookDB.getProject(activeProjectId);
}

function getItem(id) {
    if (!id) return null;
    const row = DevNotebookDB.getItem(id);
    if (!row) return null;
    // Convert DB row to in-memory item format expected by rest of code
    const item = {
        id: row.id,
        type: row.type,
        title: row.title,
        created: row.created
    };
    if (row.type === 'note') {
        if (row.body) {
            try { item.body = JSON.parse(row.body); } catch { item.body = row.body; }
        } else {
            item.body = '';
        }
    } else if (row.type === 'bookmark') {
        item.url = row.url || '';
        item.description = row.description || '';
        item.folder_id = row.folder_id || '';
    } else if (row.type === 'credential') {
        item.username = row.username || '';
        item.password = row.password || '';
        item.notes = row.notes || '';
    } else if (row.type === 'draw') {
        item.drawUrl = row.draw_url || '';
    }
    return item;
}

// --- UI Rendering ---

function renderSidebarControls() {
    // Render Workspace Select
    workspaceSelect.innerHTML = '';
    const allWorkspaces = DevNotebookDB.getWorkspaces();
    allWorkspaces.forEach(ws => {
        const option = document.createElement('option');
        option.value = ws.id;
        option.textContent = ws.name;
        if (ws.id === activeWorkspaceId) option.selected = true;
        workspaceSelect.appendChild(option);
    });

    // Render Project Select
    projectSelect.innerHTML = '';
    if (activeWorkspaceId) {
        const projects = DevNotebookDB.getProjects(activeWorkspaceId);
        projects.forEach(proj => {
            const option = document.createElement('option');
            option.value = proj.id;
            option.textContent = proj.name;
            if (proj.id === activeProjectId) option.selected = true;
            projectSelect.appendChild(option);
        });
    }
}

function renderItemsList() {
    itemsListEl.innerHTML = '';

    if (!activeProjectId) return;

    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    let filteredItems;
    if (searchTerm) {
        filteredItems = DevNotebookDB.searchItems(activeProjectId, activeItemType, searchTerm);
    } else {
        filteredItems = DevNotebookDB.getItems(activeProjectId, activeItemType);
    }

    filteredItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'note-item';
        if (item.id === activeItemId) li.classList.add('active');
        if (selectedItemIds.has(item.id)) li.classList.add('selected');

        let title = item.title || 'Untitled';
        let subText = '';

        if (item.type === 'note') {
            // Use a lightweight preview - don't load full body
            subText = 'Content...';
        } else if (item.type === 'bookmark') {
            subText = item.url || '';
        } else if (item.type === 'credential') {
            subText = item.username || '********';
        } else if (item.type === 'draw') {
            subText = item.draw_url || 'Tap to open';
        }

        const openLinkBtn = item.type === 'bookmark' || item.type === 'draw' ? `
            <button class="note-item-open-link-btn" title="Open">
                <span class="material-symbols-rounded">open_in_new</span>
            </button>
        ` : '';

        li.innerHTML = `
            <div class="note-item-content">
                <div class="note-item-title">${escapeHtml(title)}</div>
                <div class="note-item-preview">${escapeHtml(subText)}</div>
            </div>
            ${openLinkBtn}
            <button class="note-item-delete-btn" title="Delete">
                <span class="material-symbols-rounded">close</span>
            </button>
        `;

        li.addEventListener('click', (e) => {
            handleItemClick(e, item.id, filteredItems);
        });

        if (item.type === 'bookmark' || item.type === 'draw') {
            const openBtn = li.querySelector('.note-item-open-link-btn');
            if (openBtn) {
                openBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (item.type === 'bookmark' && item.url) {
                        window.open(item.url, '_blank');
                    }
                    if (item.type === 'draw') {
                        setActiveItem(item.id, { openDraw: true });
                    }
                });
            }
        }

        const deleteBtn = li.querySelector('.note-item-delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDeleteRequest(item.id);
        });

        itemsListEl.appendChild(li);
    });
}

function handleItemClick(e, id, visibleItems) {
    if (e.shiftKey) {
        // Multi-select range
        if (activeItemId && activeItemId !== id) {
            let startIdx = visibleItems.findIndex(i => i.id === activeItemId);
            let endIdx = visibleItems.findIndex(i => i.id === id);

            if (startIdx !== -1 && endIdx !== -1) {
                const [min, max] = [Math.min(startIdx, endIdx), Math.max(startIdx, endIdx)];
                // Select everything in between
                for (let i = min; i <= max; i++) {
                    selectedItemIds.add(visibleItems[i].id);
                }
                // Update active to current, but keep selection
                activeItemId = id;
            }
        } else {
            selectedItemIds.add(id);
            activeItemId = id;
        }
    } else if (e.metaKey || e.ctrlKey) {
        // Toggle selection (standard behavior, though not strictly requested, good UX)
        if (selectedItemIds.has(id)) {
            selectedItemIds.delete(id);
            if (activeItemId === id) activeItemId = null;
        } else {
            selectedItemIds.add(id);
            activeItemId = id;
        }
    } else {
        // Single select
        selectedItemIds.clear();
        selectedItemIds.add(id);
        setActiveItem(id); // Sets active and clears other UI selection logic in render usually... 
        // But setActiveItem implementation clears selection classes too naively? 
        // Let's check setActiveItem.
        // Actually setActiveItem calls renderItemsList, which reads selectedItemIds.
    }
    // Force re-render to show selection
    renderItemsList();
    // Ensure the detailed view is updated for the active item
    if (activeItemId) openItemEditor(activeItemId);
}

function handleDeleteRequest(targetId) {
    let itemsToDelete = [];

    // Check if target is part of selection
    if (selectedItemIds.has(targetId) && selectedItemIds.size > 1) {
        // Delete all selected
        itemsToDelete = Array.from(selectedItemIds);
    } else {
        // Delete only target
        itemsToDelete = [targetId];
    }

    if (confirm(`Delete ${itemsToDelete.length} item(s)? This cannot be undone.`)) {
        deleteItems(itemsToDelete);
    }
}

function deleteItems(idsToDelete) {
    if (!activeProjectId) return;

    DevNotebookDB.deleteItems(idsToDelete);

    // Clear selection
    selectedItemIds.clear();

    // Reset active item if deleted
    if (idsToDelete.includes(activeItemId)) {
        activeItemId = null;
        const remaining = DevNotebookDB.getItems(activeProjectId, activeItemType);
        if (remaining.length > 0) {
            activeItemId = remaining[0].id;
            selectedItemIds.add(remaining[0].id);
        } else {
            createNewItem();
            return;
        }
    } else if (activeItemId) {
        selectedItemIds.add(activeItemId);
    }

    renderItemsList();
    if (activeItemId) openItemEditor(activeItemId);
    else hideEditors();
}

function hideEditors() {
    document.querySelectorAll('.view-pane').forEach(el => el.classList.add('hidden'));
}

function openItemEditor(id, { openDraw = false } = {}) {
    // Logic extracted from setActiveItem to just switch view without resetting list state
    const item = getItem(id);
    document.querySelectorAll('.view-pane').forEach(el => el.classList.add('hidden'));
    // Hide dashboard when editing an item
    const dashboard = document.getElementById('dashboard');
    if (dashboard) dashboard.classList.remove('active');
    document.body.classList.remove('dashboard-mode');

    if (!item) return;

    if (item.type === 'note') {
        document.getElementById('editor-content').classList.remove('hidden');
        // Restore Quill toolbar (hidden by dashboard)
        const quillToolbar = document.querySelector('.ql-toolbar');
        if (quillToolbar) quillToolbar.style.display = '';
        noteTitleEl.value = item.title || '';
        if (quill) {
            if (item.body && typeof item.body === 'object' && item.body.ops) {
                quill.setContents(item.body);
            } else if (item.body && typeof item.body === 'string' && item.body.startsWith('{')) {
                try {
                    const delta = JSON.parse(item.body);
                    quill.setContents(delta);
                } catch (e) { quill.setText(item.body || ''); }
            } else {
                quill.setText(item.body || '');
            }
            // Focus title for new/empty notes, otherwise focus editor
            setTimeout(() => {
                if (!item.title && (!item.body || item.body === '')) {
                    noteTitleEl.focus();
                } else {
                    quill.focus();
                    const len = quill.getLength();
                    quill.setSelection(Math.max(0, len - 1), 0);
                }
                // Re-attach table action handlers for loaded content
                if (typeof attachTableActionHandlers === 'function') {
                    attachTableActionHandlers();
                }
            }, 50);
        }
    } else if (item.type === 'bookmark') {
        bookmarkEditor.classList.remove('hidden');
        // Open the bookmark manager view with folder tree
        bmOpenManager();
        // If a specific bookmark was selected, open its edit form
        if (item.url || item.title) {
            bmShowForm(item.id);
        }
    } else if (item.type === 'credential') {
        credentialEditor.classList.remove('hidden');
        credentialTitleInput.value = item.title || '';
        credentialUsernameInput.value = item.username || '';
        credentialPasswordInput.value = item.password || '';
        credentialNotesInput.value = item.notes || '';
    } else if (item.type === 'draw') {
        if (openDraw) {
            openDrawView(false, item.drawUrl || getDrawCollabLinkUrl(true));
        }
    }
}

function setActiveItem(id, { openDraw = false } = {}) {
    if (activeItemId !== id) {
        activeItemId = id;
        selectedItemIds.clear();
        if (id) selectedItemIds.add(id);
    }

    renderItemsList();
    openItemEditor(id, { openDraw });
}

function createNewItem() {
    if (!activeProjectId) return;

    if (activeItemType === 'draw') {
        const newItem = {
            id: Date.now().toString(),
            project_id: activeProjectId,
            type: 'draw',
            title: 'New canvas',
            created: new Date().toISOString(),
            draw_url: getDrawCollabLinkUrl(true)
        };

        DevNotebookDB.createItem(newItem);
        setActiveItem(newItem.id, { openDraw: true });
        return;
    }

    const newItem = {
        id: Date.now().toString(),
        project_id: activeProjectId,
        type: activeItemType,
        title: '',
        created: new Date().toISOString()
    };

    if (activeItemType === 'note') {
        newItem.body = '';
    } else if (activeItemType === 'bookmark') {
        // Don't create an empty bookmark item. Instead show the bookmark manager form.
        // We still need to show the bookmark-editor pane.
        document.querySelectorAll('.view-pane').forEach(el => el.classList.add('hidden'));
        const dashboard = document.getElementById('dashboard');
        if (dashboard) dashboard.classList.remove('active');
        document.body.classList.remove('dashboard-mode');
        bookmarkEditor.classList.remove('hidden');
        bmOpenManager();
        bmShowForm(null); // Open "Add Bookmark" form
        return;
    } else if (activeItemType === 'credential') {
        newItem.username = '';
        newItem.password = '';
        newItem.notes = '';
    }

    DevNotebookDB.createItem(newItem);
    setActiveItem(newItem.id);
}

// --- Event Listeners for New Controls ---

workspaceSelect.addEventListener('change', (e) => {
    activeWorkspaceId = e.target.value;
    const projects = DevNotebookDB.getProjects(activeWorkspaceId);
    if (projects.length > 0) activeProjectId = projects[0].id;
    saveWorkspaces();
    renderSidebarControls();
    renderItemsList();
    if (activeItemType === 'draw') {
        const items = DevNotebookDB.getItems(activeProjectId, 'draw');
        if (items.length > 0) setActiveItem(items[0].id);
        else createNewItem();
    } else {
        createNewItem();
    }
});

projectSelect.addEventListener('change', (e) => {
    activeProjectId = e.target.value;
    saveWorkspaces();
    renderItemsList();
    if (activeItemType === 'draw') {
        const items = DevNotebookDB.getItems(activeProjectId, 'draw');
        if (items.length > 0) setActiveItem(items[0].id);
        else createNewItem();
    } else {
        createNewItem();
    }
});

addWorkspaceBtn.addEventListener('click', async () => {
    const name = prompt('New Workspace Name:');
    if (name) {
        const wsId = 'ws_' + Date.now();
        const projId = 'proj_' + Date.now();
        DevNotebookDB.createWorkspace(wsId, name);
        DevNotebookDB.createProject(projId, wsId, 'General');
        activeWorkspaceId = wsId;
        activeProjectId = projId;
        saveWorkspaces();
        renderSidebarControls();
        renderItemsList();
        createNewItem();
    }
});

addProjectBtn.addEventListener('click', async () => {
    const name = prompt('New Project Name:');
    if (name) {
        if (activeWorkspaceId) {
            const projId = 'proj_' + Date.now();
            DevNotebookDB.createProject(projId, activeWorkspaceId, name);
            activeProjectId = projId;
            saveWorkspaces();
            renderSidebarControls();
            renderItemsList();
            createNewItem();
        }
    }
});

resourceTabs.forEach(btn => {
    btn.addEventListener('click', () => {
        resourceTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeItemType = btn.dataset.type;
        saveWorkspaces();

        if (activeItemType === 'draw') {
            activeItemId = null;
            selectedItemIds.clear();
            renderItemsList();
            hideEditors();
            return;
        }
        renderItemsList();
        const items = DevNotebookDB.getItems(activeProjectId, activeItemType);
        if (items.length > 0) {
            setActiveItem(items[0].id);
        } else {
            createNewItem();
        }
    });
});

// Quick Access Buttons (Sidebar Footer)
const quickNoteBtn = document.getElementById('quick-note-btn');
const quickBookmarkBtn = document.getElementById('quick-bookmark-btn');
const quickCredentialBtn = document.getElementById('quick-credential-btn');

[quickNoteBtn, quickBookmarkBtn, quickCredentialBtn].forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            resourceTabs.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.type === type);
            });
            activeItemType = type;
            saveWorkspaces();
            renderItemsList();
            const items = DevNotebookDB.getItems(activeProjectId, activeItemType);
            if (items.length > 0) {
                setActiveItem(items[0].id);
            } else {
                createNewItem();
            }
        });
    }
});

// --- Edit/Delete Workspace & Project Listeners ---

// Rename Workspace
editWorkspaceBtn.addEventListener('click', async () => {
    const ws = getCurrentWorkspace();
    if (!ws) return;

    const newName = prompt('Rename Workspace:', ws.name);
    if (newName && newName.trim() !== '') {
        DevNotebookDB.updateWorkspace(ws.id, newName.trim());
        renderSidebarControls();
        showNotification('Workspace renamed');
    }
});

// Delete Workspace
deleteWorkspaceBtn.addEventListener('click', async () => {
    const ws = getCurrentWorkspace();
    if (!ws) return;

    const allWs = DevNotebookDB.getWorkspaces();
    if (allWs.length <= 1) {
        showNotification('Cannot delete the last workspace', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete workspace "${ws.name}"? All projects and items inside it will be lost.`)) {
        DevNotebookDB.deleteWorkspace(ws.id);

        const remaining = DevNotebookDB.getWorkspaces();
        activeWorkspaceId = remaining[0].id;
        const projects = DevNotebookDB.getProjects(activeWorkspaceId);
        activeProjectId = projects.length > 0 ? projects[0].id : null;

        saveWorkspaces();
        renderSidebarControls();
        renderItemsList();

        if (activeProjectId) {
            const items = DevNotebookDB.getItems(activeProjectId, activeItemType);
            if (items.length > 0) setActiveItem(items[0].id);
            else setActiveItem(null);
        } else {
            setActiveItem(null);
        }

        showNotification('Workspace deleted');
    }
});

// Rename Project
editProjectBtn.addEventListener('click', async () => {
    const proj = getCurrentProject();
    if (!proj) return;

    const newName = prompt('Rename Project:', proj.name);
    if (newName && newName.trim() !== '') {
        DevNotebookDB.updateProject(proj.id, newName.trim());
        renderSidebarControls();
        showNotification('Project renamed');
    }
});

// Delete Project
deleteProjectBtn.addEventListener('click', async () => {
    const proj = getCurrentProject();
    if (!proj || !activeWorkspaceId) return;

    const allProjects = DevNotebookDB.getProjects(activeWorkspaceId);
    if (allProjects.length <= 1) {
        showNotification('Cannot delete the last project in a workspace', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete project "${proj.name}"? All items inside it will be lost.`)) {
        DevNotebookDB.deleteProject(proj.id);

        const remaining = DevNotebookDB.getProjects(activeWorkspaceId);
        activeProjectId = remaining.length > 0 ? remaining[0].id : null;

        saveWorkspaces();
        renderSidebarControls();
        renderItemsList();

        if (activeProjectId) {
            const items = DevNotebookDB.getItems(activeProjectId, activeItemType);
            if (items.length > 0) setActiveItem(items[0].id);
            else {
                setActiveItem(null);
                createNewItem();
            }
        } else {
            setActiveItem(null);
            createNewItem();
        }

        showNotification('Project deleted');
    }
});

addItemBtn.addEventListener('click', createNewItem);
fabAddBtn.addEventListener('click', createNewItem);

// ==========================================
// BOOKMARK MANAGER
// ==========================================
let bmCurrentFolderId = ''; // '' = all / unfiled
let bmEditingItemId = null; // item being edited in the form

function initBookmarkManager() {
    const addFolderBtn = document.getElementById('bm-add-folder-btn');
    const addBookmarkBtn = document.getElementById('bm-add-bookmark-btn');
    const syncBrowserBtn = document.getElementById('bm-sync-browser-btn');
    const closeFormBtn = document.getElementById('bm-close-form-btn');
    const cancelFormBtn = document.getElementById('bm-cancel-form-btn');

    if (addFolderBtn) addFolderBtn.addEventListener('click', bmCreateFolder);
    if (addBookmarkBtn) addBookmarkBtn.addEventListener('click', () => bmShowForm(null));
    if (syncBrowserBtn) syncBrowserBtn.addEventListener('click', bmSyncToBrowser);
    if (closeFormBtn) closeFormBtn.addEventListener('click', bmHideForm);
    if (cancelFormBtn) cancelFormBtn.addEventListener('click', bmHideForm);

    if (saveBookmarkBtn) saveBookmarkBtn.addEventListener('click', bmSaveBookmark);
    if (visitBookmarkBtn) visitBookmarkBtn.addEventListener('click', () => {
        const url = bookmarkUrlInput.value;
        if (url) window.open(url, '_blank');
    });
}

function bmOpenManager() {
    bmCurrentFolderId = '';
    bmRenderFolders();
    bmRenderBookmarks();
    bmHideForm();
}

function bmCreateFolder() {
    const name = prompt('Folder name:');
    if (!name || !name.trim()) return;
    if (!activeProjectId) return;

    const folder = {
        id: 'bmf_' + Date.now(),
        project_id: activeProjectId,
        name: name.trim(),
        parent_id: bmCurrentFolderId || null,
        sort_order: 0,
        created: new Date().toISOString()
    };

    DevNotebookDB.createBookmarkFolder(folder);

    bmRenderFolders();
    // Also refresh dashboard bookmarks
    const currentFolderId = _bmFolderHistory.length > 0
        ? _bmFolderHistory[_bmFolderHistory.length - 1]
        : undefined;
    renderDashboardBookmarks(currentFolderId);
    showNotification('Folder created');
}

function bmRenameFolder(folderId) {
    const folder = DevNotebookDB.getBookmarkFolder(folderId);
    if (!folder) return;
    const name = prompt('Rename folder:', folder.name);
    if (name === null || !name.trim()) return;

    DevNotebookDB.updateBookmarkFolder(folderId, { name: name.trim() });

    bmRenderFolders();
    const currentFolderId = _bmFolderHistory.length > 0
        ? _bmFolderHistory[_bmFolderHistory.length - 1]
        : undefined;
    renderDashboardBookmarks(currentFolderId);
    showNotification('Folder renamed');
}

function bmDeleteFolder(folderId) {
    if (!confirm('Delete this folder? Bookmarks inside will be moved to "All Bookmarks".')) return;

    DevNotebookDB.deleteBookmarkFolder(folderId);

    if (bmCurrentFolderId === folderId) {
        bmCurrentFolderId = '';
    }

    bmRenderFolders();
    bmRenderBookmarks();
    const currentFolderId = _bmFolderHistory.length > 0
        ? _bmFolderHistory[_bmFolderHistory.length - 1]
        : undefined;
    renderDashboardBookmarks(currentFolderId);
    showNotification('Folder deleted');
}

function bmRenderFolders() {
    const list = document.getElementById('bm-folder-list');
    if (!list || !activeProjectId) return;

    const folders = DevNotebookDB.getAllBookmarkFolders(activeProjectId);
    const folderName = document.getElementById('bm-current-folder-name');

    // Build HTML
    let html = `
        <div class="bm-folder-item ${bmCurrentFolderId === '' ? 'active' : ''}" data-folder-id="">
            <span class="material-symbols-rounded">folder_open</span>
            <span>All Bookmarks</span>
        </div>`;

    folders.forEach(f => {
        const isActive = bmCurrentFolderId === f.id;
        const items = DevNotebookDB.getBookmarksByFolder(activeProjectId, f.id);
        html += `
            <div class="bm-folder-item ${isActive ? 'active' : ''}" data-folder-id="${f.id}">
                <span class="material-symbols-rounded">${isActive ? 'folder_open' : 'folder'}</span>
                <span>${escapeHtml(f.name)}</span>
                <span class="bm-folder-count">${items.length}</span>
                <div class="bm-folder-actions">
                    <button data-action="rename" data-folder-id="${f.id}" title="Rename">
                        <span class="material-symbols-rounded">edit</span>
                    </button>
                    <button data-action="delete" data-folder-id="${f.id}" title="Delete">
                        <span class="material-symbols-rounded">delete</span>
                    </button>
                </div>
            </div>`;
    });

    list.innerHTML = html;

    // Update title
    if (folderName) {
        if (bmCurrentFolderId) {
            const cf = DevNotebookDB.getBookmarkFolder(bmCurrentFolderId);
            folderName.textContent = cf ? cf.name : 'Bookmarks';
        } else {
            folderName.textContent = 'All Bookmarks';
        }
    }

    // Click handlers
    list.querySelectorAll('.bm-folder-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.bm-folder-actions')) return;
            bmCurrentFolderId = item.dataset.folderId;
            bmRenderFolders();
            bmRenderBookmarks();
        });
    });

    // Folder action handlers (rename/delete)
    list.querySelectorAll('.bm-folder-actions button[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const fId = btn.dataset.folderId;
            if (btn.dataset.action === 'rename') bmRenameFolder(fId);
            else if (btn.dataset.action === 'delete') bmDeleteFolder(fId);
        });
    });

    // Also update folder select in form
    bmUpdateFolderSelect();
}

function bmUpdateFolderSelect() {
    const select = document.getElementById('bookmark-folder-select');
    if (!select || !activeProjectId) return;

    const folders = DevNotebookDB.getAllBookmarkFolders(activeProjectId);
    select.innerHTML = '<option value="">No Folder</option>';
    folders.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = f.name;
        select.appendChild(opt);
    });
}

function bmRenderBookmarks() {
    const list = document.getElementById('bm-list');
    if (!list || !activeProjectId) return;

    let bookmarks;
    if (bmCurrentFolderId === '') {
        // Show all bookmarks
        bookmarks = DevNotebookDB.getItems(activeProjectId, 'bookmark');
    } else {
        bookmarks = DevNotebookDB.getBookmarksByFolder(activeProjectId, bmCurrentFolderId);
    }

    if (bookmarks.length === 0) {
        list.innerHTML = `
            <div class="bm-empty">
                <span class="material-symbols-rounded">bookmark_border</span>
                No bookmarks yet.<br>Click "Add Bookmark" to create one.
            </div>`;
        return;
    }

    let html = '';
    bookmarks.forEach(bm => {
        const favicon = bm.url ? getFaviconUrl(bm.url) : '';
        const domain = bm.url ? getDomain(bm.url) : '';
        html += `
            <div class="bm-card" data-id="${bm.id}">
                <div class="bm-card-favicon">
                    ${favicon ? `<img src="${favicon}" alt="">` : ''}
                    <span class="material-symbols-rounded" ${favicon ? 'style="display:none"' : ''}>language</span>
                </div>
                <div class="bm-card-info">
                    <div class="bm-card-title">${escapeHtml(bm.title || 'Untitled')}</div>
                    <div class="bm-card-url">${escapeHtml(domain)}</div>
                    ${bm.description ? `<div class="bm-card-desc">${escapeHtml(bm.description)}</div>` : ''}
                </div>
                <div class="bm-card-actions">
                    <button data-action="open" data-url="${escapeHtml(bm.url || '')}" title="Open">
                        <span class="material-symbols-rounded">open_in_new</span>
                    </button>
                    <button data-action="edit" data-item-id="${bm.id}" title="Edit">
                        <span class="material-symbols-rounded">edit</span>
                    </button>
                    <button class="danger" data-action="delete" data-item-id="${bm.id}" title="Delete">
                        <span class="material-symbols-rounded">delete</span>
                    </button>
                </div>
            </div>`;
    });

    list.innerHTML = html;

    // Handle favicon errors
    list.querySelectorAll('.bm-card-favicon img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });

    // Bookmark card action handlers (event delegation)
    list.querySelectorAll('.bm-card-actions button[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            if (action === 'open') window.open(btn.dataset.url, '_blank');
            else if (action === 'edit') bmShowForm(btn.dataset.itemId);
            else if (action === 'delete') bmDeleteBookmark(btn.dataset.itemId);
        });
    });

    // Click on card → open URL
    list.querySelectorAll('.bm-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.bm-card-actions')) return;
            const id = card.dataset.id;
            const item = getItem(id);
            if (item && item.url) window.open(item.url, '_blank');
        });
    });
}

function bmShowForm(editId) {
    const form = document.getElementById('bm-edit-form');
    const title = document.getElementById('bm-form-title');
    if (!form) return;

    bmEditingItemId = editId;

    if (editId) {
        // Editing existing bookmark
        title.textContent = 'Edit Bookmark';
        const item = getItem(editId);
        if (item) {
            bookmarkTitleInput.value = item.title || '';
            bookmarkUrlInput.value = item.url || '';
            bookmarkDescInput.value = item.description || '';
            const folderSelect = document.getElementById('bookmark-folder-select');
            if (folderSelect) folderSelect.value = item.folder_id || '';
        }
    } else {
        // New bookmark
        title.textContent = 'Add Bookmark';
        bookmarkTitleInput.value = '';
        bookmarkUrlInput.value = '';
        bookmarkDescInput.value = '';
        const folderSelect = document.getElementById('bookmark-folder-select');
        if (folderSelect) folderSelect.value = bmCurrentFolderId || '';
    }

    bmUpdateFolderSelect();
    form.style.display = 'block';
    setTimeout(() => bookmarkTitleInput.focus(), 50);
}

function bmHideForm() {
    const form = document.getElementById('bm-edit-form');
    if (form) form.style.display = 'none';
    bmEditingItemId = null;
}

function bmSaveBookmark() {
    const title = bookmarkTitleInput.value.trim();
    const url = bookmarkUrlInput.value.trim();
    const desc = bookmarkDescInput.value.trim();
    const folderSelect = document.getElementById('bookmark-folder-select');
    const folderId = folderSelect ? folderSelect.value : '';

    if (!url) {
        showNotification('URL is required');
        return;
    }

    if (bmEditingItemId) {
        // Update existing
        DevNotebookDB.updateItem(bmEditingItemId, {
            title: title || url,
            url: url,
            description: desc,
            folder_id: folderId || null
        });
        showNotification('Bookmark updated');
    } else {
        // Create new
        if (!activeProjectId) return;
        const newItem = {
            id: 'bm_' + Date.now(),
            project_id: activeProjectId,
            type: 'bookmark',
            title: title || url,
            url: url,
            description: desc,
            folder_id: folderId || null,
            created: new Date().toISOString()
        };
        DevNotebookDB.createItem(newItem);

        showNotification('Bookmark created');
    }

    bmHideForm();
    bmRenderBookmarks();
    bmRenderFolders();
    renderItemsList();

    // Also refresh dashboard bookmarks
    const currentFolderId = _bmFolderHistory.length > 0
        ? _bmFolderHistory[_bmFolderHistory.length - 1]
        : undefined;
    renderDashboardBookmarks(currentFolderId);
}

function bmDeleteBookmark(id) {
    if (!confirm('Delete this bookmark?')) return;
    DevNotebookDB.deleteItem(id);
    bmRenderBookmarks();
    bmRenderFolders();
    renderItemsList();

    // Refresh dashboard bookmarks
    const currentFolderId = _bmFolderHistory.length > 0
        ? _bmFolderHistory[_bmFolderHistory.length - 1]
        : undefined;
    renderDashboardBookmarks(currentFolderId);
    showNotification('Bookmark deleted');
}

function bmSyncToBrowser() {
    if (typeof chrome === 'undefined' || !chrome.bookmarks || !chrome.bookmarks.create) {
        showNotification('Chrome Bookmarks API not available');
        return;
    }

    if (!activeProjectId) return;

    const allBookmarks = DevNotebookDB.getItems(activeProjectId, 'bookmark');
    const folders = DevNotebookDB.getAllBookmarkFolders(activeProjectId);

    // Create a parent folder in bookmarks bar for this sync
    chrome.bookmarks.create({
        parentId: '1',
        title: 'Notebook Bookmarks'
    }, (rootFolder) => {
        if (!rootFolder) return;

        // Create folders first
        const folderMap = {}; // local ID → chrome ID
        let pending = folders.length;

        if (pending === 0) {
            syncBookmarkItems(rootFolder.id, folderMap);
            return;
        }

        folders.forEach(f => {
            const parentId = f.parent_id && folderMap[f.parent_id] ? folderMap[f.parent_id] : rootFolder.id;
            chrome.bookmarks.create({
                parentId: parentId,
                title: f.name
            }, (created) => {
                if (created) {
                    folderMap[f.id] = created.id;
                    DevNotebookDB.updateBookmarkFolder(f.id, { chrome_id: created.id });
                }
                pending--;
                if (pending === 0) {
                    syncBookmarkItems(rootFolder.id, folderMap);
                }
            });
        });
    });

    function syncBookmarkItems(rootChromeId, folderMap) {
        allBookmarks.forEach(bm => {
            const parentId = bm.folder_id && folderMap[bm.folder_id] ? folderMap[bm.folder_id] : rootChromeId;
            chrome.bookmarks.create({
                parentId: parentId,
                title: bm.title || bm.url,
                url: bm.url
            });
        });
        showNotification(`Synced ${allBookmarks.length} bookmarks to browser`);
    }
}

// Initialize bookmark manager when bookmark view is opened
// (called from openItemEditor)

// Credential Save
saveCredentialBtn.addEventListener('click', () => {
    if (activeItemId) {
        const item = getItem(activeItemId);
        if (item && item.type === 'credential') {
            DevNotebookDB.updateItem(activeItemId, {
                title: credentialTitleInput.value,
                username: credentialUsernameInput.value,
                password: credentialPasswordInput.value,
                notes: credentialNotesInput.value
            });
            renderItemsList();
            showNotification('Credential saved');
        }
    }
});

togglePasswordBtn.addEventListener('click', () => {
    const type = credentialPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    credentialPasswordInput.setAttribute('type', type);
});

copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (input) {
            navigator.clipboard.writeText(input.value);
            showNotification('Copied to clipboard');
        }
    });
});


// --- Cross-Tab Synchronization ---
// With SQLite, cross-tab sync is handled by reloading from DB
// Use BroadcastChannel for lightweight notifications
const _syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('devnotebook_sync') : null;

function notifySyncPeers() {
    if (_syncChannel) _syncChannel.postMessage({ type: 'data_changed', ts: Date.now() });
}

if (_syncChannel) {
    _syncChannel.onmessage = (e) => {
        if (e.data && e.data.type === 'data_changed') {
            // Reload UI from DB (another tab made changes)
            renderSidebarControls();
            renderItemsList();
            todos = DevNotebookDB.getTodos().map(t => ({
                id: t.id, text: t.text,
                completed: !!t.completed,
                createdAt: t.created_at,
                completedAt: t.completed_at
            }));
            renderTodoList();

            const newTheme = DevNotebookDB.getSetting('theme', 'system');
            if (newTheme !== currentTheme) {
                currentTheme = newTheme;
                applyTheme(currentTheme);
            }
        }
    };
}

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
// --- Note Management (Replaced by Item Management) ---

function deleteActiveItem() {
    if (!activeProjectId || !activeItemId) return;

    if (confirm('Are you sure you want to delete this item?')) {
        DevNotebookDB.deleteItem(activeItemId);
        renderItemsList();

        const remaining = DevNotebookDB.getItems(activeProjectId, activeItemType);
        if (remaining.length > 0) {
            setActiveItem(remaining[0].id);
        } else {
            createNewItem();
        }
    }
}

// Map delete button
deleteBtn.addEventListener('click', deleteActiveItem);

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
    DevNotebookDB.createTodo(newTodo);
    notifySyncPeers();
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
        if (todo.completed) {
            todo.completedAt = Date.now();
        } else {
            todo.completedAt = null;
        }
        DevNotebookDB.updateTodo(id, { completed: todo.completed, completedAt: todo.completedAt });
        notifySyncPeers();
        renderTodoList();
    }
}

function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this todo?')) {
        todos = todos.filter(t => t.id !== id);
        DevNotebookDB.deleteTodo(id);
        notifySyncPeers();
        renderTodoList();
        showNotification('Todo deleted', 'success');
    }
}

function clearAllTodos() {
    if (todos.length === 0) return;

    if (confirm('Are you sure you want to clear all todos?')) {
        todos = [];
        DevNotebookDB.deleteAllTodos();
        notifySyncPeers();
        renderTodoList();
        showNotification('All todos cleared', 'success');
    }
}

// Make AI dock draggable
if (aiDock) {
    const aiDockContent = aiDock.querySelector('.ai-dock-content');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Clamp position so the dock stays within the viewport
    function clampPosition(x, y) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const rect = aiDock.getBoundingClientRect();
        const dockW = rect.width;
        const dockH = rect.height;

        const minX = 0;
        const minY = 0;
        const maxX = vw - dockW;
        const maxY = vh - dockH;

        return {
            x: Math.max(minX, Math.min(x, maxX)),
            y: Math.max(minY, Math.min(y, maxY))
        };
    }

    // Load saved position and validate it's in-viewport
    const savedPosition = localStorage.getItem('aiDockPosition');
    if (savedPosition) {
        try {
            const { x, y } = JSON.parse(savedPosition);
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            // Only apply if position is remotely sane
            if (x >= -100 && x < vw && y >= -100 && y < vh) {
                aiDock.style.left = x + 'px';
                aiDock.style.top = y + 'px';
                aiDock.style.bottom = 'auto';
                aiDock.style.transform = 'none';
                xOffset = x;
                yOffset = y;
            } else {
                // Stale/off-screen position, clear it
                localStorage.removeItem('aiDockPosition');
            }
        } catch (e) {
            localStorage.removeItem('aiDockPosition');
        }
    }

    aiDockContent.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Re-clamp on window resize so the dock never stays off-screen
    window.addEventListener('resize', () => {
        if (localStorage.getItem('aiDockPosition')) {
            const clamped = clampPosition(xOffset, yOffset);
            xOffset = clamped.x;
            yOffset = clamped.y;
            aiDock.style.left = clamped.x + 'px';
            aiDock.style.top = clamped.y + 'px';
            localStorage.setItem('aiDockPosition', JSON.stringify({ x: clamped.x, y: clamped.y }));
        }
    });

    function dragStart(e) {
        // Don't drag if clicking on input or button
        if (e.target.tagName === 'INPUT' ||
            e.target.tagName === 'TEXTAREA' ||
            e.target.tagName === 'BUTTON' ||
            e.target.tagName === 'SELECT' ||
            e.target.closest('button') ||
            e.target.closest('input') ||
            e.target.closest('textarea')) {
            return;
        }

        // If no saved position yet, capture the current computed position
        if (!localStorage.getItem('aiDockPosition')) {
            const rect = aiDock.getBoundingClientRect();
            xOffset = rect.left;
            yOffset = rect.top;
            aiDock.style.left = xOffset + 'px';
            aiDock.style.top = yOffset + 'px';
            aiDock.style.bottom = 'auto';
            aiDock.style.transform = 'none';
        }

        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        isDragging = true;
        aiDockContent.classList.add('dragging');
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            const rawX = e.clientX - initialX;
            const rawY = e.clientY - initialY;
            const clamped = clampPosition(rawX, rawY);

            currentX = clamped.x;
            currentY = clamped.y;
            xOffset = currentX;
            yOffset = currentY;

            aiDock.style.left = currentX + 'px';
            aiDock.style.top = currentY + 'px';
            aiDock.style.bottom = 'auto';
            aiDock.style.transform = 'none';
        }
    }

    function dragEnd(e) {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;

            isDragging = false;
            aiDockContent.classList.remove('dragging');

            // Save position
            localStorage.setItem('aiDockPosition', JSON.stringify({ x: xOffset, y: yOffset }));
        }
    }
}

function renderTodoList() {
    todoListEl.innerHTML = '';

    // Sort: active todos first, then completed by completion date
    const sortedTodos = [...todos].sort((a, b) => {
        if (a.completed === b.completed) {
            return (b.completedAt || b.createdAt) - (a.completedAt || a.createdAt);
        }
        return a.completed ? 1 : -1;
    });

    // Pagination
    const totalPages = Math.ceil(sortedTodos.length / todosPerPage);
    currentTodoPage = Math.min(currentTodoPage, Math.max(1, totalPages));
    const startIndex = (currentTodoPage - 1) * todosPerPage;
    const endIndex = startIndex + todosPerPage;
    const paginatedTodos = sortedTodos.slice(startIndex, endIndex);

    // Update pagination info
    todoPageInfo.textContent = `${currentTodoPage} / ${totalPages || 1}`;
    todoPrevBtn.disabled = currentTodoPage <= 1;
    todoNextBtn.disabled = currentTodoPage >= totalPages;

    // Render todos
    paginatedTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        let dateInfo = '';
        if (todo.completed && todo.completedAt) {
            const date = new Date(todo.completedAt);
            dateInfo = `<small style="color: var(--text-muted); font-size: 0.8em; margin-left: 8px;">✓ ${date.toLocaleDateString()}</small>`;
        }

        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''}>
            <span>${escapeHtml(todo.text)}${dateInfo}</span>
            <button class="delete-todo-btn">
                <span class="material-symbols-rounded" style="font-size: 16px;">close</span>
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

function getCompletedTodos() {
    return todos.filter(t => t.completed).sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
}

function renderHistoryList() {
    historyTodoList.innerHTML = '';

    const completedTodos = getCompletedTodos();

    // Calculate pagination
    const totalPages = Math.ceil(completedTodos.length / historyItemsPerPage);
    const startIndex = (currentHistoryPage - 1) * historyItemsPerPage;
    const endIndex = startIndex + historyItemsPerPage;
    const paginatedHistory = completedTodos.slice(startIndex, endIndex);

    // Render history items
    paginatedHistory.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item completed';

        const completedDate = new Date(todo.completedAt);
        const dateStr = completedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: completedDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });

        li.innerHTML = `
            <span class="material-symbols-rounded" style="color: var(--accent); font-size: 18px;">check_circle</span>
            <div style="flex: 1;">
                <div>${escapeHtml(todo.text)}</div>
                <div style="font-size: 0.8em; color: var(--text-muted); margin-top: 2px;">${dateStr}</div>
            </div>
            <button class="delete-todo-btn" title="Remove from history">
                <span class="material-symbols-rounded" style="font-size: 16px;">close</span>
            </button>
        `;

        const deleteBtn = li.querySelector('.delete-todo-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteHistoryTodo(todo.id);
        });

        historyTodoList.appendChild(li);
    });

    // Update pagination controls
    updateHistoryPagination(totalPages, completedTodos.length);
}

function updateHistoryPagination(totalPages, totalItems) {
    historyPageInfo.textContent = `${currentHistoryPage} / ${Math.max(1, totalPages)}`;
    historyPrevBtn.disabled = currentHistoryPage <= 1;
    historyNextBtn.disabled = currentHistoryPage >= totalPages;

    if (totalItems === 0) {
        historyTodoList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">No completed todos yet</div>';
    }
}

function deleteHistoryTodo(id) {
    if (confirm('Remove this todo from history?')) {
        todos = todos.filter(t => t.id !== id);
        DevNotebookDB.deleteTodo(id);
        notifySyncPeers();

        // Adjust current page if needed
        const completedTodos = getCompletedTodos();
        const totalPages = Math.ceil(completedTodos.length / historyItemsPerPage);
        if (currentHistoryPage > totalPages && totalPages > 0) {
            currentHistoryPage = totalPages;
        }

        renderHistoryList();
        showNotification('Todo removed from history', 'success');
    }
}

function switchTodoTab(tab) {
    // Update tab buttons
    todoTabs.forEach(btn => {
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Show/hide sections
    if (tab === 'active') {
        activeTodosSection.classList.add('active');
        historyTodosSection.classList.remove('active');
    } else {
        activeTodosSection.classList.remove('active');
        historyTodosSection.classList.add('active');
        renderHistoryList();
    }
}

// --- Theme Management ---
function toggleTheme() {
    if (currentTheme === 'dark') {
        currentTheme = 'light';
    } else {
        currentTheme = 'dark';
    }
    applyTheme(currentTheme);
    DevNotebookDB.setSetting('theme', currentTheme);
    try { localStorage.setItem('devnotebook-theme', currentTheme); } catch(e) {}
    notifySyncPeers();
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



      // Generate a 20-char hex roomId (same size as the app’s default: 10 random bytes)
function makeRoomId() {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join(""); // 20 hex chars
}

// Generate a URL-safe key (similar length/shape to the app’s default)
function makeRoomKey() {
  const bytes = new Uint8Array(16); // adjust length if you prefer
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/=+/g, "") // drop padding
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// Build the link you’ll give to the iframe
function makeCollabLink(baseUrl) {
  const roomId = makeRoomId();
  const roomKey = makeRoomKey();
  return {
    roomId,
    roomKey,
    hash: `#room=${roomId},${roomKey}`, // or `#room_id=${roomId}&room_key=${roomKey}`
    url: `${baseUrl.replace(/#.*$/, "")}#room=${roomId},${roomKey}`,
  };
}

function getDrawCollabLinkUrl(forceRefresh = false) {
    const baseUrl = excalidrawBaseSrc.replace(/#.*$/, '');
    if (forceRefresh || !drawCollabLinkUrl) {
        drawCollabLinkUrl = makeCollabLink(baseUrl).url;
    }
    return drawCollabLinkUrl;
}

function openDrawView(forceRefresh = true, targetUrl = null) {
    lastPrimaryView = { type: activeItemType, itemId: activeItemId };
    const link = targetUrl || getDrawCollabLinkUrl(forceRefresh);
    photoeditor.classList.remove('active');
    excalidraw.setAttribute('src', "");
    setTimeout(() => {
        
    excalidraw.setAttribute('src', link);
    excalidraw.classList.add('active');
    backToAppBtn.classList.add('active');
    fabAddBtn.classList.add('hide');
    }, 100);
    return link;
}


// --- Event Listeners ---
toggleSidebarBtn.addEventListener('click', () => {
    appContainer.classList.toggle('sidebar-open');
});

// AI Toggle Button
if (aiToggleBtn && aiDock) {
    aiToggleBtn.addEventListener('click', () => {
        setAIDockVisibility(!aiDockActive);
    });
}

if (fabAIBtn && aiDock) {
    fabAIBtn.addEventListener('click', () => {
        setAIDockVisibility(!aiDockActive);
    });
}



// Search Listener
searchInput.addEventListener('input', renderItemsList);


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

// Todo pagination
todoPrevBtn.addEventListener('click', () => {
    if (currentTodoPage > 1) {
        currentTodoPage--;
        renderTodoList();
    }
});

todoNextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(todos.length / todosPerPage);
    if (currentTodoPage < totalPages) {
        currentTodoPage++;
        renderTodoList();
    }
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
    if (confirm('WARNING: This will delete ALL Workspaces, Projects, and items permanently. Are you sure?')) {
        // Wipe all SQLite data
        DevNotebookDB.deleteAllTodos();
        DevNotebookDB.clearChatHistory();
        const allWs = DevNotebookDB.getWorkspaces();
        for (const ws of allWs) {
            DevNotebookDB.deleteWorkspace(ws.id);
        }
        DevNotebookDB.forcePersist().then(() => window.location.reload());
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
// Share/Export/Import
openDrawBtn.addEventListener('click', () => {
    openDrawView(true);
    if (activeItemType === 'draw') renderItemsList();
});
openPhotoeditorBtn.addEventListener('click', () => {
    lastPrimaryView = { type: activeItemType, itemId: activeItemId };
    excalidraw.classList.remove('active');
    photoeditor.classList.add('active');
    backToAppBtn.classList.add('active');
    fabAddBtn.classList.add('hide');
});
backToAppBtn.addEventListener('click', () => {
    excalidraw.classList.remove('active');
    photoeditor.classList.remove('active');
    backToAppBtn.classList.remove('active');
    fabAddBtn.classList.remove('hide');

    // Restore last primary view (type + item) if available; fallback to current type, then notes
    let restoreType = lastPrimaryView?.type || activeItemType || 'note';
    const restoreItemId = lastPrimaryView?.itemId;

    activeItemType = restoreType;
    resourceTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.type === activeItemType);
    });
    saveWorkspaces();
    renderItemsList();

    if (activeProjectId) {
        let targetId = null;
        if (restoreItemId) {
            const found = DevNotebookDB.getItem(restoreItemId);
            if (found && found.type === activeItemType) targetId = found.id;
        }
        if (!targetId) {
            const items = DevNotebookDB.getItems(activeProjectId, activeItemType);
            if (items.length > 0) targetId = items[0].id;
        }
        if (targetId) setActiveItem(targetId, { openDraw: false });
        else createNewItem();
    }
});

shareBtn.addEventListener('click', shareCurrentItem);
exportSingleBtn.addEventListener('click', exportSingleItem);
exportAllBtn.addEventListener('click', exportAllWorkspaces);

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
// --- Share/Export/Import Logic ---
async function shareCurrentItem() {
    if (!activeItemId) {
        showNotification('No item selected to share', 'error');
        return;
    }

    const item = getItem(activeItemId);
    if (!item) return;

    let shareTitle = item.title || 'Untitled';
    let shareText = '';

    if (item.type === 'note') {
        // Extract text from Quill Delta format
        let bodyText = '';
        if (item.body && typeof item.body === 'object' && item.body.ops) {
            bodyText = item.body.ops.map(op => op.insert || '').join('');
        } else if (typeof item.body === 'string') {
            bodyText = item.body;
        }
        shareText = `${shareTitle}\n\n${bodyText}`;
    } else if (item.type === 'bookmark') {
        shareText = `${shareTitle}\n${item.url}`;
    } else if (item.type === 'credential') {
        showNotification('Sharing credentials is restricted', 'error');
        return;
    }

    // Try using Web Share API if available
    if (navigator.share) {
        try {
            await navigator.share({
                title: shareTitle,
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

function exportSingleItem() {
    if (!activeItemId) {
        showNotification('No item selected to export', 'error');
        return;
    }

    const item = getItem(activeItemId);
    if (!item) return;

    const data = {
        item: item,
        exportDate: new Date().toISOString(),
        version: '1.2'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = (item.title || 'Untitled').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Item exported successfully!', 'success');
}

function exportAllWorkspaces() {
    const data = DevNotebookDB.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dev-notebook-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Backup exported successfully!', 'success');
}

function importNotebookFile(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);

            // Basic validation
            if (!data.workspaces && !data.item && !data.notes && !data.todos && !data.note) {
                showNotification('Invalid notebook file', 'error');
                return;
            }

            let importedCount = 0;

            // 1. Import Workspaces (Full Backup)
            if (data.workspaces && Array.isArray(data.workspaces)) {
                for (const ws of data.workspaces) {
                    const newWsId = 'ws_' + Date.now() + Math.random().toString(36).substr(2, 5);
                    DevNotebookDB.createWorkspace(newWsId, ws.name);
                    if (ws.projects && Array.isArray(ws.projects)) {
                        for (const proj of ws.projects) {
                            const newProjId = 'proj_' + Date.now() + Math.random().toString(36).substr(2, 5);
                            DevNotebookDB.createProject(newProjId, newWsId, proj.name);
                            if (proj.items && Array.isArray(proj.items)) {
                                for (const item of proj.items) {
                                    DevNotebookDB.createItem({
                                        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                                        project_id: newProjId,
                                        type: item.type || 'note',
                                        title: item.title || '',
                                        created: item.created,
                                        body: item.body,
                                        url: item.url,
                                        description: item.description,
                                        username: item.username,
                                        password: item.password,
                                        notes: item.notes,
                                        draw_url: item.draw_url || item.drawUrl
                                    });
                                }
                            }
                        }
                    }
                    importedCount++;
                }
                showNotification(`Imported ${importedCount} workspaces`, 'success');
            }

            // 2. Import Single Item
            if (data.item && activeProjectId) {
                DevNotebookDB.createItem({
                    ...data.item,
                    id: Date.now().toString(),
                    project_id: activeProjectId,
                    draw_url: data.item.draw_url || data.item.drawUrl
                });
                importedCount++;
            }

            // 3. Import Legacy Single Note
            if (data.note && typeof data.note === 'object' && activeProjectId) {
                DevNotebookDB.createItem({
                    ...data.note,
                    id: Date.now().toString(),
                    project_id: activeProjectId,
                    type: 'note'
                });
                importedCount++;
            }

            // 4. Import Legacy Notes Array
            if (data.notes && Array.isArray(data.notes) && activeProjectId) {
                for (const n of data.notes) {
                    DevNotebookDB.createItem({
                        ...n,
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                        project_id: activeProjectId,
                        type: 'note'
                    });
                    importedCount++;
                }
            }

            // 5. Import Todos
            if (data.todos && Array.isArray(data.todos)) {
                for (const todo of data.todos) {
                    const newTodo = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                        text: todo.text,
                        completed: !!todo.completed,
                        createdAt: todo.createdAt || Date.now(),
                        completedAt: todo.completedAt || null
                    };
                    todos.push(newTodo);
                    DevNotebookDB.createTodo(newTodo);
                }
            }

            // Re-initialize UI
            renderSidebarControls();
            renderItemsList();
            renderTodoList();

            if (importedCount > 0) {
                showNotification(`Imported content successfully!`, 'success');
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
    const savedAI = DevNotebookDB.getSetting('aiSettings', null);
    if (savedAI) {
        aiSettings = { ...aiSettings, ...savedAI };

        // Ensure providers object exists if migrating from old settings
        if (!aiSettings.providers) {
            aiSettings.providers = {
                openai: true,
                gemini: true,
                webai: true,
                anthropic: true,
                xai: true,
                deepseek: true,
                mistral: true,
                cohere: false,
                huggingface: false,
                nvidia: false,
                alibaba: false
            };
        } else {
            aiSettings.providers = {
                openai: aiSettings.providers.openai ?? true,
                gemini: aiSettings.providers.gemini ?? true,
                webai: aiSettings.providers.webai ?? true,
                anthropic: aiSettings.providers.anthropic ?? true,
                xai: aiSettings.providers.xai ?? true,
                deepseek: aiSettings.providers.deepseek ?? true,
                mistral: aiSettings.providers.mistral ?? true,
                cohere: aiSettings.providers.cohere ?? false,
                huggingface: aiSettings.providers.huggingface ?? false,
                nvidia: aiSettings.providers.nvidia ?? false,
                alibaba: aiSettings.providers.alibaba ?? false
            };
        }
    }

    // Populate Settings UI
    if (enableOpenAI) enableOpenAI.checked = aiSettings.providers.openai;
    if (enableGemini) enableGemini.checked = aiSettings.providers.gemini;
    if (enableWebAI) enableWebAI.checked = aiSettings.providers.webai;
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
    toggleKeyContainer(webaiKeyContainer, aiSettings.providers.webai);
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
    const saved = DevNotebookDB.getSetting('aiSnippets', null);
    if (saved && Array.isArray(saved)) {
        AI_SNIPPETS = saved;
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
                <span class="material-symbols-rounded" style="font-size: 18px;">delete</span>
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
    DevNotebookDB.setSetting('aiSnippets', snippets);
    renderSnippetsList();
    showNotification('Snippets saved successfully!');
}

// Reset Snippets to defaults
async function resetSnippets() {
    AI_SNIPPETS = [...DEFAULT_AI_SNIPPETS];
    DevNotebookDB.setSetting('aiSnippets', AI_SNIPPETS);
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
        if (aiDock) aiDock.style.display = 'none'; // Hide dock if nothing enabled
        aiDockActive = false;
        if (aiToggleBtn) aiToggleBtn.classList.remove('active');
    } else {
        if (aiDockActive && aiDock) {
            aiDock.style.display = 'block';
        }
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
                DevNotebookDB.setSetting('aiSettings', aiSettings);
            }
        }
    }
}

function isWebAIModel(modelId) {
    return typeof modelId === 'string' && modelId.startsWith('chrome-');
}

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
setupProviderToggle(enableWebAI, webaiKeyContainer);
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
        aiSettings.providers.webai = enableWebAI ? enableWebAI.checked : false;
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

        await DevNotebookDB.setSetting('aiSettings', aiSettings);
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
        DevNotebookDB.setSetting('aiSettings', aiSettings);
        if (isWebAIModel(aiSettings.lastModel)) {
            webAIIntentActive = true;
            refreshWebAIStatus(false);
        } else {
            hideWebAIStatus();
        }
    });
}

if (aiCancelBtn) {
    aiCancelBtn.addEventListener('click', () => {
        aiPreviewSection.classList.add('hidden');
        aiAppendBtn.classList.add('hidden');
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

        aiPromptInput.value = beforeSlash + snippet.text + '\n' + afterCursor;
        const newCursorPos = beforeSlash.length + snippet.text.length + 1;
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
        switch (e.key) {
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
        // Skip if in chat mode - handled by separate listener
        const outputType = document.getElementById('ai-type-select').value;
        if (outputType === 'chat') {
            return;
        }

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
        } else if (model.startsWith('chrome-')) {
            provider = 'webai';
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
        } else if (model.startsWith('banana')) {
            provider = 'gemini';
            apiKey = aiSettings.geminiKey;
        }

        if (!provider) {
            showAIError(`The model '${model}' is not currently supported with a direct API integration.`);
            return;
        }

        if (provider !== 'webai' && !apiKey) {
            showAIError(`API Key for ${provider} is missing. Please configure it in Settings.`);
            return;
        }

        if (provider === 'webai') {
            const ok = await ensureWebAIReadyForUse(true);
            if (!ok) return;
        }
        if (!prompt) {
            showAIError('Please enter a prompt');
            return;
        }

        // Save last used model
        aiSettings.lastModel = model;
        DevNotebookDB.setSetting('aiSettings', aiSettings);

        // UI State
        aiAbortController = new AbortController();
        aiLoading.classList.remove('hidden');
        if (aiStopBtn) aiStopBtn.classList.remove('hidden');
        aiError.classList.add('hidden');
        aiPreviewSection.classList.add('hidden');
        aiGenerateBtn.disabled = true;
        // aiGenerateBtn.innerHTML = '<span class="material-symbols-rounded spin">refresh</span>'; // Optional: change icon while loading

        try {
            const outputType = document.getElementById('ai-type-select').value;
            let baseInstruction = aiSettings.systemInstruction || "You are a helpful assistant.";

            // Handle note mode with real-time streaming
            if (outputType === 'note') {
                const formatInstruction = " Please provide well-formatted content with a brief title on the first line if appropriate. Use Markdown formatting including code blocks with language tags.";
                const systemInstruction = baseInstruction + formatInstruction;

                // Ensure we have an active note item
                if (!activeItemId || activeItemType !== 'note') {
                    // Create new note item in current project
                    if (activeProjectId) {
                        const newNote = {
                            id: Date.now().toString(),
                            project_id: activeProjectId,
                            type: 'note',
                            title: 'AI Generated Note',
                            body: '',
                            created: new Date().toISOString()
                        };
                        DevNotebookDB.createItem(newNote);
                        activeItemType = 'note';
                        activeItemId = newNote.id;
                        saveWorkspaces();
                        renderItemsList();
                        renderSidebarControls();

                        // Re-init editor with empty content
                        noteTitleEl.value = newNote.title;
                        quill.setText('');
                    }
                }

                // Prepare for streaming
                const startPosition = quill.getLength();
                const separator = startPosition > 1 ? '\n\n' : '';
                let streamedContent = '';
                let insertPosition = startPosition - 1;

                // Insert separator if needed
                if (separator) {
                    quill.insertText(insertPosition, separator);
                    insertPosition += separator.length;
                }

                // Stream content in real-time
                let buffer = ''; // Buffer to accumulate text for parsing

                await callAIProviderStreaming(
                    provider,
                    apiKey,
                    model,
                    [{ role: 'user', content: prompt }],
                    // onChunk - called for each piece of streamed text
                    (chunk) => {
                        buffer += chunk;

                        // Process complete lines for better markdown parsing
                        const lines = buffer.split('\n');

                        // Keep the last incomplete line in buffer
                        if (!chunk.includes('\n')) {
                            return; // Wait for more content
                        }

                        // Process all complete lines except the last
                        const completeLines = lines.slice(0, -1);
                        buffer = lines[lines.length - 1];

                        completeLines.forEach((line, idx) => {
                            insertPosition = insertMarkdownLine(quill, insertPosition, line);
                            if (idx < completeLines.length - 1 || buffer === '') {
                                insertPosition = insertMarkdownLine(quill, insertPosition, '\n');
                            }
                        });

                        // Scroll to bottom
                        quill.setSelection(insertPosition, 0);
                    },
                    // onComplete - called when streaming finishes
                    (fullText) => {
                        // Apply code formatting to the streamed content
                        setTimeout(() => {
                            scanAndFormatCodeBlocks(quill);
                            setTimeout(() => {
                                highlightCodeBlocks();
                            }, 150);
                        }, 100);

                        // Trigger save
                        if (activeItemId) {
                            DevNotebookDB.updateItem(activeItemId, { body: quill.getContents() });
                        }

                        showNotification('Note added successfully!', 'success');
                        aiPromptInput.value = '';
                    },
                    // onError
                    (error) => {
                        if (error?.name === 'AbortError') {
                            showNotification('Generation stopped', 'info');
                        } else {
                            showAIError(error.message || 'Streaming failed');
                        }
                    },
                    { signal: aiAbortController.signal }
                );
            } else {
                // Todo and Both modes use regular call for JSON parsing
                let formatInstruction = "";
                if (outputType === 'todo') {
                    formatInstruction = " Please provide the response as a JSON object with a 'todos' field containing an array of task strings. Do not include title or content fields.";
                } else if (outputType === 'both') {
                    formatInstruction = " Please provide the response in JSON format with 'title', 'content' (Markdown paragraphs), and a 'todos' field (array of strings).";
                }

                const systemInstruction = baseInstruction + formatInstruction;
                const result = await callAIProvider(provider, apiKey, model, prompt, systemInstruction, { signal: aiAbortController.signal });

                let title = '';
                let content = result;
                let generatedTodos = [];

                // Try to parse JSON  
                try {
                    const jsonStr = result.replace(/```json\n?|\n?```/g, '');
                    const parsed = JSON.parse(jsonStr);
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

                if (outputType === 'todo') {
                    // Show todo preview only
                    aiPreviewSection.classList.add('hidden');

                    if (generatedTodos.length > 0) {
                        aiTodosPreviewList.innerHTML = generatedTodos.map((task, i) =>
                            `<div>${i + 1}. ${escapeHtml(task)}</div>`
                        ).join('');
                        aiTodosPreviewSection.dataset.todos = JSON.stringify(generatedTodos);
                        aiTodosPreviewSection.classList.remove('hidden');
                    } else {
                        aiTodosPreviewSection.classList.add('hidden');
                        showNotification('No todos were generated', 'error');
                    }
                } else if (outputType === 'both') {
                    // Stream note directly + show todo preview
                    streamNoteToEditor(title, content);

                    if (generatedTodos.length > 0) {
                        aiTodosPreviewList.innerHTML = generatedTodos.map((task, i) =>
                            `<div>${i + 1}. ${escapeHtml(task)}</div>`
                        ).join('');
                        aiTodosPreviewSection.dataset.todos = JSON.stringify(generatedTodos);
                        aiTodosPreviewSection.classList.remove('hidden');
                    } else {
                        aiTodosPreviewSection.classList.add('hidden');
                    }
                }
            }
        } catch (error) {
            if (error?.name === 'AbortError') {
                showNotification('Generation stopped', 'info');
            } else {
                showAIError(error.message);
            }
        } finally {
            if (aiAbortController) aiAbortController = null;
            aiLoading.classList.add('hidden');
            if (aiStopBtn) aiStopBtn.classList.add('hidden');
            aiGenerateBtn.disabled = false;
            // aiGenerateBtn.innerHTML = '<span class="material-symbols-rounded">arrow_upward</span>'; // Restore icon
        }
    });
}

// Stream note directly to editor (no preview)
// Stream note directly to editor (no preview)
function streamNoteToEditor(title, content) {
    let item = getItem(activeItemId);

    // Ensure we have an active note item
    if (!item || activeItemType !== 'note') {
        createNewItem(); // Creates a note by default currently or based on default
        // Force type to note if createNewItem defaults to something else (though it defaults to activeItemType)
        item = getItem(activeItemId);

        // If we are still not in a note (e.g. user selected bookmark tab), we need to handle that
        if (item.type !== 'note') {
            // For simplicity, just error or try to find a note
            showNotification('Please select a Note to use AI generation', 'error');
            return;
        }

        if (title) {
            item.title = title;
            noteTitleEl.value = title;
        }
    } else if (title && !noteTitleEl.value.trim()) {
        noteTitleEl.value = title;
        item.title = title;
    }

    // Insert content at the end of the editor
    if (content) {
        const currentLength = quill.getLength();
        const separator = currentLength > 1 ? '\n\n' : '';

        quill.insertText(currentLength - 1, separator + content);

        // Apply code formatting after insertion
        setTimeout(() => {
            scanAndFormatCodeBlocks(quill);
            setTimeout(() => {
                highlightCodeBlocks();
            }, 150);
        }, 100);

        // Save (include title in case it was set above)
        DevNotebookDB.updateItem(activeItemId, { body: quill.getContents(), title: noteTitleEl.value });
        renderItemsList();

        showNotification('Note added successfully!', 'success');
    }

    // Clear prompt
    aiPromptInput.value = '';
}

// Apply button handler for preview mode
// Apply button handler for preview mode
if (aiApplyBtn) {
    aiApplyBtn.addEventListener('click', () => {
        const title = aiPreviewSection.dataset.title;
        const content = aiPreviewSection.dataset.content;

        if (activeItemType !== 'note') {
            showNotification('Can only apply text to Notes', 'error');
            return;
        }

        // Always append content
        if (content) {
            const currentLength = quill.getLength();

            // Add separator if note has content
            let separator = currentLength > 1 ? '\n\n' : '';

            // Insert at the end
            quill.insertText(currentLength - 1, separator + content);
        }

        const item = getItem(activeItemId);

        // Only update title if empty
        if (title && item && (!item.title || !item.title.trim())) {
            item.title = title;
            noteTitleEl.value = title;
        }

        // Trigger magic formatting for AI content
        setTimeout(() => {
            scanAndFormatCodeBlocks(quill);
            // Also trigger syntax highlighting
            setTimeout(() => {
                highlightCodeBlocks();
            }, 150);
        }, 100);

        if (activeItemId) {
            DevNotebookDB.updateItem(activeItemId, { body: quill.getContents(), title: noteTitleEl.value });
            renderItemsList();
        }

        showNotification('Content appended to note!', 'success');

        aiPromptInput.value = '';
        aiPreviewSection.classList.add('hidden');
    });
}



function showAIError(msg) {
    aiError.textContent = msg;
    aiError.classList.remove('hidden');
}

// --- Media Generation Logic ---

// Open media generation modal
function openMediaModal(type) {
    currentMediaType = type;
    mediaModalTitle.textContent = type === 'image' ? 'Generate Image' : 'Generate Video';

    // Show/hide appropriate options
    if (type === 'image') {
        imageOptions.classList.remove('hidden');
        videoOptions.classList.add('hidden');
    } else {
        imageOptions.classList.add('hidden');
        videoOptions.classList.remove('hidden');
    }

    // Determine and display which provider will be used
    let providerName = '';
    let modelName = '';

    if (type === 'image') {
        if (aiSettings.providers.openai && aiSettings.openaiKey) {
            providerName = 'OpenAI';
            modelName = 'DALL-E 3';
        } else if (aiSettings.providers.gemini && aiSettings.geminiKey) {
            providerName = 'Google';
            modelName = 'Imagen 3 / Nano Banana';
        }
    } else {
        if (aiSettings.providers.openai && aiSettings.openaiKey) {
            providerName = 'OpenAI';
            modelName = 'Sora';
        } else if (aiSettings.providers.gemini && aiSettings.geminiKey) {
            providerName = 'Google';
            modelName = 'Veo 2';
        }
    }

    if (providerName && mediaProviderInfo && mediaProviderText) {
        mediaProviderText.textContent = `Using: ${modelName} (${providerName})`;
        mediaProviderInfo.style.display = 'flex';
    } else if (mediaProviderInfo) {
        mediaProviderInfo.style.display = 'none';
    }

    // Reset preview area
    mediaPreviewArea.classList.add('hidden');
    mediaLoading.classList.add('hidden');
    generatedImage.classList.add('hidden');
    generatedVideo.classList.add('hidden');
    mediaActions.classList.add('hidden');
    mediaPromptInput.value = '';
    currentMediaUrl = null;

    mediaGenerationModal.classList.add('show');
}

// Image generation function
async function generateImage(provider, apiKey, prompt, size, quality) {
    if (provider === 'openai') {
        // DALL-E 3
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: prompt,
                n: 1,
                size: size,
                quality: quality
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenAI Error: ${error}`);
        }

        const data = await response.json();
        return data.data[0].url;
    } else if (provider === 'gemini') {
        // Google Imagen 3
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instances: [{
                    prompt: prompt
                }],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: size === '1024x1024' ? '1:1' : (size === '1024x1792' ? '9:16' : '16:9'),
                    negativePrompt: '',
                    personGeneration: 'allow_adult'
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Gemini Error: ${error}`);
        }

        const data = await response.json();
        // Gemini returns base64 encoded image
        return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
    }

    throw new Error('Unsupported provider for image generation');
}

// Video generation function
async function generateVideo(provider, apiKey, prompt, duration, resolution) {
    if (provider === 'openai') {
        // OpenAI Sora
        const response = await fetch('https://api.openai.com/v1/videos/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'sora-1.0',
                prompt: prompt,
                resolution: resolution,
                duration: parseInt(duration)
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenAI Sora Error: ${error}`);
        }

        const data = await response.json();
        // Sora might return a video URL or require polling
        if (data.video_url) {
            return data.video_url;
        } else if (data.id) {
            // Poll for completion
            return await pollVideoCompletion('openai', apiKey, data.id);
        }
        throw new Error('Unexpected Sora response format');
    } else if (provider === 'gemini') {
        // Google Veo 2
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/veo-2:predict?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instances: [{
                    prompt: prompt
                }],
                parameters: {
                    duration: parseInt(duration),
                    resolution: resolution,
                    aspectRatio: resolution === '1920x1080' ? '16:9' : '9:16'
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Gemini Veo 2 Error: ${error}`);
        }

        const data = await response.json();
        // Veo 2 might return base64 or URL
        if (data.predictions[0].videoUrl) {
            return data.predictions[0].videoUrl;
        } else if (data.predictions[0].bytesBase64Encoded) {
            return `data:video/mp4;base64,${data.predictions[0].bytesBase64Encoded}`;
        }
        throw new Error('Unexpected Veo 2 response format');
    }

    throw new Error('Video generation is only supported with OpenAI (Sora) or Google (Veo 2)');
}

// Poll for video completion (for async video generation)
async function pollVideoCompletion(provider, apiKey, videoId) {
    const maxAttempts = 60; // 5 minutes max
    const pollInterval = 5000; // 5 seconds

    for (let i = 0; i < maxAttempts; i++) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        let response;
        if (provider === 'openai') {
            response = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
        }

        if (response && response.ok) {
            const data = await response.json();
            if (data.status === 'completed' && data.video_url) {
                return data.video_url;
            } else if (data.status === 'failed') {
                throw new Error('Video generation failed');
            }
        }
    }

    throw new Error('Video generation timed out');
}

// Close media modal
if (closeMediaModal) {
    closeMediaModal.addEventListener('click', () => {
        mediaGenerationModal.classList.remove('show');
    });
}

// Close modal on outside click
if (mediaGenerationModal) {
    mediaGenerationModal.addEventListener('click', (e) => {
        if (e.target === mediaGenerationModal) {
            mediaGenerationModal.classList.remove('show');
        }
    });
}

// Generate media
if (generateMediaBtn && mediaPromptInput) {
    const generateMedia = async () => {
        const prompt = mediaPromptInput.value.trim();

        if (!prompt) {
            showNotification('Please enter a prompt', 'error');
            return;
        }

        let provider = '';
        let apiKey = '';

        // Determine provider based on what's enabled and media type
        if (currentMediaType === 'image') {
            // For image generation, prioritize: OpenAI > Gemini > Nano Banana
            if (aiSettings.providers.openai && aiSettings.openaiKey) {
                provider = 'openai';
                apiKey = aiSettings.openaiKey;
            } else if (aiSettings.providers.gemini && aiSettings.geminiKey) {
                provider = 'gemini';
                apiKey = aiSettings.geminiKey;
            }
        } else {
            // For video generation, prioritize: OpenAI (Sora) > Gemini (Veo 2)
            if (aiSettings.providers.openai && aiSettings.openaiKey) {
                provider = 'openai';
                apiKey = aiSettings.openaiKey;
            } else if (aiSettings.providers.gemini && aiSettings.geminiKey) {
                provider = 'gemini';
                apiKey = aiSettings.geminiKey;
            }
        }

        if (!apiKey) {
            showNotification(`API Key for ${provider} is missing`, 'error');
            return;
        }

        // Show loading
        mediaPreviewArea.classList.remove('hidden');
        mediaLoading.classList.remove('hidden');
        generatedImage.classList.add('hidden');
        generatedVideo.classList.add('hidden');
        mediaActions.classList.add('hidden');
        generateMediaBtn.disabled = true;

        try {
            if (currentMediaType === 'image') {
                const size = imageSizeSelect.value;
                const quality = imageQualitySelect.value;

                const url = await generateImage(provider, apiKey, prompt, size, quality);

                generatedImage.src = url;
                generatedImage.classList.remove('hidden');
                currentMediaUrl = url;
                mediaActions.classList.remove('hidden');
            } else {
                // Video generation
                const duration = videoDurationSelect.value;
                const resolution = videoResolutionSelect.value;

                const url = await generateVideo(provider, apiKey, prompt, duration, resolution);

                generatedVideo.src = url;
                generatedVideo.classList.remove('hidden');
                currentMediaUrl = url;
                mediaActions.classList.remove('hidden');
            }

            mediaLoading.classList.add('hidden');
        } catch (error) {
            mediaLoading.classList.add('hidden');
            showNotification('Generation failed: ' + error.message, 'error');
        } finally {
            generateMediaBtn.disabled = false;
        }
    };

    generateMediaBtn.addEventListener('click', generateMedia);

    mediaPromptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            generateMedia();
        }
    });
}

// Regenerate media
if (regenerateMediaBtn) {
    regenerateMediaBtn.addEventListener('click', () => {
        generateMediaBtn.click();
    });
}

// Download media
if (downloadMediaBtn) {
    downloadMediaBtn.addEventListener('click', () => {
        if (currentMediaUrl) {
            const link = document.createElement('a');
            link.href = currentMediaUrl;
            link.download = `generated-${currentMediaType}-${Date.now()}.${currentMediaType === 'image' ? 'png' : 'mp4'}`;
            link.click();
            showNotification('Downloaded successfully', 'success');
        }
    });
}

// Insert media to note
if (insertMediaBtn) {
    insertMediaBtn.addEventListener('click', () => {
        if (currentMediaUrl) {
            const currentLength = quill.getLength();
            const insertText = `\n\n[Generated ${currentMediaType}]\n${currentMediaUrl}\n`;

            quill.insertText(currentLength - 1, insertText);

            // Trigger code formatting after inserting media
            setTimeout(() => {
                scanAndFormatCodeBlocks(quill);
                highlightCodeBlocks();
            }, 100);

            updateActiveNote();

            showNotification('Media inserted to note', 'success');
            mediaGenerationModal.classList.remove('show');
        }
    });
}

// --- Chat Mode Logic ---

function setWebAIProgress(percent) {
    if (!webaiProgress || !webaiProgressLabel) return;

    if (percent === null || percent === undefined) {
        webaiProgress.hidden = true;
        webaiProgressLabel.classList.add('hidden');
        return;
    }

    const clamped = Math.max(0, Math.min(100, Math.round(percent)));
    webaiProgress.hidden = false;
    webaiProgress.value = clamped / 100;
    webaiProgressLabel.textContent = `${clamped}%`;
    webaiProgressLabel.classList.remove('hidden');
}

function setWebAIDownloading(isDownloading) {
    if (webaiCancelBtn) webaiCancelBtn.classList.toggle('hidden', !isDownloading);
    if (webaiCancelBtnModal) webaiCancelBtnModal.classList.toggle('hidden', !isDownloading);
}

function hideWebAIStatus() {
    if (webaiStatus) webaiStatus.classList.add('hidden');
    setWebAIProgress(null);
    setWebAIDownloading(false);
}

async function getLanguageModelAvailability() {
    if (!aiDockActive && !webAIIntentActive) {
        return 'unavailable';
    }
    try {
        if (typeof LanguageModel !== 'undefined') {
            return await LanguageModel.availability({
                expectedInputLanguages: ['en'],
                expectedOutputLanguages: ['en']
            });
        }
        if (window.ai && window.ai.languageModel && window.ai.languageModel.availability) {
            const result = await window.ai.languageModel.availability({
                expectedInputLanguages: ['en'],
                expectedOutputLanguages: ['en'],
                languages: ['en']
            });
            return result?.state || result;
        }
    } catch (e) {
        console.warn('WebAI availability check failed:', e);
    }
    return 'unavailable';
}

async function startWebAIDownload() {
    if (!navigator.userActivation?.isActive) {
        showNotification('Click or press a key first to allow Web AI download (user activation required).', 'error');
        return false;
    }

    try {
        setWebAIProgress(0);
        webaiDownloadCanceled = false;
        setWebAIDownloading(true);

        if (typeof LanguageModel === 'undefined') {
            throw new Error('LanguageModel is not supported in this browser.');
        }

        if (webaiDownloadSession && webaiDownloadSession.destroy) {
            try { webaiDownloadSession.destroy(); } catch (e) { /* ignore */ }
        }

        const session = await LanguageModel.create({
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                    const loaded = typeof e.loaded === 'number' ? e.loaded : 0;
                    const total = typeof e.total === 'number' ? e.total : 1;
                    const percent = total > 0 ? (loaded / total) * 100 : loaded * 100;
                    if (webaiDownloadCanceled) {
                        try { session?.destroy?.(); } catch (err) { /* ignore */ }
                        setWebAIProgress(null);
                        return;
                    }
                    setWebAIProgress(percent);
                });
            },
            expectedInputLanguages: ['en'],
            expectedOutputLanguages: ['en'],
            expectedInputs: [{ type: 'text', languages: ['en'] }],
            expectedOutputs: [{ type: 'text', languages: ['en'] }]
        });

        webaiDownloadSession = session;

        // End the session immediately; we only needed it to trigger download
        try { session?.destroy?.(); } catch (e) { /* ignore */ }
        showNotification('Web AI model downloaded. Ready to use.', 'success');
        setWebAIProgress(null);
        setWebAIDownloading(false);
        return true;
    } catch (err) {
        console.error(err);
        showNotification(err.message || 'Web AI download failed', 'error');
        setWebAIProgress(null);
        setWebAIDownloading(false);
        return false;
    }
}

function cancelWebAIDownload() {
    webaiDownloadCanceled = true;
    if (webaiDownloadSession && typeof webaiDownloadSession.destroy === 'function') {
        try { webaiDownloadSession.destroy(); } catch (e) { /* ignore */ }
    }
    setWebAIProgress(null);
    setWebAIDownloading(false);
    showNotification('Web AI download canceled.', 'error');
}

async function refreshWebAIStatus(autoStartDownload = false) {
    if (!webaiStatus || !webaiStatusText) return false;
    if (!aiDockActive && !webAIIntentActive) {
        hideWebAIStatus();
        return false;
    }

    const availability = await getLanguageModelAvailability();
    const modelName = 'Gemini Nano (Chrome)';

    if (availability === 'available') {
        webaiStatus.classList.add('hidden');
        setWebAIProgress(null);
        setWebAIDownloading(false);
        return true;
    }

    webaiStatus.classList.remove('hidden');
    if (availability === 'unavailable') {
        setWebAIProgress(null);
        setWebAIDownloading(false);
    }

    if (availability === 'unavailable') {
        webaiStatusText.textContent = `${modelName} is unavailable. Enable Chrome built-in AI flags and restart, then try downloading.`;
        return false;
    }

    if (availability === 'downloadable' || availability === 'downloading') {
        webaiStatusText.textContent = `${modelName} needs to download. This runs locally and requires disk space and an unmetered connection.`;
        setWebAIProgress(0);
        setWebAIDownloading(false);
        if (autoStartDownload) {
            return await startWebAIDownload();
        }
        return false;
    }

    webaiStatusText.textContent = `${modelName} state: ${availability}.`;
    setWebAIDownloading(false);
    return false;
}

function renderWebAIModelsList(availability) {
    if (!webaiModelsList) return;
    const models = [
        { id: 'chrome-gemini-nano', name: 'Gemini Nano', description: 'On-device text model (Prompt API)' },
        { id: 'chrome-prompt-api', name: 'Prompt API', description: 'Prompt API access for local model' },
        { id: 'chrome-summarizer', name: 'Summarizer', description: 'Summarizer API in Chrome' }
    ];

    webaiModelsList.innerHTML = models.map((m) => `
        <div class="webai-model-card">
            <h5>${m.name}</h5>
            <div class="status">State: ${availability}</div>
            <div class="status">${m.description}</div>
        </div>
    `).join('');
}

function renderWebAIGuides() {
    if (!webaiGuidesList) return;
    const guides = [
        { label: 'Setup Chrome built-in AI', href: 'https://developer.chrome.com/docs/ai/built-in' },
        { label: 'Enable Prompt API flag', href: 'chrome://flags/#prompt-api-for-gemini-nano' },
        { label: 'Enable on-device model flag (copy and open)', href: 'chrome://flags/#optimization-guide-on-device-model' },
        { label: 'Enable on-device internal flag and activate debug mode. (copy and open)', href: 'chrome://on-device-internals' },
        { label: 'Troubleshoot install not complete', href: 'https://developer.chrome.com/docs/ai/prompt-api#troubleshooting' }
    ];
    webaiGuidesList.innerHTML = guides.map(g => `<li><a href="${g.href}" target="_blank" rel="noopener">${g.label}</a></li>`).join('');
}

async function ensureWebAIReadyForUse(triggerDownload = false) {
    if (!aiDockActive) {
        return false;
    }
    webAIIntentActive = true;
    const availability = await getLanguageModelAvailability();
    const ready = availability === 'available';

    // Update status UI without blocking on full download
    refreshWebAIStatus(false);

    if (!ready) {
        openWebAIStorageModal();
        if (triggerDownload && (availability === 'downloadable' || availability === 'downloading')) {
            startWebAIDownload();
        }
    }

    return ready;
}

function openWebAIStorageModal() {
    if (!webaiStorageModal) return;
    webAIIntentActive = true;
    webaiStorageModal.style.display = 'block';
    updateWebAIStorageEstimate();
    refreshWebAIStatus(false).then((available) => {
        if (webaiStatusSummary) {
            webaiStatusSummary.textContent = available ? 'Available' : 'Not ready';
        }
        getLanguageModelAvailability().then(state => {
            renderWebAIModelsList(state);
        });
    });
    renderWebAIGuides();
}

function closeWebAIStorageModal() {
    if (webaiStorageModal) webaiStorageModal.style.display = 'none';
}

async function updateWebAIStorageEstimate() {
    if (!webaiStorageEstimate || !navigator.storage?.estimate) return;
    try {
        const { usage, quota } = await navigator.storage.estimate();
        if (usage && quota) {
            const usedMb = usage / (1024 * 1024);
            const quotaMb = quota / (1024 * 1024);
            const pct = Math.round((usage / quota) * 100);
            webaiStorageEstimate.textContent = `${usedMb.toFixed(1)} MB of ${quotaMb.toFixed(0)} MB (${pct}%)`;
        } else {
            webaiStorageEstimate.textContent = 'Unavailable';
        }
    } catch (err) {
        webaiStorageEstimate.textContent = 'Unavailable';
        console.warn('Storage estimate failed:', err);
    }
}

async function deleteLocalWebAIModel() {
    try {
        if (typeof LanguageModel !== 'undefined' && typeof LanguageModel.delete === 'function') {
            await LanguageModel.delete();
            showNotification('Deleted local Web AI model. You can download it again later.', 'success');
            refreshWebAIStatus(false);
            return true;
        }
        if (window.ai?.languageModel?.delete) {
            await window.ai.languageModel.delete();
            showNotification('Deleted local Web AI model. You can download it again later.', 'success');
            refreshWebAIStatus(false);
            return true;
        }
        showNotification('Browser does not expose model delete. Clear it via Chrome settings → Site settings → Machine learning.', 'error');
        return false;
    } catch (err) {
        showNotification(err.message || 'Failed to delete local model', 'error');
        return false;
    }
}

if (webaiDownloadBtn) {
    webaiDownloadBtn.addEventListener('click', async () => {
        webAIIntentActive = true;
        await startWebAIDownload();
    });
}

if (webaiCancelBtn) {
    webaiCancelBtn.addEventListener('click', () => {
        cancelWebAIDownload();
    });
}

if (webaiDownloadBtnModal) {
    webaiDownloadBtnModal.addEventListener('click', async () => {
        webAIIntentActive = true;
        await startWebAIDownload();
    });
}

if (webaiCancelBtnModal) {
    webaiCancelBtnModal.addEventListener('click', () => {
        cancelWebAIDownload();
    });
}

if (webaiManageBtn) {
    webaiManageBtn.addEventListener('click', openWebAIStorageModal);
}

if (webaiHelpBtn) {
    webaiHelpBtn.addEventListener('click', openWebAIStorageModal);
}

if (closeWebaiStorageBtn) {
    closeWebaiStorageBtn.addEventListener('click', closeWebAIStorageModal);
}

if (webaiStorageModal) {
    webaiStorageModal.addEventListener('click', (e) => {
        if (e.target === webaiStorageModal) {
            closeWebAIStorageModal();
        }
    });
}

if (webaiDeleteBtn) {
    webaiDeleteBtn.addEventListener('click', async () => {
        const success = await deleteLocalWebAIModel();
        if (success) {
            closeWebAIStorageModal();
        }
    });
}

// Toggle UI based on output type
if (aiTypeSelect) {
    aiTypeSelect.addEventListener('change', () => {
        const outputType = aiTypeSelect.value;
        console.log('Output type selected:', outputType);

        // Handle media generation modes
        if (outputType === 'image' || outputType === 'video') {
            console.log('Opening media modal for:', outputType);
            currentMediaType = outputType;
            openMediaModal(outputType);
            return;
        }

        if (outputType === 'chat') {
            // Chat mode uses standard prompt but displays in note editor
            aiChatContainer.classList.remove('hidden');
            aiPreviewSection.classList.add('hidden');
            aiTodosPreviewSection.classList.add('hidden');
            aiLoading.classList.add('hidden');
            aiError.classList.add('hidden');

            // Show file attachment controls in prompt area
            if (aiChatAttachBtn) aiChatAttachBtn.style.display = 'inline-flex';
        } else {
            // Standard modes
            aiChatContainer.classList.add('hidden');
            if (aiChatAttachBtn) aiChatAttachBtn.style.display = 'none';
        }

        if (isWebAIModel(aiModelSelect?.value)) {
            webAIIntentActive = true;
            refreshWebAIStatus(false);
        } else {
            hideWebAIStatus();
        }
    });
}

// Chat file attachment
if (aiChatAttachBtn && aiChatFileInput) {
    aiChatAttachBtn.addEventListener('click', () => {
        aiChatFileInput.click();
    });

    aiChatFileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);

        for (const file of files) {
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                try {
                    const encoded = await encodeMediaFile(file);
                    chatAttachedFiles.push(encoded);
                    renderChatAttachments();
                } catch (error) {
                    showNotification('Failed to attach file: ' + file.name, 'error');
                }
            } else {
                showNotification('Only images and videos are supported', 'error');
            }
        }

        // Clear input
        aiChatFileInput.value = '';
    });
}

// Render chat attachments preview
function renderChatAttachments() {
    if (!aiChatAttachments) return;

    if (chatAttachedFiles.length === 0) {
        aiChatAttachments.classList.add('hidden');
        aiChatAttachments.innerHTML = '';
        return;
    }

    aiChatAttachments.classList.remove('hidden');
    aiChatAttachments.innerHTML = chatAttachedFiles.map((file, index) => {
        const src = `data:${file.mimeType};base64,${file.data}`;
        const mediaTag = file.type === 'image'
            ? `<img src="${src}" alt="${file.name}">`
            : `<video src="${src}"></video>`;

        return `
            <div class="chat-attachment-item">
                ${mediaTag}
                <span class="chat-attachment-remove material-symbols-rounded" data-index="${index}">close</span>
            </div>
        `;
    }).join('');

    // Add remove handlers
    aiChatAttachments.querySelectorAll('.chat-attachment-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            chatAttachedFiles.splice(index, 1);
            renderChatAttachments();
        });
    });
}

// Add message to note editor (chat mode)
function addChatMessage(role, content, attachments = []) {
    const currentLength = quill.getLength();
    let insertText = '';

    // Add separator if note has content
    if (currentLength > 1) {
        insertText += '\n\n';
    }

    // Add role header
    if (role === 'user') {
        insertText += '👤 You:\n';
    } else {
        insertText += '🤖 Assistant:\n';
    }

    // Add attachments info
    if (attachments && attachments.length > 0) {
        insertText += `[${attachments.length} attachment(s)]\n`;
    }

    // Add content
    if (content) {
        insertText += content + '\n';
    }

    // Insert into editor
    const insertPosition = quill.getLength() - 1;
    quill.insertText(insertPosition, insertText);

    // Auto-save
    updateActiveNote();

    // Return last position for streaming updates
    return insertPosition + insertText.length;
}

// Insert markdown line with Quill formatting
function insertMarkdownLine(quill, position, line) {
    if (!line && line !== '\n') return position;

    // Handle newlines
    if (line === '\n') {
        quill.insertText(position, '\n');
        return position + 1;
    }

    // Check for headings
    const h1Match = line.match(/^#\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);

    if (h3Match) {
        quill.insertText(position, h3Match[1] + '\n');
        quill.formatLine(position, h3Match[1].length, { header: 3 });
        return position + h3Match[1].length + 1;
    } else if (h2Match) {
        quill.insertText(position, h2Match[1] + '\n');
        quill.formatLine(position, h2Match[1].length, { header: 2 });
        return position + h2Match[1].length + 1;
    } else if (h1Match) {
        quill.insertText(position, h1Match[1] + '\n');
        quill.formatLine(position, h1Match[1].length, { header: 1 });
        return position + h1Match[1].length + 1;
    }

    // Process inline formatting (bold, italic, code)
    let processedLine = line;
    let currentPos = position;
    const segments = [];

    // Parse bold **text**
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(line)) !== null) {
        // Add text before bold
        if (match.index > lastIndex) {
            segments.push({ text: line.substring(lastIndex, match.index), format: {} });
        }
        // Add bold text
        segments.push({ text: match[1], format: { bold: true } });
        lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < line.length) {
        segments.push({ text: line.substring(lastIndex), format: {} });
    }

    // If no formatting found, just insert plain text
    if (segments.length === 0) {
        quill.insertText(currentPos, line);
        return currentPos + line.length;
    }

    // Insert segments with formatting
    segments.forEach(segment => {
        quill.insertText(currentPos, segment.text, segment.format);
        currentPos += segment.text.length;
    });

    return currentPos;
}

// Format preview content (convert markdown code blocks to HTML)
function formatPreviewContent(text) {
    if (!text) return '';

    // Escape HTML first
    text = text.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Convert markdown code blocks to HTML with syntax highlighting classes
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'plaintext';
        return `<pre><code class="language-${language}">${code.trim()}</code></pre>`;
    });

    // Convert inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert line breaks to HTML
    text = text.replace(/\n/g, '<br>');

    return text;
}

// Format chat content (basic markdown support)
function formatChatContent(text) {
    if (!text) return '';

    // Code blocks
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Line breaks
    text = text.replace(/\n/g, '<br>');

    return text;
}

// Add streaming indicator in note
function addStreamingIndicator() {
    const currentLength = quill.getLength();
    let insertText = '';

    if (currentLength > 1) {
        insertText += '\n\n';
    }

    insertText += '🤖 Assistant:\n...';

    const insertPosition = quill.getLength() - 1;
    quill.insertText(insertPosition, insertText);

    return insertPosition + insertText.length - 3; // Return position before '...'
}

// Helper function to update active note
function updateActiveNote() {
    const item = getItem(activeItemId);
    if (item && item.type === 'note') {
        DevNotebookDB.updateItem(activeItemId, { body: quill.getContents() });
    }
}

// Save chat history to storage
function saveChatHistory() {
    DevNotebookDB.clearChatHistory();
    for (const msg of chatHistory) {
        DevNotebookDB.addChatMessage(msg.role, msg.content);
    }
}

// Render chat history (on page load)
function renderChatHistory() {
    if (!chatHistory || chatHistory.length === 0) return;

    // Only render if we're in chat mode or have chat history
    const currentLength = quill.getLength();
    let insertPosition = currentLength > 1 ? currentLength - 1 : 0;

    // Render each message in the history
    chatHistory.forEach((entry, index) => {
        if (entry.role === 'user') {
            const userText = typeof entry.content === 'string' ? entry.content :
                (Array.isArray(entry.content) ?
                    entry.content.find(c => c.text || c.type === 'text')?.text || '[Message with attachments]' :
                    '[Message]');
            quill.insertText(insertPosition, `\n\n👤 You:\n${userText}`, 'user');
            insertPosition = quill.getLength() - 1;
        } else if (entry.role === 'assistant') {
            quill.insertText(insertPosition, '\n\n🤖 Assistant:\n');
            insertPosition = quill.getLength() - 1;
            const lines = entry.content.split('\n');
            lines.forEach(line => {
                insertPosition = insertMarkdownLine(quill, insertPosition, line);
                insertPosition = insertMarkdownLine(quill, insertPosition, '\n');
            });
        }
    });

    // Trigger code formatting after rendering
    setTimeout(() => {
        scanAndFormatCodeBlocks(quill);
        highlightCodeBlocks();
    }, 100);
}


// Send chat message
if (aiGenerateBtn && (aiPromptInput || aiChatInput)) {
    if (aiStopBtn) {
        aiStopBtn.addEventListener('click', () => {
            if (aiAbortController) {
                aiAbortController.abort();
            }
            aiStopBtn.classList.add('hidden');
        });
    }

    const sendChatMessage = async (messagePayload = null) => {
        const message = messagePayload !== null ? messagePayload : (aiChatInput && !aiChatInput.closest('.hidden') ? aiChatInput.value.trim() : aiPromptInput.value.trim());
        if (!message && chatAttachedFiles.length === 0) return;
        if (isStreamingChat) return;

        const model = aiModelSelect.value;

        // Determine provider
        let provider = '';
        let apiKey = '';

        if (model.startsWith('gpt')) {
            provider = 'openai';
            apiKey = aiSettings.openaiKey;
        } else if (model.startsWith('gemini') || model.startsWith('gemma')) {
            provider = 'gemini';
            apiKey = aiSettings.geminiKey;
        } else if (model.startsWith('chrome-')) {
            provider = 'webai';
        } else if (model.startsWith('claude')) {
            provider = 'anthropic';
            apiKey = aiSettings.anthropicKey;
        } else if (model.startsWith('grok')) {
            provider = 'xai';
            apiKey = aiSettings.xaiKey;
        } else if (model.startsWith('deepseek')) {
            provider = 'deepseek';
            apiKey = aiSettings.deepseekKey;
        } else if (model.startsWith('mistral') || model.startsWith('codestral')) {
            provider = 'mistral';
            apiKey = aiSettings.mistralKey;
        } else if (model.startsWith('nvidia')) {
            provider = 'nvidia';
            apiKey = aiSettings.nvidiaKey;
        } else if (model.startsWith('qwen')) {
            provider = 'alibaba';
            apiKey = aiSettings.alibabaKey;
        } else if (model.startsWith('banana')) {
            provider = 'gemini';
            apiKey = aiSettings.geminiKey;
        }

        if (!provider) {
            showNotification('Provider not supported for streaming', 'error');
            return;
        }

        if (provider !== 'webai' && !apiKey) {
            showNotification(`API Key for ${provider} is missing`, 'error');
            return;
        }

        if (provider === 'webai') {
            const ok = await ensureWebAIReadyForUse(true);
            if (!ok) return;
        }

        // Ensure we have an active note
        let item = getItem(activeItemId);
        if (!item || activeItemType !== 'note') {
            // Create a new note for chat
            createNewItem();
            // Force title update
            item = getItem(activeItemId);
            if (item) {
                const chatTitle = 'AI Chat - ' + new Date().toLocaleString();
                DevNotebookDB.updateItem(activeItemId, { title: chatTitle });
                noteTitleEl.value = chatTitle;
                renderItemsList();
            }
        }

        // Add user message
        const userAttachments = [...chatAttachedFiles];
        addChatMessage('user', message, userAttachments);

        // Prepare message content (multimodal if attachments)
        let userContent;
        if (userAttachments.length > 0) {
            // Multimodal message
            userContent = [];

            // Add attachments first
            for (const file of userAttachments) {
                if (provider === 'openai') {
                    if (file.type === 'image') {
                        userContent.push({
                            type: 'image_url',
                            image_url: { url: `data:${file.mimeType};base64,${file.data}` }
                        });
                    }
                } else if (provider === 'gemini') {
                    userContent.push({
                        inline_data: {
                            mime_type: file.mimeType,
                            data: file.data
                        }
                    });
                } else if (provider === 'anthropic') {
                    if (file.type === 'image') {
                        userContent.push({
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: file.mimeType,
                                data: file.data
                            }
                        });
                    }
                }
            }

            // Add text
            if (message) {
                if (provider === 'gemini') {
                    userContent.push({ text: message });
                } else {
                    userContent.push({ type: 'text', text: message });
                }
            }
        } else {
            userContent = message;
        }

        // Add to history
        chatHistory.push({ role: 'user', content: userContent });
        saveChatHistory();

        // Clear input and attachments
        aiPromptInput.value = '';
        if (aiChatInput) aiChatInput.value = '';
        chatAttachedFiles = [];
        renderChatAttachments();

        // Show streaming indicator
        isStreamingChat = true;
        aiGenerateBtn.disabled = true;
        if (aiLoading) aiLoading.classList.remove('hidden');
        if (aiStopBtn) aiStopBtn.classList.remove('hidden');
        aiAbortController = new AbortController();

        // Add assistant header and prepare for streaming
        const startPos = quill.getLength();
        quill.insertText(startPos - 1, '\n\n🤖 Assistant:\n');
        let streamPosition = quill.getLength() - 1;

        let streamedText = '';
        let chatBuffer = ''; // Buffer for markdown parsing

        try {
            await callAIProviderStreaming(
                provider,
                apiKey,
                model,
                chatHistory,
                // onChunk
                (chunk) => {
                    chatBuffer += chunk;

                    // Process complete lines for markdown parsing  
                    const lines = chatBuffer.split('\n');

                    // Keep incomplete line in buffer
                    if (!chunk.includes('\n')) {
                        // Just accumulate in buffer, don't return yet - process on next chunk or completion
                        return;
                    }

                    // Process complete lines except the last (which might be incomplete)
                    const completeLines = lines.slice(0, -1);
                    chatBuffer = lines[lines.length - 1];

                    completeLines.forEach((line, idx) => {
                        streamPosition = insertMarkdownLine(quill, streamPosition, line);
                        // Add newline after each line except potentially the last
                        if (idx < completeLines.length - 1 || chatBuffer === '') {
                            streamPosition = insertMarkdownLine(quill, streamPosition, '\n');
                        }
                    });

                    streamedText += chunk;

                    // Scroll to bottom
                    quill.setSelection(streamPosition, 0);
                    updateActiveNote();
                },
                // onComplete
                (fullText) => {
                    // Process any remaining buffer
                    if (chatBuffer) {
                        streamPosition = insertMarkdownLine(quill, streamPosition, chatBuffer);
                    }

                    chatHistory.push({ role: 'assistant', content: fullText });
                    saveChatHistory();
                    // Trigger code formatting after streaming completes
                    setTimeout(() => {
                        scanAndFormatCodeBlocks(quill);
                        highlightCodeBlocks();
                    }, 100);

                    updateActiveNote();
                },
                // onError
                (error) => {
                    showNotification('Chat error: ' + error.message, 'error');
                },
                { signal: aiAbortController.signal }
            );
        } catch (error) {
            if (error?.name === 'AbortError') {
                showNotification('Chat stopped', 'info');
            } else {
                showNotification('Chat error: ' + error.message, 'error');
            }
        } finally {
            isStreamingChat = false;
            aiGenerateBtn.disabled = false;
            if (aiLoading) aiLoading.classList.add('hidden');
            if (aiStopBtn) aiStopBtn.classList.add('hidden');
            if (aiAbortController) aiAbortController = null;
        }
    };

    // Update aiTypeSelect listener to show/hide chat container
    if (aiTypeSelect && aiChatContainer) {
        aiTypeSelect.addEventListener('change', () => {
            if (aiTypeSelect.value === 'chat') {
                aiChatContainer.classList.remove('hidden');
                aiPromptContainer.classList.add('hidden');
            } else {
                aiChatContainer.classList.add('hidden');
                aiPromptContainer.classList.remove('hidden');
            }
        });
    }

    // Wire up dedicated Chat UI listeners
    if (aiChatSendBtn) {
        aiChatSendBtn.addEventListener('click', () => {
            const msg = aiChatInput.value.trim();
            if (msg || chatAttachedFiles.length > 0) sendChatMessage(msg);
        });
    }

    if (aiChatInput) {
        aiChatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const msg = aiChatInput.value.trim();
                if (msg || chatAttachedFiles.length > 0) sendChatMessage(msg);
            }
        });
    }

    // Add to existing generate button click handler
    const originalGenerateHandler = aiGenerateBtn.onclick;
    aiGenerateBtn.addEventListener('click', async (e) => {
        const outputType = aiTypeSelect.value;
        if (outputType === 'chat') {
            e.stopImmediatePropagation();
            sendChatMessage();
        }
    }, true);
}

// Clear chat history
function clearChatHistory() {
    chatHistory = [];
    chatAttachedFiles = [];
    renderChatAttachments();
    saveChatHistory();
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
