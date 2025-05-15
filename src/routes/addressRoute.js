import addressController from "../controllers/addressController.js";
import { userMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";

export default (app) => {
    app.get('/address', adminMiddleware, addressController.get); 
    app.get('/address/:id', userMiddleware, addressController.get); 
    app.post('/address', userMiddleware ,addressController.persist); 
    app.patch('/address/:id', userMiddleware, addressController.persist); 
    app.delete('/address/:id', adminMiddleware, addressController.destroy);
};