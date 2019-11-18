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
 octave0 : ['a0','a-0','b0'],
 octave1 : ['a1','a-1','b1','c1','c-1','d-1','e1','f1','f-1','g1','g-1'],
 octave2 : ['a2','a-2','b2','c2','c-2','d-2','e2','f2','f-2','g2','g-2'],
 octave3 : ['a3','a-3','b3','c3','c-3','d-3','e3','f3','f-3','g3','g-3'],
 octave4 : ['a4','a-4','b4','c4','c-4','d-4','e4','f4','f-4','g4','g-4'],
 octave5 : ['a5','a-5','b5','c5','c-5','d-5','e5','f5','f-5','g5','g-5'],
 octave6 : ['a6','a-6','b6','c6','c-6','d-6','e6','f6','f-6','g6','g-6'],
 octave7 : ['a7','c7','c-7','d-7','e7','f7','f-7','g7','g-7']
}


//Pre-loads all notes in userOctaves so that user interaction is not required for notes to be played.
const loadAllNotes = function(){ 
  userOctaves.forEach((note) => {
    let currentNote = document.querySelector(`audio[data-key=${note}`);
    console.log(currentNote);
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
},100);
};


//we will eventually use this to highlight the range of possible notes on the keyboard
let currentInterval = 8;
//sets the currentInterval to whatever the number is in the maxInterval field
const setUserInterval = () => {
  currentInterval = Number(document.getElementById("maxInterval").value);
}
//add an event listener to the interval selector (so range of notes gets highlighted)
const userIntervalSelector = document.getElementById("maxInterval");
userIntervalSelector.addEventListener('change',setUserInterval);


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

const userOctaves = [];
//populates the userOctaves array with the selected octaves
const setUserOctaves = function(){
  userOctaves.length = 0;
  const checked = document.querySelectorAll(`input[type="checkbox"]:checked`);
  checked.forEach(checkbox => {
    //iterate over all checked checkboxes and for each one, return its id converted from a string into a variable and push that into userOctaves.  That will push the note array stored in each variable into userOctaves
    userOctaves.push(...octaves[checkbox.id]);
  })
  console.log(userOctaves);
  console.log(checkOctavesAreAdjacent());
  return userOctaves;
}

setUserOctaves();

//update the userOctaves array every time there is a change to the octaves field
const octaveSelector = document.querySelector('fieldset');
octaveSelector.addEventListener('change',setUserOctaves);

//pick a random note from the userOctaves array
const getRandomNote = () => {
  const randomNoteIndex = Math.floor(Math.random() * userOctaves.length);
  const randomNote = userOctaves[randomNoteIndex];
  console.log(randomNote);
  return randomNote;
}

//play the first randomNote
const playFirstNote = () => {
  loadAllNotes(); 
  const firstNote = getRandomNote();
  const firstAudio = document.querySelector(`audio[data-key=${firstNote}`);
  firstAudio.play();
  setTimeout(() => fadeOut(firstAudio),1500);
}

//Once the first random note is played, we create an array of possible second notes based on the user interval.  If the interval is 8 we add eight notes ahead of the first note and eight notes behind the first note, all selected from the userOctaves.  If it's not possible to select eight notes in either direction, we add as many as we can until the end of the array is reached.

//The second random note is played.


const compareNote = () => {

  
}


const startButton = document.querySelector('button.start');
startButton.addEventListener('click',playFirstNote);

//listen for user clicks on keyboard

//if clicked button id matches note id, message 'correct', otherwise message 'incorrect.'