//create octave note arrays

const intervals = {
  1: 'semitone',
  2: 'whole tone',
  5: 'perfect fifth',
  7: 'major seventh',
  8: 'minor seventh'
}

//a maximum of 4 octaves can be chosen.  
//These must be consecutive.  If user tries to select non-consecutive octaves, display an error message.

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

const assignNotesToBrowserKeys = function() {
  removeGreyColour();
  const whiteKeysArr = Array.from(document.querySelectorAll('svg rect:not(.black)'));
  const blackKeysArr = Array.from(document.querySelectorAll('svg rect.black'));
  const keyPattern = [0,1,0,1,0,0,1,0,1,0,1,0];
  const notesToMapArr = [...userOctaveNotes];
  const orderedNotesArr = [];
  while(whiteKeysArr.length > 0){
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



function playUserInput (e){
  const note = document.querySelector(`audio[data-key=${e.target.getAttribute('data-key')}]`);
  console.log(e.target);
  console.log(note);
  playNote(note);
};

//Pre-loads all notes in userOctaveNotes so that user interaction is not required for notes to be played.
const loadAllNotes = function(){ 
  userOctaveNotes.forEach((note) => {
    let currentNote = document.querySelector(`audio[data-key=${note}`);
    currentNote.load()});
};

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


const checkOctavesAreAdjacent = function(){
  const allOctaves = Array.from(document.querySelectorAll('input[type="checkbox"]'));
  const checkedOctaves = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
  // if(checkedOctaves.length === 0 || checkedOctaves.length === 1) return;
  // if(checkedOctaves.length > 4){
  //   //print an error message and return
  // };
  const checkedOctavesIndexes = allOctaves
    //filter out the checked octaves
    .filter((el)=> el.checked)
    //and map 
    .map((el)=>allOctaves.indexOf(el));
 
  //this is just an array of consecutive numbers that has the same starting value and is the same length as allCHeckedOctavesIndexes
  const consecutiveArray = [];
  for(let i=0;i<checkedOctavesIndexes.length;i++){
    consecutiveArray.push(checkedOctavesIndexes[0]+i);
  };
  //check if the consecutive array and the checked indexes array are equal
  if(JSON.stringify(consecutiveArray) === JSON.stringify(checkedOctavesIndexes)){
    return true;
  } else {
    return false;
  };
}

const disableButtons = () => {
  document.querySelector('button.start').setAttribute('disabled','true');
  document.querySelector('button.repeat').setAttribute('disabled','true');
}

const displayMessage = (string) => {
  const test = document.querySelector('.octaveMessage p');
  console.log('string:',string);
  test.innerHTML = string;
};

const fadeInMessage = (node) => {
  setTimeout(()=>{
  document.querySelector(node).classList.add('fadeIn');
  },100); 
}


const userOctaveNotes = [];
//populates the userOctaveNotes array with the selected octaves
const setUserOctaves = function(){
  //empties the userOctaveNotes array
  userOctaveNotes.length = 0;
  //removes any existing messages and enables buttons
  document.querySelector('.octaveMessage p').classList.remove('fadeIn');
  displayMessage('');
  document.querySelector('button.start').removeAttribute('disabled','true');
  document.querySelector('button.repeat').removeAttribute('disabled','true');
  
  const checked = document.querySelectorAll(`input[type="checkbox"]:checked`);
  //if no octaves are selected, disable buttons, display error message and return
  if(checked.length === 0){
    displayMessage('Please select at least one octave');
    fadeInMessage('.octaveMessage p');
    disableButtons();
    return;
  }
  if(checked.length > 4){
    displayMessage('Please select a maximum of 4 octaves.');
    fadeInMessage('.octaveMessage p');
    disableButtons();
  }
  checked.forEach(checkbox => {
    //iterate over all checked checkboxes and for each one, return its id converted from a string into a variable and push that into userOctaveNotes.  That will push the note array stored in each variable into userOctaveNotes
    userOctaveNotes.push(...octaves[checkbox.id]);
  })
  if(!checkOctavesAreAdjacent()){
    displayMessage('Octaves must be adjacent');
    fadeInMessage('.octaveMessage p');
    disableButtons();
  }
  console.log(userOctaveNotes);
  console.log(checkOctavesAreAdjacent());
  assignNotesToBrowserKeys();
}

//update the userOctaveNotes array every time there is a change to the octaves field
const octaveSelector = document.querySelector('fieldset');
octaveSelector.addEventListener('change',setUserOctaves);

//pick a random note from a specified array
const getRandomNote = (arr) => {
  const randomNoteIndex = Math.floor(Math.random() * arr.length);
  const randomNote = arr[randomNoteIndex];
  console.log(randomNote);
  return randomNote;
}

let firstRandomNote = '';

const repeat = () => {
  const firstAudio = document.querySelector(`audio[data-key=${firstRandomNote}`);
  playNote(firstAudio);
  setTimeout(() => {
    const secondAudio = document.querySelector(`audio[data-key=${secondRandomNote}`);
    playNote(secondAudio);
  }, 2500);

}

const repeatButton = document.querySelector('button.repeat');
repeatButton.addEventListener('click',repeat);

const removeEventListenersAndClasses = () => {
  const allPianoKeys = document.querySelectorAll('.keyboard rect');
  allPianoKeys.forEach((el) => {
    el.removeEventListener('click',playUserInput);
    el.classList.remove('firstNote');
    el.classList.remove('correct');
    el.classList.remove('incorrect');
  });
}

const addClickEventListeners = () => {
  const allPianoKeys = document.querySelectorAll('.keyboard rect');
  allPianoKeys.forEach((el) => {
    el.addEventListener('click',testUserNote);
  });
}

playFirstRandomNote = () => {
  firstRandomNote = getRandomNote(userOctaveNotes);
  const firstKey = document.querySelector(`rect[data-key=${firstRandomNote}]`);
  firstKey.classList.add('firstNote');
  const firstAudio = document.querySelector(`audio[data-key=${firstRandomNote}`);
  playNote(firstAudio);
}

const startTest = () => {
  //Remove existing event listeners and classes
  removeEventListenersAndClasses()
  //applies event listeners to the keyboard that trigger the testUserNote function.
  addClickEventListeners();
  //pre-loads notes in use so they can be triggered without user input.
  loadAllNotes(); 
  playFirstRandomNote();
  //plays second random note after 3.5 seconds.
  setTimeout(() => {
    playSecondRandomNote();
  }, 2500); 
}

//Once the first random note is played, we create an array of possible second notes based on the user interval.  For interval x we add x notes ahead of the first note and x notes behind the first note, all selected from the userOctaveNotes.  If it's not possible to select x notes in one or both directions, we add as many as we can until the end of the array is reached.
const secondRandomNoteArray = [];
  
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
}

let secondRandomNote = '';  

const playNote = (note) => {
  note.volume = 1;
  note.currentTime = 0;
  note.play(); 
  setTimeout(() => fadeOutAudio(note),1200);
}

const playSecondRandomNote = () => { 
  //pick a note from the second random note array 
  console.log(getSecondRandomNoteArray()); 
  secondRandomNote = getRandomNote(getSecondRandomNoteArray());
  console.log(secondRandomNote);
  //selects a different note if the first note and second notes are the same
  while(secondRandomNote === firstRandomNote){
    secondRandomNote = getRandomNote(getSecondRandomNoteArray());
  };
  const secondKeyToPlay =  document.querySelector(`audio[data-key=${secondRandomNote}]`);
  console.log('secondRandomNote:',secondRandomNote); 
  playNote(secondKeyToPlay); 
}

//this function only runs once test has started and user clicks a key
const testUserNote = (e) => {
  const userNote = e.target.getAttribute('data-key');
  const userKey = document.querySelector(`rect[data-key=${userNote}]`);
  const userAudio = document.querySelector(`audio[data-key=${userNote}]`);
  playNote(userAudio);
 if(compareNote(secondRandomNote,userNote)){
   //show correct message
   userKey.classList.add('correct');
   console.log('Correct');
 } else {
  //show incorrect message
  console.log('Incorrect');
  userKey.classList.add('incorrect');
 };
};

const compareNote = (note1, note2) => {
  return note1 === note2;
};

setUserOctaves();

const startButton = document.querySelector('button.start');
startButton.addEventListener('click',startTest);
