const resClean = (text) => {
    let fixedString = text
        .trim()
        .replace(/\n/g, ' ')
        .replace(/("[^"]+"|[\w-]+)\s*:\s*(true|false|"([^"\\]|\\.)*"|\d+|[\w\s-]+)(?=,|$)/g, (match, p1, p2) => {
            let key = p1.replace(/"/g, '');
            let value = p2.trim();

            if (value === 'true' || value === 'false' || !isNaN(value)) {
                value = `"${value}"`;
            } else if (!value.startsWith('"')) {
                value = `"${value.replace(/"/g, '\\"')}"`;
            } else if (value.startsWith('"') && !value.endsWith('"')) {
                let nextComma = text.indexOf(',', match.index + match.length);
                let nextCurlyBrace = text.indexOf('}', match.index + match.length);
                if (nextComma === -1 || (nextCurlyBrace !== -1 && nextCurlyBrace < nextComma)) {
                    nextComma = nextCurlyBrace;
                }
                const strValue = text.substring(match.index + p1.length + 1, nextComma).trim();
                value = `"${strValue.replace(/"/g, '\\"')}"`;
            }

            return `"${key}": ${value}`;
        });

    if (!fixedString.endsWith('}')) {
        if (fixedString.endsWith('"')) {
            fixedString += '}';
        } else {
            fixedString += '"}';
        }
    }

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
