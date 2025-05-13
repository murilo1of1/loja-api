import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import User from "./UserModel.js";

const Address = sequelize.define(
  'addresses',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    zipCode: {
      field: 'zip_code',    
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },      
    street: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },  
    number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

Address.belongsTo(User, {
  as: 'user',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
    name: 'idUser',
    allowNull: false,
    field: 'id_user',
  }
});

export default Address;