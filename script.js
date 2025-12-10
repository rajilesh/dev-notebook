// --- DOM Elements ---
const appContainer = document.querySelector('.app-container');
const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');

// Note Elements
// Legacy notesListEl removed
const noteTitleEl = document.getElementById('note-title');
const editorContent = document.getElementById('editor-content');
const editorToolbar = document.getElementById('editor-toolbar');
const searchInput = document.getElementById('search-input');
// Legacy addBtn removed
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

// Chat Mode Elements
const aiTypeSelect = document.getElementById('ai-type-select');
const aiChatContainer = document.getElementById('ai-chat-container');
const aiChatMessages = document.getElementById('ai-chat-messages');
const aiChatInput = document.getElementById('ai-chat-input');
const aiChatSendBtn = document.getElementById('ai-chat-send-btn');
const aiChatAttachBtn = document.getElementById('ai-chat-attach-btn');
const aiChatFileInput = document.getElementById('ai-chat-file-input');
const aiChatAttachments = document.getElementById('ai-chat-attachments');

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
let workspaces = [];
let activeWorkspaceId = null;
let activeProjectId = null;
let activeItemType = 'note'; // 'note', 'bookmark', 'credential'
let activeItemId = null; // Replaces activeNoteId
let selectedItemIds = new Set(); // For Multi-selection


// Legacy state for migration reference (will be removed/unused after migration)

