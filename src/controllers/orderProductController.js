import OrderProduct from '../models/OrderProductModel.js';
import Product from '../models/ProductModel.js';
import Drink from '../models/DrinkModel.js';

const get = async (req, res) => {
    try {
        const idOrder = req.params.orderId ? req.params.orderId.toString().replace(/\D/g, '') : null;

        const includeOptions = [
            {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'description', 'price']
            },
            {
                model: Drink,
                as: 'drink',
                attributes: ['id', 'name', 'price']
            }
        ];
        let response;
        if (idOrder) {
            response = await OrderProduct.findAll({
                where: {
                    idOrder: idOrder
                },
                include: includeOptions
            });

            if (!response || response.length === 0) {
                return res.status(404).send({
                    message: 'Nenhum produto encontrado para este pedido.'
                });
            }
        } else {
            response = await OrderProduct.findAll({
                include: includeOptions
            });
        }

        return res.status(200).send({
            message: 'Dados encontrados',
            data: response,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: error.message
        });
    }
};

export default { get };