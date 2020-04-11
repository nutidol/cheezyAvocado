class Graph {
    constructor(nodes) {
        this.nodes = nodes;
    }
    findPath(source, destination) {
        //The algorithm is brought from https://efficientcodeblog.wordpress.com/2017/12/13/bidirectional-search-two-end-bfs/
        let sVisited = [];
        let dVisited = [];
        let sParents = [];
        let dParents = [];
        let sQueue = [];
        let dQueue = [];
        let intersectNode;
        for(let i=0;i<this.nodes.length;i++) {
            sVisited[i] = false;
            tVisited[i] = false;
        }
        sQueue.push(source);
        sVisited = true;

        
    }
}

module.exports = Graph