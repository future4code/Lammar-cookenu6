import { Request, Response } from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { Authenticator } from '../services/Authenticator';
import { RecipeDatabase } from '../data/RecipeDatabase';

export const deleteRecipeEndpoint = async (req: Request, res: Response) => {
    try{
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const userAuthenticator = authenticator.verify(token);

        const recipeDatabase = new RecipeDatabase();
        const recipeId = await recipeDatabase.getById(req.params.id)        

        if(userAuthenticator.id !== recipeId.user_id && userAuthenticator.role !== "admin"){
            throw new Error("You Shall Not Pass")
        }

        await recipeDatabase.delete(req.params.id)
        
        res.sendStatus(200)

    }catch(err:any){
        res.status(400).send({
            message: err.message
        })
    }finally{
        BaseDatabase.destroyConnection();
    }

}