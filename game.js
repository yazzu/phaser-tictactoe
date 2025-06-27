const config = {
    type: Phaser.AUTO,
    width: 300,
    height: 400,
    backgroundColor: 0xffffff, // Add this line for white background
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

let board;
let currentPlayer;
let gameOver;
let playerText;
let resultText;

function preload () {
    // No assets to preload
}

function create () {
    // Initialize game variables
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    currentPlayer = 'X';
    gameOver = false;

    // Draw the grid
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x000000); // 2 pixels thick, black color

    // Horizontal lines
    graphics.lineBetween(0, 100, 300, 100);
    graphics.lineBetween(0, 200, 300, 200);

    // Vertical lines
    graphics.lineBetween(100, 0, 100, 300);
    graphics.lineBetween(200, 0, 200, 300);

    // Add text for player turn and result
    playerText = this.add.text(10, 310, 'Player: ' + currentPlayer, { fontSize: '24px', fill: '#000' });
    resultText = this.add.text(10, 350, '', { fontSize: '24px', fill: '#ff0000' });


    // Add input listener
    this.input.on('pointerdown', function (pointer) {
        if (gameOver) {
            return;
        }

        const x = Math.floor(pointer.x / 100);
        const y = Math.floor(pointer.y / 100);

        if (x < 3 && y < 3 && board[y][x] === '') {
            // Make the move
            board[y][x] = currentPlayer;
            const mark = this.add.text(x * 100 + 50, y * 100 + 50, currentPlayer, { fontSize: '64px', fill: '#000' });
            mark.setOrigin(0.5);

            // Check for winner
            if (checkWinner()) {
                resultText.setText(currentPlayer + ' wins!');
                gameOver = true;
            } else if (isBoardFull()) {
                resultText.setText('Draw!');
                gameOver = true;
            } else {
                // Switch player
                currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
                playerText.setText('Player: ' + currentPlayer);
            }
        }
    }, this);

    // Add restart text
    const restartText = this.add.text(160, 380, 'Click to Restart', { fontSize: '18px', fill: '#000' });
    restartText.setOrigin(0.5);
    this.input.on('pointerdown', function (pointer) {
        if (gameOver) {
            this.scene.restart();
        }
    }, this);
}

function checkWinner() {
    // Check rows
    for (let i = 0; i < 3; i++) {
        if (board[i][0] !== '' && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            return true;
        }
    }
    // Check columns
    for (let i = 0; i < 3; i++) {
        if (board[0][i] !== '' && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
            return true;
        }
    }
    // Check diagonals
    if (board[0][0] !== '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return true;
    }
    if (board[0][2] !== '' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return true;
    }
    return false;
}

function isBoardFull() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                return false;
            }
        }
    }
    return true;
}