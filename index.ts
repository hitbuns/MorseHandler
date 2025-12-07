

const soundPlayer = require("node-wav-player")

const index = [
    "-----",
    ".----",
    "..---",
    "...--",
    "....-",
    ".....",
    "-....",
    "--...",
    "---..",
    "----.",
    ".-",
    "-...",
    "-.-.",
    "-..",
    ".",
    "..-.",
    "--.",
    "....",
    "..",
    ".---",
    "-.-",
    ".-..",
    "--",
    "-.",
    "---",
    ".--.",
    "--.-",
    ".-.",
    "...",
    "-",
    "..-",
    "...-",
    ".--",
    "-..-",
    "-.--",
    "--.."
]

// SETTINGS

const slowModifier = 2.5;

//

function letterToNumber(char : string | number) {
    return typeof char === "number" ? char : char.toUpperCase().charCodeAt(0)-55
}

function convertLetterToMorse(char : string | number) {
    return index[letterToNumber(char)]
}

function convertPhraseToMorse(phrase : string) {
    const ff = phrase.split("").map(value => {
        if (value === " ") return value;
        return convertLetterToMorse(value) + "|"
    }).join("");
    return ff.substring(0,ff.length-1)
}



async function playMorse(morseString : string) {
    const split = morseString.split("");
    for (let string of split) {
        if (string === ".") soundPlayer.play({
            path: './resources/dot.wav'
        })
        else if (string === "-") soundPlayer.play({
            path: './resources/dash.wav'
        })
        await wait(Math.round(100 * slowModifier))
        if (string === "|") await wait(Math.round(300 * slowModifier))
        if (string === " ") await wait(Math.round(600 * slowModifier))
    }
}

export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const morse = convertPhraseToMorse("Hello World");

playMorse(morse)

console.log(morse)


