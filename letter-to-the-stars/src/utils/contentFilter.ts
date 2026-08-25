const blockedWords = [
    // Add the words you want your project to block here.
    'sacha',
    'example2',
    'example3',
];

export function containsBlockedWord(message: string): boolean {
    const normalizedMessage = message
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ');

    const words = normalizedMessage.split(/\s+/);

    return words.some((word) => blockedWords.includes(word));
}