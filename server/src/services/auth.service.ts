import jwt from 'jsonwebtoken';

import { config } from '../config';

const secret =
  process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret';

const authService = () => {
  const issue = (payload: string | object | Buffer) =>
    jwt.sign(payload, secret, { expiresIn: config.jwtExpiry });

  const verify = (
    token: string,
    cb: jwt.VerifyCallback<string | jwt.JwtPayload>
  ) => jwt.verify(token, secret, {}, cb);

  const extract = (token: string) => jwt.decode(token);

  return {
    issue,
    verify,
    extract,
  };
};

export { authService };
