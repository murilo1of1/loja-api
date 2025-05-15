import orderController from "../controllers/orderController.js";

export default (app) => { 
    app.get('/order', orderController.get);
    app.get('/order/:id', orderController.get);
    app.post('/order', orderController.persist);
    app.patch('/order/:id', orderController.persist);
    app.delete('/order/:id', orderController.destroy);
    app.post('/order/accept/:id', orderController.acceptOrder);
    app.post('/order/complete/:id', orderController.completeOrder);
    app.post('/order/cancel/:id', orderController.cancelOrder);
    app.get('/order/pending', orderController.getPendingOrders);
    app.get('/order/customer', orderController.getCustomerOrders);
}