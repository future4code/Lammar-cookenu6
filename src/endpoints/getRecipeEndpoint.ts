import { Request, Response } from 'express';
import { RecipeDatabase } from '../data/RecipeDatabase';
import { Authenticator } from '../services/Authenticator';

export const getRecipeEndpoint = async(req: Request, res:Response) => {
    try{
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator()
        authenticator.verify(token)

        const recipeId = req.params.id

        const recipeDatabase = new RecipeDatabase()
        const recipe = await recipeDatabase.getById(recipeId)

        res.status(200).send({
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            createdAt: recipe.created_at
        })

    }catch(err:any){
        res.status(400).send({
            message: err.message
        })

    }finally{
        await RecipeDatabase.destroyConnection();
    }
}