import elements from './elements.js';
import settingsManager from '../settings/settings-manager.js';

const showDisconnectButton = () => {
    if (elements.disconnectBtn) {
        elements.disconnectBtn.classList.add('connected');
        elements.disconnectBtn.querySelector('.icon').textContent = '⏸';
    }
};

const showConnectButton = () => {
    if (elements.disconnectBtn) {
        elements.disconnectBtn.classList.remove('connected');
        elements.disconnectBtn.querySelector('.icon').textContent = '⏵';
    }
};

let isCameraActive = false;

const ensureAgentReady = async (agent) => {
    if (!agent.connected) {
        await agent.connect();
        showDisconnectButton();
    }
    if (!agent.initialized) {
        await agent.initialize();
    }
};

export function setupEventListeners(agent) {
    // Response type toggle
    const responseToggle = document.getElementById('responseTypeToggle');
    const toggleLabel = document.querySelector('.toggle-label');
    const visualizer = document.getElementById('visualizer');
    
    responseToggle.addEventListener('change', () => {
        const isAudio = responseToggle.checked;
        toggleLabel.textContent = isAudio ? 'Audio' : 'Text';
        visualizer.classList.toggle('active', isAudio);
        localStorage.setItem('responseModalities', isAudio ? 'audio' : 'text');
        window.location.reload(); // Reload to apply new response type
    });

    // Set initial state
    const savedModality = localStorage.getItem('responseModalities') || 'text';
    responseToggle.checked = savedModality === 'audio';
    toggleLabel.textContent = savedModality === 'audio' ? 'Audio' : 'Text';
    visualizer.classList.toggle('active', savedModality === 'audio');

    // Rest of your existing event listeners...
    elements.disconnectBtn?.addEventListener('click', async () => {
        try {
            if (agent.connected) {
                await agent.disconnect();
                showConnectButton();
                [elements.cameraBtn, elements.screenBtn, elements.micBtn].forEach(btn => btn?.classList.remove('active'));
                isCameraActive = false;
            } else {
                await ensureAgentReady(agent);
            }
        } catch (error) {
            console.error('Error toggling connection:', error);
        }
    });

    // Your other existing event listeners...
     // Microphone toggle handler
    elements.micBtn?.addEventListener('click', async () => {
        try {
            await ensureAgentReady(agent);
            await agent.toggleMic();
            elements.micBtn.classList.toggle('active');
        } catch (error) {
            console.error('Error toggling microphone:', error);
            elements.micBtn.classList.remove('active');
        }
    });

    // Camera toggle handler
    elements.cameraBtn?.addEventListener('click', async () => {
        try {
            await ensureAgentReady(agent);
            
            if (!isCameraActive) {
                await agent.startCameraCapture();
                elements.cameraBtn.classList.add('active');
            } else {
                await agent.stopCameraCapture();
                elements.cameraBtn.classList.remove('active');
            }
            isCameraActive = !isCameraActive;
        } catch (error) {
            console.error('Error toggling camera:', error);
            elements.cameraBtn.classList.remove('active');
            isCameraActive = false;
        }
    });

    // Screen sharing handler
    let isScreenShareActive = false;
    
    // Listen for screen share stopped events (from native browser controls)
    agent.on('screenshare_stopped', () => {
        elements.screenBtn?.classList.remove('active');
        isScreenShareActive = false;
        console.info('Screen share stopped');
    });

    elements.screenBtn?.addEventListener('click', async () => {
        try {
            await ensureAgentReady(agent);
            
            if (!isScreenShareActive) {
                await agent.startScreenShare();
                elements.screenBtn.classList.add('active');
            } else {
                await agent.stopScreenShare();
                elements.screenBtn.classList.remove('active');
            }
            isScreenShareActive = !isScreenShareActive;
        } catch (error) {
            console.error('Error toggling screen share:', error);
            elements.screenBtn.classList.remove('active');
            isScreenShareActive = false;
        }
    });

    // Message sending handlers
    const sendMessage = async () => {
        try {
            await ensureAgentReady(agent);
            const text = elements.messageInput?.value.trim() || '';
            await agent.sendText(text);
            if (elements.messageInput) {
                elements.messageInput.value = '';
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    elements.sendBtn?.addEventListener('click', sendMessage);
    elements.messageInput?.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    // Settings button click
    elements.settingsBtn?.addEventListener('click', () => settingsManager.show());
}

// Initialize settings
settingsManager;
