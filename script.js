
//======REFERENCE OBJECTS==========

//object to consult for interval name
const intervals = {
  0: 'perfect unison',
  1: 'minor second',
  2: 'major second',
  3: 'minor third',
  4: 'major third',
  5: 'perfect fourth',
  6: 'diminished fifth/augmented fourth',
  7: 'perfect fifth',
  8: 'minor sixth',
  9: 'major sixth',
  10: 'minor seventh',
  11: 'major seventh',
  12: 'perfect octave'
}

const octaves = {
//  octave0 : ['a0','a-0','b0'],
 octave1 : ['c1','c-1','d1','d-1','e1','f1','f-1','g1','g-1','a1','a-1','b1'],
 octave2 : ['c2','c-2','d2','d-2','e2','f2','f-2','g2','g-2','a2','a-2','b2'],
 octave3 : ['c3','c-3','d3','d-3','e3','f3','f-3','g3','g-3','a3','a-3','b3'],
 octave4 : ['c4','c-4','d4','d-4','e4','f4','f-4','g4','g-4','a4','a-4','b4'],
 octave5 : ['c5','c-5','d5','d-5','e5','f5','f-5','g5','g-5','a5','a-5','b5'],
 octave6 : ['c6','c-6','d6','d-6','e6','f6','f-6','g6','g-6','a6','a-6','b6'],
 octave7 : ['c7','c-7','d7','d-7','e7','f7','f-7','g7','g-7','a7','a-7','b7'],
//  octave8 : ['c8']
}

//===============DISPLAYING MESSAGES============================

const displayMessage = (string, node = '.octaveMessage p') => {
  const test = document.querySelector(node);
  test.innerHTML = string;
};

const collapseMessageArea = (node1, node2 = node1) => {
  document.querySelector(node1).classList.add('collapsed');
  document.querySelector(node2).classList.add('collapsed');
};

const uncollapseMessageArea = (node1, node2 = node1) => {
  document.querySelector(node1).classList.remove('collapsed');
  document.querySelector(node2).classList.remove('collapsed');
};

//=======KEYBOARD FUNCTIONALITY AND APPEARANCE===========

 //removes grey colour from keys previously not in use
const removeGreyColour = () => {
  const allKeys = document.querySelectorAll('svg rect');
  allKeys.forEach((key)=>{
    key.classList.remove('disabled');
  });
};
//adds grey colour to keys not in use and disables click event listener
const disableUnusedKeys = () => {
  const unusedKeys = document.querySelectorAll('rect[data-key=undefined]');
  unusedKeys.forEach((key) => {
    key.classList.add('disabled');
    //removes any previously added event listeners;
    key.removeEventListener('click',playUserInput);
  });
};

//===========HIDING/SHOWING THE TESTING SECTION=================

//hides the landing section and displays the settings section
const showSettings = () => {
  document.querySelector('header').classList.add('hidden');
  document.querySelector('.settingsContainer').classList.remove('hidden');
}

//runs showSettings() when user clicks 'get started' button
document.querySelector('button.getStarted').addEventListener('click', showSettings);

//hides the settings section and displays the landing section
const restart = () => {
  document.querySelector('header').classList.remove('hidden');
  document.querySelector('.settingsContainer').classList.add('hidden');
}

//runs restart() when user clicks on 'close' icon on test page
document.querySelector('.close').addEventListener('click',restart);


//===============PLAYING USER INPUT======================

//Before user starts their first round of the tutor, they can play notes on the piano
function playUserInput (e){
  const note = document.querySelector(`audio[data-key=${e.target.getAttribute('data-key')}]`);
  playNote(note);
};

//=============WHEN LANDING PAGE LOADS======================

//Pre-loads all notes in userOctaveNotes so that user interaction is not required for notes to be played.
const loadAllNotes = function(){ 
  userOctaveNotes.forEach((note) => {
    let currentNote = document.querySelector(`audio[data-key=${note}`);
    currentNote.load()});
};

//==============SETTING UP THE TUTOR=========================

