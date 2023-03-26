
export const resClean = (text) => {
    console.log(text);
    const fixedString = text
        .trim()
        .replace(/\n/g, ' ')
        .replace(/(\w+):/g, '"$1":')
        .replace(/'/g, '"');
    return fixedString;
}

//try catch block to parse
export const okJSON = (jsonString) => {
    try {
        const json = JSON.parse(jsonString);
        // console.log(json);
        return json;
    } catch (error) {
        console.error('Error parsing JSON from API:', error, jsonString);
        return null;
    }
}
