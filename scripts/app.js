const MAX_LETTE_PER_ROW = 5
const MAX_ATTEMPTS = 6

const KEY_BACKSPACE = 'Backspace'
const KEY_ENTER = 'Enter'
const KEY_DELETE = 'Delete'

const NOTIFICATION_DISPLAY_LETTER_SUCCESSFULLY = 'Showing letter with success'
const NOTIFICATION_BACKSPACE_KEY_PRESSED = 'Backspace key pressed'
const NOTIFICATION_BACKSPACE_WHEN_EMPTY_GUESS = 'Could not erase when is an empty guess'
const NOTIFICATION_ENTER_KEY_PRESSED = 'Enter key pressed'
const NOTIFICATION_EMPTY_GUESS = 'Empty guess'
const NOTIFICATION_INCOMPLETE_GUESS = 'Incomplete guess'
const NOTIFICATION_INVALID_PRESSED_KEY = 'Invalid Pressed Key'
const NOTIFICATION_REACH_MAX_ATTEMPTS = 'Reach Max Attempts'
const NOTIFICATION_REACH_MAX_LETTERS_PER_ROW = 'Reach Max letter per row'
const NOTIFICATION_WORD_NOT_IN_DATABASE = 'Word not in database'

const gameInitConfig = {
    DB: [],
    currentRow: 1,
    currentLetterPos: 1,
    currentGuess: '',
    rightGuess: ''
 }

const getRandomWord = (wordList) => {
    const wordsCount = wordList.length
    const shuffleIndex = Math.floor(Math.random() * wordsCount)
    return wordList[shuffleIndex]
}

const getGameBordLetter = (currentRow, currentLetterPos) => {
    return document.querySelector(`.board .row-${currentRow} .letter-${currentLetterPos}`)
}

const isBackspacePressed = (pressedKey) => {
    return [KEY_BACKSPACE, KEY_DELETE].includes(pressedKey)
}

const isEnterPressed = (pressedKey) => {
    return pressedKey == KEY_ENTER
}

const isOneAlphabetLetter = (pressedKey) => {
    return pressedKey.length == 1 && /[A-Za-z]/.test(pressedKey)
}

const isValidKeyPressed = (pressedKey) => {
    return isEnterPressed(pressedKey) || isBackspacePressed(pressedKey) || isOneAlphabetLetter(pressedKey)
}

const isGuessInDatabase = (guess, database) => {
    return database.includes(guess.toLowerCase())
}

const isCurrentGuessEmpty = (currentGuess) => {
    return currentGuess === ''  
}

const reachMaxLetterPerRow = (currentLetterPos) => {
    return currentLetterPos > MAX_LETTE_PER_ROW
}

const reachMaxAttempts = (currentRow) => {
    return currentRow > MAX_ATTEMPTS
}

const removeLastLetter = (currentGuess) => {
    return currentGuess.slice(0, currentGuess.length - 1)
}

const removeLetterFromBoard = (game) => {
    const { currentGuess, currentRow, currentLetterPos } = game

    game.currentGuess = removeLastLetter(currentGuess)
    game.currentLetterPos--

    const element = getGameBoardLetter(currentRow, currentLetterPos - 1)
    element.textContent = ''

    return NOTIFICATION_BACKSPACE_KEY_PRESSED
}

const displayLetterOnTheBoard = (game, pressedKey) => {
    const { currentRow, currentLetterPos } = game

    const element = getGameBordLetter(currentRow, currentLetterPos)
    element.textContent = pressedKey

    game.currentGuess += pressedKey
    game.currentLetterPos++

    return NOTIFICATION_DISPLAY_LETTER_SUCCESSFULLY
}

const nextGame = (game) => {
    game.currentRow++
    game.currentGuess = ''
    game.currentLetterPos = 1

    return NOTIFICATION_ENTER_KEY_PRESSED
}

const checkGuess = (game) => {
    const { DB, currentLetterPos, currentGuess } = game

    if (isCurrentGuessEmpty(currentGuess)) {
        return NOTIFICATION_EMPTY_GUESS
    }

    if (!reachMaxLetterPerRow(currentLetterPos)) {
        return NOTIFICATION_INCOMPLETE_GUESS
    }

    if (!isGuessInDatabase(currentGuess, DB)) {
        return NOTIFICATION_WORD_NOT_IN_DATABASE
    }

    return nextGame(game)
}

const onKeyPressed = (pressedKey, game) => {
    const { currentLetterPos, currentGuess, currentRow } = game

    if (reachMaxAttempts(currentRow)) {
        return NOTIFICATION_REACH_MAX_ATTEMPTS
    }

    if (!isValidKeyPressed(pressedKey)) {
        return NOTIFICATION_INVALID_PRESSED_KEY
    }

    if (isBackspacePressed(pressedKey) && !isCurrentGuessEmpty(currentGuess)) {
        return removeLetterFromBoard(game)
    }

    if (isBackspacePressed(pressedKey) && isCurrentGuessEmpty(currentGuess)) {
        return NOTIFICATION_BACKSPACE_WHEN_EMPTY_GUESS
    }

    if (isEnterPressed(pressedKey)) {
        return checkGuess(game)
    }

    if (reachMaxLetterPerRow(currentLetterPos)) {
        return NOTIFICATION_REACH_MAX_LETTERS_PER_ROW
    }

    return displayLetterOnTheBoard(game, pressedKey)
}


const getWordsDB = async () => {
    return fetch('./json/database.json')
        .then((response) => response.json())
        .then(({ words }) => words)
        .catch(() => {})
}

const start = () => {
    window.onload = async () => {
        const DB = await getWordsDB()
        const game = {...gameInitConfig, DB}
        console.log(DB)
        console.log('get one random word: ', getRandomWord(DB))
        
        document.addEventListener('keydown', (event) => onKeyPressed(event.key, game))
    }
}

start()