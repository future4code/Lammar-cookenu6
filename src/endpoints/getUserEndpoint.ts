import { Request, Response } from "express";
import { UserDatabase } from "../data/UserDatabase";
import { Authenticator } from "../services/Authenticator"

export const getUserByIDEndpoint = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const authenticator = new Authenticator();
    authenticator.verify(token)

    const id = req.params.id

    if (!id) {
      throw new Error('Missing or invalid id')
    }

    const cookenuUser = new UserDatabase()
    const user = await cookenuUser.getUserByID(id)

    return res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email
    })
  } catch (err:any) {
    return res.status(400).send({
      message: err.message
    })
  } finally {
    await UserDatabase.destroyConnection();
  }
}