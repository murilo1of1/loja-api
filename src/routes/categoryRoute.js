import categoryController from "../controllers/categoryController.js";

export default (app) => { 
    app.get('/category', categoryController.get);
    app.get('/category/:id', categoryController.get);
    app.post('/category', categoryController.persist);
    app.patch('/category/:id', categoryController.persist);
    app.delete('/category/:id', categoryController.destroy);
}