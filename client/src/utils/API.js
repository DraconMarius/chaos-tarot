
export const resClean = (text) => {
    console.log(text);
    const fixedString = text
        .trim()
        .replace(/\n/g, ' ')
        .replace(/("[^"]+":)(\s*)(\w+:)/g, '$1"$3"')
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
