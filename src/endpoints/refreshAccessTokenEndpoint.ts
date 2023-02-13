import { Request, Response} from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { Authenticator } from '../services/Authenticator';
import { UserDatabase } from '../data/UserDatabase';

export const refreshAccessTokenEndpoint = async (req: Request, res: Response) => {
    try{

        const refreshToken = req.body.refreshToken;
        const device = req.body.device;

        const authenticator = new Authenticator();
        const refreshTokenData = authenticator.verify(refreshToken);

        if(refreshTokenData.device !== device){
            throw new Error("Wrong Device")
        }

        const userDatabase = new UserDatabase();
        const user = await userDatabase.getUserByID(refreshTokenData.id)

        const accessToken = authenticator.generateToken({
            id: refreshTokenData.id,
            role: user.role
        }, process.env.ACCESS_TOKEN_EXPIRES_IN )

        res.status(200).send({
            accessToken
        })
        
    }catch(err:any){
        res.status(400).send({
            message: err.message
        })
    }finally{
        await BaseDatabase.destroyConnection();
    }
}