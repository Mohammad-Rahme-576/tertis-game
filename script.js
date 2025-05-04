// document.addEventListener('DOMContentLoaded', () => {
//     // Game elements
//     const gameGrid = document.getElementById('game-grid');
//     const nextGrid = document.getElementById('next-grid');
//     const scoreElement = document.getElementById('score');
//     const levelElement = document.getElementById('level');
//     const linesElement = document.getElementById('lines');
//     const startButton = document.getElementById('start-button');
//     const restartButton = document.getElementById('restart-button');
//     const pauseButton = document.getElementById('pause-button');

//     // Game state
//     let cells = Array.from(gameGrid.children);
//     let nextCells = [];
//     let currentPosition = 4; 
//     let currentRotation = 0;
//     let currentTetrimino;
//     let nextTetrimino;
//     let score = 0;
//     let level = 1;
//     let lines = 0;
//     let timerId = null;
//     let isPaused = false;
//     let isGameOver = false;
//     let speed = 1000;
    
//     // Sound effects with volume adjustment
//     const sounds = {
//       rotate: new Audio('sounds/rotate.wav'),
//       clear: new Audio('sounds/clear.wav'),
//       drop: new Audio('sounds/drop.wav'),
//       gameOver: new Audio('sounds/game-over.wav')
//     };
    
//     Object.values(sounds).forEach(sound => sound.volume = 0.3);
  
//     // Enhanced Tetrimino definitions with rotations
//     const tetriminos = {
//         I: [
//             [1, 11, 21, 31],  // vertical (modified from [1, 11, 21, 31])
//             [0, 1, 2, 3],     // horizontal
//             [0, 10, 20, 30],  // vertical
//             [0, 1, 2, 3]      // horizontal
//           ],
//       O: [
//         [0, 1, 10, 11],
//         [0, 1, 10, 11],
//         [0, 1, 10, 11],
//         [0, 1, 10, 11]
//       ],
//       T: [
//         [1, 10, 11, 12],
//         [1, 11, 12, 21],
//         [10, 11, 12, 21],
//         [1, 10, 11, 21]
//       ],
//       S: [
//         [1, 2, 10, 11],
//         [1, 11, 12, 22],
//         [1, 2, 10, 11],
//         [1, 11, 12, 22]
//       ],
//       Z: [
//         [0, 1, 11, 12],
//         [2, 11, 12, 21],
//         [0, 1, 11, 12],
//         [2, 11, 12, 21]
//       ],
//       J: [
//         [0, 10, 11, 12],
//         [1, 2, 11, 21],
//         [10, 11, 12, 22],
//         [1, 11, 20, 21]
//       ],
//       L: [
//         [2, 10, 11, 12],
//         [1, 11, 21, 22],
//         [10, 11, 12, 20],
//         [0, 1, 11, 21]
//       ]
//     };
  
//     const colors = {
//       I: '#00f0f0',
//       O: '#f0f000',
//       T: '#a000f0',
//       S: '#00f000',
//       Z: '#f00000',
//       J: '#0000f0',
//       L: '#f0a000'
//     };
  
//     // Initialize game grid
//     function initializeGrids() {
//       // Main grid
//       gameGrid.innerHTML = '';
//       for (let i = 0; i < 200; i++) {
//         const cell = document.createElement('div');
//         gameGrid.appendChild(cell);
//       }
//       cells = Array.from(gameGrid.children);
  
//       // Next piece preview grid
//       nextGrid.innerHTML = '';
//       for (let i = 0; i < 16; i++) {
//         const cell = document.createElement('div');
//         nextGrid.appendChild(cell);
//       }
//       nextCells = Array.from(nextGrid.children);
//     }
  
//     // Game control functions
//     function startGame() {
//       if (timerId) return;
//       isGameOver = false;
//       isPaused = false;
//       initializeGrids();
//       score = 0;
//       level = 1;
//       lines = 0;
//       speed = 1000;
//       updateScore();
//       nextTetrimino = getRandomTetrimino();
//       spawnTetrimino();
//       timerId = setInterval(moveDown, speed);
//       startButton.disabled = true;
//       pauseButton.disabled = false;
//     }
  
