/* AUFGABE 7 - SMARTPHONE SPIEL - CHRISTOPH SCHUBERT */


let ballX, ballY;    // Kugelposition
let velX, velY;      // Kugelgeschwindigkeit
let accX, accY;      // Kugelbeschleunigung; abhängig von Schräglage des Gerätes
let g = 2;           // globale "Schwerkraft", bestimmt, wie schnell Kugel beschleunigt wird
let ballSize = 100;  // Kugelgröße

let gameover = false;   // aktueller Spielstatus
let queueGameOver = 0;  // Hilfsvariable, damit bei Gameover trotzdem der komplette Level gezeichnet wird
let level = 1;          // aktueller Punktestand



function setup() {
   createCanvas(windowWidth, windowHeight);
   angleMode(DEGREES);
   colorMode(HSB,255);
   resetAll();
}

function draw() {
   if (gameover) { return; }

   loadLevel(level);

   // Neue Kugeldaten berechnen
   updateAcceleration();
   updateVelocity();
   updatePosition();

   drawBall(ballX, ballY, ballSize, ballColor);    // Kugel zeichnen
}

function updateAcceleration() {  // Beschleunigung
   accX = sin(rotationY) * g;
   accY = sin(rotationX) * g;
}

function updateVelocity() {      // Geschwindigkeit
   velX = velX + accX;
   velY = velY + accY;
}

function updatePosition() {      // Position
   let rlowerXBound, rupperXBound, rlowerYBound, rupperYBound;

   rlowerXBound = lowerXBound();
   rupperXBound = upperXBound();
   rlowerYBound = lowerYBound();
   rupperYBound = upperYBound();

   ballX = min(rupperXBound, max(ballX + velX, rlowerXBound));
   ballY = min(rupperYBound, max(ballY + velY, rlowerYBound));

   if (ballX <= rlowerXBound
      || ballX >= rupperXBound) {
      velX = velX* - 0.7;
   }

   if (ballY <= rlowerYBound
      || ballY >= rupperYBound) {
      velY = velY * - 0.7;
   }
}

// Alle Variablen in Ausgangszustand zurückversetzen
function resetAll() {
   ballX = width / 2;
   ballY = height - 100;
   velX = 0;
   velY = 0;
   accX = 0;
   accY = 0;
   gameover = false;
   queueGameOver = 0;
   ballColor = color(random(255), 200, 150);
}

function gameOver(victory) {     // victory = true/false definiert, ob der Level erfolgreich abgeschlossen oder abgebrochen wurde
   gameover = true;
   
   fill(255);
   noStroke();
   textSize(400);
   if (victory == 1) {
      level++;
      text("PASS",0 , height / 2);
   } else {
      text("DEAD",0 , height / 2);
   }
}


// Spielfeldgrenzen
function lowerXBound() {
   return ballSize / 2;
}

function upperXBound() {
   return width - (ballSize / 2);
}

function lowerYBound() {
   return ballSize / 2;
}

function upperYBound() {
   return height - (ballSize / 2);
}


function drawBall(x, y, size, bcolor) {
   noStroke();
   fill(bcolor);
   ellipse(x, y, size);
   fill(255);
   ellipse(x - size * 0.15, y - size * 0.15, size * 0.4);
}


function touchStarted() {
   if (gameover) { resetAll(); }    // bei GameOver-Bildschirm alles zurücksetzen
}


function loadLevel(n) {    // zeichnet alle zu Level <n> gehörigen Objekte und überprüft Kollisionen
   let goalX = width / 2;
   let goalY = 0;
   let goalSize = 200;

   // Level 1
   if (n == 1) {
      background(200, 100, 100);
      createHole(0,height / 2, width * 1.2);
   }
   //Level 2
   else if (n == 2) {
      background(250, 100, 100);
      createHole(0,height / 2, width * 0.8);
      createHole(width,height / 2, width * 0.8);
      goalX = width * 0.8;
   }
   //Level 3
   else if (n == 3) {
      background(40, 100, 100);
      createHole(0,height * 0.7, width * 0.9);
      createHole(width,height * 0.3, width * 0.9);
   }
   //Level 4
   else if (n == 4) {
      background(70, 100, 100);
      createHole(0, height * 0.3, width * 0.7);
      createHole(width, height * 0.3, width * 0.7);
      createHole(width / 2, height * 0.7, width * 0.5);
   }
   //Level 5
   else if (n == 5) {
      background(100, 100, 100);
      createHole(width * 0.2, height * 0.8, width * 0.5);
      createHole(width * 0.8, height * 0.5, width * 0.6);
      createHole(width * 0.2, height * 0.2, width * 0.5);
      goalX = width - 300;
   }
   //Level 6
   else if (n == 6) {
      background(100, 100, 100);
      createHole(width * 0.1, height * 0.7, width * 0.4);
      createHole(width * 0.7, height * 0.7, width * 0.5);
      createHole(width * 0.3, height * 0.3, width * 0.5);
      createHole(width * 0.9, height * 0.3, width * 0.4);
      goalX = width - 300;
   }

   // usw....
   // hier zu Level 1 zurückspringen

   else { level = 1; }

   fill(200);
   noStroke();
   textSize(200);
   text("Level " + level, 0, height - 50);

   createGoal(goalX, goalY, goalSize);

   if (queueGameOver) { gameOver(queueGameOver - 1); }
}

function createHole(holeX, holeY, holeSize) {      // Erstellt und prüft die Lochflächen

   noStroke();
   fill(0);
   ellipse(holeX, holeY, holeSize);
   if (dist(holeX, holeY, ballX, ballY) <=  holeSize / 2) {
      queueGameOver = 1;
   }
}

function createGoal(goalX, goalY, goalSize) {      // Erstellt und prüft die Zielfläche

   noStroke();
   fill(100,200,200,200);
   ellipse(goalX, goalY, goalSize);
   if (dist(goalX, goalY, ballX, ballY) <=  goalSize / 2) {
      queueGameOver = 2;
   }
}