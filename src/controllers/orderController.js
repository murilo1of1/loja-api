import Order from '../models/OrderModel.js';
import OrderProduct from '../models/OrderProductModel.js';
import Product from '../models/ProductModel.js';
import Drink from '../models/DrinkModel.js';
import Cupom from '../models/CupomModel.js';

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
            idUserCostumer,
            idUserDelivery,
            idAddress,
            idCupom, 
            idPayment,
            products,
            drinks
        } = corpo;

        let calculatedTotal = 0;
        const orderItemsToCreate = [];
        let finalTotalDiscount = 0;

        if (products && products.length > 0) {
            for (const productItem of products) {
                const { idProduct, quantity } = productItem;

                if (!idProduct || !quantity || quantity <= 0) {
                    throw new Error('Dados inválidos para produto: idProduct e quantity são obrigatórios e quantity deve ser maior que 0.');
                }

                const productData = await Product.findOne({ where: { id: idProduct } });

                if (!productData) {
                    throw new Error(`Produto com ID ${idProduct} não encontrado`);
                }

                const itemPrice = parseFloat(productData.price);
                calculatedTotal += itemPrice * quantity;

                orderItemsToCreate.push({
                    idProduct: idProduct,
                    quantity: quantity,
                    priceProducts: itemPrice,
                    idDrink: null
                });
            }
        }

        if (drinks && drinks.length > 0) {
            for (const drinkItem of drinks) {
                const { idDrink, quantity } = drinkItem;

                if (!idDrink || !quantity || quantity <= 0) {
                    throw new Error('Dados inválidos para bebida: idDrink e quantity são obrigatórios e quantity deve ser maior que 0.');
                }

                const drinkData = await Drink.findOne({ where: { id: idDrink } });

                if (!drinkData) {
                    throw new Error(`Bebida com ID ${idDrink} não encontrada`);
                }

                const itemPrice = parseFloat(drinkData.price);
                calculatedTotal += itemPrice * quantity;

                orderItemsToCreate.push({
                    idProduct: null,
                    quantity: quantity,
                    priceProducts: itemPrice,
                    idDrink: idDrink
                });
            }
        }

        if (idCupom) {
            const cupomData = await Cupom.findOne({ where: { id: idCupom } });

            if (!cupomData) {
                throw new Error(`Cupom com ID ${idCupom} não encontrado.`);
            }
            
            const discountValue = parseFloat(cupomData.value); 
            
            if (!isNaN(discountValue) && discountValue > 0) {
                finalTotalDiscount = discountValue;
                calculatedTotal -= finalTotalDiscount;
                if (calculatedTotal < 0) calculatedTotal = 0;
            }
        }

        const order = await Order.create({
            status,
            total: calculatedTotal,
            totalDiscount: finalTotalDiscount, 
            idUserCostumer,
            idUserDelivery,
            idAddress,
            idCupom,
            idPayment,
            idDrink: null
        });

        if (orderItemsToCreate.length > 0) {
            const finalOrderItems = orderItemsToCreate.map(item => ({
                ...item,
                idOrder: order.id
            }));
            await OrderProduct.bulkCreate(finalOrderItems);
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
          products,
          idDrink
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
      if (idDrink !== undefined) order.idDrink = idDrink;

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
                      idDrink,
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

const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { idUserDelivery } = req.body; // ID do entregador

    const order = await Order.findOne({ where: { id } });
    if (!order) {
      return res.status(404).send({ message: 'Pedido não encontrado' });
    }

    if (order.status !== 'pending') {
      return res.status(400).send({ message: 'Pedido não está pendente' });
    }

    order.status = 'in_delivery';
    order.idUserDelivery = idUserDelivery;
    await order.save();

    return res.status(200).send({ message: 'Pedido aceito com sucesso', data: order });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const completeOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ where: { id } });
    if (!order) {
      return res.status(404).send({ message: 'Pedido não encontrado' });
    }

    if (order.status !== 'in_delivery') {
      return res.status(400).send({ message: 'Pedido não está em entrega' });
    }

    order.status = 'delivered';
    await order.save();

    return res.status(200).send({ message: 'Entrega confirmada com sucesso', data: order });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ where: { id } });
    if (!order) {
      return res.status(404).send({ message: 'Pedido não encontrado' });
    }

    if (order.status !== 'pending') {
      return res.status(400).send({ message: 'Apenas pedidos pendentes podem ser cancelados' });
    }

    order.status = 'cancelled';
    await order.save();

    return res.status(200).send({ message: 'Pedido cancelado com sucesso', data: order });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { status: 'pending' } });
    return res.status(200).send({ message: 'Pedidos pendentes encontrados', data: orders });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const { idUserCostumer } = req.user; 

    const orders = await Order.findAll({ where: { idUserCostumer } });
    return res.status(200).send({ message: 'Histórico de pedidos encontrado', data: orders });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export default { get, persist, destroy, acceptOrder, completeOrder, cancelOrder, getPendingOrders, getCustomerOrders }; 