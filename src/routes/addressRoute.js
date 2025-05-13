import addressController from "../controllers/addressController.js";

export default (app) => { 
    app.get('/address', addressController.get);
    app.get('/address/:id', addressController.get);
    app.post('/address', addressController.persist);
    app.patch('/address/:id', addressController.persist);
    app.delete('/address/:id', addressController.destroy);
}