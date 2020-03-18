const GraphNode = require('./classes/graph/graphNode');
const Graph = require('./classes/graph/graph');

let A = new GraphNode('A',[{'B':'S30'}]);
let B = new GraphNode('B',[{'A':'N30'},{'C':'S35'}])

hotelMap = new Graph([A,B])