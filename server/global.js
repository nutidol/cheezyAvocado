const GraphNode = require('./classes/graph/graphNode');
const Graph = require('./classes/graph/graph');

let A = new GraphNode('A',[{'B':'S30'}]);
let B = new GraphNode('B',[{'A':'N30'},{'C':'S35'}]);
let C = new GraphNode('C',[{'B':'N35'},{'D':'S35'},{'H':'E75'}]);

hotelMap = new Graph([A,B,C]);

node = {
    '101' : 'A',
    '102' : 'A',
    '103' : 'B',
    '104' : 'B',
    '105' : 'C',
    '106' : 'D',
    '107' : 'D',
    '108' : 'E',
    '109' : 'E',
    '110' : 'F',
    '111' : 'F',
    '112' : 'G',
    '113' : 'G',
    '114' : 'I',
    '115' : 'H',
    '116' : 'K',
    '117' : 'I',
    '119' : 'J',
    'Kitchen' : 'I',
    'Housekeeping' : 'J'
}