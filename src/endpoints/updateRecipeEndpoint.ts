import { Request, Response } from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { Authenticator } from '../services/Authenticator';
import { RecipeDatabase } from '../data/RecipeDatabase'

export const updateRecipeEndpoint = async(req: Request, res: Response) => {
    try{
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const userAuthenticator = authenticator.verify(token);

        const recipeData = {
            id:req.body.id,
            title: req.body.title,
            description: req.body.description
        }

        const recipeDatabase = new RecipeDatabase();
        const recipeId = await recipeDatabase.getById(recipeData.id)

        if(userAuthenticator.id !== recipeId.user_id){
            throw new Error("You Shall Not Pass")
        }

        await recipeDatabase.update(
            recipeData.id,
            recipeData.title,
            recipeData.description
        )
        
        res.status(200).send()

    }catch(err:any){
        res.status(400).send({
            message: err.message
        })
    }finally{
        BaseDatabase.destroyConnection();
    }
}