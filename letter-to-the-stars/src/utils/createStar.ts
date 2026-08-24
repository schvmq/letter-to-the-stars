import type { Star } from '../types/star';
import { generateStarPosition } from './starPosition';

function getRandomShape(): Star['shape'] {
    const roll = Math.random();

    if (roll < 0.7) {
        return 'circle';
    }

    if (roll < 0.9) {
        return 'diamond';
    }

    return 'star';
}

export function createStar(message: string): Star {
    const position = generateStarPosition();

    return {
        id: crypto.randomUUID(),
        message,
        createdAt: new Date().toISOString(),
        x: position.x,
        y: position.y,
        size: 2.5 + Math.random() * 2.5,
        brightness: 0.6 + Math.random() * 0.4,
        shape: getRandomShape(),
    };
}