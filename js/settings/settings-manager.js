import { settingsTemplate } from './settings-template.js';

class SettingsManager {
    constructor() {
        this._eventListeners = [];
        this.initializeElements();
        this.setupEventListeners();
        this.loadSettings();
    }

    initializeElements() {
        // Create settings dialog and overlay
        this.dialog = document.createElement('div');
        this.dialog.className = 'settings-dialog';
        this.dialog.innerHTML = settingsTemplate;

        this.overlay = document.createElement('div');
        this.overlay.className = 'settings-overlay';

        // Add to document
        document.body.appendChild(this.dialog);
        document.body.appendChild(this.overlay);

        // Cache DOM elements
        this.elements = {
            dialog: this.dialog,
            overlay: this.overlay,
            apiKeyInput: this.dialog.querySelector('#apiKey'),
            deepgramApiKeyInput: this.dialog.querySelector('#deepgramApiKey'),
            voiceSelect: this.dialog.querySelector('#voice'),
            sampleRateInput: this.dialog.querySelector('#sampleRate'),
            sampleRateValue: this.dialog.querySelector('#sampleRateValue'),
            systemInstructionsToggle: this.dialog.querySelector('#systemInstructionsToggle'),
            systemInstructionsContent: this.dialog.querySelector('#systemInstructions').parentElement,
            systemInstructionsInput: this.dialog.querySelector('#systemInstructions'),
            screenCameraToggle: this.dialog.querySelector('#screenCameraToggle'),
            screenCameraContent: this.dialog.querySelector('#screenCameraToggle + .collapsible-content'),
            fpsInput: this.dialog.querySelector('#fps'),
            fpsValue: this.dialog.querySelector('#fpsValue'),
            resizeWidthInput: this.dialog.querySelector('#resizeWidth'),
            resizeWidthValue: this.dialog.querySelector('#resizeWidthValue'),
            qualityInput: this.dialog.querySelector('#quality'),
            qualityValue: this.dialog.querySelector('#qualityValue'),
            advancedToggle: this.dialog.querySelector('#advancedToggle'),
            advancedContent: this.dialog.querySelector('#advancedToggle + .collapsible-content'),
            temperatureInput: this.dialog.querySelector('#temperature'),
            temperatureValue: this.dialog.querySelector('#temperatureValue'),
            topPInput: this.dialog.querySelector('#topP'),
            topPValue: this.dialog.querySelector('#topPValue'),
            topKInput: this.dialog.querySelector('#topK'),
            topKValue: this.dialog.querySelector('#topKValue'),
            safetyToggle: this.dialog.querySelector('#safetyToggle'),
            safetyContent: this.dialog.querySelector('#safetyToggle + .collapsible-content'),
            harassmentInput: this.dialog.querySelector('#harassmentThreshold'),
            harassmentValue: this.dialog.querySelector('#harassmentValue'),
            dangerousInput: this.dialog.querySelector('#dangerousContentThreshold'),
            dangerousValue: this.dialog.querySelector('#dangerousValue'),
            sexualInput: this.dialog.querySelector('#sexuallyExplicitThreshold'),
            sexualValue: this.dialog.querySelector('#sexualValue'),
            civicInput: this.dialog.querySelector('#civicIntegrityThreshold'),
            civicValue: this.dialog.querySelector('#civicValue'),
            visualizerColorInput: this.dialog.querySelector('#visualizerColor'),
            saveBtn: this.dialog.querySelector('#settingsSaveBtn')
        };
    }

    setupEventListeners() {
        // Helper to track and remove listeners for cleanup
        const addListener = (el, type, fn) => {
            el.addEventListener(type, fn);
            this._eventListeners.push({ el, type, fn });
        };

        // Close settings when clicking overlay
        addListener(this.overlay, 'click', () => this.hide());

        // Prevent dialog close when clicking inside dialog
        addListener(this.dialog, 'click', (e) => e.stopPropagation());

        // Save settings
        addListener(this.elements.saveBtn, 'click', () => {
            try {
                this.saveSettings();
                this.hide();
                window.location.reload();
            } catch (err) {
                this.showError('Failed to save settings: ' + err.message);
            }
        });

        // Toggle collapsible sections
        addListener(this.elements.systemInstructionsToggle, 'click', () => {
            this.toggleCollapsible(this.elements.systemInstructionsToggle, this.elements.systemInstructionsContent);
        });

        addListener(this.elements.advancedToggle, 'click', () => {
            this.toggleCollapsible(this.elements.advancedToggle, this.elements.advancedContent);
        });

        addListener(this.elements.screenCameraToggle, 'click', () => {
            this.toggleCollapsible(this.elements.screenCameraToggle, this.elements.screenCameraContent);
        });

        addListener(this.elements.safetyToggle, 'click', () => {
            this.toggleCollapsible(this.elements.safetyToggle, this.elements.safetyContent);
        });

        // Add input listeners for real-time value updates
        const inputElements = [
            'sampleRateInput', 'temperatureInput', 'topPInput', 'topKInput',
            'fpsInput', 'resizeWidthInput', 'qualityInput', 'harassmentInput',
            'dangerousInput', 'sexualInput', 'civicInput'
        ];

        inputElements.push('visualizerColorInput');

        const updateValues = () => this.updateDisplayValues();
        inputElements.forEach(elementName => {
            addListener(this.elements[elementName], 'input', updateValues);
        });
    }

