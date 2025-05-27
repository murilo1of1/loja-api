import orderProductController from "../controllers/orderProductController.js";

export default (app) => { 
    app.get('/order-product', orderProductController.get);
    app.get('/order-product/:orderId', orderProductController.get);
}