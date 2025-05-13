import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

export default (app) => {  
    app.get('/users/token', authMiddleware(), userController.getDataByToken); 
    app.get('/users', authMiddleware(['admin']), userController.get); 
    app.get('/users/:id', authMiddleware(['admin', 'usuario']), userController.get);
    app.post('/users', authMiddleware(['admin']), userController.persist); 
    app.patch('/users/:id', authMiddleware(['admin', 'usuario']), userController.persist); 
    app.delete('/users/:id', authMiddleware(['admin']), userController.destroy);
    app.post('/users/login', userController.login); 
    app.post('/users/forgot-password', userController.forgotPassword); 
    app.post('/users/reset-password', userController.resetPassword); 
};