const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  client.subscribe('topic/test', (err) => {
    if (!err) {
      console.log("Subscribed to topic/test");
    }
  });
});

client.on('message', (topic, message) => {
  // message is Buffer
  console.log(message.toString());
});
