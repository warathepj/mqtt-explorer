const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  setInterval(() => {
    client.publish('topic/test', 'hello', (err) => {
      if (err) {
        console.error('Failed to publish message:', err);
      } else {
        console.log('Message "hello" published to topic "topic/test"');
      }
    });
  }, 5000); // 5000 milliseconds = 5 seconds
});

client.on('error', (err) => {
  console.error('MQTT client error:', err);
});

client.on('offline', () => {
  console.log('MQTT client is offline');
});

client.on('reconnect', () => {
  console.log('MQTT client is reconnecting');
});