const userOctaveNotes = [];

//populates the userOctaveNotes array with the selected octaves
const setUserOctaves = function(){
  //empties the userOctaveNotes array
  userOctaveNotes.length = 0;
  //removes any existing messages and enables buttons
  collapseMessageArea('.octaveMessage p','.settingsContainer');
  document.querySelector('.octaveMessage p').classList.remove('fadeIn');
  displayMessage('');
  document.querySelector('button.start').removeAttribute('disabled','true');
  document.querySelector('button.repeat').removeAttribute('disabled','true');
  document.querySelector('button.start').classList.remove('disabled');
  document.querySelector('button.repeat').classList.remove('disabled');
  
  const checked = document.querySelectorAll(`input[type="checkbox"]:checked`);
  //if no octaves are selected, disable buttons, display error message and return
  if(checked.length === 0){
    uncollapseMessageArea('.octaveMessage p','.settingsContainer');
    displayMessage('Please select at least one octave');
    // fadeInMessage('.octaveMessage p');
    disableButtons();
    return;
  }
  if(checked.length > 4){
    uncollapseMessageArea('.octaveMessage p','.settingsContainer');
    displayMessage('Please select a maximum of 4 octaves.');
    // fadeInMessage('.octaveMessage p');
    disableButtons();
  }
  checked.forEach(checkbox => {
    //iterate over all checked checkboxes and for each one, return its id converted from a string into a variable and push that into userOctaveNotes.  That will push the note array stored in each variable into userOctaveNotes
    userOctaveNotes.push(...octaves[checkbox.id]);
  })
  if(!checkOctavesAreAdjacent()){
    uncollapseMessageArea('.octaveMessage p','.settingsContainer');
    displayMessage('Octaves must be adjacent');
    // fadeInMessage('.octaveMessage p');
    disableButtons();
  }
  assignNotesToBrowserKeys();
}

//update the userOctaveNotes array every time there is a change to the octaves field
const octaveSelector = document.querySelector('fieldset');
octaveSelector.addEventListener('change',setUserOctaves);

//checks whether selected octaves are adjacent to one another
const checkOctavesAreAdjacent = function(){
  const allOctaves = Array.from(document.querySelectorAll('input[type="checkbox"]'));
  const checkedOctaves = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
  const checkedOctavesIndexes = allOctaves
    //filter out the checked octaves
    .filter((el)=> el.checked)
    //and return an array of the index number of each element (from allOctaves)
    .map((el)=>allOctaves.indexOf(el));
 
  //generates an array of consecutive numbers with the same starting value and the same length as checkedOctavesIndexes
  const consecutiveArray = [];
  for(let i=0;i<checkedOctavesIndexes.length;i++){
    consecutiveArray.push(checkedOctavesIndexes[0]+i);
  };
  //check if the consecutive array and the checkedOctavesIndexes array are equal
  if(JSON.stringify(consecutiveArray) === JSON.stringify(checkedOctavesIndexes)){
    return true;
  } else {
    return false;
  };
}

//assigns a note value to each piano key by looping over the keyPattern array
const assignNotesToBrowserKeys = function() {
  removeGreyColour();
  //put all the white keys and black keys in 2 separate arrays.
  const whiteKeysArr = Array.from(document.querySelectorAll('svg rect:not(.black)'));
  const blackKeysArr = Array.from(document.querySelectorAll('svg rect.black'));
  //establishes repeating pattern of white/black keys
  const keyPattern = [0,1,0,1,0,0,1,0,1,0,1,0];
  //the notes to map are the notes currently in userOctaves
  const notesToMapArr = [...userOctaveNotes];
  const orderedNotesArr = [];
  //as long as there are white keys in the white keys array (we use white keys because there are more white keys than black keys so white array will finish emptying last)...
  while(whiteKeysArr.length > 0){
    //map over the keyPattern 
    keyPattern.map((key) => {
      if(key===0){
        const keyToAdd = (whiteKeysArr.splice(0,1))[0];
        keyToAdd.setAttribute(`data-key`,`${notesToMapArr[0]}`);
        keyToAdd.addEventListener('click',playUserInput);
        notesToMapArr.splice(0,1);
        orderedNotesArr.push(keyToAdd);  
      };
      if(key===1){
        const keyToAdd = blackKeysArr.splice(0,1)[0];
        keyToAdd.setAttribute(`data-key`,`${notesToMapArr[0]}`);
        keyToAdd.addEventListener('click',playUserInput);
        notesToMapArr.splice(0,1);
        orderedNotesArr.push(keyToAdd);
      };
    });
  };
  disableUnusedKeys();
  return orderedNotesArr;
};

