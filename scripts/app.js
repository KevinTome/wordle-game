const getRandomWord = (wordList) => {
    const wordsCount = wordList.length
    const shuffleIndex = Math.floor(Math.random() * wordsCount)
    return wordList[shuffleIndex]
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
        console.log(DB)
        console.log('get one random word: ', getRandomWord(DB))
    }
}

start()