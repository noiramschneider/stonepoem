// Add this code to the beginning of the file, after the imports
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('error', (error) => {
  console.error(`Socket.IO error: ${error}`);
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
const messages = [
  { role: 'user', content: 'create a poem that a robot would write to a stone. The poem would be inspired by the guilt fear and sadness that the robot feels about the environmental crisis. It would be an apology motivated by empathy.' }
];
 
const doIt = async () => {
  try {
    const completion = await openai.createChatCompletion({
  model: 'gpt-3.5-turbo',
  messages
});
    const message = completion.data.choices[0].message.content;
    console.log('this is the message '+ message);
    
    setTimeout(() => {
      socket.emit('message', message);
    }, 10000); // 1 second delay

  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
};

doIt();
