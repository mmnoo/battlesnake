// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com
const STARVING_THRESHOLD = 20
import runServer from './server.js';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "SnakeySnek_sparkgeo",       // TODO: Your Battlesnake Username
    color: "#FF7F50", // TODO: Choose color
    head: "sand-worm",  // TODO: Choose head
    tail: "replit-notmark",  // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {

  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
    isMoveSafe.left = false;

  } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
    isMoveSafe.right = false;

  } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
    isMoveSafe.down = false;

  } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;

  if (myHead.x === 0) {
    isMoveSafe.left = false;
  }
  if (myHead.x === boardWidth - 1) {
    isMoveSafe.right = false;
  }
  if (myHead.y === 0) {
    isMoveSafe.down = false;
  }
  if (myHead.y === boardHeight - 1) {
    isMoveSafe.up = false;
  }

  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  const myBody = gameState.you.body;

  // Check if moving in each direction would hit our own body
  if (isMoveSafe.up) {
    const nextPosition = { x: myHead.x, y: myHead.y + 1 };
    if (myBody.some(segment => segment.x === nextPosition.x && segment.y === nextPosition.y)) {
      isMoveSafe.up = false;
    }
  }
  if (isMoveSafe.down) {
    const nextPosition = { x: myHead.x, y: myHead.y - 1 };
    if (myBody.some(segment => segment.x === nextPosition.x && segment.y === nextPosition.y)) {
      isMoveSafe.down = false;
    }
  }
  if (isMoveSafe.left) {
    const nextPosition = { x: myHead.x - 1, y: myHead.y };
    if (myBody.some(segment => segment.x === nextPosition.x && segment.y === nextPosition.y)) {
      isMoveSafe.left = false;
    }
  }
  if (isMoveSafe.right) {
    const nextPosition = { x: myHead.x + 1, y: myHead.y };
    if (myBody.some(segment => segment.x === nextPosition.x && segment.y === nextPosition.y)) {
      isMoveSafe.right = false;
    }
  }

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  const opponents = gameState.board.snakes;

  // Check if moving in each direction would hit any opponent snake
  if (isMoveSafe.up) {
    const nextPosition = { x: myHead.x, y: myHead.y + 1 };
    for (const opponent of opponents) {
      if (opponent.body.some(segment => segment.x === nextPosition.x && segment.y === nextPosition.y)) {
        isMoveSafe.up = false;
        break;
      }
    }
  }
  if (isMoveSafe.down) {
    const nextPosition = { x: myHead.x, y: myHead.y - 1 };
    for (const opponent of opponents) {
      if (opponent.body.some(segment => segment.x === nextPosition.x && segment.y === nextPosition.y)) {
        isMoveSafe.down = false;
        break;
      }
    }
  }
  if (isMoveSafe.left) {
    const nextPosition = { x: myHead.x - 1, y: myHead.y };
    for (const opponent of opponents) {
      if (opponent.body.some(segment => segment.x === nextPosition.x && segment.y === nextPosition.y)) {
        isMoveSafe.left = false;
        break;
      }
    }
  }
  if (isMoveSafe.right) {
    const nextPosition = { x: myHead.x + 1, y: myHead.y };
    for (const opponent of opponents) {
      if (opponent.body.some(segment => segment.x === nextPosition.x && segment.y === nextPosition.y)) {
        isMoveSafe.right = false;
        break;
      }
    }
  }

  // TODO: Avoid food when not starving to stay lean
  const myHealth = gameState.you.health;
  const food = gameState.board.food;

  if (myHealth > STARVING_THRESHOLD && food.length > 0) {
    // Mark positions with food as unsafe when not starving
    for (const foodItem of food) {
      if (myHead.x - 1 === foodItem.x && myHead.y === foodItem.y && isMoveSafe.left) {
        isMoveSafe.left = false;
        console.log(`Avoiding food at (${foodItem.x}, ${foodItem.y}) - not moving left`);
      }
      if (myHead.x + 1 === foodItem.x && myHead.y === foodItem.y && isMoveSafe.right) {
        isMoveSafe.right = false;
        console.log(`Avoiding food at (${foodItem.x}, ${foodItem.y}) - not moving right`);
      }
      if (myHead.x === foodItem.x && myHead.y - 1 === foodItem.y && isMoveSafe.down) {
        isMoveSafe.down = false;
        console.log(`Avoiding food at (${foodItem.x}, ${foodItem.y}) - not moving down`);
      }
      if (myHead.x === foodItem.x && myHead.y + 1 === foodItem.y && isMoveSafe.up) {
        isMoveSafe.up = false;
        console.log(`Avoiding food at (${foodItem.x}, ${foodItem.y}) - not moving up`);
      }
    }
  }

  // Are there any safe moves left?


  // TODO: Step 4 - Track moves that lead to food for prioritization
  let isFeedMove = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  if (food.length > 0) {
    // Find the closest food
    let closestFood = null;
    let shortestDistance = Infinity;

    for (const foodItem of food) {
      const distance = Math.abs(myHead.x - foodItem.x) + Math.abs(myHead.y - foodItem.y);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestFood = foodItem;
      }
    }

    if (closestFood) {
      // Mark which directions get us closer to the food
      if (closestFood.x > myHead.x && isMoveSafe.right) {
        isFeedMove.right = true;
      }
      if (closestFood.x < myHead.x && isMoveSafe.left) {
        isFeedMove.left = true;
      }
      if (closestFood.y > myHead.y && isMoveSafe.up) {
        isFeedMove.up = true;
      }
      if (closestFood.y < myHead.y && isMoveSafe.down) {
        isFeedMove.down = true;
      }
    }
  }

  // Prioritize moves: feed moves when starving, then safe moves with circling pattern
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  let nextMove = null;

  // Priority 1: If starving (health <= STARVING_THRESHOLD), prefer feed moves
  if (myHealth <= STARVING_THRESHOLD) {
    const feedMoves = Object.keys(isFeedMove).filter(key => isFeedMove[key] && isMoveSafe[key]);
    if (feedMoves.length > 0) {
      nextMove = feedMoves[Math.floor(Math.random() * feedMoves.length)];
      console.log(`MOVE ${gameState.turn}: ${nextMove} (seeking food - Health: ${myHealth})`);
      return { move: nextMove };
    }
  }

  // Priority 2: Circling pattern for minimal movement
  const moveHistory = gameState.you.body;
  let preferredMove = null;

  if (moveHistory.length >= 2) {
    const head = moveHistory[0];
    const neck = moveHistory[1];

    // Determine current direction
    let currentDirection = null;
    if (head.x > neck.x) currentDirection = 'right';
    else if (head.x < neck.x) currentDirection = 'left';
    else if (head.y > neck.y) currentDirection = 'up';
    else if (head.y < neck.y) currentDirection = 'down';

    // Define clockwise turn priority (creates tight circles)
    const turnPriority = {
      'up': ['up', 'right', 'down', 'left'],
      'right': ['right', 'down', 'left', 'up'],
      'down': ['down', 'left', 'up', 'right'],
      'left': ['left', 'up', 'right', 'down']
    };

    if (currentDirection && turnPriority[currentDirection]) {
      // Try moves in clockwise priority order
      for (const move of turnPriority[currentDirection]) {
        if (safeMoves.includes(move)) {
          preferredMove = move;
          break;
        }
      }
    }
  }

  // Priority 3: Fallback to first safe move
  nextMove = preferredMove || safeMoves[0];

  console.log(`MOVE ${gameState.turn}: ${nextMove} (circling pattern - Health: ${myHealth})`);
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
