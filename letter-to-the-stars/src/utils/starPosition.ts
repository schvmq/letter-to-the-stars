import type { Star } from '../types/star';

const columns = 8;
const rows = 5;
const margin = 5;

const totalCells = columns * rows;

export function generateStarPosition(
    existingStars: Pick<Star, 'x' | 'y'>[] = []
) {
    const cellWidth = 100 / columns;
    const cellHeight = 100 / rows;

    // Find which grid cells are already occupied.
    const occupiedCells = new Set<number>();

    existingStars.forEach((star) => {
        const column = Math.min(
            columns - 1,
            Math.floor(star.x / cellWidth)
        );

        const row = Math.min(
            rows - 1,
            Math.floor(star.y / cellHeight)
        );

        const cell = row * columns + column;

        occupiedCells.add(cell);
    });

    // Find cells that don't currently contain a star.
    const availableCells: number[] = [];

    for (let cell = 0; cell < totalCells; cell++) {
        if (!occupiedCells.has(cell)) {
            availableCells.push(cell);
        }
    }

    // If every cell is occupied, fall back to a random position.
    if (availableCells.length === 0) {
        return {
            x: margin + Math.random() * (100 - margin * 2),
            y: margin + Math.random() * (100 - margin * 2),
        };
    }

    // Pick one of the available cells.
    const randomIndex = Math.floor(
        Math.random() * availableCells.length
    );

    const cell = availableCells[randomIndex];

    const column = cell % columns;
    const row = Math.floor(cell / columns);

    // Find the center of the selected cell.
    const centerX = column * cellWidth + cellWidth / 2;
    const centerY = row * cellHeight + cellHeight / 2;

    // Add controlled randomness around the center.
    const jitterX =
        (Math.random() - 0.5) * cellWidth * 0.85;

    const jitterY =
        (Math.random() - 0.5) * cellHeight * 0.6;

    const x = centerX + jitterX;
    const y = centerY + jitterY;

    return {
        x: Math.max(margin, Math.min(100 - margin, x)),
        y: Math.max(margin, Math.min(100 - margin, y)),
    };
}