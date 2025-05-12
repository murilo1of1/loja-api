import productRoute from "./productRoute.js";
import cupomRoute from "./cupomRoute.js";
import categoryRoute from "./categoryRoute.js";
import userRoute from "./userRoute.js";

function Routes(app) {
  productRoute(app);
  cupomRoute(app);
  categoryRoute(app); 
  userRoute(app);
}

export default Routes;