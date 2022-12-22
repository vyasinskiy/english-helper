import translations from './translations.json' assert { type: "json" };

const titleNode = document.querySelector('.js-title');
const resultNode = document.querySelector('.js-result');
const synonymsNode = document.querySelector('.js-synonyms');
const exampleNode = document.querySelector('.js-example');
const input = document.querySelector('.js-input');

const nextButton = document.querySelector('.js-next-button');
const helpButton = document.querySelector('.js-help-button');
const exampleButton = document.querySelector('.js-example-button');

exampleButton.addEventListener('click', onExample);
input.addEventListener('keydown', onInput);
nextButton.addEventListener('click', onNext);
helpButton.addEventListener('click', onHelp);

const englTranslations = translations.filter((translation) => translation['Search language'] === 'en');
const synonymsMap = englTranslations.reduce((map, translationItem) => {
    const russianKey = translationItem["Translation text"].toLowerCase();
    const englishKey = translationItem["Search text"].toLowerCase();

    if (map[russianKey] && !map[russianKey].includes(englishKey)) {
        map[russianKey].push(englishKey);
        return map;
    } else {
        map[russianKey] = [englishKey];
        return map;
    }
}, {})

let currentWord = {};

onNext();

function onAccept() {
    const value = input.value;

    if (!value) {
        return;
    }

    const validAnswer = currentWord['Search text'];
    const russianKey = currentWord['Translation text'];

    const isValid = areLowerCaseEqual(validAnswer, value);
    const isIncludes = validAnswer.toLowerCase().includes(value.toLowerCase());
    const isSynonym = synonymsMap[russianKey.toLowerCase()].includes(value.toLowerCase());

    if (isValid) {
        setResult('Верно');
        handleSuccess();
    } else if (isIncludes){
        setResult(validAnswer);
    } else if (isSynonym) {
        setResult('Синоним!');
        setSynonyms(synonymsNode.innerHTML + " " + value);
    } else {
        setResult('Не верно');
    }
}

function onHelp() {
    const value = currentWord['Search text'];
    setResult(value);
}

function onExample() {
    const value = currentWord['Search example'];
    setExample(value);
}

function onInput(event) {
    if (event.shiftKey && event.keyCode === 13) {
        onNext();
        return;
    }

    if (event.keyCode === 13) {
        onAccept();
        return;
    }
}

function onNext() {
    setInputValue('');
    setResult('');
    setSynonyms('');
    setExample('');

    const randomIndex = getRandomIndex();
    setDataIndex(randomIndex);
    currentWord = englTranslations[randomIndex];
    setTitile(currentWord['Translation text']);
}

function setTitile(text) {
    titleNode.innerHTML = text;
}

function setInputValue(text) {
    input.value = text;
}

function setResult(text) {
    resultNode.innerHTML = text;
}

function setSynonyms(text) {
    synonymsNode.innerHTML = text;
}

function setExample(text) {
    exampleNode.innerHTML = text;
}

function setDataIndex(index) {
    input.setAttribute('data-index', index);
}

function handleSuccess() {
    const storageKey = currentWord["Search text"];
    const value = localStorage.getItem(storageKey);
    if (!value) {
        localStorage.setItem(storageKey, 'done');
    }
}

function getRandomIndex(prevIndex) {
    const index = getRandom();
    const _index = getRandom();
    const __index = getRandom();

    const resultIndex = index * _index * __index;

    if (resultIndex === prevIndex || resultIndex > englTranslations.length) {
        return getRandomIndex(prevIndex);
    }
    
    if (!isDone(resultIndex)) {
        return resultIndex;
    } else {
        const lessIndex = resultIndex - 1;
        const greaterIndex = resultIndex + 1;
        if (!isDone(lessIndex)) {
            return lessIndex;
        } else if (!isDone(greaterIndex)) {
            return greaterIndex;
        } else {
            return getRandomIndex(prevIndex);
        }
    }
}

function getRandom() {
    const index = +(Math.random() * 10).toFixed();
    if (index === 0) {
        return index + 1;
    } else {
        return index;
    }
}

function isDone(index) {
    const targetWord = englTranslations[index];
    return Boolean(localStorage.getItem(targetWord["Search text"]));
}

function areLowerCaseEqual(a,b) {
    return a.toLowerCase() === b.toLowerCase();
}