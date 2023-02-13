import { Request, Response } from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { FollowersDatabase } from '../data/FollowersDataBase';
import { Authenticator } from '../services/Authenticator';

export const unfollowProfileEndpoint = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const userAuthenticator = authenticator.verify(token)

    const followingId = req.body.userToUnfollowId

    if (!followingId) {
      throw new Error('Missing or invalid id')
    }

    const followerDatabase = new FollowersDatabase();
    await followerDatabase.deleteFollowUser(userAuthenticator.id, followingId);

    res.status(200).send({
      message: 'Unfollowed successfully'
    })

  } catch (err:any) {
    res.status(400).send({
      message: err.message
    })
  } finally {
    await BaseDatabase.destroyConnection();
  }
}