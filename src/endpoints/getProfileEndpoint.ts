import { Request, Response } from "express";
import { UserDatabase } from "../data/UserDatabase";
import { Authenticator } from "../services/Authenticator";
import { BaseDatabase } from "../data/BaseDatabase";

export const getProfileEndpoint = async(req: Request, res: Response) => {
    try{
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const userAuthenticator = authenticator.verify(token)

        const userDatabase = new UserDatabase();
        const user = await userDatabase.getUserByID(userAuthenticator.id);

        res.status(200).send({
            id: user.id,
            name: user.name,
            email: user.email
        })

    }catch(err:any){
        res.status(400).send({
            message: err.message
        })
    }finally{
        await BaseDatabase.destroyConnection();
    }
}