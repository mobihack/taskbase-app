import { CookieOptions, Request, Response } from 'express';
import express from 'express';
import { z } from 'zod';

import { appDataSource } from '../app-data-source';
import { config } from '../config';
import { User } from '../entity/user.entity';
import { validateData } from '../middleware';
import { authService, bcryptService } from '../services';

const UserController = express.Router();
const UserPrivateController = express.Router();

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  maxAge: config.cookieExpiry * 1000,
  sameSite: 'strict',
};

const sendSessionCookie = (res: Response, token: string) => {
  res.cookie('session_token', token, cookieOptions);
};
const removeSessionCookie = (res: Response) => {
  res.clearCookie('session_token', cookieOptions);
};

const register = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const user = appDataSource.getRepository(User).create({
      email: body.email,
      password: body.password,
    });

    const results = await appDataSource.getRepository(User).save(user);

    const token = authService().issue({ id: results.id });

    sendSessionCookie(res, token);

    return res.send_created('User created successfully', {
      token,
      user: results,
    });
  } catch (err) {
    console.log(err);
    return res.send_internalServerError('Internal server error');
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email && password) {
    try {
      const user = await appDataSource.getRepository(User).findOneOrFail({
        where: { email },
        select: ['email', 'password', 'id'],
      });

      if (!user) {
        return res.send_badRequest('User not found or wrong password');
      }

      if (bcryptService().comparePassword(password, user.password)) {
        const token = authService().issue({ id: user.id });

        sendSessionCookie(res, token);

        return res.send_ok('Login Successful', {
          token,
          email: user.email,
          id: user.id,
        });
      }

      return res.send_badRequest('User not found or wrong password');
    } catch (err) {
      console.log(err);
      return res.send_internalServerError('Internal server error');
    }
  }

  return res.send_badRequest('Email or password is wrong');
};

const validateSession = async (req: Request, res: Response) => {
  const sessionCookie = req.cookies?.['session_token'];
  if (!sessionCookie) {
    return res.send_ok('Invalid user1', { user: null });
  }
  try {
    const jwtData = authService().extract(sessionCookie) as {
      id: string;
    };

    if (!jwtData?.id) {
      console.log(jwtData);

      return res.send_ok('Invalid user2', { user: null });
    }

    const user = await appDataSource.getRepository(User).findOneBy({
      id: jwtData.id,
    });
    if (!user) {
      return res.send_ok('Invalid user3', { user: null });
    }

    return res.send_ok('Valid user', { user });
  } catch (err) {
    console.log(err);
    return res.send_internalServerError('Internal server error');
  }
};

const logout = (req: Request, res: Response) => {
  removeSessionCookie(res);

  res.send_ok('Logged out');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await appDataSource.getRepository(User).find();

    return res.send_ok('Success', { users });
  } catch (err) {
    console.log(err);
    return res.send_internalServerError('Internal server error');
  }
};

UserController.post('/user', validateData(userSchema), register);
UserController.post('/login', validateData(userSchema), login);
UserPrivateController.delete('/logout', logout);

UserController.get('/me', validateSession);

// UserPrivateController.get('/users', getAllUsers);

export { UserController, UserPrivateController };
