// Problem: Finding the Shortest Path in a Weighted Graph
// You need to create a JavaScript program that finds the shortest path between two nodes in a directed weighted graph. 
// You can represent the graph as an adjacency list. Your function should return the shortest path and the sum of the edge weights in that path.
// For example, given the following representation of the graph:
const graph = {
  A: [{ node: 'B', weight: 2 }, { node: 'C', weight: 4 }],
  B: [{ node: 'D', weight: 7 }],
  C: [{ node: 'D', weight: 1 }],
  D: []
};

// You should find the shortest path using the Dijkstra's algorithm or a similar approach.
// If there are multiple paths with the same minimum length, you can return any of them.

function findShortestPath(graph, startNode, endNode) {
  // Your implementation here
}

console.log(findShortestPath(graph, 'A', 'D'));
// Should return { path: ['A', 'C', 'D'], sumOfWeights: 5 }
