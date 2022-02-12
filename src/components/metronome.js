
import clickFile from '../res/250552__druminfected__metronome.mp3';
import WorkerBuilder from './WorkerBuilder';
import Metronomeworker from './MetronomeWorker';

// Configuration globals
var lookahead = 25.0;        // How frequently to call scheduling function 
                             //(in milliseconds)
var scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
                             // This is calculated from lookahead, and overlaps 
                             // with next interval (in case the timer is late)

// Runtime globals
var unlocked = false;
var notesInQueue = [];       // the notes that have been put into the web audio,
                             // and may or may not have played yet. {note, time}
var nextNoteTime = 0.0;      // when the next note is due.
var isPlaying = false;       // Are we currently playing?
var current16thNote = 0;     // What note is currently last scheduled?

// Worker globals
var tempo = null;            // tempo (in beats per minute)
var noteResolution = null;   // 0 == 16th, 1 == 8th, 2 == quarter note
var click = null;
var timerWorker = null;
var audioContext = null;


export function setTempo( t ) {
  tempo = t;
}

export function setResolution( r ) {
  noteResolution = r;
}

export function init( t, resolution ) {
  tempo = t;
  noteResolution = resolution

  // NOTE: THIS RELIES ON THE MONKEYPATCH LIBRARY BEING LOADED FROM
  // Http://cwilso.github.io/AudioContext-MonkeyPatch/AudioContextMonkeyPatch.js
  // TO WORK ON CURRENT CHROME!!  But this means our code can be properly
  // spec-compliant, and work on Chrome, Safari and Firefox.
  audioContext = new AudioContext();

  fetch(clickFile)
  .then(resp => resp.arrayBuffer())
  .then(buf => audioContext.decodeAudioData(buf))
  .then(data => click = data)

  timerWorker = new WorkerBuilder(Metronomeworker);

  timerWorker.onmessage = function(e) {
    if (e.data === "tick") {
      scheduler();
    }
  };
  timerWorker.postMessage({"interval":lookahead});
}

export function togglePlay() {
  if (!unlocked) {
    // play silent buffer to unlock the audio
    var buffer = audioContext.createBuffer(1, 1, 22050);
    var node = audioContext.createBufferSource();
    node.buffer = buffer;
    node.start(0);
    unlocked = true;
  }

  isPlaying = !isPlaying;

  if (isPlaying) { // start playing
    current16thNote = 0;
    nextNoteTime = audioContext.currentTime;
    timerWorker.postMessage("start");
    return "stop";
  } else {
    timerWorker.postMessage("stop");
    return "play";
  }
}

function nextNote() {
  // Advance current note and time by a 16th note...
  var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT 
                                      // tempo value to calculate beat length.
  nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

  current16thNote++;    // Advance the beat number, wrap to zero
  if (current16thNote === 16) {
    current16thNote = 0;
  }
}

function scheduleNote( beatNumber, time ) {
  // push the note on the queue, even if we're not playing.
  notesInQueue.push( { note: beatNumber, time: time } );

  if ( (noteResolution === 1) && (beatNumber%2))
    return; // we're not playing non-8th 16th notes
  if ( (noteResolution === 2) && (beatNumber%4))
    return; // we're not playing non-quarter 8th notes

  var osc = audioContext.createBufferSource();
  osc.buffer = click;
  osc.connect(audioContext.destination);
  osc.start(time);
}

function scheduler() {
  // while there are notes that will need to play before the next interval, 
  // schedule them and advance the pointer.
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
    scheduleNote( current16thNote, nextNoteTime );
    nextNote();
  }
}