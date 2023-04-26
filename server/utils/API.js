const resClean = (text) => {
    const fixedString = text
        .trim()
        .replace(/\n/g, ' ')
        .replace(/("[^"]+"\s*:\s*)(true|false|"([^"\\]|\\.)+"|\d+)/g, (match, p1, p2) => {
            if (p2 === 'true' || p2 === 'false') {
                return `${p1}"${p2}"`;
            } else if (p2.startsWith('"') && !p2.endsWith('"')) {
                // Check if the value is a string and doesn't have a closing quote
                // Find the position of the next comma or closing curly brace
                let nextComma = text.indexOf(',', match.index + match.length);
                let nextCurlyBrace = text.indexOf('}', match.index + match.length);
                if (nextComma === -1 || (nextCurlyBrace !== -1 && nextCurlyBrace < nextComma)) {
                    nextComma = nextCurlyBrace;
                }
                // Extract the string value and add a closing quote
                const strValue = text.substring(match.index + p1.length, nextComma);
                return `${p1}"${strValue}"`;
            }
            return `${p1}${p2}`;
        });
    return fixedString;
};
//try catch block to parse
const okJSON = (jsonString) => {
    try {
        const json = JSON.parse(jsonString);
        // console.log(json);
        return json;
    } catch (error) {
        console.error('Error parsing JSON from API:', error, jsonString);
        return null;
    }
}

// deciding which card is pulled, takes in uprightOnly pref.
const pullCard = (uprightOnly) => {
    const dirSelect = { 1: true, 2: false };
    let cardName;
    let dir;

    if (uprightOnly) {
        dir = true;
    } else {
        dir = dirSelect[Math.floor(Math.random() * 2) + 1]
    }
    console.log(dir)

    const firSelect = { 0: "Major", 1: "WANDS", 2: "SWORDS", 3: "CUPS", 4: "PENTACLES" };
    const majSelect = {
        0: "THE FOOL",
        1: "THE MAGICIAN",
        2: "THE HIGH PRIESTESS",
        3: "THE EMPRESS",
        4: "THE EMPEROR",
        5: "THE HIEROPHANT",
        6: "THE LOVERS",
        7: "THE CHARIOT",
        8: "STRENGTH",
        9: "THE HERMIT",
        10: "THE WHEEL OF FORTUNE",
        11: "JUSTICE",
        12: "THE HANGED MAN",
        13: "DEATH",
        14: "TEMPERANCE",
        15: "THE DEVIL",
        16: "THE TOWER",
        17: "THE STAR",
        18: "THE MOON",
        19: "THE SUN",
        20: "JUDGEMENT",
        21: "THE WORLD"
    };
    const minSelect = {
        1: "ACE OF",
        2: "TWO OF",
        3: "THREE OF",
        4: "FOUR OF",
        5: "FIVE OF",
        6: "SIX OF",
        7: "SEVEN OF",
        8: "EIGHT OF",
        9: "NINE OF",
        10: "TEN OF",
        11: "PAGE OF",
        12: "KNIGHT OF",
        13: "QUEEN OF",
        14: "KING OF"
    };

    //generate random number between 0 and 4
    const firstNum = Math.floor(Math.random() * 5);
    // console.log("generated 1st number: " + firstNum);
    //if major
    if (firstNum == 0) {
        cardName = majSelect[Math.floor(Math.random() * 21) + 1];
        console.log(cardName)
    } else {
        const suite = firSelect[firstNum]
        cardName = minSelect[Math.floor(Math.random() * 14) + 1];
        // console.log(cardName)
        cardName = cardName + " " + suite
        console.log(cardName)
    }
    return { cardName: cardName, dir: dir }
}

module.exports = { resClean, okJSON, pullCard };
