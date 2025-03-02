Overview
This project generates random mazes of customizable sizes, visualizes them in ASCII format, and can find a solution path from start to end. It's built with pure JavaScript and runs in Node.js 

Features

Generates random mazes of any size using DFS with backtracking
Visualizes mazes in the console using ASCII characters
Finds a solution path from start to finish
Displays the solution path overlaid on the maze
Works as both a standalone application and importable module

How It Works
Maze Generation Algorithm
The maze is generated using the Depth-First Search algorithm with recursive backtracking:

Start from a random cell and mark it as visited
While there are unvisited cells:

Get all unvisited neighbors of the current cell
If there are unvisited neighbors:

Choose a random unvisited neighbor
Remove the wall between the current cell and the chosen neighbor
Mark the neighbor as visited and move to it


If there are no unvisited neighbors, backtrack to the previous cell



Maze Solving
The maze is solved using a Depth-First Search to find a path from the start to the end:

Start from the beginning cell (default is top-left)
Explore possible paths by checking accessible neighbors (cells with no walls between them)
If a dead end is reached, backtrack and try another path
Continue until the end cell is found (default is bottom-right)
