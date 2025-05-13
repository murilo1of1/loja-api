import jwt from 'jsonwebtoken';

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send({ message: 'Token não fornecido' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).send({ message: 'Token inválido' });
      }

      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = decoded; 

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).send({ message: 'Acesso negado' });
      }

      next(); 
    } catch (error) {
      return res.status(401).send(error.message);
    }
  };
};

export default authMiddleware;