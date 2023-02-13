import { Request, Response } from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { HashManager } from '../services/HashManager';
import { UserDatabase } from '../data/UserDatabase';
import { Authenticator } from '../services/Authenticator';
import { RefreshTokenDatabase } from '../data/RefreshTokenDatabase';

export const loginEndpoint = async (req: Request, res: Response) => {
  try {

    if (!req.body.email || !req.body.password) {
      throw new Error(" Invalid email or password")
    }

    const userData = {
      email: req.body.email,
      password: req.body.password,
      device: req.body.device
    }
    const userDatabase = new UserDatabase();
    const user = await userDatabase.getUserByEmail(userData.email)

    if (!user) {
      return res.status(400).send({
        message: 'User not found'
      })
    }

    const hashManager = new HashManager();
    const comparePassword = await hashManager.compare(userData.password, user.password);
    if (!comparePassword) {
      return res.status(400).send({
        message: 'Incorrect password'
      })
    }

    const authenticator = new Authenticator()
    const accessToken = authenticator.generateToken({
      id: user.id,
      role: user.role
    }, process.env.ACCESS_TOKEN_EXPIRES_IN );

    const refreshToken = authenticator.generateToken({
      id: user.id,
      device: userData.device
    }, process.env.REFRESH_TOKEN_EXPIRES_IN );

    const refreshTokenDatabase = new RefreshTokenDatabase();

    const refreshTokenFromDatabase = await refreshTokenDatabase.getByUserIdAndDevice(
      user.id,
      userData.device
    )

    if(refreshTokenFromDatabase !== undefined) {
      await refreshTokenDatabase.delete(refreshTokenFromDatabase.refreshToken)
    }

    await refreshTokenDatabase.create(
      refreshToken,
      userData.device,
      true,
      user.id
    )

    res.status(200).send({
      access_token: accessToken,
      refresh_token: refreshToken
    })

  } catch (err:any) {
    res.status(400).send({
      message: err.message      
    })

  } finally {
    await BaseDatabase.destroyConnection();
  }
}