setUserOctaves();

loadAllNotes(); 

//==============RUNNING THE TUTOR==========================

//pick a random note from a specified array
const getRandomNote = (arr) => {
  const randomNoteIndex = Math.floor(Math.random() * arr.length);
  const randomNote = arr[randomNoteIndex];
  return randomNote;
};

let firstRandomNote = '';

//removes event listeners and classes
const removeEventListenersAndClasses = () => {
  const allPianoKeys = document.querySelectorAll('.keyboard rect');
  collapseMessageArea('.intervalMessage p','.settingsContainer');
  //removes any existing message
  displayMessage('','.intervalMessage p');
  //loop over the piano keys and remove any existing classes
  allPianoKeys.forEach((el) => {
    el.removeEventListener('click',playUserInput);
    el.classList.remove('firstNote');
    el.classList.remove('correct');
    el.classList.remove('incorrect');
  });
};

//adds click event listeners that run testUserNote() to all piano keys
const addClickEventListeners = () => {
  const allPianoKeys = document.querySelectorAll('.keyboard rect');
  allPianoKeys.forEach((el) => {
    el.addEventListener('click',testUserNote);
  });
};

//plays the first random note
playFirstRandomNote = () => {
  firstRandomNote = getRandomNote(userOctaveNotes);
  const firstKey = document.querySelector(`rect[data-key=${firstRandomNote}]`);
  firstKey.classList.add('firstNote');
  const firstAudio = document.querySelector(`audio[data-key=${firstRandomNote}`);
  playNote(firstAudio);
};

//determines the interval between the first random note and the note the user guesses, and returns a message to indicate the interval length, name, and whether the user's guess is correct
const findInterval = (note) => {
  const noteOneIndex = secondRandomNoteArray.indexOf(firstRandomNote);
  const noteTwoIndex = secondRandomNoteArray.indexOf(note);
  //ensure the higher number subtracts the lower number to avoid negative integers
  const intervalLength  = noteOneIndex > noteTwoIndex ? 
  noteOneIndex - noteTwoIndex: 
  noteTwoIndex - noteOneIndex;
  return `${correctMessage} that interval is ${intervalLength} semi-tones, which is a <span class="underline">${intervals[intervalLength]}.<span>`;
}

//Runs when the user clicks the 'Start new round' button.  Starts a new round of the tutor
const startTest = () => {
  //Remove existing event listeners and classes
  removeEventListenersAndClasses()
  //applies event listeners to the keyboard that trigger the testUserNote function.
  addClickEventListeners();
  playFirstRandomNote();
  //plays second random note after 3.5 seconds.
  setTimeout(() => {
    playSecondRandomNote();
  }, 2500); 
};

const secondRandomNoteArray = [];
  
//generates an array of possible options for the second random note (based on the 'max interval length' set by user)
const getSecondRandomNoteArray = function(){
  //empties the array 
  secondRandomNoteArray.length = 0;
  //gets the index in [userOctaveNotes] of the first random note 
  const firstNoteIndex = userOctaveNotes.indexOf(firstRandomNote);
  //sets currentInterval to whatever is selected in the interval selector.
  const currentInterval = Number(document.getElementById("maxInterval").value);
  //store the array of possible higher notes in a variable...
  const firstBatchofNotes = userOctaveNotes.slice(firstNoteIndex, firstNoteIndex+currentInterval+1);
  //and push all the notes into [secondRandomNoteArray]. 
  secondRandomNoteArray.push(...firstBatchofNotes);
  //get the starting index for the second batch of notes.  If the index would go below zero, just make it zero.
  const indexStart = Math.max(0,firstNoteIndex - currentInterval);
  //use the index to extract the lower notes and place them at the start of [secondRandomNoteArray].
  const secondBatchofNotes = (userOctaveNotes.slice(indexStart, firstNoteIndex)) 
  secondRandomNoteArray.unshift(...secondBatchofNotes);
  return secondRandomNoteArray;
};

