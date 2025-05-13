import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Order from "./OrderModel.js";
import Product from "./ProductModel.js";

const OrderProduct = sequelize.define(
  'order_products',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    priceProducts: {
      field: 'price_products',
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

OrderProduct.belongsTo(Order, {
  as: 'order',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
    name: 'idOrder',
    allowNull: false,
    field: 'id_order',
  }
});

OrderProduct.belongsTo(Product, {
    as: 'product',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
      name: 'idProduct',
      allowNull: true,
      field: 'id_product',
    }
});

export default OrderProduct;