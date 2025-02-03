require('dotenv').config();
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


const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const doIt = async () => {
  const messages = [
    { role: 'user', content: "Pourrais-tu créer un poème qu'un robot écrirait à une roche ? La roche est un schiste d'environ 1 tonne et le robot est face a elle. Le poème serait inspiré par la culpabilité, la peur et la tristesse que le robot éprouve face à la crise environnementale. Ce serait des excuses motivées par l'empathie, mettant en lumière le caractère minéral des deux agents. Il doit contenir moins de 800 caractères." }

  ];

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
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

// Call doIt every half an hour
setInterval(doIt, 3600000/2); // 60 seconds * 1000 milliseconds