//     function pauseGame() {
//       if (isGameOver) return;
//       if (isPaused) {
//         isPaused = false;
//         timerId = setInterval(moveDown, speed);
//         pauseButton.textContent = 'Pause';
//         gameGrid.classList.remove('paused');
//       } else {
//         isPaused = true;
//         clearInterval(timerId);
//         timerId = null;
//         pauseButton.textContent = 'Resume';
//         gameGrid.classList.add('paused');
//       }
//     }
  
//     function gameOver() {
//       clearInterval(timerId);
//       timerId = null;
//       isGameOver = true;
//       sounds.gameOver.play();
//       gameGrid.classList.add('game-over');
//       startButton.disabled = false;
//       pauseButton.disabled = true;
//       alert(Game `Over! Score: ${score}`);
//     }
  
//     // Tetrimino movement and rotation
//     function spawnTetrimino() {
//       currentTetrimino = nextTetrimino;
//       nextTetrimino = getRandomTetrimino();
//       currentPosition = 4;
//       currentRotation = 0;
      
//       if (checkCollision()) {
//         gameOver();
//         return;
//       }
      
//       draw();
//       drawNext();
//     }      
  
//     function getRandomTetrimino() {
//       const tetriminoKeys = Object.keys(tetriminos);
//       return tetriminoKeys[Math.floor(Math.random() * tetriminoKeys.length)];
//     }
  
//     function draw() {
//       tetriminos[currentTetrimino][currentRotation].forEach(index => {
//         cells[currentPosition + index].style.backgroundColor = colors[currentTetrimino];
//       });
//     }
  
//     function undraw() {
//       tetriminos[currentTetrimino][currentRotation].forEach(index => {
//         cells[currentPosition + index].style.backgroundColor = '';
//       });
//     }
  
//     function drawNext() {
//       nextCells.forEach(cell => cell.style.backgroundColor = '');
//       tetriminos[nextTetrimino][0].forEach(index => {
//         const row = Math.floor(index / 10);
//         const col = index % 10;
//         const adjustedIndex = row * 4 + col;
//         if (nextCells[adjustedIndex]) {
//           nextCells[adjustedIndex].style.backgroundColor = colors[nextTetrimino];
//         }
//       });
//     }
  
//     // Modified moveDown function to use new collision detection
//     function moveDown() {
//         if (isPaused || isGameOver) return;
//         undraw();
//         currentPosition += 10;
//         if (checkCollision()) {
//           currentPosition -= 10;
//           draw();
//           freeze();
//           return;
//         }
//         draw();
//       }
  
//     // Modified moveLeft function with better edge detection
//   function moveLeft() {
//     if (isPaused || isGameOver) return;
    
//     undraw();
//     const isAtLeftEdge = tetriminos[currentTetrimino][currentRotation].some(index => {
//       const position = currentPosition + index;
//       return position % 10 === 0 || // Check if at left edge
//         (cells[position - 1]?.style.backgroundColor !== '' && // Check if cell to left is occupied
//          !tetriminos[currentTetrimino][currentRotation].includes(index - 1)); // Ensure it's not part of current piece
//     });
    
//     if (!isAtLeftEdge) {
//       currentPosition -= 1;
//       if (checkCollision()) {
//         currentPosition += 1;
//       }
//     }
//     draw();
//   }

//   // Modified moveRight function with better edge detection
//   function moveRight() {
//     if (isPaused || isGameOver) return;
    
//     undraw();
//     const isAtRightEdge = tetriminos[currentTetrimino][currentRotation].some(index => {
//       const position = currentPosition + index;
//       return position % 10 === 9 || // Check if at right edge
//         (cells[position + 1]?.style.backgroundColor !== '' && // Check if cell to right is occupied
//          !tetriminos[currentTetrimino][currentRotation].includes(index + 1)); // Ensure it's not part of current piece
//     });
    
//     if (!isAtRightEdge) {
//       currentPosition += 1;
//       if (checkCollision()) {
//         currentPosition -= 1;
//       }
//     }
//     draw();
//   }


