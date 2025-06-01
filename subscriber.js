const mqtt = require('mqtt');
const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import the 'path' module

const client = mqtt.connect('mqtt://localhost:1883');

// Define a topic for subscription. Initialized from env variable or default.
// This variable will be updated if a new topic is subscribed via HTTP.
let currentMainTopic = process.env.MQTT_TOPIC || 'topic/test';

const wss = new WebSocket.Server({ port: 8083 });
const app = express();
const httpPort = 3000;

app.use(bodyParser.json()); // Use body-parser to parse JSON bodies
app.use(express.static(__dirname)); // Serve static files from the current directory

// Serve the index.html file on the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// HTTP POST endpoint for subscription
app.post('/subscribe', (req, res) => {
  const { topic } = req.body;
  if (topic) {
    console.log(`Received topic subscription request via HTTP for: ${topic}`); // Log the received topic
    // Optional: If currentMainTopic should represent a single, exclusive subscription
    // that changes, you might want to unsubscribe from the old currentMainTopic here.
    // For example:
    // if (currentMainTopic && client.connected) {
    //   client.unsubscribe(currentMainTopic, () => console.log(`Unsubscribed from ${currentMainTopic}`));
    // }

    client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to topic: ${topic} via HTTP`);
        currentMainTopic = topic; // Update currentMainTopic with the new topic from index.html
        console.log(`currentMainTopic is now: ${currentMainTopic}`);
        res.status(200).send(`Successfully subscribed to ${topic}`);
      } else {
        console.error(`Failed to subscribe to topic: ${topic} via HTTP`, err);
        res.status(500).send(`Failed to subscribe to ${topic}: ${err.message}`);
      }
    });
  } else {
    res.status(400).send('Topic not provided');
  }
});

let clients = [];

wss.on('connection', ws => {
  console.log('Client connected');
  clients.push(ws);

  ws.on('close', () => {
    console.log('Client disconnected');
    clients = clients.filter(c => c !== ws);
  });
});

client.on('connect', () => {
  if (currentMainTopic) { // Check if there's an initial topic to subscribe to
    client.subscribe(currentMainTopic, (err) => {
      if (!err) {
        console.log(`Successfully subscribed to initial topic: ${currentMainTopic}`);
      } else {
        console.error(`Failed to subscribe to initial topic: ${currentMainTopic}`, err);
      }
    });
  } else {
    console.log('MQTT client connected. No initial topic defined. Waiting for subscription via HTTP.');
  }
});

client.on('message', (topic, message) => {
  // message is Buffer
  const msg = message.toString();
  console.log(`Received MQTT message: ${msg}`);
  
  // Send message to all connected WebSocket clients
  clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  });
});

console.log('MQTT Subscriber and WebSocket server started on port 8080');
app.listen(httpPort, () => {
  console.log(`HTTP Subscriber server started on port ${httpPort}`);
});
