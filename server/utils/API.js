//clean up api res string with regex
const resClean = (text) => {
    const fixedString = text
        .trim()
        .replace(/\n/g, ' ')
        .replace(/(\w+):/g, '"$1":')
    return fixedString;
}
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

module.exports = { resClean, okJSON };