    loadSettings() {
        try {
            // Load values from localStorage
            this.elements.apiKeyInput.value = localStorage.getItem('apiKey') || "";
            this.elements.visualizerColorInput.value = localStorage.getItem('visualizerColor') || "#00FF00";
            this.elements.deepgramApiKeyInput.value = localStorage.getItem('deepgramApiKey') || '';
            this.elements.voiceSelect.value = localStorage.getItem('voiceName') || 'Aoede';
            this.elements.sampleRateInput.value = localStorage.getItem('sampleRate') || '27000';
            this.elements.systemInstructionsInput.value = localStorage.getItem('systemInstructions') || 'You are a helpful assistant';
            this.elements.temperatureInput.value = localStorage.getItem('temperature') || '1.8';
            this.elements.topPInput.value = localStorage.getItem('top_p') || '0.95';
            this.elements.topKInput.value = localStorage.getItem('top_k') || '65';

            // Initialize screen & camera settings
            this.elements.fpsInput.value = localStorage.getItem('fps') || '1';
            this.elements.resizeWidthInput.value = localStorage.getItem('resizeWidth') || '640';
            this.elements.qualityInput.value = localStorage.getItem('quality') || '0.3';

            // Initialize safety settings
            this.elements.harassmentInput.value = localStorage.getItem('harassmentThreshold') || '3';
            this.elements.dangerousInput.value = localStorage.getItem('dangerousContentThreshold') || '3';
            this.elements.sexualInput.value = localStorage.getItem('sexuallyExplicitThreshold') || '3';
            this.elements.civicInput.value = localStorage.getItem('civicIntegrityThreshold') || '3';

            this.updateDisplayValues();
        } catch (err) {
            this.showError('Failed to load settings: ' + err.message);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('apiKey', this.elements.apiKeyInput.value);
            localStorage.setItem('visualizerColor', this.elements.visualizerColorInput.value);
            localStorage.setItem('deepgramApiKey', this.elements.deepgramApiKeyInput.value);
            localStorage.setItem('voiceName', this.elements.voiceSelect.value);
            localStorage.setItem('sampleRate', this.elements.sampleRateInput.value);
            localStorage.setItem('systemInstructions', this.elements.systemInstructionsInput.value);
            localStorage.setItem('temperature', this.elements.temperatureInput.value);
            localStorage.setItem('top_p', this.elements.topPInput.value);
            localStorage.setItem('top_k', this.elements.topKInput.value);
            
            // Save screen & camera settings
            localStorage.setItem('fps', this.elements.fpsInput.value);
            localStorage.setItem('resizeWidth', this.elements.resizeWidthInput.value);
            localStorage.setItem('quality', this.elements.qualityInput.value);

            // Save safety settings
            localStorage.setItem('harassmentThreshold', this.elements.harassmentInput.value);
            localStorage.setItem('dangerousContentThreshold', this.elements.dangerousInput.value);
            localStorage.setItem('sexuallyExplicitThreshold', this.elements.sexualInput.value);
            localStorage.setItem('civicIntegrityThreshold', this.elements.civicInput.value);
        } catch (err) {
            this.showError('Failed to save settings: ' + err.message);
            throw err;
        }
    }

    updateDisplayValues() {
        this.elements.sampleRateValue.textContent = this.elements.sampleRateInput.value + " Hz";
        this.elements.temperatureValue.textContent = this.elements.temperatureInput.value;
        this.elements.topPValue.textContent = this.elements.topPInput.value;
        this.elements.topKValue.textContent = this.elements.topKInput.value;
        this.elements.fpsValue.textContent = this.elements.fpsInput.value + " FPS";
        this.elements.resizeWidthValue.textContent = this.elements.resizeWidthInput.value + "px";
        this.elements.qualityValue.textContent = this.elements.qualityInput.value;
        this.elements.harassmentValue.textContent = this.getThresholdLabel(this.elements.harassmentInput.value);
        this.elements.dangerousValue.textContent = this.getThresholdLabel(this.elements.dangerousInput.value);
        this.elements.sexualValue.textContent = this.getThresholdLabel(this.elements.sexualInput.value);
        this.elements.civicValue.textContent = this.getThresholdLabel(this.elements.civicInput.value);
        this.elements.visualizerColorValue.textContent = this.elements.visualizerColorInput.value;
    }
    getThresholdLabel(value) {
        const labels = {
            '0': 'None',
            '1': 'Low',
            '2': 'Medium',
            '3': 'High'
        };
        return labels[value] || value;
    }

    toggleCollapsible(toggle, content) {
        const isActive = content.classList.contains('active');
        content.classList.toggle('active');
        toggle.textContent = toggle.textContent.replace(isActive ? '▼' : '▲', isActive ? '▲' : '▼');
    }

    show() {
        this.dialog.classList.add('active');
        this.overlay.classList.add('active');
    }

    hide() {
        this.dialog.classList.remove('active');
        this.overlay.classList.remove('active');
    }
    showError(message) {
        // Remove existing error if present
        let errorDiv = this.dialog.querySelector('.settings-error');
        if (errorDiv) errorDiv.remove();
        errorDiv = document.createElement('div');
        errorDiv.className = 'settings-error';
        errorDiv.style.color = 'red';
        errorDiv.style.marginBottom = '10px';
        errorDiv.textContent = message;
        this.dialog.insertBefore(errorDiv, this.dialog.firstChild);
        setTimeout(() => {
            if (errorDiv && errorDiv.parentNode) errorDiv.remove();
        }, 5000);
    }

    destroy() {
        // Remove all event listeners
        if (this._eventListeners) {
            this._eventListeners.forEach(({ el, type, fn }) => {
                el.removeEventListener(type, fn);
            });
            this._eventListeners = [];
        }
        // Remove DOM elements
        if (this.dialog && this.dialog.parentNode) {
            this.dialog.parentNode.removeChild(this.dialog);
        }
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        this.elements = null;
    }
}

export default new SettingsManager();