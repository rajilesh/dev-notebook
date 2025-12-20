/**
 * AI Provider Logic
 * Handles API calls to various AI providers.
 */

async function callAIProvider(provider, apiKey, model, prompt, systemInstruction, options = {}) {
    const { signal } = options;
    const systemPrompt = systemInstruction || "You are a helpful assistant that generates notes. Please provide the response in JSON format with 'title' and 'content' fields. The content should be formatted in Markdown.";
    
    let url, headers, body;

    switch (provider) {
        case 'openai':
            url = 'https://api.openai.com/v1/chat/completions';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            body = JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ]
            });
            break;
            
        case 'gemini':
            url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            headers = { 'Content-Type': 'application/json' };
            body = JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + "\n\nUser Prompt: " + prompt }] }]
            });
            break;
            
        case 'anthropic':
            url = 'https://api.anthropic.com/v1/messages';
            headers = {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
                'dangerously-allow-browser': 'true' // Client-side call
            };
            body = JSON.stringify({
                model: model,
                max_tokens: 4096,
                messages: [
                    { role: 'user', content: systemPrompt + "\n\n" + prompt }
                ]
            });
            break;
            
        case 'xai':
            url = 'https://api.x.ai/v1/chat/completions';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            body = JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                stream: false
            });
            break;

        case 'deepseek':
            url = 'https://api.deepseek.com/chat/completions';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            body = JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                stream: false
            });
            break;

        case 'mistral':
            url = 'https://api.mistral.ai/v1/chat/completions';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            body = JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ]
            });
            break;

        case 'cohere':
            url = 'https://api.cohere.ai/v1/chat';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            body = JSON.stringify({
                model: model,
                message: prompt,
                preamble: systemPrompt
            });
            break;

        case 'huggingface':
            url = `https://api-inference.huggingface.co/models/${model}`;
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            body = JSON.stringify({
                inputs: `${systemPrompt}\n\nUser: ${prompt}\nAssistant:`,
                parameters: {
                    max_new_tokens: 1024,
                    return_full_text: false
                }
            });
            break;

        case 'nvidia':
            url = 'https://integrate.api.nvidia.com/v1/chat/completions';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            body = JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.5,
                top_p: 1,
                max_tokens: 1024
            });
            break;

        case 'alibaba':
            url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            body = JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ]
            });
            break;

        case 'webai':
            return await callWebAINonStreaming(prompt, systemPrompt);
            
        default:
            throw new Error('Unknown provider');
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body,
            signal
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        
        // Parse response based on provider
        if (provider === 'openai' || provider === 'xai' || provider === 'deepseek' || provider === 'mistral' || provider === 'nvidia' || provider === 'alibaba') {
            return data.choices[0].message.content;
        } else if (provider === 'gemini') {
            return data.candidates[0].content.parts[0].text;
        } else if (provider === 'anthropic') {
            return data.content[0].text;
        } else if (provider === 'cohere') {
            return data.text;
        } else if (provider === 'huggingface') {
            // Hugging Face Inference API returns an array of objects
            return Array.isArray(data) ? data[0].generated_text : data.generated_text;
        }
    } catch (error) {
        console.error("AI Provider Error:", error);
        throw error;
    }
}

/**
 * Call AI Provider with Streaming Support
 * Returns a ReadableStream for streaming responses
 */
