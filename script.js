  /*
  * IDB Programming: A3 — a musical instrument
  *
  * All of the code for your instrument goes in this file. It's split into sections:
  *   settings — the "fixed" parts of your program
  *   state    — the parts of your program that change over time
  *   sound    — the Tone.js instruments and effects
  *   update   — updates the state every 100ms, if necessary
  *   use      — uses the state to make sound and shapes every 100ms, if necessary
  *   controls — what happens when the player uses the pointer
  *   setup    — starts everything
  *
  * The pointer events change the state. update() and use() each run every
  * 100ms, in a loop:
  *   1. update: change the state, e.g. based on time or on the pointer's movement
  *   2. use:    make sound and move shapes, based on the state
  *
  * Shapes come from shape.js: createShape() makes one, and its methods
  * (setPosition, setSize, setColour ...) change it.
  *
  * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
  */

  import { createShape } from "./shape.js";

  // ---------- Settings ----------
  // Settings variables should contain all of the "fixed" parts of your programs
  // For example: which notes you can play, how fast things move, the tempo.
  const note = "D4";// the note played when the pointer goes down
  let x = 0;
  let y = 0;

  let distCount = 0;
  let vibrCount = 0;

  let vibrOn = false;
  let distortionOn = false;
  let spin = 0;
  let spin1 = 0;

  let speed = 0;
  let smoothSpeed = 0;

  let speed2 = 0;
  let smoothSpeed2 = 0;
  //top left rectangle
    const square1 = createShape();
    square1.setSize(900, 440);
    square1.setRoundedness(0);
    square1.setColour(170, 60, 50);
    square1.setPositionPixels(0, 0);
    square1.setRotation(0);


  //bottom left
  const square2 = createShape();
  square2.setSize(900, 440);
  square2.setRoundedness(0);
  square2.setColour(330, 60, 50);
  square2.setPosition(0, 1);
  square2.setRotation(0);

  //top right rectangle
  const square3 = createShape();
  square3.setSize(900, 440);
  square3.setRoundedness(0);
  square3.setColour(300, 60, 50);
  square3.setPosition(1, 0);
  square3.setRotation(0);

  //bottom right rectangle
  const square4 = createShape();
  square4.setSize(900, 440);
  square4.setRoundedness(0);
  square4.setColour(190, 60, 50);
  square4.setPosition(1, 1);
  square4.setRotation(0);

  //top
  const effectSquare = createShape();
  effectSquare.setSize(200);
  effectSquare.setRoundedness(0.1);
  effectSquare.setColour(140, 60, 50);
  effectSquare.setPosition(0.5, 0.25);
  effectSquare.setRotation(0);

  //middle
  const effectSquare1 = createShape();
  effectSquare1.setSize(200);
  effectSquare1.setRoundedness(0.1);
  effectSquare1.setColour(140, 60, 50);
  effectSquare1.setPosition(0.5, 0.75);
  effectSquare1.setRotation(0);
  // ---------- State ----------
  // State variables are the parts of your program that change over time.
  // For example: where the pointer is, how fast it's moving, or whether a drone is on.

  // ---------- Sound ----------
  // Make the instruments and plug them into the speakers.
  const dist = new Tone.Distortion({distortion: 0.8, wet: 0});
  const vibr = new Tone.Vibrato({frequency: 5, depth: 0.3, wet:0});
  const polySynth = new Tone.PolySynth(Tone.Synth);
  polySynth.chain(vibr, dist, Tone.Destination);
  let synth = polySynth;
  // ---------- Update ----------
  // Update the state. This is called every 100ms.
  function update() {
    setTimeout(update, 100); // call update() again in 100 milliseconds
  }

  // ---------- Use ----------
  // Use the state to make sound and move shapes. This is called every 100ms.
function use(){
if (distortionOn){
  spin +=50;
  effectSquare.setRotation(spin);
}
if (vibrOn){
  spin1 +=50;
  effectSquare1.setRotation(spin1);
}
if (square3.element.matches(":hover")) {
  speed *= 0.95;
  smoothSpeed += (speed - smoothSpeed) * 0.15;
  synth.set({ detune: Math.min(smoothSpeed * 30, 2400) });
}
if (square4.element.matches(":hover")) {
  speed2 *= 0.95;
  smoothSpeed2 += (speed2 - smoothSpeed2) *0.15;
  synth.set({ detune: -Math.min(smoothSpeed2 * 30, 2400) });
}
setTimeout(use, 30);
}
  // ---------- Controls (Event Handlers) ----------
  function distPointerDown(event) {
    Tone.start();
    distCount++;
  if (distCount > 1){
    distortionOn = false;
    dist.wet.rampTo(0, 0.05);
    distCount = 0;
    spin = 0;
    effectSquare.setRotation(0);
  } else if (distCount > 0){
    distortionOn = true;
    dist.wet.rampTo(1, 0.05);
  }
  }
function vibrPointerDown(event) {
  Tone.start();
  vibrCount++;
  if (vibrCount > 1) {
    vibrOn = false;
    vibr.wet.rampTo(0, 0.05);
    vibrCount = 0;
    spin1 = 0;
    effectSquare1.setRotation(0);
  } else if (vibrCount > 0) {
    vibrOn = true;
    vibr.wet.rampTo(1, 0.05);
  }
}

  function pointerEnter(event) {
    Tone.start();
    synth.triggerAttack(note);
  }
  function pointerLeave(event) {
    synth.triggerRelease(note);
    speed = 0;
    smoothSpeed = 0;
    speed2 = 0;
    smoothSpeed2 = 0;
    synth.set({detune: 0});
  }
  function pointerMove (event){
    x = event.clientX;
    y = event.clientY;
  }

function detuneMove(event) {
  const rect = square1.element.getBoundingClientRect();
  const normX = (event.clientX - rect.left) / rect.width;   // 0 to 1 across square1
  synth.set({ detune: normX * 2400 });
}
function detuneMoveReversed(event) {
  const rect = square2.element.getBoundingClientRect();
  const normX = (event.clientX - rect.left) / rect.width;   // 0 at left, 1 at right
  const reversed = 1 - normX;                               // 1 at left, 0 at right
  synth.set({ detune: reversed * 3600});
}
function speedMove(event){
speed = Math.hypot(event.movementX, event.movementY);
}
function speedMove2(event) {
  const moved = Math.hypot(event.movementX, event.movementY);
  speed2 = Math.max(speed2, moved);
}
  // ---------- Setup ----------
  function setup() {
    update(); // start the update loop
    use(); // start the use loop

  square1.element.addEventListener("pointerenter", pointerEnter);
  square1.element.addEventListener("pointerleave", pointerLeave);

  square2.element.addEventListener("pointerenter", pointerEnter);
  square2.element.addEventListener("pointerleave", pointerLeave);

  square3.element.addEventListener("pointerenter", pointerEnter);
  square3.element.addEventListener("pointerleave", pointerLeave);

  square4.element.addEventListener("pointerenter", pointerEnter);
  square4.element.addEventListener("pointerleave", pointerLeave);

  effectSquare.element.addEventListener("pointerdown", distPointerDown);
  effectSquare1.element.addEventListener("pointerdown", vibrPointerDown);

  square1.element.addEventListener("pointermove", detuneMove);
  square2.element.addEventListener("pointermove", detuneMoveReversed)
  square3.element.addEventListener("pointermove", speedMove);
  square4.element.addEventListener("pointermove", speedMove2)
  window.addEventListener("pointermove", pointerMove);
  }

  setup(); // Always remember to call setup()!
