// maze-generator.js

/**
 * Maze Generator using Depth-First Search with recursive backtracking
 * A pure JavaScript implementation that can be run with Node.js
 */

// Maze cell class
class Cell {
    constructor(row, col) {
      this.row = row;
      this.col = col;
      this.visited = false;
      this.walls = {
        top: true,
        right: true,
        bottom: true,
        left: true
      };
    }
  }
  
  class MazeGenerator {
    constructor(rows = 10, cols = 10) {
      this.rows = rows;
      this.cols = cols;
      this.grid = [];
      this.initializeGrid();
    }
  
    // Set up the grid with cells
    initializeGrid() {
      for (let r = 0; r < this.rows; r++) {
        let row = [];
        for (let c = 0; c < this.cols; c++) {
          row.push(new Cell(r, c));
        }
        this.grid.push(row);
      }
    }
  
    // Get a cell at specific coordinates
    getCell(row, col) {
      if (row < 0 || col < 0 || row >= this.rows || col >= this.cols) {
        return null;
      }
      return this.grid[row][col];
    }
  
    // Get unvisited neighbors of a cell
    getUnvisitedNeighbors(cell) {
      const neighbors = [];
      const { row, col } = cell;
      
      const top = this.getCell(row - 1, col);
      const right = this.getCell(row, col + 1);
      const bottom = this.getCell(row + 1, col);
      const left = this.getCell(row, col - 1);
      
      if (top && !top.visited) neighbors.push({ cell: top, direction: 'top' });
      if (right && !right.visited) neighbors.push({ cell: right, direction: 'right' });
      if (bottom && !bottom.visited) neighbors.push({ cell: bottom, direction: 'bottom' });
      if (left && !left.visited) neighbors.push({ cell: left, direction: 'left' });
      
      return neighbors;
    }
  
    // Remove walls between two cells
    removeWalls(current, next, direction) {
      switch (direction) {
        case 'top':
          current.walls.top = false;
          next.walls.bottom = false;
          break;
        case 'right':
          current.walls.right = false;
          next.walls.left = false;
          break;
        case 'bottom':
          current.walls.bottom = false;
          next.walls.top = false;
          break;
        case 'left':
          current.walls.left = false;
          next.walls.right = false;
          break;
      }
    }
  
    // Generate the maze using recursive backtracking
    generate() {
      // Start from a random cell
      const startRow = Math.floor(Math.random() * this.rows);
      const startCol = Math.floor(Math.random() * this.cols);
      const startCell = this.getCell(startRow, startCol);
      
      // Stack for backtracking
      const stack = [];
      
      // Mark the start cell as visited
      startCell.visited = true;
      stack.push(startCell);
      
      // Continue until all cells are visited
      while (stack.length > 0) {
        const currentCell = stack[stack.length - 1];
        const neighbors = this.getUnvisitedNeighbors(currentCell);
        
        if (neighbors.length === 0) {
          // No unvisited neighbors, backtrack
          stack.pop();
        } else {
          // Choose a random unvisited neighbor
          const randomIndex = Math.floor(Math.random() * neighbors.length);
          const { cell: nextCell, direction } = neighbors[randomIndex];
          
          // Remove walls between current cell and chosen neighbor
          this.removeWalls(currentCell, nextCell, direction);
          
          // Mark the neighbor as visited and add to stack
          nextCell.visited = true;
          stack.push(nextCell);
        }
      }
      
      return this.grid;
    }
  
    // Print the maze as ASCII art
    print() {
      let output = '';
      
      // Print the top border of the maze
      output += '+' + '---+'.repeat(this.cols) + '\n';
      
      for (let r = 0; r < this.rows; r++) {
        // Print left wall and cell contents
        let rowStr = '|';
        let bottomStr = '+';
        
        for (let c = 0; c < this.cols; c++) {
          const cell = this.getCell(r, c);
          
          // Cell content (could be modified to show a path or solution)
          rowStr += '   ';
          
          // Right wall
          rowStr += cell.walls.right ? '|' : ' ';
          
          // Bottom wall
          bottomStr += cell.walls.bottom ? '---' : '   ';
          bottomStr += '+';
        }
        
        output += rowStr + '\n' + bottomStr + '\n';
      }
      
      return output;
    }
  
    // Save the maze as a JSON file
    toJSON() {
      return JSON.stringify(this.grid, null, 2);
    }
  
    // Find a path from start to end using depth-first search
    solveDFS(startRow = 0, startCol = 0, endRow = this.rows - 1, endCol = this.cols - 1) {
      const startCell = this.getCell(startRow, startCol);
      const endCell = this.getCell(endRow, endCol);
      const visited = new Set();
      const path = [];
      
      // Helper function for DFS
      const dfs = (cell, end, currentPath) => {
        // Create a unique key for the cell
        const cellKey = `${cell.row},${cell.col}`;
        
        // Mark cell as visited
        visited.add(cellKey);
        
        // Add to current path
        currentPath.push(cell);
        
        // Check if we reached the end
        if (cell.row === end.row && cell.col === end.col) {
          return true;
        }
        
        // Get accessible neighbors (no wall between them)
        const neighbors = [];
        
        // Check top
        if (!cell.walls.top) {
          const neighbor = this.getCell(cell.row - 1, cell.col);
          const neighborKey = `${neighbor.row},${neighbor.col}`;
          if (!visited.has(neighborKey)) {
            neighbors.push(neighbor);
          }
        }
        
        // Check right
        if (!cell.walls.right) {
          const neighbor = this.getCell(cell.row, cell.col + 1);
          const neighborKey = `${neighbor.row},${neighbor.col}`;
          if (!visited.has(neighborKey)) {
            neighbors.push(neighbor);
          }
        }
        
        // Check bottom
        if (!cell.walls.bottom) {
          const neighbor = this.getCell(cell.row + 1, cell.col);
          const neighborKey = `${neighbor.row},${neighbor.col}`;
          if (!visited.has(neighborKey)) {
            neighbors.push(neighbor);
          }
        }
        
        // Check left
        if (!cell.walls.left) {
          const neighbor = this.getCell(cell.row, cell.col - 1);
          const neighborKey = `${neighbor.row},${neighbor.col}`;
          if (!visited.has(neighborKey)) {
            neighbors.push(neighbor);
          }
        }
        
        // Explore neighbors
        for (const neighbor of neighbors) {
          if (dfs(neighbor, end, currentPath)) {
            return true;
          }
        }
        
        // If no path found, backtrack
        currentPath.pop();
        return false;
      };
      
      // Find the path
      dfs(startCell, endCell, path);
      return path;
    }
  
    // Print maze with solution path
    printWithSolution(path) {
      // Create a set of path cells for quick lookup
      const pathSet = new Set();
      path.forEach(cell => {
        pathSet.add(`${cell.row},${cell.col}`);
      });
      
      let output = '';
      
      // Print the top border of the maze
      output += '+' + '---+'.repeat(this.cols) + '\n';
      
      for (let r = 0; r < this.rows; r++) {
        // Print left wall and cell contents
        let rowStr = '|';
        let bottomStr = '+';
        
        for (let c = 0; c < this.cols; c++) {
          const cell = this.getCell(r, c);
          const isOnPath = pathSet.has(`${r},${c}`);
          
          // Cell content
          rowStr += isOnPath ? ' * ' : '   ';
          
          // Right wall
          rowStr += cell.walls.right ? '|' : ' ';
          
          // Bottom wall
          bottomStr += cell.walls.bottom ? '---' : '   ';
          bottomStr += '+';
        }
        
        output += rowStr + '\n' + bottomStr + '\n';
      }
      
      return output;
    }
  }
  
  // Usage example
  function main() {
    console.log("Maze Generator\n");
    
    // Get command line arguments for size
    const args = process.argv.slice(2);
    const rows = parseInt(args[0]) || 10;
    const cols = parseInt(args[1]) || 10;
    
    console.log(`Generating a ${rows}x${cols} maze...\n`);
    
    // Create and generate the maze
    const maze = new MazeGenerator(rows, cols);
    maze.generate();
    
    // Print the maze
    console.log("Generated Maze:");
    console.log(maze.print());
    
    // Find a solution
    console.log("Finding solution path...\n");
    const solution = maze.solveDFS();
    
    // Print the maze with solution
    console.log("Maze with Solution Path (*):");
    console.log(maze.printWithSolution(solution));
    
    console.log(`Solution path length: ${solution.length} steps`);
  }
  
  // Run the application if executed directly
  if (require.main === module) {
    main();
  } else {
    // Export the MazeGenerator class for use as a module
    module.exports = { MazeGenerator, Cell };
  }