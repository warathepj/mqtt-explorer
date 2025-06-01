# ซอร์สโค้ดนี้ ใช้สำหรับเป็นตัวอย่างเท่านั้น ถ้านำไปใช้งานจริง ผู้ใช้ต้องจัดการเรื่องความปลอดภัย และ ประสิทธิภาพด้วยตัวเอง

# MQTT WebSocket Explorer

This project demonstrates a simple setup for subscribing to MQTT topics and displaying the messages in a web interface via WebSockets. It also allows users to dynamically subscribe to new MQTT topics through an HTTP endpoint.

## Features

*   **MQTT Subscriber:** A Node.js script (`subscriber.js`) connects to an MQTT broker, subscribes to specified topics, and forwards received messages.
*   **WebSocket Server:** Integrated into the subscriber, it pushes MQTT messages to connected web clients in real-time.
*   **Web Interface:** An HTML page (`index.html`) that connects to the WebSocket server to display incoming MQTT messages.
*   **Dynamic Topic Subscription:** Users can enter an MQTT topic in the web interface and subscribe to it via an HTTP POST request to the backend.
*   **MQTT Publisher:** A separate Node.js script (`publisher.js`) to publish sample messages to an MQTT topic for testing purposes.
*   **Static File Serving:** The `subscriber.js` also serves the `index.html` page.

## Project Structure

```
mqtt-explorer/
├── index.html         # Frontend HTML page for displaying messages and subscribing to topics
├── publisher.js       # Node.js script to publish MQTT messages
├── subscriber.js      # Node.js script acting as MQTT subscriber, WebSocket server, and HTTP server
└── README.md          # This file
```

## Prerequisites

*   **Node.js and npm:** Ensure you have Node.js (which includes npm) installed. You can download it from nodejs.org.
*   **MQTT Broker:** You need an MQTT broker running. A popular choice is Mosquitto. If you don't have one, you can install it locally or use a public one (be mindful of security and privacy with public brokers). The default configuration expects a broker at `mqtt://localhost:1883`.

### Install mqtt broker

https://mosquitto.org/download/


## Setup and Installation

1.  **Clone the repository (or create the files):**
    If this were a git repository, you'd clone it. Otherwise, ensure you have the `index.html`, `publisher.js`, and `subscriber.js` files in a directory (e.g., `mqtt-explorer`).

2.  **Install dependencies:**
    Navigate to your project directory in the terminal and install the necessary Node.js packages:
    ```bash
    npm init -y # If you don't have a package.json yet
    npm install mqtt ws express body-parser
    ```

## Running the Application

You'll need to run two main components: the subscriber/WebSocket server and optionally the publisher.

1.  **Start the MQTT Broker:**
    Ensure your MQTT broker is running (e.g., Mosquitto).

2.  **Start the Subscriber and Web Server:**
    Open a terminal, navigate to the project directory, and run:
```bash
node subscriber.js
```
    You should see console output indicating:
    *   Connection to the MQTT broker.
    *   Subscription to the initial topic (default: `topic/test` or `MQTT_TOPIC` env variable).
    *   WebSocket server started on port `8083`.
    *   HTTP server started on port `3000`.

3.  **Start the Publisher (Optional):**
    To send test messages, open another terminal, navigate to the project directory, and run:
```bash
node publisher.js
```
    This script will connect to the MQTT broker and start publishing "hello" to `topic/test1` every 5 seconds.

## How to Use

1.  **Open the Web Interface:**
    Open your web browser and go to `http://localhost:3000`.
    You should see the "MQTT Messages via WebSocket" page.

2.  **View Messages:**
    *   If the `subscriber.js` successfully connected to the WebSocket server, you'll see a "Connected to WebSocket server" message.
    *   If you started `publisher.js` and the subscriber is subscribed to `topic/test1` (either initially or by subscribing via the UI), you will see "hello" messages appearing every 5 seconds.
    *   The default initial topic for `subscriber.js` is `topic/test`. You can change this by setting the `MQTT_TOPIC` environment variable before running `subscriber.js` (e.g., `MQTT_TOPIC=topic/test1 node subscriber.js`).

3.  **Subscribe to a New Topic via HTTP:**
    *   In the input field labeled "Enter topic to subscribe via HTTP" on the web page, type the MQTT topic you want to subscribe to (e.g., `topic/another` or `topic/test1` if not already subscribed).
    *   Click the "Subscribe via HTTP" button.
    *   You'll see a confirmation message on the web page, and the `subscriber.js` console will log the new subscription.
    *   Any messages published to this new topic will now appear in the web interface.

## Code Overview

### `index.html`
*   A simple HTML page with CSS for basic styling.
*   Establishes a WebSocket connection to `ws://localhost:8083`.
*   Displays connection status and incoming messages from the WebSocket server.
*   Provides an input field and button to send a POST request to `/subscribe` on the backend to subscribe to a new MQTT topic.

### `subscriber.js`
*   **MQTT Client:** Connects to `mqtt://localhost:1883`. Subscribes to an initial topic (`MQTT_TOPIC` environment variable or `topic/test` by default).
*   **WebSocket Server (`ws`):** Runs on port `8083`. Broadcasts received MQTT messages to all connected WebSocket clients.
*   **Express HTTP Server:**
    *   Runs on port `3000`.
    *   Serves `index.html` at the root (`/`).
    *   Provides a `/subscribe` POST endpoint that accepts a JSON body like `{"topic": "your/topic"}`. It then subscribes the MQTT client to this new topic.
*   **Dependencies:** `mqtt`, `ws`, `express`, `body-parser`.

### `publisher.js`
*   A simple MQTT client that connects to `mqtt://localhost:1883`.
*   Publishes the message "hello" to the topic `topic/test1` every 5 seconds.
*   Useful for testing the subscriber and web interface.
*   **Dependencies:** `mqtt`.

## Customization

*   **MQTT Broker Address:** Modify `mqtt://localhost:1883` in `publisher.js` and `subscriber.js` if your broker is elsewhere.
*   **Ports:** Change the WebSocket port (8083) and HTTP port (3000) in `subscriber.js` if needed. Remember to update the WebSocket URL in `index.html` accordingly.
*   **Initial Topic:** Set the `MQTT_TOPIC` environment variable when running `subscriber.js` to change the default subscribed topic.