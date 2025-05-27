import Drink from '../models/DrinkModel.js';
import path from 'path';
import fs from 'fs';

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      const response = await Drink.findAll({ 
        order: [['id', 'desc']],
      });
      
      return res.status(200).send({
        message: 'Dados de bebidas encontrados',
        data: response,
      });
    }

    const response = await Drink.findOne({ 
      where: {
        id: id
      }
    });

    if (!response) {
      return res.status(404).send('Bebida não encontrada'); 
    }

    return res.status(200).send({
      message: 'Dados de bebida encontrados', 
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

const create = async (corpo) => {
  try {
    const {
        name,
        price,
        image,
        
    } = corpo;

    const response = await Drink.create({ 
        name,
        price,
        image,
    });

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (corpo, id) => {
  try {
    const response = await Drink.findOne({ 
      where: {
        id
      }
    });

    if (!response) {
      throw new Error('Bebida não encontrada');
    }
    
    Object.keys(corpo).forEach((item) => response[item] = corpo[item]);
    await response.save();

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const persist = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

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
        const fileName = `drink_${response.id}${ext}`; 
        await image.mv(path.join(uploadDir, fileName));

        response.image = `${baseUrl}/${fileName}`;
        await response.save();
      }

      return res.status(201).send({
        message: 'Bebida criada com sucesso!',
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
      const fileName = `drink_${id}${ext}`; 
      await image.mv(path.join(uploadDir, fileName));
      imagePath = `${baseUrl}/${fileName}`;
    }

    const data = {
      ...req.body,
      ...(imagePath && { image: imagePath })
    };
    const response = await update(data, id);
    return res.status(201).send({
      message: 'Bebida atualizada com sucesso!', 
      data: response
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

const destroy = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    if (!id) {
      return res.status(400).send('Por favor, informe o ID da bebida.'); 
    }

    const response = await Drink.findOne({ 
      where: {
        id
      }
    });

    if (!response) {
      return res.status(404).send('Bebida não encontrada'); 
    }

    await response.destroy();

    return res.status(200).send({
      message: 'Bebida excluída com sucesso!', 
      data: response
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

export default { get, persist, destroy };