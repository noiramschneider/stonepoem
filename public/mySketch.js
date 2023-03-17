// Declare variables outside of functions so they can be accessed throughout the sketch
//let socket;
var message;
var data;
message = "";
let currentLine = 0;
let currentCharacter = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);

  socket = io.connect('http://localhost:3000');
  socket.on('message', function (data) {
    console.log("Received message data:", data);
    message = data;
  });
console.log("message at setup"+ message + data);
  // Call drawPoem() in the setup() function
  drawPoem();

}

// Define the lines array once with the message variable
let lines = [message];

function drawPoem() {
  background(220);
  translate(width/2, height/2);
  rotate(HALF_PI);
  fill(0);
console.log("message at drawPoem"+ message);
  // split message into an array of lines
  lines = message.split('\n');

  textLeading(40);
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let x = 0;
    let y = -(lines.length / 2 - i) * 40;
    if (i < currentLine) {
      text(line, x, y);
    } else if (i == currentLine) {
      let substring = line.substring(0, currentCharacter);
      text(substring, x, y);
    }
  }
  if (currentLine < lines.length - 1 || currentCharacter < lines[currentLine].length) {
    if (frameCount % 4 == 0) {
      if (currentCharacter < lines[currentLine].length) {
        currentCharacter++;
      } else {
        currentLine++;
        currentCharacter = 0;
      }
    }
  }

  // Call drawPoem() recursively to continuously update the poem
  requestAnimationFrame(drawPoem);
}
