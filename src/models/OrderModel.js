import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import User from "./UserModel.js";
import Address from "./AddressModel.js";
import Payment from "./PaymentModel.js";
import Cupom from "./CupomModel.js";

const Order = sequelize.define(
  'orders',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        allowNull: true
    },
    total: {
      type: DataTypes.DECIMAL(15, 2),
    },
    totalDiscount: {
      field: 'total_discount',
      type: DataTypes.DECIMAL(15, 2),
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

Order.belongsTo(User, {
  as: 'costumer',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
    name: 'idUserCostumer',
    allowNull: false,
    field: 'id_user_costumer',
  }
});

Order.belongsTo(User, {
    as: 'delivery',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    allowNull: true,
    foreignKey: {
      name: 'idUserDelivery',
      field: 'id_user_delivery',
    }
});

Order.belongsTo(Address, {
    as: 'address',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    allowNull: true,
    foreignKey: {
      name: 'idAddress',
      field: 'id_address',
    }
});

Order.belongsTo(Payment, {
    as: 'payment',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
      name: 'idPayment',
      allowNull: false,
      field: 'id_payment',
    }
});

Order.belongsTo(Cupom, {
    as: 'cupom',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    allowNull: true,
    foreignKey: {
      name: 'idCupom',
      field: 'id_Cupom',
    }
});

export default Order;