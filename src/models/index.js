import Category from "./CategoryModel.js";
import Cupom from "./CupomModel.js";
import Product from "./ProductModel.js";
import User from "./UserModel.js";

(async () => {
  try {
    await Category.sync({ alter: true });
    await Cupom.sync({ alter: true });
    await Product.sync({ alter: true });
    await User.sync({ alter: true });

    console.log("Tabelas sincronizadas com sucesso!");
  } catch (error) {
    console.error("Erro ao sincronizar tabelas:", error.message);
  }
})();