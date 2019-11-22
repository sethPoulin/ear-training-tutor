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

const assignNotesToBrowserKeys = function() {
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
        keyToAdd.addEventListener('click',playNote);
        notesToMapArr.splice(0,1);
        orderedNotesArr.push(keyToAdd);  
      };
      if(key===1){
        const keyToAdd = blackKeysArr.splice(0,1)[0];
        keyToAdd.setAttribute(`data-key`,`${notesToMapArr[0]}`);
        keyToAdd.addEventListener('click',playNote);
        notesToMapArr.splice(0,1);
        orderedNotesArr.push(keyToAdd);
      };
    });
  };
};

function playNote (e){
  const note = document.querySelector(`audio[data-key=${e.target.getAttribute('data-key')}]`);
  note.currentTime = 0;
  note.volume = 1;
  note.play();
  fadeOut(note);
};

//Pre-loads all notes in userOctaveNotes so that user interaction is not required for notes to be played.
const loadAllNotes = function(){ 
  userOctaveNotes.forEach((note) => {
    let currentNote = document.querySelector(`audio[data-key=${note}`);
    currentNote.load()});
};

//starts fading out sound as soon as it's run by lowering volume every 50 milliseconds
const fadeOut = function(sample){
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
  if(checkedOctaves.length === 0 || checkedOctaves.length === 1) return;
  if(checkedOctaves.length > 4){
    //print an error message and return
  };
  const allCheckedOctaves = allOctaves.filter((el)=>{
    return el.checked;
  });
  const allCheckedOctavesIndexes = allCheckedOctaves.map((el)=>{
    return allOctaves.indexOf(el);
  });
  //this is just an array of consecutive numbers that has the same starting value and is the same length as allCHeckedOctavesIndexes
  const consecutiveArray = [];
  for(let i=0;i<allCheckedOctavesIndexes.length;i++){
    consecutiveArray.push(allCheckedOctavesIndexes[0]+i);
  };
  //check if the consecutive array and the checked indexes array are equal
  if(JSON.stringify(consecutiveArray) === JSON.stringify(allCheckedOctavesIndexes)){
    return true;
  } else {
    return false;
  };
}

const userOctaveNotes = [];
//populates the userOctaveNotes array with the selected octaves
const setUserOctaves = function(){
  userOctaveNotes.length = 0;
  const checked = document.querySelectorAll(`input[type="checkbox"]:checked`);
  checked.forEach(checkbox => {
    //iterate over all checked checkboxes and for each one, return its id converted from a string into a variable and push that into userOctaveNotes.  That will push the note array stored in each variable into userOctaveNotes
    userOctaveNotes.push(...octaves[checkbox.id]);
  })
  console.log(userOctaveNotes);
  console.log(checkOctavesAreAdjacent());
  assignNotesToBrowserKeys();
  return userOctaveNotes;
}

//update the userOctaveNotes array every time there is a change to the octaves field
const octaveSelector = document.querySelector('fieldset');
octaveSelector.addEventListener('change',setUserOctaves);

//pick a random note from the userOctaveNotes array
const getRandomNote = () => {
  const randomNoteIndex = Math.floor(Math.random() * userOctaveNotes.length);
  randomNote = userOctaveNotes[randomNoteIndex];
  console.log(randomNote);
  return randomNote;
}

let firstRandomNote = '';

const repeat = () => {
  const firstAudio = document.querySelector(`audio[data-key=${firstRandomNote}`);
  firstAudio.currentTime = 0;
  firstAudio.volume = 1;
  firstAudio.play();
  setTimeout(() => fadeOut(firstAudio),1500);
  setTimeout(() => {
    const secondAudio = document.querySelector(`audio[data-key=${secondRandomNote}`);
    secondAudio.currentTime = 0;
    secondAudio.volume = 1;
    secondAudio.play();
    setTimeout(() => fadeOut(secondAudio),1500);
  }, 3500);

}

const repeatButton = document.querySelector('button.repeat');
repeatButton.addEventListener('click',repeat);


const startTest = () => {
  //1. Remove existing event listeners and re-apply them to fire a different event on click.
  const allPianoKeys = document.querySelectorAll('.keyboard rect');
  allPianoKeys.forEach((el) => {
    el.removeEventListener('click',playNote);
    el.classList.remove('firstNote');
    el.classList.remove('correct');
    el.classList.remove('incorrect');
  });
  allPianoKeys.forEach((el) => {
    el.addEventListener('click',playNoteForTest);
  });
  loadAllNotes(); 
  firstRandomNote = getRandomNote();
  const firstAudio = document.querySelector(`audio[data-key=${firstRandomNote}`);
  firstAudio.volume = 1;
  firstAudio.play();
  const firstKey = document.querySelector(`rect[data-key=${firstRandomNote}]`);
  firstKey.classList.add('firstNote');
  //play the first randomNote
  setTimeout(() => fadeOut(firstAudio),1500);
  //play the second random note.
  setTimeout(() => {
    playSecondRandomNote();
  }, 3500);
  //listen for user input 
  
}

//Once the first random note is played, we create an array of possible second notes based on the user interval.  If the interval is 8 we add eight notes ahead of the first note and eight notes behind the first note, all selected from the userOctaveNotes.  If it's not possible to select eight notes in either direction, we add as many as we can until the end of the array is reached.

const secondRandomNoteArray = [];
  
const getSecondRandomNoteArray = function(){
  //sets firstNoteIndex to the index in the userOctaveNotes array of the first random note played
  secondRandomNoteArray.length = 0;
  const firstNoteIndex = userOctaveNotes.indexOf(firstRandomNote);
  //sets currentInterval to whatever is selected in the interval selector.
  const currentInterval = Number(document.getElementById("maxInterval").value);
  const firstBatchofNotes = userOctaveNotes.slice(firstNoteIndex, firstNoteIndex+currentInterval+1); 
  secondRandomNoteArray.push(...firstBatchofNotes);
  const indexStart = Math.max(0,firstNoteIndex - currentInterval);
  const secondBatchofNotes = (userOctaveNotes.slice(indexStart, firstNoteIndex)) 
  secondRandomNoteArray.unshift(...secondBatchofNotes);

}
let secondRandomNote = '';  

const playSecondRandomNote = function(){ 
  getSecondRandomNoteArray();
  const randomIndex = Math.floor(Math.random() * secondRandomNoteArray.length);  
  secondRandomNote = secondRandomNoteArray[randomIndex]; 
  const secondKeyToPlay =  document.querySelector(`audio[data-key=${secondRandomNote}]`);
  console.log('secondRandomNote:',secondRandomNote); 
  secondKeyToPlay.volume = 1; 
  secondKeyToPlay.play(); 
  setTimeout(() => fadeOut(secondKeyToPlay),1500);
}

const playNoteForTest = (e) => {
  const userNote = e.target.getAttribute('data-key');
  const userKey = document.querySelector(`rect[data-key=${userNote}]`);
  const userAudio = document.querySelector(`audio[data-key=${userNote}]`);
  userAudio.currentTime = 0;
  userAudio.volume = 1;
  userAudio.play();
  fadeOut(userAudio);
 if(compareNote(secondRandomNote,userNote)){
   userKey.classList.add('correct');
   console.log('Correct');
 } else {
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

//listen for user clicks on keyboard

//if clicked button id matches note id, message 'correct', otherwise message 'incorrect.'