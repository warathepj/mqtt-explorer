const mqtt = require('mqtt');
const WebSocket = require('ws');

const client = mqtt.connect('mqtt://localhost:1883');

const wss = new WebSocket.Server({ port: 8080 });

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
  client.subscribe('topic/test', (err) => {
    if (!err) {
      console.log("Subscribed to topic/test");
    }
  });
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
