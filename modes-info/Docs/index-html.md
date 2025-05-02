# index.html Documentation

## Purpose
index.html is the main entry point for the Gemini Live web application. It defines the core UI layout, loads the main stylesheet and JavaScript module, and provides the structure for all primary user interactions.

## Structure Overview

- **Head**
  - Sets charset, viewport, and page title.
  - Links to `css/styles.css`.

- **Body**
  - `.app-container`: Main wrapper for the app UI.
    - **Header**: Contains a disconnect/power button and a response type toggle (text/audio).
    - **Chat History**: Displays conversation history.
    - **Control Panel**: Buttons for microphone, camera, screen sharing, and settings.
    - **Visualizer**: Canvas for audio or other visual feedback.
    - **Text Input**: Field and button for sending messages.
    - **Camera Preview**: For live camera feed and switching camera.
    - **Screen Preview**: For screen sharing preview.
  - Loads main JavaScript module: `js/script.js`.

## Key Elements

- **Buttons**: For disconnect, mic, camera, screen, settings, send, and camera switch.
- **Toggles**: For switching response type (text/audio).
- **Canvas**: For visual feedback (e.g., audio visualization).
- **Input**: For user message entry.
- **Preview Containers**: For camera and screen sharing.

## Dependencies

- CSS: `css/styles.css`
- JavaScript: `js/script.js` (module)

## Notes

- All main UI features are initialized here; dynamic behavior is handled by linked JS.
- Designed for extensibility with modular containers for future features.

**Mode:** agent-research