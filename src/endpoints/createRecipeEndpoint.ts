import { Request, Response } from 'express';
import { IdGenerator } from '../services/IdGenerator';
import { BaseDatabase } from '../data/BaseDatabase';
import { Authenticator } from '../services/Authenticator';
import { RecipeDatabase } from '../data/RecipeDatabase';
import moment from 'moment';

export const createRecipeEndpoint = async(req: Request, res: Response) => {
    try{
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const tokenData = authenticator.verify(token);

        const recipeData = {
            title: req.body.title,
            description: req.body.description
        }

        const idGenerator = new IdGenerator();
        const id = idGenerator.generateId();

        const date = moment();

        const recipeDatabase = new RecipeDatabase();
        await recipeDatabase.create(
            id,
            tokenData.id,
            recipeData.title,
            recipeData.description,
            date.format("DD/MM/YYYY")            
        )   
        
        res.sendStatus(200);
    }catch(err:any){
        res.status(400).send({
            message: err.message
        })
    }finally{
        await BaseDatabase.destroyConnection();
    }
}