let todos = [];
let currentTheme = 'system'; // 'light', 'dark', 'system'
let currentTodoPage = 1;
const todosPerPage = 15;

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

    // Initialize Quill with comprehensive toolbar and code support
    quill = new Quill('#editor-content', {
        theme: 'snow',
        modules: {
            toolbar: {
                container: [
                    // Headers and font size
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'font': [] }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],

                    // Text formatting
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],

                    // Lists and alignment
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'align': [] }],

                    // Blocks
                    ['blockquote', 'code-block'],

                    // Media
                    ['link', 'image', 'video'],

                    // Clear formatting
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
        placeholder: 'Start typing...',
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
                    item.title = noteTitleEl.value; // Sync title too if needed or handle separately
                    item.body = quill.getContents();
                    saveWorkspaces();
                    // Optional: Update list item preview if needed, but debounced
                }
            }
        }, 500);
    });

    // Note Title Listener
    noteTitleEl.addEventListener('input', () => {
        const item = getItem(activeItemId);
        if (item) {
            item.title = noteTitleEl.value;
            // Update list item immediately for better UX
            renderItemsList();
            // Debounce save
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveWorkspaces, 500);
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
        }
    });
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
    const data = await chrome.storage.local.get(['workspaces', 'notes', 'todos', 'theme', 'activeWorkspaceId', 'activeProjectId', 'activeItemType', 'aiDockVisible', 'chatHistory']);

    // Theme
    currentTheme = data.theme || 'system';
    applyTheme(currentTheme);

    // Todos (kept global for now, separate from projects as per user request flow usually)
    todos = data.todos || [];
    renderTodoList();

    // Data Migration & Initialization
    if (!data.workspaces || data.workspaces.length === 0) {
        // Migration: Create default workspace with existing notes
        const existingNotes = data.notes || [];

        const defaultProject = {
            id: 'proj_' + Date.now(),
            name: 'General',
            items: existingNotes.map(n => ({ ...n, type: 'note' })) // Ensure type is set
        };

        const defaultWorkspace = {
            id: 'ws_' + Date.now(),
            name: 'Personal',
            projects: [defaultProject]
        };

        workspaces = [defaultWorkspace];
        activeWorkspaceId = defaultWorkspace.id;
        activeProjectId = defaultProject.id;

        // Save migrated structure
        await saveWorkspaces();
        console.log('Migrated notes to workspaces structure.');
    } else {
        workspaces = data.workspaces;
        activeWorkspaceId = data.activeWorkspaceId || workspaces[0].id;

        // Validate active Project
        const ws = workspaces.find(w => w.id === activeWorkspaceId);
        if (ws && ws.projects.length > 0) {
            activeProjectId = data.activeProjectId || ws.projects[0].id;
        } else if (ws) {
            // Should verify project exists or create one
            const newProj = { id: 'proj_' + Date.now(), name: 'General', items: [] };
            ws.projects.push(newProj);
            activeProjectId = newProj.id;
            saveWorkspaces();
        }
    }

    // Restore active item type
    if (data.activeItemType) {
        activeItemType = data.activeItemType;
        // Update tab buttons to reflect active type
        resourceTabs.forEach(btn => {
            if (btn.dataset.type === activeItemType) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Restore AI dock visibility state
    if (data.aiDockVisible !== undefined && aiDock) {
        if (data.aiDockVisible) {
            aiDock.style.display = 'block';
            if (aiToggleBtn) aiToggleBtn.classList.add('active');
        } else {
            aiDock.style.display = 'none';
            if (aiToggleBtn) aiToggleBtn.classList.remove('active');
        }
    }

    // Restore chat history
    if (data.chatHistory && Array.isArray(data.chatHistory)) {
        chatHistory = data.chatHistory;
        // Re-render chat messages if in chat mode
        renderChatHistory();
    }

    // Render UI
    renderSidebarControls();
    renderItemsList();

    // Select first item or create new
    const currentProject = getCurrentProject();
    if (currentProject && currentProject.items.length > 0) {
        // Try to filter by type to find a valid item
        const firstItem = currentProject.items.find(i => i.type === activeItemType);
        if (firstItem) {
            setActiveItem(firstItem.id);
        } else {
            createNewItem();
        }
    } else {
        createNewItem();
    }
}

// --- Data Persistence ---
async function saveWorkspaces() {
    await chrome.storage.local.set({
        workspaces: workspaces,
        activeWorkspaceId: activeWorkspaceId,
        activeProjectId: activeProjectId,
        activeItemType: activeItemType
    });
}

// --- Helper Accessors ---
function getCurrentWorkspace() {
    return workspaces.find(w => w.id === activeWorkspaceId);
}

function getCurrentProject() {
    const ws = getCurrentWorkspace();
    return ws ? ws.projects.find(p => p.id === activeProjectId) : null;
}

function getItem(id) {
    const proj = getCurrentProject();
    if (!proj) return null;
    return proj.items.find(i => i.id === id);
}

// --- UI Rendering ---

function renderSidebarControls() {
    // Render Workspace Select
    workspaceSelect.innerHTML = '';
    workspaces.forEach(ws => {
        const option = document.createElement('option');
        option.value = ws.id;
        option.textContent = ws.name;
        if (ws.id === activeWorkspaceId) option.selected = true;
        workspaceSelect.appendChild(option);
    });

    // Render Project Select
    projectSelect.innerHTML = '';
    const currentWs = getCurrentWorkspace();
    if (currentWs) {
        currentWs.projects.forEach(proj => {
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
    const currentProject = getCurrentProject();
    if (!currentProject) return;

    const filteredItems = currentProject.items.filter(item => item.type === activeItemType);

    filteredItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'note-item';
        // Active vs Selected logic
        if (item.id === activeItemId) li.classList.add('active');
        if (selectedItemIds.has(item.id)) li.classList.add('selected');

        // Search Filter
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        let match = true;

        // Different display based on Type
        let title = item.title || 'Untitled';
        let subText = '';

        if (item.type === 'note') {
            subText = item.body ? String(item.body).substring(0, 50).replace(/<[^>]*>/g, '') + '...' : 'No content';
            // If body is delta object
            if (item.body && typeof item.body === 'object') subText = 'Content...';
        } else if (item.type === 'bookmark') {
            subText = item.url || '';
        } else if (item.type === 'credential') {
            subText = item.username || '********';
        }

        if (searchTerm) {
            const searchContent = (title + subText).toLowerCase();
            if (!searchContent.includes(searchTerm)) match = false;
        }

        if (match) {
            // Add open link button for bookmarks
            const openLinkBtn = item.type === 'bookmark' ? `
                <button class="note-item-open-link-btn" title="Open Link">
                    <span class="material-icons">open_in_new</span>
                </button>
            ` : '';

            li.innerHTML = `
                <div class="note-item-content">
                    <div class="note-item-title">${escapeHtml(title)}</div>
                    <div class="note-item-preview">${escapeHtml(subText)}</div>
                </div>
                ${openLinkBtn}
                <button class="note-item-delete-btn" title="Delete">
                    <span class="material-icons">close</span>
                </button>
            `;

            // Click Handler (Selection)
            li.addEventListener('click', (e) => {
                // Prevent triggering if clicked on inner buttons (if any, though delete is handled separately)
                // if (e.target.closest('button')) return; 

                handleItemClick(e, item.id, filteredItems);
            });

            // Open Link Handler (for bookmarks)
            if (item.type === 'bookmark') {
                const openLinkBtn = li.querySelector('.note-item-open-link-btn');
                if (openLinkBtn) {
                    openLinkBtn.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent item selection
                        if (item.url) {
                            window.open(item.url, '_blank');
                        }
                    });
                }
            }

            // Delete Handler
            const deleteBtn = li.querySelector('.note-item-delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent item selection
                handleDeleteRequest(item.id);
            });

            itemsListEl.appendChild(li);
        }
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
    const proj = getCurrentProject();
    if (!proj) return;

    proj.items = proj.items.filter(item => !idsToDelete.includes(item.id));

    // Clear selection
    selectedItemIds.clear();

    // Reset active item if deleted
    if (idsToDelete.includes(activeItemId)) {
        activeItemId = null;
        if (proj.items.length > 0) {
            // Select first available of current type?
            const next = proj.items.find(i => i.type === activeItemType);
            if (next) {
                activeItemId = next.id;
                selectedItemIds.add(next.id);
            } else {
                // Or create new if empty? Users might prefer empty list.
                // createNewItem(); 
                // Let's just clear editor
            }
        } else {
            // Create new if truly empty to avoid confusing empty state?
            createNewItem();
        }
    } else if (activeItemId) {
        // Retain selection of active item
        selectedItemIds.add(activeItemId);
    }

    saveWorkspaces();
    renderItemsList();
    if (activeItemId) openItemEditor(activeItemId);
    else hideEditors();
}

function hideEditors() {
    document.querySelectorAll('.view-pane').forEach(el => el.classList.add('hidden'));
}

function openItemEditor(id) {
    // Logic extracted from setActiveItem to just switch view without resetting list state
    const item = getItem(id);
    document.querySelectorAll('.view-pane').forEach(el => el.classList.add('hidden'));

    if (!item) return;

    // Get the Quill toolbar element
    const quillToolbar = document.querySelector('.ql-toolbar');

    if (item.type === 'note') {
        document.getElementById('editor-content').classList.remove('hidden');
        // Show toolbar for notes
        if (quillToolbar) {
            quillToolbar.style.display = 'block';
        }
        noteTitleEl.value = item.title || '';
        if (quill) {
            // ... (reuse existing quill set logic)
            if (item.body && typeof item.body === 'object' && item.body.ops) {
                quill.setContents(item.body);
            } else if (item.body && item.body.startsWith('{')) {
                try {
                    const delta = JSON.parse(item.body);
                    quill.setContents(delta);
                } catch (e) { quill.setText(item.body || ''); }
            } else {
                quill.setText(item.body || '');
            }
        }
    } else if (item.type === 'bookmark') {
        bookmarkEditor.classList.remove('hidden');
        // Hide toolbar for bookmarks
        if (quillToolbar) {
            quillToolbar.style.display = 'none';
        }
        bookmarkTitleInput.value = item.title || '';
        bookmarkUrlInput.value = item.url || '';
        bookmarkDescInput.value = item.description || '';
    } else if (item.type === 'credential') {
        credentialEditor.classList.remove('hidden');
        // Hide toolbar for credentials
        if (quillToolbar) {
            quillToolbar.style.display = 'none';
        }
        credentialTitleInput.value = item.title || '';
        credentialUsernameInput.value = item.username || '';
        credentialPasswordInput.value = item.password || '';
        credentialNotesInput.value = item.notes || '';
    }
}

function setActiveItem(id) {
    if (activeItemId !== id) {
        activeItemId = id;
        selectedItemIds.clear();
        if (id) selectedItemIds.add(id);
    }

    renderItemsList();
    openItemEditor(id);
}

function createNewItem() {
    const proj = getCurrentProject();
    if (!proj) return;

    const newItem = {
        id: Date.now().toString(),
        type: activeItemType,
        title: '',
        created: new Date().toISOString()
    };

    if (activeItemType === 'note') {
        newItem.body = '';
    } else if (activeItemType === 'bookmark') {
        newItem.url = '';
        newItem.description = '';
    } else if (activeItemType === 'credential') {
        newItem.username = '';
        newItem.password = '';
        newItem.notes = '';
    }

    proj.items.unshift(newItem); // Add to top
    saveWorkspaces();
    setActiveItem(newItem.id);
}

// --- Event Listeners for New Controls ---

workspaceSelect.addEventListener('change', (e) => {
    activeWorkspaceId = e.target.value;
    // Set active project to first in new workspace
    const ws = getCurrentWorkspace();
    if (ws && ws.projects.length > 0) activeProjectId = ws.projects[0].id;
    saveWorkspaces();
    renderSidebarControls();
    renderItemsList();
    createNewItem(); // Or select first
});

projectSelect.addEventListener('change', (e) => {
    activeProjectId = e.target.value;
    saveWorkspaces();
    renderItemsList();
    createNewItem();
});

addWorkspaceBtn.addEventListener('click', async () => {
    const name = prompt('New Workspace Name:');
    if (name) {
        const newWs = {
            id: 'ws_' + Date.now(),
            name: name,
            projects: [{ id: 'proj_' + Date.now(), name: 'General', items: [] }]
        };
        workspaces.push(newWs);
        activeWorkspaceId = newWs.id;
        activeProjectId = newWs.projects[0].id;
        await saveWorkspaces();
        renderSidebarControls();
        renderItemsList();
        createNewItem();
    }
});

addProjectBtn.addEventListener('click', async () => {
    const name = prompt('New Project Name:');
    if (name) {
        const ws = getCurrentWorkspace();
        if (ws) {
            const newProj = { id: 'proj_' + Date.now(), name: name, items: [] };
            ws.projects.push(newProj);
            activeProjectId = newProj.id;
            await saveWorkspaces();
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
        saveWorkspaces(); // Save state immediately
        renderItemsList();
        // Try to select first item of new type
        const proj = getCurrentProject();
        if (proj) {
            const first = proj.items.find(i => i.type === activeItemType);
            if (first) setActiveItem(first.id);
            else createNewItem();
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
            // Update main resource tabs
            resourceTabs.forEach(tab => {
                if (tab.dataset.type === type) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
            activeItemType = type;
            saveWorkspaces(); // Save state immediately
            renderItemsList();
            // Try to select first item of new type
            const proj = getCurrentProject();
            if (proj) {
                const first = proj.items.find(i => i.type === activeItemType);
                if (first) setActiveItem(first.id);
                else createNewItem();
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
        ws.name = newName.trim();
        await saveWorkspaces();
        renderSidebarControls();
        showNotification('Workspace renamed');
    }
});

// Delete Workspace
deleteWorkspaceBtn.addEventListener('click', async () => {
    const ws = getCurrentWorkspace();
    if (!ws) return;

    if (workspaces.length <= 1) {
        showNotification('Cannot delete the last workspace', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete workspace "${ws.name}"? All projects and items inside it will be lost.`)) {
        // Remove workspace
        workspaces = workspaces.filter(w => w.id !== ws.id);

        // Select another workspace
        activeWorkspaceId = workspaces[0].id;
        if (workspaces[0].projects.length > 0) {
            activeProjectId = workspaces[0].projects[0].id;
        } else {
            activeProjectId = null;
        }

        await saveWorkspaces();
        renderSidebarControls();
        renderItemsList();

        // Try to select an item
        const proj = getCurrentProject();
        if (proj && proj.items.length > 0) {
            const next = proj.items.find(i => i.type === activeItemType) || proj.items[0];
            setActiveItem(next ? next.id : null);
        } else {
            setActiveItem(null); // Or create new?
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
        proj.name = newName.trim();
        await saveWorkspaces();
        renderSidebarControls(); // Project names are in select
        showNotification('Project renamed');
    }
});

// Delete Project
deleteProjectBtn.addEventListener('click', async () => {
    const ws = getCurrentWorkspace();
    const proj = getCurrentProject();
    if (!ws || !proj) return;

    if (ws.projects.length <= 1) {
        showNotification('Cannot delete the last project in a workspace', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete project "${proj.name}"? All items inside it will be lost.`)) {
        // Remove project
        ws.projects = ws.projects.filter(p => p.id !== proj.id);

        // Select another project
        if (ws.projects.length > 0) {
            activeProjectId = ws.projects[0].id;
        }

        await saveWorkspaces();
        renderSidebarControls();
        renderItemsList();

        // Select item
        const newProj = getCurrentProject();
        if (newProj && newProj.items.length > 0) {
            const next = newProj.items.find(i => i.type === activeItemType) || newProj.items[0];
            if (next) setActiveItem(next.id);
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

// Bookmark Save
saveBookmarkBtn.addEventListener('click', () => {
    const item = getItem(activeItemId);
    if (item && item.type === 'bookmark') {
        item.title = bookmarkTitleInput.value;
        item.url = bookmarkUrlInput.value;
        item.description = bookmarkDescInput.value;
        saveWorkspaces();
        renderItemsList(); // Update title in list
        showNotification('Bookmark saved');
    }
});

visitBookmarkBtn.addEventListener('click', () => {
    const url = bookmarkUrlInput.value;
    if (url) window.open(url, '_blank');
});

// Credential Save
saveCredentialBtn.addEventListener('click', () => {
    const item = getItem(activeItemId);
    if (item && item.type === 'credential') {
        item.title = credentialTitleInput.value;
        item.username = credentialUsernameInput.value;
        item.password = credentialPasswordInput.value;
        item.notes = credentialNotesInput.value;
        saveWorkspaces();
        renderItemsList();
        showNotification('Credential saved');
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
// Listen for changes in chrome.storage from other tabs
// --- Cross-Tab Synchronization ---
// Listen for changes in chrome.storage from other tabs
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
        if (changes.workspaces) {
            workspaces = changes.workspaces.newValue || [];
            if (activeProjectId) {
                // Check if active project still exists
                const proj = getCurrentProject();
                if (!proj) {
                    // Fallback if deleted
                    if (workspaces.length > 0) {
                        activeWorkspaceId = workspaces[0].id;
                        if (workspaces[0].projects.length > 0) activeProjectId = workspaces[0].projects[0].id;
                    }
                }
            }
            renderSidebarControls();
            renderItemsList();

            // If active item updated, refresh it (if not typing)
            if (activeItemId && !quill.hasFocus()) {
                const item = getItem(activeItemId);
                if (item && item.type === 'note') {
                    // Update Quill if needed (complex diffing omitted for brevity, just refreshing title/list usually enough unless collaborative)
                }
            }
        }

        if (changes.activeWorkspaceId) {
            activeWorkspaceId = changes.activeWorkspaceId.newValue;
            renderSidebarControls();
            renderItemsList();
        }

        if (changes.activeProjectId) {
            activeProjectId = changes.activeProjectId.newValue;
            renderItemsList();
        }

        if (changes.todos) {
            todos = changes.todos.newValue || [];
            renderTodoList();
        }

        if (changes.theme) {
            currentTheme = changes.theme.newValue || 'system';
            applyTheme(currentTheme);
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
// --- Note Management (Replaced by Item Management) ---

function deleteActiveItem() {
    const proj = getCurrentProject();
    if (!proj || !activeItemId) return;

    if (confirm('Are you sure you want to delete this item?')) {
        proj.items = proj.items.filter(i => i.id !== activeItemId);
        saveWorkspaces();
        renderItemsList();

        // Select another item
        if (proj.items.length > 0) {
            // Find one of compatible type if possible
            const next = proj.items.find(i => i.type === activeItemType) || proj.items[0];
            setActiveItem(next.id);
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
        if (todo.completed) {
            todo.completedAt = Date.now();
        }
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

    // Load saved position
    const savedPosition = localStorage.getItem('aiDockPosition');
    if (savedPosition) {
        const { x, y } = JSON.parse(savedPosition);
        aiDockContent.style.right = 'auto';
        aiDockContent.style.bottom = 'auto';
        aiDockContent.style.left = x + 'px';
        aiDockContent.style.top = y + 'px';
        xOffset = x;
        yOffset = y;
    }

    aiDockContent.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

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

        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        isDragging = true;
        aiDockContent.classList.add('dragging');
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, aiDockContent);
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

    function setTranslate(xPos, yPos, el) {
        el.style.right = 'auto';
        el.style.bottom = 'auto';
        el.style.left = xPos + 'px';
        el.style.top = yPos + 'px';
    }
}

function saveTodos() {
    chrome.storage.local.set({ todos: todos });
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

function renderHistoryList() {
    historyTodoList.innerHTML = '';

    // Calculate pagination
    const totalPages = Math.ceil(todoHistory.length / historyItemsPerPage);
    const startIndex = (currentHistoryPage - 1) * historyItemsPerPage;
    const endIndex = startIndex + historyItemsPerPage;
    const paginatedHistory = todoHistory.slice(startIndex, endIndex);

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
            <span class="material-icons" style="color: var(--accent); font-size: 18px;">check_circle</span>
            <div style="flex: 1;">
                <div>${escapeHtml(todo.text)}</div>
                <div style="font-size: 0.8em; color: var(--text-muted); margin-top: 2px;">${dateStr}</div>
            </div>
            <button class="delete-todo-btn" title="Remove from history">
                <span class="material-icons" style="font-size: 16px;">close</span>
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
    updateHistoryPagination(totalPages);
}

function updateHistoryPagination(totalPages) {
    historyPageInfo.textContent = `${currentHistoryPage} / ${Math.max(1, totalPages)}`;
    historyPrevBtn.disabled = currentHistoryPage <= 1;
    historyNextBtn.disabled = currentHistoryPage >= totalPages;

    if (todoHistory.length === 0) {
        historyTodoList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">No completed todos yet</div>';
    }
}

function deleteHistoryTodo(id) {
    if (confirm('Remove this todo from history?')) {
        todoHistory = todoHistory.filter(t => t.id !== id);

        // Adjust current page if needed
        const totalPages = Math.ceil(todoHistory.length / historyItemsPerPage);
        if (currentHistoryPage > totalPages && totalPages > 0) {
            currentHistoryPage = totalPages;
        }

        saveTodos();
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

// AI Toggle Button
const aiToggleBtn = document.getElementById('ai-toggle-btn');
if (aiToggleBtn && aiDock) {
    aiToggleBtn.addEventListener('click', () => {
        const isVisible = aiDock.style.display !== 'none' && aiDock.style.display !== '';
        if (!isVisible) {
            aiDock.style.display = 'block';
            aiToggleBtn.classList.add('active');
            chrome.storage.local.set({ aiDockVisible: true });
        } else {
            aiDock.style.display = 'none';
            aiToggleBtn.classList.remove('active');
            chrome.storage.local.set({ aiDockVisible: false });
        }
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
        workspaces = [];
        activeWorkspaceId = null;
        activeProjectId = null;
        todos = [];

        saveWorkspaces();
        chrome.storage.local.set({ todos: [] });

        // Re-init (will create default workspace)
        window.location.reload();
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
    const data = {
        workspaces: workspaces,
        todos: todos,
        exportDate: new Date().toISOString(),
        version: '1.2'
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
            const currentProj = getCurrentProject();

            // 1. Import Workspaces (Full Backup)
            if (data.workspaces && Array.isArray(data.workspaces)) {
                // Determine if we should replace or append. 
                // For simplicity, we append new workspaces if IDs don't collide, or generate new IDs.
                // Or just push them as new workspaces.

                const newWorkspaces = data.workspaces.map(ws => {
                    // Regenerate IDs to avoid collisions
                    const newWsId = 'ws_' + Date.now() + Math.random().toString(36).substr(2, 5);
                    return {
                        ...ws,
                        id: newWsId,
                        projects: ws.projects.map(p => ({
                            ...p,
                            id: 'proj_' + Date.now() + Math.random().toString(36).substr(2, 5)
                        }))
                    };
                });

                workspaces = [...workspaces, ...newWorkspaces];
                importedCount += newWorkspaces.length;
                showNotification(`Imported ${newWorkspaces.length} workspaces`, 'success');
            }

            // 2. Import Single Item
            if (data.item && currentProj) {
                const newItem = {
                    ...data.item,
                    id: Date.now().toString()
                };
                currentProj.items.unshift(newItem);
                importedCount++;
            }

            // 3. Import Legacy Single Note
            if (data.note && typeof data.note === 'object' && currentProj) {
                const newNote = {
                    ...data.note,
                    id: Date.now().toString(),
                    type: 'note' // Ensure type
                };
                currentProj.items.unshift(newNote);
                importedCount++;
            }

            // 4. Import Legacy Notes Array
            if (data.notes && Array.isArray(data.notes) && currentProj) {
                const newNotes = data.notes.map(n => ({
                    ...n,
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                    type: 'note'
                }));
                currentProj.items.unshift(...newNotes);
                importedCount += newNotes.length;
            }

            // 5. Import Todos
            if (data.todos && Array.isArray(data.todos)) {
                const newTodos = data.todos.map(todo => ({
                    ...todo,
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5) // Generate new ID
                }));
                todos = [...todos, ...newTodos];
            }

            await saveWorkspaces();
            await chrome.storage.local.set({ todos });

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

            // Handle note mode with real-time streaming
            if (outputType === 'note') {
                const formatInstruction = " Please provide well-formatted content with a brief title on the first line if appropriate. Use Markdown formatting including code blocks with language tags.";
                const systemInstruction = baseInstruction + formatInstruction;

                // Ensure we have an active note item
                if (!activeItemId || activeItemType !== 'note') {
                    // Create new note item in current project
                    const proj = getCurrentProject();
                    if (proj) {
                        const newNote = {
                            id: Date.now().toString(),
                            type: 'note',
                            title: 'AI Generated Note',
                            body: '',
                            createdAt: Date.now(),
                            updatedAt: Date.now()
                        };
                        proj.items.unshift(newNote);
                        activeItemType = 'note'; // Switch to note type view
                        activeItemId = newNote.id;
                        saveWorkspaces();
                        renderItemsList();
                        renderSidebarControls(); // Update UI to reflect type change if needed

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
                        const item = getItem(activeItemId);
                        if (item) {
                            item.body = quill.getContents();
                            saveWorkspaces();
                        }

                        showNotification('Note added successfully!', 'success');
                        aiPromptInput.value = '';
                    },
                    // onError
                    (error) => {
                        showAIError(error.message || 'Streaming failed');
                    }
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
                const result = await callAIProvider(provider, apiKey, model, prompt, systemInstruction);

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
            showAIError(error.message);
        } finally {
            aiLoading.classList.add('hidden');
            aiGenerateBtn.disabled = false;
            // aiGenerateBtn.innerHTML = '<span class="material-icons">arrow_upward</span>'; // Restore icon
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

        // Save
        item.body = quill.getContents();
        saveWorkspaces();
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

        if (item) {
            item.body = quill.getContents();
            saveWorkspaces();
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
                <span class="chat-attachment-remove material-icons" data-index="${index}">close</span>
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
        item.body = quill.getContents();
        saveWorkspaces();
    }
}

// Save chat history to storage
function saveChatHistory() {
    chrome.storage.local.set({ chatHistory: chatHistory });
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

        if (!apiKey) {
            showNotification(`API Key for ${provider} is missing`, 'error');
            return;
        }

        // Ensure we have an active note
        let item = getItem(activeItemId);
        if (!item || activeItemType !== 'note') {
            // Create a new note for chat
            createNewItem();
            // Force title update
            item = getItem(activeItemId);
            if (item) {
                item.title = 'AI Chat - ' + new Date().toLocaleString();
                noteTitleEl.value = item.title;
                saveWorkspaces();
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
                }
            );
        } catch (error) {
            showNotification('Chat error: ' + error.message, 'error');
        } finally {
            isStreamingChat = false;
            aiGenerateBtn.disabled = false;
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
