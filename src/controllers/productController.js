import Product from '../models/ProductModel.js';
import path from 'path';
import fs from 'fs';

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      const response = await Product.findAll({
        order: [['id', 'desc']],
      });
      
      return res.status(200).send({
        message: 'Dados encontrados',
        data: response,
      });
    }

    const response = await Product.findOne({
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
}

const create = async (corpo) => {
  try {
    const {
        name,
        price,
        description,
        image,
        idCategory
    } = corpo

    const response = await Product.create({
        name,
        price,
        description,
        image,
        idCategory
    });

    return response;
  } catch (error) {
    throw new Error(error.message)
  }
}

const update = async (corpo, id) => {
  try {
    const response = await Product.findOne({
      where: {
        id
      }
    });

    if (!response) {
      throw new Error('Nao achou');
    }
    
    Object.keys(corpo).forEach((item) => response[item] = corpo[item]);
    await response.save();

    return response;
  } catch (error) {
    throw new Error(error.message)
  }
}

const persist = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      const data = { ...req.body, image: null };
      const response = await create(data);

      if (req.files && req.files.image) {
        const image = req.files.image;
        const ext = path.extname(image.name);
        const uploadDir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileName = `product_${response.id}${ext}`;
        const imagePath = `${fileName}`;
        await image.mv(path.join(uploadDir, fileName));

        response.image = imagePath;
        await response.save();
      }

      return res.status(201).send({
        message: 'criado com sucesso!',
        data: response
      });
    }

    let imagePath = null;
    if (req.files && req.files.image) {
      const image = req.files.image;
      const ext = path.extname(image.name);
      const uploadDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `product_${id}${ext}`;
      imagePath = `${fileName}`;
      await image.mv(path.join(uploadDir, fileName));
    }

    const data = {
      ...req.body,
      ...(imagePath && { image: imagePath })
    };
    const response = await update(data, id);
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
      return res.status(400).send('informa ai paezao')
    }

    const response = await Product.findOne({
      where: {
        id
      }
    });

    if (!response) {
      return res.status(404).send('nao achou');
    }

    await response.destroy();

    return res.status(200).send({
      message: 'registro excluido',
      data: response
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}

export default { get, persist, destroy };