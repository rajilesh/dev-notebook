# Chat Mode Feature

## Overview
A new "Chat" mode has been added to the AI assistant that provides a ChatGPT-like streaming experience with multimodal support (text, code, images, and videos).

## Features

### 1. **Streaming Responses**
- Real-time streaming of AI responses similar to ChatGPT, Gemini, Claude, and other modern chat interfaces
- Smooth character-by-character display with streaming indicators
- No waiting for complete responses before display

### 2. **Multimodal Support**
- **Text**: Standard text conversations
- **Code**: Syntax-highlighted code blocks with language detection
- **Images**: Upload and send images in your messages
- **Videos**: Upload and send videos (supported by select models)

### 3. **Supported AI Providers**
The following providers support streaming in chat mode:
- **OpenAI** (GPT-4, GPT-4V for vision, GPT-3.5)
- **Google Gemini** (Gemini Pro, Gemini Pro Vision)
- **Anthropic Claude** (Claude 3 Opus, Sonnet, Haiku with vision)
- **X.AI** (Grok models)
- **DeepSeek** (DeepSeek Chat, DeepSeek Coder)
- **Mistral AI** (Mistral Large, Medium, Small, Codestral)
- **Nvidia** (Nvidia models)
- **Alibaba** (Qwen models)

## How to Use

### Basic Chat
1. Select **"Chat"** from the output type dropdown
2. The interface will switch to chat mode with a message history view
3. Type your message in the input field at the bottom
4. Press **Enter** or click the **Send** button (arrow icon)
5. Watch as the AI response streams in real-time

### Attaching Images/Videos
1. Click the **📎 Attach** button next to the input field
2. Select one or more image or video files
3. Preview thumbnails will appear above the input
4. Type your message (optional) and send
5. The AI will analyze the media and respond

**Supported Models for Vision:**
- OpenAI GPT-4V, GPT-4 Turbo
- Google Gemini Pro Vision, Gemini 1.5
- Anthropic Claude 3 (all variants)

### Managing Chat History
- All messages remain visible in the chat window
- Scroll up to see previous conversations
- Click the **🗑️ Clear** button (top right) to delete all chat history
- Chat history persists during the session but resets on page reload

### Keyboard Shortcuts
- **Enter**: Send message
- **Shift + Enter**: New line in message (if implemented)
- **/trigger**: Use snippets in chat (same as note mode)

## UI Elements

### Chat Container
- **Message History**: Scrollable list of all messages
- **User Messages**: Displayed on the right with blue background
- **Assistant Messages**: Displayed on the left with gray background
- **Avatars**: Visual indicators for user (👤) and assistant (🤖)

### Input Area
- **Attach Button**: Upload images/videos
- **Text Input**: Multi-line input field
- **Send Button**: Submit message (disabled while streaming)

### Attachments
- **Preview Thumbnails**: Show attached media before sending
- **Remove Button**: Click ❌ to remove individual attachments

## Technical Details

### Streaming Implementation
- Uses Server-Sent Events (SSE) for real-time data streaming
- Buffers and parses chunked responses from various providers
- Handles different response formats per provider

### Multimodal Encoding
- Images and videos are encoded to base64
- Different providers use different multimodal formats:
  - OpenAI: `image_url` with base64 data URI
  - Gemini: `inline_data` with mime type and base64
  - Claude: `image` source with base64

### Message Format
Chat history maintains proper conversation structure:
```javascript
{
  role: 'user' | 'assistant',
  content: 'text' | [{ type, data }, ...]
}
```

## Limitations

1. **File Size**: Large images/videos may exceed API limits
2. **Video Support**: Limited to models that support video analysis (currently mainly Gemini)
3. **Session Storage**: Chat history is not persisted across page reloads
4. **Provider Support**: Streaming only works with providers that support SSE
5. **Rate Limits**: Subject to each provider's API rate limits

## Tips

- For best results with images, use GPT-4V, Gemini Vision, or Claude 3
- Keep images under 5MB for optimal upload speed
- Videos work best with Gemini models
- Use code snippets with ``` markdown for better formatting
- Clear chat history periodically to maintain performance

## Future Enhancements

Potential improvements:
- [ ] Persistent chat history storage
- [ ] Export chat to note
- [ ] Message editing/regeneration
- [ ] Multiple chat sessions/threads
- [ ] File attachment preview before sending
- [ ] Copy message content
- [ ] Search within chat history
