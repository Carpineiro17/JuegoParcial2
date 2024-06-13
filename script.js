//lista de palabras a buscar
const words = ["CINTURON", "SEÑALES", "SEMAFORO", "PEATONES", "AUTO", "MOTO", "CHOQUE", "LUCES", "TRAFICO", "ESTACIONAR"];
//Tamaño de la grilla
const gridSize = 12;
//Matriz que representa la sopa de letras
const grid = [];
//lista para almacenar las celdas seleccionadas por el jugador
let selectedCells = [];
//lista para almacenar las palabras encontradas
let foundWords = [];
// Elementos del DOM
const wordSearchContainer = document.getElementById('word-search-container');
const messageDiv = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
// Event listener para el botón de inicio
startButton.addEventListener('click', () => {
    // Oculta la pantalla de inicio y muestra el contenedor del juego
    startScreen.style.display = 'none';
    gameContainer.style.display = 'flex';
    // Inicializa el juego
    init();
});
// Función para crear una cuadrícula vacía
function createEmptyGrid(size) {
    for (let i = 0; i < size; i++) {
        grid[i] = [];
        for (let j = 0; j < size; j++) {
            grid[i][j] = '';
        }
    }
}

// Función para rellenar la cuadrícula con letras aleatorias
function fillGridWithRandomLetters() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÑ";
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }
}
// Función para comprobar si se puede colocar una palabra en una posición y dirección específicas
function canPlaceWord(word, row, col, direction) {
    if (direction === 'horizontal' && col + word.length > gridSize) return false;
    if (direction === 'vertical' && row + word.length > gridSize) return false;
    if (direction === 'diagonal' && (col + word.length > gridSize || row + word.length > gridSize)) return false;

    for (let i = 0; i < word.length; i++) {
        let newRow = row + (direction === 'vertical' || direction === 'diagonal' ? i : 0);
        let newCol = col + (direction === 'horizontal' || direction === 'diagonal' ? i : 0);

        if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
            return false;
        }
    }
    return true;
}
// Función para colocar una palabra en la cuadrícula
function placeWord(word) {
    const directions = ['horizontal', 'vertical', 'diagonal'];
    let placed = false;
    while (!placed) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);

        if (canPlaceWord(word, row, col, direction)) {
            for (let i = 0; i < word.length; i++) {
                let newRow = row + (direction === 'vertical' || direction === 'diagonal' ? i : 0);
                let newCol = col + (direction === 'horizontal' || direction === 'diagonal' ? i : 0);
                grid[newRow][newCol] = word[i];
            }
            placed = true;
        }
    }
}
// Función para mostrar la cuadrícula en el DOM
function displayGrid() {
    wordSearchContainer.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.textContent = grid[i][j];
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('mousedown', () => startSelection(cell));
            cell.addEventListener('mouseenter', () => extendSelection(cell));
            cell.addEventListener('mouseup', () => endSelection());
            wordSearchContainer.appendChild(cell);
        }
    }
}
// Variable para controlar si se está seleccionando
let isSelecting = false;
// Función para iniciar la selección de celdas
function startSelection(cell) {
    isSelecting = true;
    selectedCells.push(cell);
    cell.classList.add('selected');
}
// Función para extender la selección de celdas
function extendSelection(cell) {
    if (isSelecting && !selectedCells.includes(cell)) {
        selectedCells.push(cell);
        cell.classList.add('selected');
    }
}
// Función para finalizar la selección de celdas
function endSelection() {
    isSelecting = false;
    checkSelection();
}
// Función para comprobar la selección y buscar palabras
function checkSelection() {
    const word = selectedCells.map(cell => cell.textContent).join('');
    const reverseWord = selectedCells.map(cell => cell.textContent).reverse().join('');

    if (words.includes(word) || words.includes(reverseWord)) {
        selectedCells.forEach(cell => {
            cell.classList.add('correct');
            cell.classList.remove('selected');
        });
        const foundWord = words.includes(word) ? word : reverseWord;
        foundWords.push(foundWord);
        markWordAsFound(foundWord);
        selectedCells = [];
        checkCompletion();
    } else {
        selectedCells.forEach(cell => cell.classList.remove('selected'));
        selectedCells = [];
    }
}
// Función para marcar una palabra como encontrada en la lista
function markWordAsFound(word) {
    const listItem = document.querySelector(`#word-list li[data-word="${word}"]`);
    if (listItem) {
        listItem.classList.add('found');
    }
}

// Función para comprobar si se han encontrado todas las palabras
function checkCompletion() {
    if (foundWords.length === words.length) {
        messageDiv.textContent = '¡Felicidades! Has encontrado todas las palabras.';
        messageDiv.style.display = 'block';
        gameContainer.style.display = 'none';
        restartButton.style.display = 'block';
    }
}
// Función para inicializar el juego
function init() {
    grid.length = 0;
    selectedCells = [];
    foundWords = [];
    messageDiv.textContent = '';
    messageDiv.style.display = 'none';
    restartButton.style.display = 'none';
    gameContainer.style.display = 'flex';
    document.querySelectorAll('#word-list li').forEach(li => {
        li.classList.remove('found');
    });
    createEmptyGrid(gridSize);
    words.forEach(word => placeWord(word));
    fillGridWithRandomLetters();
    displayGrid();
}
// Event listener para el botón de reinicio
restartButton.addEventListener('click', () => {
    init();
    messageDiv.style.display = 'none';
    gameContainer.style.display = 'flex';
});
