import userController from "../controllers/userController.js";

export default (app) => {  
    app.get('/users/token', userController.getDataByToken);
    app.get('/users', userController.get);
    app.get('/users/:id', userController.get);
    app.post('/users', userController.persist);
    app.patch('/users/:id', userController.persist);
    app.delete('/users/:id', userController.destroy);
    app.post('/users/login', userController.login);
    app.post('/users/forgot-password', userController.forgotPassword);
    app.post('/users/reset-password', userController.resetPassword);
}