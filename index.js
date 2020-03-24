const chalk = require('chalk');
const readline = require('readline');

// Word length length distribution:
// 2 chars:  5% | cumulative:   5%
// 3 chars: 20% | cumulative:  25% 
// 4 chars: 20% | cumulative:  45%
// 5 chars: 40% | cumulative:  85%
// 6 chars: 15% | cumulative: 100%
// Total: 100%

console.log()

let chooseableLetters = [
  'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';',
];

words = generateWords(chooseableLetters);
console.log(words);
singleWordStr = generateAllWordsStr(words);
console.log(singleWordStr);
matchUserInput(singleWordStr);

function matchUserInput(wordStr) {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  let count = 0;
  
  process.stdin.on('keypress', (str, key) => {
  
    if (key.name === 'escape') {
      console.log();
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

function generateAllWordsStr(words) {
  let allWordsString = '';
  for (i = 0; i < words.length; i++) {
    allWordsString += (words[i] + ' ');
  }

  return allWordsString;
}

function generateWords(lettersToChooseFrom) {
  let wordLengths = chooseWordLengths();
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

function chooseWordLengths() {
  let maxWordLength = 30;
  let listOfWordLengths = [];
  let stopAddingWords = false;
  while (!stopAddingWords) {
    let wordLengthChosen = chooseWordLength();
    listOfWordLengths.push(wordLengthChosen);
    maxWordLength -= wordLengthChosen;
    if (maxWordLength <= 0)
      stopAddingWords = true;
  }

  return listOfWordLengths;
}

