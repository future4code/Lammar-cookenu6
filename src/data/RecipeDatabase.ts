import { BaseDatabase } from "./BaseDatabase";

export class RecipeDatabase extends BaseDatabase {
    private static TABLE_NAME: string = "CookenuRecipes";

    public async create(
        id:string,
        user_id:string,
        title:string,
        description:string,
        created_at:string    
    ): Promise<void> {
        await this.connection()
        .insert({
            id,
            user_id,
            title,
            description,
            created_at
        })
        .into(RecipeDatabase.TABLE_NAME)
    }

   public async getById(id: string):Promise<any>{
       const result = await this.connection()
       .select("*")
       .from(RecipeDatabase.TABLE_NAME)
       .where({id})

       return result[0]
   }

   public async getFeed():Promise<any>{
       const result = await this.connection().raw(`
       SELECT r.id as recipe_id, r.title, r.description, r.created_at as createdAt, u.id as userId, u.name as userName
        FROM ${RecipeDatabase.TABLE_NAME} r LEFT JOIN CookenuUser u ON r.user_id = u.id
       `)
        return result[0]
       }

       public async update(id:string, title:string, description:string): Promise<void>{
        await this.connection().raw(`
        UPDATE ${RecipeDatabase.TABLE_NAME}
        SET title = "${title}", description = "${description}" 
        WHERE id = "${id}"
        `)        
    }

    public async delete(id:string):Promise<void>{
        await this.connection()
        .delete()
        .from(RecipeDatabase.TABLE_NAME)
        .where({ id })
    }
    public async deleteByUser(id:string):Promise<void>{
      await this.connection()
      .delete()
      .from(RecipeDatabase.TABLE_NAME)
      .where({ user_id : id})
    }
   }