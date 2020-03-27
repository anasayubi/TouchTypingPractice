const chalk = require('chalk');
const readline = require('readline');
const inquirer = require('inquirer');

// Used for finding out the value in 'value' var (validation purposes) 
// let valueOutside;

// All inquiry handled here
inquirer
  .prompt([
    // First question: Which keyboard rows should be included in the practice?
    // - Top Row
    // - Home Row
    // - Bottom Row  
    {
      type: 'checkbox',
      message: 'Which keyboard rows should be included in the practice?',
      name: 'rowsIncluded',
      choices: [
        // name: the string printed for an option
        // value: the values used programatically
        { name: 'Top Row', value: 'topRow' },
        { name: 'Home Row', value: 'homeRow' },
        { name: 'Bottom Row', value: 'bottomRow' },
      ],
      // Ensures that at least 1 option is chosen before proceeding
      validate: function (value) {
        // Used for finding out the value in 'value' var 
        // valueOutside = value;

        // In case no option chosen then print error message and reask the same question 
        if (value.length == 0)
          return 'Please choose at least 1 row'

        // otherwise, proceed to the next question
        return true;
      }
    },
    // Second question: How many characters must be printed?
    // - 30
    // - 50
    {
      type: 'list',
      message: 'How many characters must be printed?',
      name: 'numberOfChars',
      choices: [
        { name: '30', value: 30 },
        { name: '50', value: 50 }
      ]
    }
  ])
  .then(answers => {
    // console.log(answers);

    // Used for finding out the value in 'value' var (validation purposes)
    // console.log(valueOutside);

    let topRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    let homeRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'];
    let bottomRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?'];
    let allChars = []; // will have all of the characters that will be used in typing practice

    // Include characters based on the user input in 'answers'
    if (answers.rowsIncluded.includes('topRow'))
      allChars = allChars.concat(topRow);
    if (answers.rowsIncluded.includes('homeRow'))
      allChars = allChars.concat(homeRow);
    if (answers.rowsIncluded.includes('bottomRow'))
      allChars = allChars.concat(bottomRow);

    // words: ['fdfa', 'fefaefae', 'ddw;']
    words = generateWords(allChars, answers.numberOfChars);
    // console.log(words);
    // convert the array into a string
    // singleWordStr: 'fdfa fefaefae ddw;'
    singleWordStr = generateAllWordsStr(words);
    console.log();
    console.log('To end the practice press <Esc> at any time.');
    console.log();
    console.log(singleWordStr);

    // Initiate user input for typing
    matchUserInput(singleWordStr);
  })
  .catch(error => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  });

function matchUserInput(wordStr) {
  // inquirer is most probably using a readline interface
  // make another interface for user input 
  const rl = readline.createInterface({
    input: process.stdin,
    terminal: true
  });

  // configurations required to emit keypress events
  readline.emitKeypressEvents(process.stdin, rl);
  process.stdin.setRawMode(true);

  let count = 0;
  let firstKeyPress = true;
  let startTime;

  process.stdin.on('keypress', (str, key) => {

    // time when the first key stroke is made
    if (firstKeyPress) {
      startTime = new Date().getTime();
      firstKeyPress = false;
    }

    // last key pressed
    if (count == (wordStr.length - 1)) {
      // print chars per minute
      printCPM(startTime, wordStr);
      process.exit();
    }

    if (key.name === 'escape' || key.name === 'return') {
      printCPM(startTime, wordStr);
      // console.log();
      process.exit();
    }

    // toUpperCaseIfPossible is used because for certain characters
    //   an uppercase does not exist
    // Cross verify that character being typed is correct
    //   in case correct then print noromally, otherwise print red
    if (wordStr[count] !== toUpperCaseIfPossible(str))
      process.stdout.write(chalk.red(str.toUpperCase()));
    else
      process.stdout.write(str.toUpperCase());

    // update character count
    count++;

    // console.log('str:')
    // console.log(str)
    // console.log('key:')
    // console.log(key)

  });
}

function toUpperCaseIfPossible(str) {
  // check for only alphabets
  var lettersRegex = /^[A-Za-z]+$/;
  if (str.match(lettersRegex))
    return str.toUpperCase();
  else
    return str;
}

function printCPM(startTime, wordStr) {
  let endTime = new Date().getTime();
  let timeDifference = endTime - startTime; // returned in ms
  let timeDifferenceMins = (timeDifference / 1000) / 60;
  let cpm = wordStr.length / timeDifferenceMins;

  // console.log('timeDifference: ')
  // console.log(timeDifference)

  console.log();
  console.log();
  console.log("Speed: " + Number(cpm).toFixed(2) + " CPM");
}

function generateAllWordsStr(words) {
  let allWordsString = '';
  for (i = 0; i < words.length; i++) {
    allWordsString += (words[i] + ' ');
  }

  return allWordsString;
}

function generateWords(lettersToChooseFrom, numberOfChars) {
  // wordLengths = [3, 5, 6, 2]
  let wordLengths = chooseWordLengths(numberOfChars);
  words = wordLengths.map((wordLength) => {
    // letters of a single word
    let letters = '';

    // pick characters of a word based on length of word
    for (i = 0; i < wordLength; i++) {
      // choose a random index
      let indexInChooseableLetters = Math.floor(Math.random() * lettersToChooseFrom.length);
      // convert index into letter
      let letter = lettersToChooseFrom[indexInChooseableLetters];
      letters += letter;
    }

    return letters;
  });

  return words;
}

// choose word lengths based on distribution of wordlengths
function chooseWordLength() {
  // Word length length distribution:
  // 2 chars:  5% | cumulative:   5%
  // 3 chars: 20% | cumulative:  25% 
  // 4 chars: 20% | cumulative:  45%
  // 5 chars: 40% | cumulative:  85%
  // 6 chars: 15% | cumulative: 100%
  // Total: 100%

  let randomNumber = Math.random() * 100;
  let lengthChosen;

  // choose less than cumulatuve percentage
  if (randomNumber < 5)
    return 2;
  else if (randomNumber < 25)
    return 3;
  else if (randomNumber < 45)
    return 4;
  else if (randomNumber < 85)
    return 5;
  else
    return 6;
}

// generate all the required word lengths based 
//   on the maximum amount of characters permitted 
//   in the entire string
function chooseWordLengths(totalChars) {
  let listOfWordLengths = [];
  let stopAddingWords = false;
  while (!stopAddingWords) {
    let wordLengthChosen = chooseWordLength();
    listOfWordLengths.push(wordLengthChosen);
    // reduce amount of chars in the total string based on 
    //   picking a random wordlength
    totalChars -= wordLengthChosen;
    // Have we run out of characters in a word?
    if (totalChars <= 0)
      stopAddingWords = true;
  }

  return listOfWordLengths;
}