//   function rotate() {
//     if (isPaused || isGameOver) return;
//     undraw();
//     const previousRotation = currentRotation;
//     currentRotation = (currentRotation + 1) % tetriminos[currentTetrimino].length;
    
//     // Wall kick
//     if (checkCollision()) {
//       // Try moving left
//       currentPosition -= 1;
//       if (checkCollision()) {
//         // Try moving right
//         currentPosition += 2;
//         if (checkCollision()) {
//           // If still colliding, revert rotation
//           currentPosition -= 1;
//           currentRotation = previousRotation;
//         }
//       }
//     }
//     draw();
//     sounds.rotate.play();
//   }

//   function hardDrop() {
//     if (isPaused || isGameOver) return;
//     undraw();
//     while (!checkCollision()) {
//       currentPosition += 10;
//     }
//     currentPosition -= 10;
//     draw();
//     sounds.drop.play();
//     freeze();
//   }

// function checkCollision() {
//     return tetriminos[currentTetrimino][currentRotation].some(index => {
//         const nextPos = currentPosition + index;
//         return (
//             nextPos >= cells.length ||  // Bottom boundary
//             nextPos % 10 === 9 && index % 10 === 0 || // Right boundary
//             nextPos % 10 === 0 && index % 10 === 9 || // Left boundary
//             cells[nextPos].style.backgroundColor !== '' // Occupied cell
//         );
//     });
// }

  

//   function freeze() {
//     const collision = tetriminos[currentTetrimino][currentRotation].some(index => {
//       const position = currentPosition + index;
  
//       // Check if the position is at the bottom or on top of another piece
//       return position + 10 >= 200 || cells[position + 10]?.style.backgroundColor !== '';
//     });
  
//     if (collision) {
//       tetriminos[currentTetrimino][currentRotation].forEach(index => {
//         const position = currentPosition + index;
//         if (position >= 0 && position < 200) {
//           cells[position].style.backgroundColor = colors[currentTetrimino];
//         }
//       });
  
//       clearLines();
//       spawnTetrimino();
//     }
//   }
  
  

  

//       function clearLines() {
//         let linesCleared = 0;
        
//         for (let row = 19; row >= 0; row--) {
//           const startIndex = row * 10;
//           const line = cells.slice(startIndex, startIndex + 10);
          
//           if (line.every(cell => cell.style.backgroundColor !== '')) {
//             // Clear the line
//             line.forEach(cell => cell.style.backgroundColor = '');
            
//             // Move all lines above down
//             for (let y = row; y > 0; y--) {
//               for (let x = 0; x < 10; x++) {
//                 const currentIndex = y * 10 + x;
//                 const aboveIndex = (y - 1) * 10 + x;
//                 cells[currentIndex].style.backgroundColor = cells[aboveIndex].style.backgroundColor;
//               }
//             }
            
//             // Clear top line
//             for (let x = 0; x < 10; x++) {
//               cells[x].style.backgroundColor = '';
//             }
            
//             linesCleared++;
//             row++; // Check the same row again after moving lines down
//           }
//         }
        
//         if (linesCleared > 0) {
//           sounds.clear.play();
//           updateScoreWithLines(linesCleared);
//         }
//       }
    
//       function updateScoreWithLines(clearedLines) {
//         // Score calculation based on number of lines cleared
//         const points = {
//           1: 100,
//           2: 300,
//           3: 500,
//           4: 800
//         };
        
//         score += points[clearedLines] * level;
//         lines += clearedLines;
//         level = Math.floor(lines / 10) + 1;
        
//         // Update speed based on level
//         speed = Math.max(100, 1000 - (level - 1) * 100);
//         if (timerId) {
//           clearInterval(timerId);
//           timerId = setInterval(moveDown, speed);
//         }
        
//         updateScore();
//       }
    
//       function updateScore() {
//         scoreElement.textContent = score;
//         levelElement.textContent = level;
//         linesElement.textContent = lines;
//       }
    
//       // Event listeners
//       document.addEventListener('keydown', (event) => {
//         if (isGameOver) return;
        
