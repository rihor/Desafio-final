import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    // evitar problemas com senhas numéricas
    req.password = String(req.password);

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    // caso o usuário não tenha sido encontrado
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // caso a senha não bata
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, avatar } = user;
    return res.json({
      user: { id, name, email, avatar },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
