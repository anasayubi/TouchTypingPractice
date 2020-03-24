const chalk = require('chalk');
const readline = require('readline');
const inquirer = require('inquirer');

// Word length length distribution:
// 2 chars:  5% | cumulative:   5%
// 3 chars: 20% | cumulative:  25% 
// 4 chars: 20% | cumulative:  45%
// 5 chars: 40% | cumulative:  85%
// 6 chars: 15% | cumulative: 100%
// Total: 100%

inquirer
  .prompt([
    {
      type: 'checkbox',
      message: 'Which keyboard rows should be included in the practice?',
      name: 'rowsIncluded',
      choices: [
        { name: 'Top Row', value: 'topRow' },
        { name: 'Home Row', value: 'homeRow' },
        { name: 'Bottom Row', value: 'bottomRow' },
      ]
    },
    {
      type: 'list',
      message: 'How many characters should be printed',
      name: 'numberOfChars',
      choices: [
        { name: '30', value: 30 },
        { name: '50', value: 50 }
      ]
    }
    // '?'
  ])
  .then(answers => {
    // console.log(answers);

    let topRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    let homeRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'];
    let bottomRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?'];
    let allChars = [];

    if (answers.rowsIncluded.includes('topRow'))
      allChars = allChars.concat(topRow);
    if (answers.rowsIncluded.includes('homeRow'))
      allChars = allChars.concat(homeRow);
    if (answers.rowsIncluded.includes('bottomRow'))
      allChars = allChars.concat(bottomRow);

    words = generateWords(allChars, answers.numberOfChars);
    // console.log(words);
    singleWordStr = generateAllWordsStr(words);
    console.log();
    console.log('To end the prcatice press <Esc> at any time.');
    console.log();
    console.log(singleWordStr);
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
  const rl = readline.createInterface({
    input: process.stdin,
    terminal: true
  });

  readline.emitKeypressEvents(process.stdin, rl);
  process.stdin.setRawMode(true);

  let count = 0;
  let firstKeyPress = true;
  let startTime;

  process.stdin.on('keypress', (str, key) => {

    if (firstKeyPress) {
      startTime = new Date().getTime();
      firstKeyPress = false;
    }

    // last key pressed
    if (count == (wordStr.length - 1)) {
      printCPM(startTime, wordStr);
      process.exit();
    }

    if (key.name === 'escape') {
      printCPM(startTime, wordStr);
      // console.log();
      process.exit();
    }

    if (wordStr[count] !== str.toUpperCase())
      process.stdout.write(chalk.red(str.toUpperCase()));
    else
      process.stdout.write(str.toUpperCase());

    count++;

    //   console.log('str:')
    //   console.log(str)
    //   console.log('key:')
    //   console.log(key)

  });
}

function printCPM(startTime, wordStr) {
  let endTime = new Date().getTime();
  let difference = endTime - startTime;
  let cpm = difference / wordStr.length;

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
  let wordLengths = chooseWordLengths(numberOfChars);
  words = wordLengths.map((wordLength) => {
    let letters = '';

    for (i = 0; i < wordLength; i++) {
      let indexInChooseableLetters = Math.floor(Math.random() * lettersToChooseFrom.length);
      let letter = lettersToChooseFrom[indexInChooseableLetters];
      letters += letter;
    }

    return letters;
  });

  return words;
}

function chooseWordLength() {
  let randomNumber = Math.random() * 100;
  let lengthChosen;

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

function chooseWordLengths(totalChars) {
  let listOfWordLengths = [];
  let stopAddingWords = false;
  while (!stopAddingWords) {
    let wordLengthChosen = chooseWordLength();
    listOfWordLengths.push(wordLengthChosen);
    totalChars -= wordLengthChosen;
    if (totalChars <= 0)
      stopAddingWords = true;
  }

  return listOfWordLengths;
}

