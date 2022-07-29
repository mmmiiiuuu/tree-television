// Wave Function Collapse (tiled model)
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/171-wave-function-collapse
// https://youtu.be/0zac-cDzJwA

// Code from Challenge: https://editor.p5js.org/codingtrain/sketches/pLW3_PNDM
// Corrected and Expanded: https://github.com/CodingTrain/Wave-Function-Collapse

// Array for tiles and tile images
const tiles = [];
const tileImages = [];

// Current state of the grid
let grid = [];

// Width and height of each cell
const DIM = 17;

// Load images
function preload() {
  const path = "ASCII";
  for (let i = 0; i < 10; i++) {
    tileImages[i] = loadImage(`${path}/${i}.png`);
  }
}

function setup() {

  var canvas3 = createCanvas(windowWidth/.0005/windowHeight/PI+HALF_PI,windowHeight/.001/windowWidth/PI+HALF_PI);

  canvas3.parent('sketch-holder');
  canvas3.style('z-index', '-1');
fps = 429;
  // Create and label the tiles
  tiles[0] = new Tile(tileImages[0], ["ABA", "AAA", "AAA", "ABA"]);
  tiles[1] = new Tile(tileImages[1], ["BBB", "BBB", "BBB", "BBB"]);
  tiles[2] = new Tile(tileImages[2], ["ACA", "BCB", "BCB", "ACA"]);
  tiles[3] = new Tile(tileImages[3], ["BBB", "BDB", "BBB", "BDB"]);
  tiles[4] = new Tile(tileImages[4], ["ADA", "BCB", "BDB", "ADA"]);
  tiles[5] = new Tile(tileImages[5], ["ADA", "BDB", "BCB", "ADA"]);
  tiles[6] = new Tile(tileImages[6], ["BBB", "BCB", "BCB", "BCB"]);
  tiles[7] = new Tile(tileImages[7], ["ADA", "BBB", "BBB", "ADA"]);
  tiles[8] = new Tile(tileImages[8], ["BDB", "BBB", "BCB", "BBB"]);
  tiles[9] = new Tile(tileImages[9], ["ABA", "AAA", "AAA", "AAA"]);
  //tiles[10] = new Tile(tileImages[10], ["BCB", "BCB", "BCB", "BCB"]);
  //tiles[11] = new Tile(tileImages[11], ["BCB", "BCB", "BBB", "BBB"]);
  //tiles[12] = new Tile(tileImages[12], ["BBB", "BCB", "BBB", "BCB"]);
  for (let i = 0; i < 14; i++) {
    for (let j = -1; j < 4; j++) {
      tiles.push(tiles[i].rotate(j));
    }
  }
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    tile.analyze(tiles);
  }

  startOver();
}

function startOver() {
  // Create cell for each spot on the grid
  for (let i = 0; i < DIM * DIM; i++) {
    grid[i] = new Cell(tiles.length);
  }
}

function checkValid(arr, valid) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let element = arr[i];
    if (!valid.includes(element)) {
      arr.splice(i, 1);
    }
  }
}


function draw() {

let sqeeth= fxrand()- sqrt(frameCount)^2;
let squath= 0.000000000000000000000000000000001 - sqeeth;
  background(33,33,33,squath);

  // Draw the grid

  let quar = sqrt(89);
  const w = width++/ DIM;
  const h = height++ / DIM;
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let cell = grid[i + j * DIM];
      if (cell.collapsed) {
        let index = cell.options[0];
        image(tiles[index].img, i * w, j * h, w, h);
      } else {

        let gin = w/89*fxrand()^2;
        let jin = h/89*fxrand()^2;
        fill(0.089,0.089,0.089,0.0089,0);
        stroke(33,33,33,0);
        rect(i * w, j * h, w, h);
        translate(gin/jin,jin/gin,0,0)
        rotate(i ++)
      }
    }
  }
  

  // Make a copy of grid
  let gridCopy = grid.slice();
  // Remove any collapsed cells
  gridCopy = gridCopy.filter((a) => !a.collapsed);
  
  // The algorithm has completed if everything is collapsed
  if (grid.length == 0) {
    return;
  }
  
  // Pick a cell with least entropy
  
  // Sort by entropy
  gridCopy.sort((a, b) => {
    return a.options.length - b.options.length;
  });

  // Keep only the lowest entropy cells
  let len = gridCopy[0].options.length;
  let stopIndex = 0;
  for (let i = 1; i < gridCopy.length; i++) {
    if (gridCopy[i].options.length > len) {
      stopIndex = i;
      break;
    }
  }
  if (stopIndex > 0) gridCopy.splice(stopIndex);
  
  
  // Collapse a cell
  const cell = random(gridCopy);
  cell.collapsed = true;
  const pick = random(cell.options);
  if (pick === undefined) {
    startOver();
    return;
  }
  cell.options = [pick];
  
  // Calculate entropy
  const nextGrid = [];
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let index = i + j * DIM;
      if (grid[index].collapsed) {
        nextGrid[index] = grid[index];
      } else {
        let options = new Array(tiles.length).fill(0).map((x, i) => i);
        // Look up
        if (j > 0) {
          let up = grid[i + (j - 1) * DIM];
          let validOptions = [];
          for (let option of up.options) {
            let valid = tiles[option].down;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look right
        if (i < DIM - 1) {
          let right = grid[i + 1 + j * DIM];
          let validOptions = [];
          for (let option of right.options) {
            let valid = tiles[option].left;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look down
        if (j < DIM - 1) {
          let down = grid[i + (j + 1) * DIM];
          let validOptions = [];
          for (let option of down.options) {
            let valid = tiles[option].up;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look left
        if (i > 0) {
          let left = grid[i - 1 + j * DIM];
          let validOptions = [];
          for (let option of left.options) {
            let valid = tiles[option].right;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }

        // I could immediately collapse if only one option left?
        nextGrid[index] = new Cell(options);
      }
    }
  }

  grid = nextGrid;
}
