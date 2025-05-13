import Order from '../models/OrderModel.js';
import OrderProduct from '../models/OrderProductModel.js';
import Product from '../models/ProductModel.js';

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      const response = await Order.findAll({
        order: [['id', 'desc']],
      });
      
      return res.status(200).send({
        message: 'Dados encontrados',
        data: response,
      });
    }

    const response = await Order.findOne({
      where: {
        id: id
      }
    });

    if (!response) {
      return res.status(404).send('nao achou')
    }

    return res.status(200).send({
      message: 'Dados encontrados',
      data: response,
    })
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

const create = async (corpo) => {
  try {
      const {
          status,
          total,
          totalDiscount,
          idUserCostumer,
          idUserDelivery,
          idAddress,
          idCupom,
          idPayment,
          products 
      } = corpo;

      const order = await Order.create({
          status,
          total,
          totalDiscount,
          idUserCostumer,
          idUserDelivery,
          idAddress,
          idCupom,
          idPayment
      });

      if (products && products.length > 0) {
          const orderProducts = [];

          for (const product of products) {
              const { idProduct, quantity } = product;

              const productData = await Product.findOne({ where: { id: idProduct } });

              if (!productData) {
                  throw new Error(`Produto com ID ${idProduct} não encontrado`);
              }

              orderProducts.push({
                  idOrder: order.id,
                  idProduct,
                  quantity,
                  priceProducts: productData.price 
              });
          }

          await OrderProduct.bulkCreate(orderProducts);
      }

      return order;
  } catch (error) {
      throw new Error(error.message);
  }
};

const update = async (corpo, id) => {
  try {
      const {
          status,
          total,
          totalDiscount,
          idUserCostumer,
          idUserDelivery,
          idAddress,
          idCupom,
          idPayment,
          products 
      } = corpo;

      const order = await Order.findOne({ where: { id } });

      if (!order) {
          throw new Error('Pedido não encontrado');
      }

      if (status !== undefined) order.status = status;
      if (total !== undefined) order.total = total;
      if (totalDiscount !== undefined) order.totalDiscount = totalDiscount;
      if (idUserCostumer !== undefined) order.idUserCostumer = idUserCostumer;
      if (idUserDelivery !== undefined) order.idUserDelivery = idUserDelivery;
      if (idAddress !== undefined) order.idAddress = idAddress;
      if (idCupom !== undefined) order.idCupom = idCupom;
      if (idPayment !== undefined) order.idPayment = idPayment;

      await order.save();

      if (products && products.length > 0) {
          const existingProducts = await OrderProduct.findAll({ where: { idOrder: order.id } });

          const productsMap = products.reduce((map, product) => {
              map[product.idProduct] = product;
              return map;
          }, {});

          for (const product of products) {
              const { idProduct, quantity } = product;

              const productData = await Product.findOne({ where: { id: idProduct } });

              if (!productData) {
                  throw new Error(`Produto com ID ${idProduct} não encontrado`);
              }

              const existingProduct = existingProducts.find(p => p.idProduct === idProduct);

              if (existingProduct) {
                  existingProduct.quantity = quantity;
                  existingProduct.priceProducts = productData.price;
                  await existingProduct.save();
              } else {
                  await OrderProduct.create({
                      idOrder: order.id,
                      idProduct,
                      quantity,
                      priceProducts: productData.price
                  });
              }
          }

          for (const existingProduct of existingProducts) {
              if (!productsMap[existingProduct.idProduct]) {
                  await existingProduct.destroy();
              }
          }
      }
      return order;
  } catch (error) {
      throw new Error(error.message);
  }
};

const persist = async (req, res) => {
    try {
      const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
  
      if (!id) {
        const response = await create(req.body);
        return res.status(201).send({
          message: 'criado com sucesso!',
          data: response
        });
      }
  
      const response = await update(req.body, id);
      return res.status(201).send({
        message: 'atualizado com sucesso!',
        data: response
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message
      });
    }
}

const destroy = async (req, res) => {
  try {
      const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
      if (!id) {
          return res.status(400).send('Informe o ID do pedido');
      }

      const order = await Order.findOne({ where: { id } });

      if (!order) {
          return res.status(404).send('Pedido não encontrado');
      }

      await OrderProduct.destroy({ where: { idOrder: order.id } });

      await order.destroy();

      return res.status(200).send({
          message: 'Pedido e produtos associados excluídos com sucesso',
          data: order
      });
  } catch (error) {
      return res.status(500).send({
          message: error.message
      });
  }
};

export default { get, persist, destroy };