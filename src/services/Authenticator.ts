import * as jwt from 'jsonwebtoken';

export class Authenticator { 

    public generateToken(
        data: AuthenticationData, 
        expiresIn: string = process.env.ACCESS_TOKEN_EXPIRES_IN!
        ): string {
        return jwt.sign(data, process.env.JWT_KEY as string,{
            expiresIn
        })
    };

    public verify(token: string): AuthenticationData {
        const data = jwt.verify(
            token,
            process.env.JWT_KEY as string,
        ) as any

        return {
            id: data.id,
            role: data.role,
            device: data.device
        }
    }
}

export interface AuthenticationData {
    id: string;
    role?: string;
    device?: string;
};