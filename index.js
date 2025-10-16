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

  // Are there any safe moves left?


  // TODO: Step 4 - Move towards food when starving, to regain health and survive longer
  const myHealth = gameState.you.health;
  const food = gameState.board.food;

  // Only seek food if health is low (30 or below) - keep short but not famished
  if (myHealth <= 20 && food.length > 0) {
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
      // Determine which direction gets us closer to the food
      const foodMoves = [];

      if (closestFood.x > myHead.x && isMoveSafe.right) {
        foodMoves.push('right');
      }
      if (closestFood.x < myHead.x && isMoveSafe.left) {
        foodMoves.push('left');
      }
      if (closestFood.y > myHead.y && isMoveSafe.up) {
        foodMoves.push('up');
      }
      if (closestFood.y < myHead.y && isMoveSafe.down) {
        foodMoves.push('down');
      }

      // If we have a safe move towards food, take it
      if (foodMoves.length > 0) {
        const foodMove = foodMoves[Math.floor(Math.random() * foodMoves.length)];
        console.log(`MOVE ${gameState.turn}: Seeking food at (${closestFood.x}, ${closestFood.y}) - ${foodMove} (Health: ${myHealth})`);
        return { move: foodMove };
      }
    }
  }

  // Choose a random move from the safe moves
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];


  console.log(`MOVE ${gameState.turn}: ${nextMove}`)
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