//         switch (event.key) {
//           case 'ArrowLeft':
//             moveLeft();
//             break;
//           case 'ArrowRight':
//             moveRight();
//             break;
//           case 'ArrowDown':
//             moveDown();
//             break;
//           case 'ArrowUp':
//             rotate();
//             break;
//           case ' ':
//             event.preventDefault(); // Prevent space from scrolling
//             hardDrop();
//             break;
//           case 'p':
//           case 'P':
//             pauseGame();
//             break;
//         }
//       });
    
//       startButton.addEventListener('click', startGame);
//       restartButton.addEventListener('click', () => {
//         clearInterval(timerId);
//         timerId = null;
//         startGame();
//       });
//       pauseButton.addEventListener('click', pauseGame);
      
//       // Initialize button states
//       pauseButton.disabled = true;
    
//       // Initialize game grid
//       initializeGrids();
//     });




document.addEventListener('DOMContentLoaded', () => {
  // Game elements
  const gameGrid = document.getElementById('game-grid');
  const nextGrid = document.getElementById('next-grid');
  const scoreElement = document.getElementById('score');
  const levelElement = document.getElementById('level');
  const linesElement = document.getElementById('lines');
  const startButton = document.getElementById('start-button');
  const restartButton = document.getElementById('restart-button');
  const pauseButton = document.getElementById('pause-button');

  // Game state
  let cells = Array.from(gameGrid.children);
  let nextCells = [];
  let currentPosition = 4; 
  let currentRotation = 0;
  let currentTetrimino;
  let nextTetrimino;
  let score = 0;
  let level = 1;
  let lines = 0;
  let timerId = null;
  let isPaused = false;
  let isGameOver = false;
  let speed = 1000;
  
  // Sound effects with volume adjustment
  const sounds = {
    rotate: new Audio('sounds/rotate.wav'),
    clear: new Audio('sounds/clear.wav'),
    drop: new Audio('sounds/drop.wav'),
    gameOver: new Audio('sounds/game-over.wav')
  };
  
  Object.values(sounds).forEach(sound => sound.volume = 0.3);

  // Enhanced Tetrimino definitions with rotations
  const tetriminos = {
      I: [
          [1, 11, 21, 31],  // vertical (modified from [1, 11, 21, 31])
          [0, 1, 2, 3],     // horizontal
          [0, 10, 20, 30],  // vertical
          [0, 1, 2, 3]      // horizontal
        ],
    O: [
      [0, 1, 10, 11],
      [0, 1, 10, 11],
      [0, 1, 10, 11],
      [0, 1, 10, 11]
    ],
    T: [
      [1, 10, 11, 12],
      [1, 11, 12, 21],
      [10, 11, 12, 21],
      [1, 10, 11, 21]
    ],
    S: [
      [1, 2, 10, 11],
      [1, 11, 12, 22],
      [1, 2, 10, 11],
      [1, 11, 12, 22]
    ],
    Z: [
      [0, 1, 11, 12],
      [2, 11, 12, 21],
      [0, 1, 11, 12],
      [2, 11, 12, 21]
    ],
    J: [
      [0, 10, 11, 12],
      [1, 2, 11, 21],
      [10, 11, 12, 22],
      [1, 11, 20, 21]
    ],
    L: [
      [2, 10, 11, 12],
      [1, 11, 21, 22],
      [10, 11, 12, 20],
      [0, 1, 11, 21]
    ]
  };

  const colors = {
    I: '#00f0f0',
    O: '#f0f000',
    T: '#a000f0',
    S: '#00f000',
    Z: '#f00000',
    J: '#0000f0',
    L: '#f0a000'
  };

  // Initialize game grid
  function initializeGrids() {
    // Main grid
    gameGrid.innerHTML = '';
    for (let i = 0; i < 200; i++) {
      const cell = document.createElement('div');
      gameGrid.appendChild(cell);
    }
    cells = Array.from(gameGrid.children);

    // Next piece preview grid
    nextGrid.innerHTML = '';
    for (let i = 0; i < 16; i++) {
      const cell = document.createElement('div');
      nextGrid.appendChild(cell);
    }
    nextCells = Array.from(nextGrid.children);
  }

  // Game control functions
  function startGame() {
    if (timerId) return;
    isGameOver = false;
    isPaused = false;
    initializeGrids();
    score = 0;
    level = 1;
    lines = 0;
    speed = 1000;
    updateScore();
    nextTetrimino = getRandomTetrimino();
    spawnTetrimino();
    timerId = setInterval(moveDown, speed);
    startButton.disabled = true;
    pauseButton.disabled = false;
  }

  function pauseGame() {
    if (isGameOver) return;
    if (isPaused) {
      isPaused = false;
      timerId = setInterval(moveDown, speed);
      pauseButton.textContent = 'Pause';
      gameGrid.classList.remove('paused');
    } else {
      isPaused = true;
      clearInterval(timerId);
      timerId = null;
      pauseButton.textContent = 'Resume';
      gameGrid.classList.add('paused');
    }
  }

  function gameOver() {
    clearInterval(timerId);
    timerId = null;
    isGameOver = true;
    sounds.gameOver.play();
    gameGrid.classList.add('game-over');
    startButton.disabled = false;
    pauseButton.disabled = true;
    alert(`Game Over! Score: ${score}`); // Fixed template literal syntax
  }

  // Tetrimino movement and rotation
  function spawnTetrimino() {
    currentTetrimino = nextTetrimino;
    nextTetrimino = getRandomTetrimino();
    currentPosition = 4;
    currentRotation = 0;
    
    if (checkCollision()) {
      gameOver();
      return;
    }
    
    draw();
    drawNext();
  }      

  function getRandomTetrimino() {
    const tetriminoKeys = Object.keys(tetriminos);
    return tetriminoKeys[Math.floor(Math.random() * tetriminoKeys.length)];
  }

  function draw() {
    tetriminos[currentTetrimino][currentRotation].forEach(index => {
      cells[currentPosition + index].style.backgroundColor = colors[currentTetrimino];
    });
  }

  function undraw() {
    tetriminos[currentTetrimino][currentRotation].forEach(index => {
      cells[currentPosition + index].style.backgroundColor = '';
    });
  }

  function drawNext() {
    nextCells.forEach(cell => cell.style.backgroundColor = '');
    tetriminos[nextTetrimino][0].forEach(index => {
      const row = Math.floor(index / 10);
      const col = index % 10;
      const adjustedIndex = row * 4 + col;
      if (nextCells[adjustedIndex]) {
        nextCells[adjustedIndex].style.backgroundColor = colors[nextTetrimino];
      }
    });
  }

  function moveDown() {
    if (isPaused || isGameOver) return;
    undraw();
    currentPosition += 10;
    if (checkCollision()) {
      currentPosition -= 10;
      draw();
      freeze();
      return;
    }
    draw();
  }

  function moveLeft() {
    if (isPaused || isGameOver) return;
    
    undraw();
    const isAtLeftEdge = tetriminos[currentTetrimino][currentRotation].some(index => {
      const position = currentPosition + index;
      return position % 10 === 0 || 
        (cells[position - 1]?.style.backgroundColor !== '' && 
         !tetriminos[currentTetrimino][currentRotation].includes(index - 1));
    });
    
    if (!isAtLeftEdge) {
      currentPosition -= 1;
      if (checkCollision()) {
        currentPosition += 1;
      }
    }
    draw();
  }

  function moveRight() {
    if (isPaused || isGameOver) return;
    
    undraw();
    const isAtRightEdge = tetriminos[currentTetrimino][currentRotation].some(index => {
      const position = currentPosition + index;
      return position % 10 === 9 || 
        (cells[position + 1]?.style.backgroundColor !== '' && 
         !tetriminos[currentTetrimino][currentRotation].includes(index + 1));
    });
    
    if (!isAtRightEdge) {
      currentPosition += 1;
      if (checkCollision()) {
        currentPosition -= 1;
      }
    }
    draw();
  }

  function rotate() {
    if (isPaused || isGameOver) return;
    undraw();
    const previousRotation = currentRotation;
    currentRotation = (currentRotation + 1) % tetriminos[currentTetrimino].length;
    
    // Wall kick
    if (checkCollision()) {
      // Try moving left
      currentPosition -= 1;
      if (checkCollision()) {
        // Try moving right
        currentPosition += 2;
        if (checkCollision()) {
          // If still colliding, revert rotation
          currentPosition -= 1;
          currentRotation = previousRotation;
        }
      }
    }
    draw();
    sounds.rotate.play();
  }

  function hardDrop() {
    if (isPaused || isGameOver) return;
    undraw();
    while (!checkCollision()) {
      currentPosition += 10;
    }
    currentPosition -= 10;
    draw();
    sounds.drop.play();
    freeze();
  }

  function checkCollision() {
    return tetriminos[currentTetrimino][currentRotation].some(index => {
      const nextPos = currentPosition + index;
      return (
        nextPos >= 200 ||  // Bottom boundary
        nextPos % 10 === 9 && index % 10 === 0 || // Right boundary
        nextPos % 10 === 0 && index % 10 === 9 || // Left boundary
        cells[nextPos].style.backgroundColor !== '' // Occupied cell
      );
    });
  }

  function freeze() {
    const collision = tetriminos[currentTetrimino][currentRotation].some(index => {
      const position = currentPosition + index;
  
      // Check if the position is at the bottom or on top of another piece
      return position + 10 >= 200 || cells[position + 10]?.style.backgroundColor !== '';
    });
  
    if (collision) {
      tetriminos[currentTetrimino][currentRotation].forEach(index => {
        const position = currentPosition + index;
        if (position >= 0 && position < 200) {
          cells[position].style.backgroundColor = colors[currentTetrimino];
        }
      });
  
      clearLines();
      spawnTetrimino();
    }
  }

  function clearLines() {
    let linesCleared = 0;
    
    for (let row = 19; row >= 0; row--) {
      const startIndex = row * 10;
      const line = cells.slice(startIndex, startIndex + 10);
      
      if (line.every(cell => cell.style.backgroundColor !== '')) {
        // Clear the line
        line.forEach(cell => cell.style.backgroundColor = '');
        
        // Move all lines above down
        for (let y = row; y > 0; y--) {
          for (let x = 0; x < 10; x++) {
            const currentIndex = y * 10 + x;
            const aboveIndex = (y - 1) * 10 + x;
            cells[currentIndex].style.backgroundColor = cells[aboveIndex].style.backgroundColor;
          }
        }
        
        // Clear top line
        for (let x = 0; x < 10; x++) {
          cells[x].style.backgroundColor = '';
        }
        
        linesCleared++;
        row++; // Check the same row again after moving lines down
      }
    }
    
    if (linesCleared > 0) {
      sounds.clear.play();
      updateScoreWithLines(linesCleared);
    }
  }

  function updateScoreWithLines(clearedLines) {
    // Score calculation based on number of lines cleared
    const points = {
      1: 100,
      2: 300,
      3: 500,
      4: 800
    };
    
    score += points[clearedLines] * level;
    lines += clearedLines;
    level = Math.floor(lines / 10) + 1;
    
    // Update speed based on level
    speed = Math.max(100, 1000 - (level - 1) * 100);
    if (timerId) {
      clearInterval(timerId);
      timerId = setInterval(moveDown, speed);
    }
    
    updateScore();
  }

  function updateScore() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
    linesElement.textContent = lines;
  }

  // Event listeners
  document.addEventListener('keydown', (event) => {
    // Prevent default scrolling behavior for arrow keys and space
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
      event.preventDefault();
    }
    
    if (isGameOver) return;
    
    switch (event.key) {
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowUp':
        rotate();
        break;
      case ' ':
        hardDrop();
        break;
      case 'p':
      case 'P':
        pauseGame();
        break;
    }
  });

  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    startGame();
  });
  pauseButton.addEventListener('click', pauseGame);
  
  // Initialize button states
  pauseButton.disabled = true;

  // Initialize game grid
  initializeGrids();
});