import { arrayBufferToBase64 } from '../utils/utils.js';

export class AudioRecorder extends EventTarget {
    constructor() {
        super();
        this.sampleRate = 16000;
        this.stream = null;
        this.audioContext = null;
        this.source = null;
        this.processor = null;
        this.onAudioData = null;
        this.isRecording = false;
        this.isSuspended = false;
    }

    async start(onAudioData) {
        if (this.isRecording) {
            eventEmitter.emit('warn', 'Already recording');
            return;
        }

        this.onAudioData = onAudioData;
        try {
            // Stop any existing streams first
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }

            this.stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    channelCount: 1,
                    sampleRate: this.sampleRate,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            });
            
            this.audioContext = new AudioContext({ sampleRate: this.sampleRate });
            this.source = this.audioContext.createMediaStreamSource(this.stream);

            await this.audioContext.audioWorklet.addModule('js/audio/worklets/audio-processor.js');
            this.processor = new AudioWorkletNode(this.audioContext, 'audio-recorder-worklet');
            
            this.processor.port.onmessage = (event) => {
                if (!this.isRecording) return;
                
                if (event.data.event === 'chunk' && this.onAudioData) {
                    const base64Data = arrayBufferToBase64(event.data.data.int16arrayBuffer);
                    this.onAudioData(base64Data);
                }
            };

            this.source.connect(this.processor);
            this.processor.connect(this.audioContext.destination);
            this.isRecording = true;
            eventEmitter.emit('info', 'Audio recording started');
        } catch (error) {
            eventEmitter.emit('error', 'Failed to start audio recording:', error);
            if (this.stream) {
                console.warn('Cleaning up stream after start() error');
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }
            if (this.audioContext) {
                console.warn('Cleaning up audioContext after start() error');
                this.audioContext.close();
                this.audioContext = null;
            }
            throw new Error('Failed to start audio recording:' + error);
        }
    }

    stop() {
        try {
            if (!this.isRecording) {
                eventEmitter.emit('warn', 'stop() called but was not recording');
                return;
            }

            if (this.stream) {
                this.stream.getTracks().forEach(track => {
                    if (track.readyState !== 'ended') {
                        track.stop();
                        eventEmitter.emit('info', 'Stopped audio track:', track.id);
                    }
                });
                this.stream = null;
            } else {
                eventEmitter.emit('warn', 'No stream to clean up in stop()');
            }

            this.isRecording = false;
            console.info('Audio recording stopped');

            if (this.audioContext) {
                this.audioContext.close().then(() => {
                    eventEmitter.emit('info', 'AudioContext closed successfully');
                }).catch((err) => {
                    eventEmitter.emit('error', 'Error closing AudioContext:', err);
                });
                this.audioContext = null;
            } else {
                console.warn('No audioContext to clean up in stop()');
            }
        } catch (error) {
            eventEmitter.emit('error', 'Failed to stop audio recording:', error);
            throw new Error('Failed to stop audio recording:' + error);
        }
    }

    async suspendMic() {
        if (!this.isRecording || this.isSuspended) return;
        
        try {
            await this.audioContext.suspend();
            this.stream.getTracks().forEach(track => track.enabled = false);
            this.isSuspended = true;
            eventEmitter.emit('info', 'Microphone suspended');
        } catch (error) {
            throw new Error('Failed to suspend microphone:' + error);
        }
    }

    async resumeMic() {
        if (!this.isRecording || !this.isSuspended) return;
        
        try {
            await this.audioContext.resume();
            this.stream.getTracks().forEach(track => track.enabled = true);
            this.isSuspended = false;
            eventEmitter.emit('info', 'Microphone resumed');
        } catch (error) {
            throw new Error('Failed to resume microphone:' + error);
        }
    }

    async toggleMic() {
        if (this.isSuspended) {
            await this.resumeMic();
        } else {
            await this.suspendMic();
        }
    }
}