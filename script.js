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
 octave1 : ['c1','c-1','d1','d-1','e1','f1','f-1','g1','g-1','a2','a-2','b2'],
 octave2 : ['c2','c-2','d2','d-2','e2','f2','f-2','g2','g-2','a3','a-3','b3'],
 octave3 : ['c3','c-3','d3','d-3','e3','f3','f-3','g3','g-3','a4','a-4','b4'],
 octave4 : ['c4','c-4','d4','d-4','e4','f4','f-4','g4','g-4','a5','a-5','b5'],
 octave5 : ['c5','c-5','d5','d-5','e5','f5','f-5','g5','g-5','a6','a-6','b6'],
 octave6 : ['c6','c-6','d6','d-6','e6','f6','f-6','g6','g-6','a7','a-7','b7'],
 octave7 : ['c7','c-7','d7','d-7','e7','f7','f-7','g7','g-7','a8','a-8','b8'],
//  octave8 : ['c8']
}

const whiteKeysArr = document.querySelectorAll('svg rect:not(.black)');
const blackKeysArr = document.querySelectorAll('svg rect.black');
console.log('whiteKeysArr:',whiteKeysArr);
console.log('blackKeysArr:',blackKeysArr);


// 


const assignNotesToBrowserKeys = function(arrOfOctave) {
  for(let i = 0; i < 5; i = i + 2) {
    whiteKeysArr[i / 2].setAttribute('data-key',`${arrOfOctave[i]}`);
    blackKeysArr[i / 2].setAttribute('data-key',`${arrOfOctave[i+1]}`);
  };
  for(let i = 5; i < arrOfOctave.length - 1; i = i + 2) {
    whiteKeysArr[i / 2].setAttribute('data-key',`${arrOfOctave[i]}`);
    blackKeysArr[i / 2].setAttribute('data-key',`${arrOfOctave[i+1]}`);
  };
  // for(let i=)
}




//Pre-loads all notes in userOctaveNotes so that user interaction is not required for notes to be played.
const loadAllNotes = function(){ 
  userOctaveNotes.forEach((note) => {
    let currentNote = document.querySelector(`audio[data-key=${note}`);
    // console.log(currentNote);
    currentNote.load()});
    
};

//starts fading out sound as soon as it's run by lowering volume every 100 milliseconds
const fadeOut = function(sample){
let vol = sample.volume;
setInterval(function(){ 
  //we set the min volume to be 0.05 because if we use 0, when the function repeats for the last time it will bring the volume down to below 0, which cause an error (the else will never get a chance to run).  
  if (vol > 0.05) {
    vol -= 0.05;
    sample.volume = vol;
    console.log(vol);
  }
  else {
    // Stop the setInterval when 0 is reached
    clearInterval(fadeOut);
  }
},75);
};


//we will eventually use this to highlight the range of possible notes on the keyboard
// let currentInterval = 8;
//sets the currentInterval to whatever the number is in the maxInterval field
// const setUserInterval = () => {
//   currentInterval = Number(document.getElementById("maxInterval").value);
// }

//add an event listener to the interval selector (so range of notes gets highlighted)
// const userIntervalSelector = document.getElementById("maxInterval");
// userIntervalSelector.addEventListener('change',setUserInterval);


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
  return userOctaveNotes;
}

setUserOctaves();

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

let firstNote = '';

//play the first randomNote
const playNotes = () => {
  loadAllNotes(); 
  firstNote = getRandomNote();
  const firstAudio = document.querySelector(`audio[data-key=${firstNote}`);
  firstAudio.play();
  setTimeout(() => fadeOut(firstAudio),1500);
  setTimeout(() => playSecondRandomNote(), 4000);
}

//Once the first random note is played, we create an array of possible second notes based on the user interval.  If the interval is 8 we add eight notes ahead of the first note and eight notes behind the first note, all selected from the userOctaveNotes.  If it's not possible to select eight notes in either direction, we add as many as we can until the end of the array is reached.

const secondRandomNoteArray = [];
  
const getSecondRandomNoteArray = function(){
  //sets firstNoteIndex to the index in the userOctaveNotes array of the first random note played
  secondRandomNoteArray.length = 0;
  
  const firstNoteIndex = userOctaveNotes.indexOf(firstNote);
  //sets currentInterval to whatever is selected in the interval selector.
  const currentInterval = Number(document.getElementById("maxInterval").value);
  
  const firstBatchofNotes = userOctaveNotes.slice(firstNoteIndex, firstNoteIndex+currentInterval+1)
  
  secondRandomNoteArray.push(...firstBatchofNotes);
  
  const indexStart = Math.max(0,firstNoteIndex - currentInterval);
  
  const secondBatchofNotes = (userOctaveNotes.slice(indexStart, firstNoteIndex));
  
  secondRandomNoteArray.unshift(...secondBatchofNotes);

}
  

const playSecondRandomNote = function(){
  getSecondRandomNoteArray();

  const randomIndex = Math.floor(Math.random() * secondRandomNoteArray.length);
   
  const secondRandomNote = secondRandomNoteArray[randomIndex];
  
  const secondNoteToPlay =  document.querySelector(`audio[data-key=${secondRandomNote}]`);

  console.log('secondRandomNote:',secondRandomNote);
  
  secondNoteToPlay.play();
  
  setTimeout(() => fadeOut(secondNoteToPlay),1500);
}


const compareNote = (note) => {
  
  
}


const startButton = document.querySelector('button.start');
startButton.addEventListener('click',playNotes);

//listen for user clicks on keyboard

//if clicked button id matches note id, message 'correct', otherwise message 'incorrect.'