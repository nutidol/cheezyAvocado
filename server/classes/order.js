require('../global');
const { pool } = require('../config/config');

class Order {

    constructor(orderID, departmentName, roomNumber) {
        this.orderID = orderID;
        this.departmentName = departmentName;
        this.roomNumber = roomNumber;
        this.status = orderStatus.PENDING;
    }

    updateStatus(status) {
        console.log(status);
        this.status = status;
        let message = {
            'orderID': this.orderID,
            'status': status
        }
        client.publish('orderStatus',JSON.stringify(message));
        const query = 'UPDATE "order" SET "status" = \''+ status +'\' WHERE "order"."orderID" = \''+ this.orderID +'\'';
        pool.query(query,(error,result)=>{
            if(error){
                throw error;
            }
            console.log('the order status has been updated to '+ status +' in the database');
        });
        client.publish('frontend/updateKitchenOrder','there is a new kitchen order');
        client.publish('frontend/updateAmenityOrder','there is a new amenity order'); 
    }
}

module.exports = Order