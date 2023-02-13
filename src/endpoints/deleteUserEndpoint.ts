import { Request, Response } from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { FollowersDatabase } from '../data/FollowersDataBase';
import { RecipeDatabase } from '../data/RecipeDatabase';
import { UserDatabase } from '../data/UserDatabase';
import { Authenticator } from '../services/Authenticator';

export const deleteProfileEndpoint = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const userAuthenticator = authenticator.verify(token)

    const deleteId = req.body.userToDeleteId

    if (!deleteId) {
      throw new Error('Missing or invalid id')
    }
    if (userAuthenticator.role !== 'admin'){
      throw new Error('Not authorized.')
    }

    const followerDatabase = new FollowersDatabase();
    await followerDatabase.deleteByUser(deleteId);

    const recipeDatabase = new RecipeDatabase();
    await recipeDatabase.deleteByUser(deleteId);

    const userDatabase = new UserDatabase();
    await userDatabase.delete(deleteId);

    res.status(200).send({
      message: 'Deleted successfully'
    })

  } catch (err:any) {
    console.log(err)
    res.status(400).send({
      message: err.message
    })
  } finally {
    await BaseDatabase.destroyConnection();
  }
}