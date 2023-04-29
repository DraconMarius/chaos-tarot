//clean up api res string with regex
export const resClean = (text) => {
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

// Helper function to convert a URL to a base64-encoded data URL
export const urlToBase64DataUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Helper function to convert a base64-encoded data URL to a File object
export const dataUrlToFile = async (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}
