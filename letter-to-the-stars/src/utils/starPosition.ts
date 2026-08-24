const columns = 5;
const rows = 4;
const margin = 5;

const totalCells = columns * rows;

let availableCells: number[] = [];

function initializeCells() {
    availableCells = Array.from(
        { length: totalCells },
        (_, index) => index
    );
}

export function generateStarPosition() {
    if (availableCells.length === 0) {
        initializeCells();
    }

    const randomIndex = Math.floor(
        Math.random() * availableCells.length
    );

    const cell = availableCells.splice(randomIndex, 1)[0];

    const column = cell % columns;
    const row = Math.floor(cell / columns);

    const cellWidth = 100 / columns;
    const cellHeight = 100 / rows;

    const centerX = column * cellWidth + cellWidth / 2;
    const centerY = row * cellHeight + cellHeight / 2;

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