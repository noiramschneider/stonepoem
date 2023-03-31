const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public')); // serve static files from the public folder

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('message', (msg) => {
    console.log('received message:', msg);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const doIt = async () => {
  const messages = [
    { role: 'user', content: 'could you create a poem that a robot would write to a stone ? The poem would be inspired by the guilt, fear and sadness that the robot feels about the environmental crisis. It would be an apology motivated by empathy and would highlight the mineral carracter of both parties. It has to be less than 800 characters.' }
  ];

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages
    });

    const message = completion.data.choices[0].message.content;
    console.log('this is the message ' + message);
    io.emit('message', message);

  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
};

// Call doIt every hour
setInterval(doIt, 60 * 60000); // 60 seconds * 1000 milliseconds
