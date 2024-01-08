export default function noDuplicates(array) {
    const seen = [];

    for (let i = 0; i < array.length; i++) {
        if (seen.includes(array[i])) {
            return false;
        } else {
            seen.push(array[i]);
        }
    }

    return true;
}