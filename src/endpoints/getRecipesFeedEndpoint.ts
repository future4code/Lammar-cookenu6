import { Request, Response } from 'express';
import { RecipeDatabase } from '../data/RecipeDatabase';
import { Authenticator } from '../services/Authenticator';

export const getRecipesFeedEndpoint = async(req: Request, res: Response) => {
    try{
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        authenticator.verify(token);

        const recipeDatabase = new RecipeDatabase();
        const feedRecipes = await recipeDatabase.getFeed();

        res.status(200).send({
            recipes: feedRecipes
        })

    }catch(err:any){
        res.status(400).send({
            message: err.message           
        })     

    }finally{
        await RecipeDatabase.destroyConnection();
    }
}