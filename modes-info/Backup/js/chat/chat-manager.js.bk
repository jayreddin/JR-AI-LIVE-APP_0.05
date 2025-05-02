export class ChatManager {
    constructor() {
        this.chatContainer = document.getElementById('chatHistory');
        this.currentStreamingMessage = null;
        this.lastUserMessageType = null;
        this.currentTranscript = '';
    }

    addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user-message';
        
        const header = document.createElement('div');
        header.className = 'message-header';
        header.textContent = `You: ${new Date().toLocaleTimeString()}`;
        
        const content = document.createElement('div');
        content.textContent = text;
        
        messageDiv.appendChild(header);
        messageDiv.appendChild(content);
        
        this.chatContainer.insertBefore(messageDiv, this.chatContainer.firstChild);
        this.lastUserMessageType = 'text';
        this.scrollToBottom();
    }

    addUserAudioMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user-message';
        
        const header = document.createElement('div');
        header.className = 'message-header';
        header.textContent = `You: ${new Date().toLocaleTimeString()}`;
        
        const content = document.createElement('div');
        content.textContent = 'Voice message';
        
        messageDiv.appendChild(header);
        messageDiv.appendChild(content);
        
        this.chatContainer.insertBefore(messageDiv, this.chatContainer.firstChild);
        this.lastUserMessageType = 'audio';
        this.scrollToBottom();
    }

    startModelMessage() {
        if (this.currentStreamingMessage) {
            this.finalizeStreamingMessage();
        }

        if (!this.lastUserMessageType) {
            this.addUserAudioMessage();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message model-message streaming';
        
        const header = document.createElement('div');
        header.className = 'message-header';
        header.textContent = `AI: ${new Date().toLocaleTimeString()}`;
        
        const content = document.createElement('div');
        
        messageDiv.appendChild(header);
        messageDiv.appendChild(content);
        
        this.chatContainer.insertBefore(messageDiv, this.chatContainer.firstChild);
        this.currentStreamingMessage = content;
        this.currentTranscript = '';
        this.scrollToBottom();
    }

    updateStreamingMessage(text) {
        if (!this.currentStreamingMessage) {
            this.startModelMessage();
        }
        this.currentTranscript += ' ' + text;
        this.currentStreamingMessage.textContent = this.currentTranscript;
        this.scrollToBottom();
    }

    finalizeStreamingMessage() {
        if (this.currentStreamingMessage) {
            this.currentStreamingMessage.parentElement.classList.remove('streaming');
            this.currentStreamingMessage = null;
            this.lastUserMessageType = null;
            this.currentTranscript = '';
        }
    }

    scrollToBottom() {
        this.chatContainer.scrollTop = 0;
    }

    clear() {
        this.chatContainer.innerHTML = '';
        this.currentStreamingMessage = null;
        this.lastUserMessageType = null;
        this.currentTranscript = '';
    }
}