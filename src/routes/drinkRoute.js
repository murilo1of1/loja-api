import drinkController from "../controllers/drinkController.js";

export default (app) => { 
    app.get('/drink', drinkController.get);
    app.get('/drink/:id', drinkController.get);
    app.post('/drink', drinkController.persist);
    app.patch('/drink/:id', drinkController.persist);
    app.delete('/drink/:id', drinkController.destroy);
}