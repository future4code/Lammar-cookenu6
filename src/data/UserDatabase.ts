import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {

  private static TABLE_NAME: string = "CookenuUser";

  public async createUser(
    id: string,
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<void> {
    await this.connection()
      .insert({
        id,
        name,
        email,
        password,
        role
      })
      .into(UserDatabase.TABLE_NAME)
  }
  public async getUserByEmail(
    email: string,
  ): Promise<any> {
    const user = await this.connection()
      .select().from(UserDatabase.TABLE_NAME)
      .where({email})
      return user[0]
  }

  public async getUserByID(
    id: string,
  ): Promise<any> {
    const user = await this.connection()
      .select('id', 'name', 'email').from(UserDatabase.TABLE_NAME)
      .where({id})
      return user[0]
  }
  public async delete(id:string):Promise<void>{
    await this.connection()
    .delete()
    .from(UserDatabase.TABLE_NAME)
    .where({ id })
  }
}
