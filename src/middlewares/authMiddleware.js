import jwt from 'jsonwebtoken';

export const adminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;

    if (decoded.role !== 'admin') {
      return res.status(403).send({ message: 'Acesso negado. Apenas administradores podem acessar.' });
    }

    next();
  } catch (error) {
    return res.status(401).send(error.message);
  }
};

export const userMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;

    if (decoded.role !== 'usuario') {
      return res.status(403).send({ message: 'Acesso negado. Apenas usuários podem acessar.' });
    }

    next();
  } catch (error) {
    return res.status(401).send(error.message);
  }
};

export const deliveryMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;

    if (decoded.role !== 'entregador') {
      return res.status(403).send({ message: 'Acesso negado. Apenas entregadores podem acessar.' });
    }

    next();
  } catch (error) {
    return res.status(401).send(error.message);
  }
};

export default { adminMiddleware, userMiddleware, deliveryMiddleware };