async function callAIProviderStreaming(provider, apiKey, model, messages, onChunk, onComplete, onError, options = {}) {
    const { signal } = options;
    let url, headers, body;

    // Prepare messages array based on provider format
    const prepareMessages = (msgs) => {
        return msgs.map(msg => {
            if (msg.content && Array.isArray(msg.content)) {
                // Multimodal content
                return msg;
            }
            return { role: msg.role, content: msg.content };
        });
    };

    switch (provider) {
        case 'openai':
        case 'xai':
        case 'deepseek':
        case 'nvidia':
        case 'alibaba':
            url = provider === 'openai' ? 'https://api.openai.com/v1/chat/completions' :
                  provider === 'xai' ? 'https://api.x.ai/v1/chat/completions' :
                  provider === 'deepseek' ? 'https://api.deepseek.com/chat/completions' :
                  provider === 'nvidia' ? 'https://integrate.api.nvidia.com/v1/chat/completions' :
                  'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            body = JSON.stringify({
                model: model,
                messages: prepareMessages(messages),
                stream: true
            });
            break;
            
        case 'gemini':
            url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`;
            headers = { 'Content-Type': 'application/json' };
            // Convert messages to Gemini format
            const geminiContents = messages.map(msg => {
                if (msg.content && Array.isArray(msg.content)) {
                    return { role: msg.role === 'assistant' ? 'model' : 'user', parts: msg.content };
                }
                return { role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text: msg.content }] };
            });
            body = JSON.stringify({ contents: geminiContents });
            break;
            
        case 'anthropic':
            url = 'https://api.anthropic.com/v1/messages';
            headers = {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
                'dangerously-allow-browser': 'true'
            };
            // Separate system message if present
            const anthropicMessages = messages.filter(m => m.role !== 'system');
            const systemMsg = messages.find(m => m.role === 'system');
            body = JSON.stringify({
                model: model,
                max_tokens: 4096,
                messages: anthropicMessages,
                system: systemMsg ? systemMsg.content : undefined,
                stream: true
            });
            break;
            
        case 'mistral':
            url = 'https://api.mistral.ai/v1/chat/completions';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            body = JSON.stringify({
                model: model,
                messages: prepareMessages(messages),
                stream: true
            });
            break;

        case 'webai':
            return await callWebAIStreaming(messages, onChunk, onComplete, onError, signal);
            
        default:
            throw new Error(`Streaming not supported for provider: ${provider}`);
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body,
            signal
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullText = '';

        while (true) {
            if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // Keep incomplete line in buffer

            for (const line of lines) {
                if (!line.trim() || line.trim() === 'data: [DONE]') continue;
                
                try {
                    const jsonStr = line.replace(/^data: /, '');
                    const data = JSON.parse(jsonStr);
                    let chunk = '';

                    if (provider === 'openai' || provider === 'xai' || provider === 'deepseek' || provider === 'mistral' || provider === 'nvidia' || provider === 'alibaba') {
                        chunk = data.choices?.[0]?.delta?.content || '';
                    } else if (provider === 'gemini') {
                        chunk = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    } else if (provider === 'anthropic') {
                        if (data.type === 'content_block_delta') {
                            chunk = data.delta?.text || '';
                        }
                    }

                    if (chunk) {
                        fullText += chunk;
                        if (onChunk) onChunk(chunk, fullText);
                    }
                } catch (e) {
                    console.warn('Failed to parse streaming chunk:', line, e);
                }
            }
        }

        if (onComplete) onComplete(fullText);
        return fullText;

    } catch (error) {
        console.error('Streaming Error:', error);
        if (onError) onError(error);
        throw error;
    }
}

// --- Chrome Web AI (Prompt API) Helpers ---

async function ensureWebAIAvailable() {
    let availability = 'unavailable';

    try {
        if (typeof LanguageModel !== 'undefined') {
            availability = await LanguageModel.availability();
        } else if (window.ai && window.ai.languageModel && window.ai.languageModel.availability) {
            const res = await window.ai.languageModel.availability({ languages: ['en'] });
            availability = res?.state || res;
        }
    } catch (e) {
        availability = 'unavailable';
    }

    if (availability === 'unavailable') {
        throw new Error('Web AI unavailable: enable Chrome built-in AI flags and restart.');
    }
    if (availability === 'downloadable' || availability === 'downloading') {
        throw new Error('Web AI model is downloading. Wait for completion, then retry.');
    }
    if (availability !== 'available') {
        throw new Error(`Web AI not ready (state: ${availability}).`);
    }

    if (!navigator.userActivation?.isActive) {
        throw new Error('User activation required. Click or type on the page, then retry.');
    }
}

function flattenMessageContent(msg) {
    if (!msg) return '';
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg)) {
        return msg.map(flattenMessageContent).join('\n');
    }
    if (typeof msg === 'object' && msg !== null) {
        if (msg.text) return msg.text;
        if (msg.content) return flattenMessageContent(msg.content);
    }
    return '';
}

function buildWebAIPrompt(messages, systemPrompt) {
    let prompt = '';
    if (systemPrompt) {
        prompt += `${systemPrompt}\n\n`;
    }
    for (const msg of messages) {
        const roleLabel = msg.role === 'assistant' ? 'Assistant' : 'User';
        const text = flattenMessageContent(msg.content ?? msg.text ?? msg.message ?? '');
        if (text) {
            prompt += `${roleLabel}: ${text}\n`;
        }
    }
    prompt += 'Assistant:';
    return prompt;
}

function extractWebAIChunkText(chunk) {
    if (!chunk) return '';
    if (typeof chunk === 'string') return chunk;
    if (chunk.outputText) return chunk.outputText;
    if (chunk.text) return chunk.text;
    if (chunk.output) return chunk.output;
    if (chunk.candidates?.[0]?.outputText) return chunk.candidates[0].outputText;
    if (chunk.candidates?.[0]?.text) return chunk.candidates[0].text;
    const parts = chunk.message?.content || chunk.choices?.[0]?.delta?.content;
    if (Array.isArray(parts)) {
        return parts.map(p => (typeof p === 'string' ? p : p?.text || '')).join('');
    }
    return '';
}

async function callWebAINonStreaming(userPrompt, systemPrompt) {
    await ensureWebAIAvailable();
    if (typeof LanguageModel !== 'undefined') {
        const session = await LanguageModel.create({
            expectedInputs: [{ type: 'text', languages: ['en'] }],
            expectedOutputs: [{ type: 'text', languages: ['en'] }]
        });
        const result = await session.prompt(userPrompt, { context: systemPrompt });
        return result?.outputText ?? result ?? '';
    }
    const session = await window.ai.languageModel.create({ systemPrompt });
    const result = await session.prompt(userPrompt);
    return result?.outputText ?? result ?? '';
}

async function callWebAIStreaming(messages, onChunk, onComplete, onError, signal) {
    try {
        await ensureWebAIAvailable();
        const promptText = buildWebAIPrompt(messages, undefined);

        if (typeof LanguageModel !== 'undefined') {
            const session = await LanguageModel.create({
                expectedInputs: [{ type: 'text', languages: ['en'] }],
                expectedOutputs: [{ type: 'text', languages: ['en'] }]
            });
            const stream = await session.promptStreaming(promptText);
            if (signal) {
                signal.addEventListener('abort', () => {
                    if (stream?.return) stream.return();
                }, { once: true });
            }

            let fullText = '';
            for await (const chunk of stream) {
                if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
                const piece = extractWebAIChunkText(chunk);
                if (piece) {
                    fullText += piece;
                    if (onChunk) onChunk(piece, fullText);
                }
            }

            if (onComplete) onComplete(fullText);
            return fullText;
        }

        const session = await window.ai.languageModel.create();
        const stream = await session.promptStreaming(promptText);
        if (signal) {
            signal.addEventListener('abort', () => {
                if (stream?.return) stream.return();
            }, { once: true });
        }

        let fullText = '';
        for await (const chunk of stream) {
            if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
            const piece = extractWebAIChunkText(chunk);
            if (piece) {
                fullText += piece;
                if (onChunk) onChunk(piece, fullText);
            }
        }

        if (onComplete) onComplete(fullText);
        return fullText;
    } catch (err) {
        if (onError) onError(err);
        throw err;
    }
}

/**
 * Encode image/video to base64
 */
function encodeMediaFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve({
                type: file.type.startsWith('image/') ? 'image' : 'video',
                mimeType: file.type,
                data: base64,
                name: file.name
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
