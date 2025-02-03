let video;
let lines;
let currentLine = 0;
let currentCharacter = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);
  video = createVideo('gradientvid2.mp4', videoLoaded);
  video.elt.muted = true;
  video.speed(0.5);
  video.hide();
  socket = io.connect('http://localhost:3000');
  socket.on('message', function (data) {
    console.log("Received message data:", data);
    lines = data.split('\n');
    currentLine = 0;
    currentCharacter = 0;
  });
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);
  translate(width / 2, height / 2);
  rotate(HALF_PI);
  fill(255);
  textLeading(40);
  textSize(32);
  if (lines) {
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
  }
}

function videoLoaded() {
  video.loop();
}
