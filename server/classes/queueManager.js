class QueueManager {
    constructor(avocabot) {
        this.orderQueue = [];
        this.currentOrder;
        this.avocabot = avocabot;
    }

    /**
    * This method adds avocabot commands to the queue. It should be called when the staff clicks "call avocabot".
    * @param {Order} order 
    * @returns {none} 
    */
    addDeliveryOrder(order) {
        if(this.currentOrder == undefined || this.currentOrder == null) {
            this.currentOrder = order;
            this.processCurrentOrder();
        }else {
            this.orderQueue.push(order);
        }
    }


}