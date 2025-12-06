

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


console.log(convertPhraseToMorse("Hello World"))


