import productRoute from "./productRoute.js";
import cupomRoute from "./cupomRoute.js";
import categoryRoute from "./categoryRoute.js";
import userRoute from "./userRoute.js";
import addressRoute from "./addressRoute.js";
import paymentRoute from "./paymentRoute.js";
import orderRoute from "./orderRoute.js";

function Routes(app) {
  productRoute(app);
  cupomRoute(app);
  categoryRoute(app); 
  userRoute(app);
  addressRoute(app);
  paymentRoute(app);
  orderRoute(app);
}

export default Routes;