let secondRandomNote = '';  

//plays the second random note
const playSecondRandomNote = () => { 
  //pick a note from the second random note array 
  secondRandomNote = getRandomNote(getSecondRandomNoteArray());
  //selects a different note if the first note and second notes are the same
  while(secondRandomNote === firstRandomNote){
    secondRandomNote = getRandomNote(getSecondRandomNoteArray());
  };
  const secondKeyToPlay =  document.querySelector(`audio[data-key=${secondRandomNote}]`); 
  playNote(secondKeyToPlay); 
};

//this function only runs once tutor has started and user clicks a key
const testUserNote = (e) => {
  const userNote = e.target.getAttribute('data-key');
  const userKey = document.querySelector(`rect[data-key=${userNote}]`);
  const userAudio = document.querySelector(`audio[data-key=${userNote}]`);
  playNote(userAudio);
  //if the note the user plays and the secondRandomNote are the same, add the .correct class to turn the note green and set the status of correctMessage to 'Correct.'  This will be accessed by the findInterval function.
 if(compareNote(secondRandomNote,userNote)){
   //show correct message
   userKey.classList.add('correct');
   correctMessage = 'Correct:';
 } else {
  //show incorrect message
  userKey.classList.add('incorrect');
  correctMessage = 'Incorrect:';
 };
 //make room for the message to display
 uncollapseMessageArea('.intervalMessage p','.settingsContainer');
 displayMessage(findInterval(userNote), '.intervalMessage p');
};

//this variable is assigned either 'Incorrect' or 'Correct' depending on the result of testUserNote()
let correctMessage = '';

//runs compareNote and returns true if the notes are the same, false if they are different
const compareNote = (note1, note2) => {
  return note1 === note2;
};

//replays both the first and second random notes.  Triggered when user presses the 'Repeat notes' button
const repeat = () => {
  let firstAudio;
  if(firstRandomNote) {
    firstAudio = document.querySelector(`audio[data-key=${firstRandomNote}`);
  } else {
    return;
  };
  playNote(firstAudio);
  setTimeout(() => {
    const secondAudio = document.querySelector(`audio[data-key=${secondRandomNote}`);
    playNote(secondAudio);
  }, 2500);
};

//listens for click on repeat button and then runs repeat()
const repeatButton = document.querySelector('button.repeat');
repeatButton.addEventListener('click',repeat);

//listens for click on the 'Start new round' button and then runs startTest()
const startButton = document.querySelector('button.start');
startButton.addEventListener('click',startTest);

//==============AUDIO FUNCTIONS=====================

//starts fading out sound as soon as it's run by lowering volume every 50 milliseconds
const fadeOutAudio = function(sample){
  let vol = sample.volume;
  setInterval(function(){ 
    
    if (vol > 0) {
      vol = Math.max((vol - 0.03),0);
      sample.volume = vol;
    }
  },50);
};

//plays an audio file after resetting its volume to full and its time to 0
const playNote = (note) => {
  note.volume = 1;
  note.currentTime = 0;
  note.play(); 
  setTimeout(() => fadeOutAudio(note),1200);
};

//==============ENABLING/DISABLING BUTTONS=======================

const disableButtons = () => {
  document.querySelector('button.start').setAttribute('disabled','true');
  document.querySelector('button.start').classList.add('disabled');
  document.querySelector('button.repeat').setAttribute('disabled','true');
  document.querySelector('button.repeat').classList.add('disabled');
};