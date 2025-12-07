import {generate} from "random-words";


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

const slowModifier = 1;

//

console.log("Welcome to the Morse Hub. Type !help to gather the list of commands!");

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


let v = 0;
async function playMorse(morseString : string) {
    const id = ++v;

    for (let i = 3; i > 0; i--) {
        console.log(`Morse sequence starts in ${i}...`);
        await wait(1000)
    }

    recurse()

    const split = morseString.split("");
    for (let string of split) {
        if (id != v) return;
        if (string === ".") soundPlayer.play({
            path: './resources/dot.wav'
        })
        else if (string === "-") soundPlayer.play({
            path: './resources/dash.wav'
        })
        await wait(Math.round(250 * slowModifier))
        if (string === "|") await wait(Math.round(400 * slowModifier))
        if (string === " ") await wait(Math.round(600 * slowModifier))
    }
}

export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateNewChallenge(minLength?: number, maxLength?: number,wordCount?: number) {
    const challenge = []
    const amount = !wordCount || Number.isNaN(wordCount) ? 1 : wordCount;
    for (let i = 0; i < amount; i++) {
        challenge.push(generate({minLength: !minLength || Number.isNaN(minLength) ? undefined : minLength,maxLength: !maxLength || Number.isNaN(maxLength) ? undefined : maxLength}));
    }
    return challenge.join(" ")
}

const readLine = require("readline");
const prefix = "[Client] >>"
let challenge : Challenge | undefined = undefined;



const int = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,

    // completer: (line : string) => {
    //     if (line.startsWith("!")) return "!quit";
    // }
})

function recurse() {
    int.question(`${new Date(Date.now()).toLocaleString()} - ${prefix}`,(answer : string) => {

        const s = answer.toLowerCase();

        if (s === "!help") {
            console.log(
                `
                List of Commands:
                !quit - To quit this morse hub
                !generate [minLength] [maxLength] [wordCount] - To generate a new challenge for morse with minLength maxLength and wordCount as optional parameters
                !replay - Used to replay an active challenge morse!
                `
            )
        }

        if (s === "!quit") {
            console.log("Logging off.. :)");
            int.close();
            return;
        }

        if (s.startsWith("!generate")) {

            const args = s.split(" ");
            const minLength = parseInt(args[1]);
            const maxLength = parseInt(args[2]);
            const wordCount = parseInt(args[3]);

            console.log(`${prefix} Challenge started! To replay the morse again, type !replay`)
            challenge = new Challenge(generateNewChallenge(minLength ?? undefined, maxLength ?? undefined,wordCount ?? 1));

            return;
        }

        if (s === "!replay") {
            if (!challenge) {
                console.log(`${prefix} There is no active challenge at the moment. Please use the command !generate [minLength] [maxLength] [wordCount] to start a challenge`)
                recurse()
                return;
            }
            playMorse(challenge.morse)
            return;
        }


        if (!!challenge) {
            challenge.attemptAnswer(s);
        }



        recurse()
    })
}

recurse()

class Challenge {

    answer: string;
    morse: string;
    attemptsLeft : number = 3;

    constructor(prompt: string) {
        this.answer = prompt;
        this.morse = convertPhraseToMorse(prompt);
        playMorse(this.morse)
    }

    attemptAnswer(input: string) {

        if (this.answer.toLowerCase() === input.toLowerCase()) {
            console.log(`${prefix} Congratulations! You got the answer correct! The phrase was '${input.toLowerCase()}'. To try another challenge use the command !generate [minLength] [maxLength] [wordCount]`)
            challenge = undefined;
            return;
        }

        if (--this.attemptsLeft > 0) {
            console.log(`${prefix} Incorrect answer! You have ${this.attemptsLeft} attempts remaining. Type !replay to hear the morse playback again!`);
            return;
        }

        console.log(`${prefix} GAME OVER!! The phrase was '${this.answer.toLowerCase()}'. To retry again, please use the command !generate [minLength] [maxLength] [wordCount]`)

    }

}


