import knex, { Knex } from 'knex';

export abstract class BaseDatabase {
    private static knex_connection: Knex | null = null;

    protected connection(){
        if(BaseDatabase.knex_connection === null){
            BaseDatabase.knex_connection = knex({
                client: "mysql",
                connection:{
                    host: process.env.DB_HOST,
                    port: 3306,
                    user: process.env.DB_USER,
                    database: process.env.DB_DATABASE,
                    password: process.env.DB_PASSWORD,
                    multipleStatements: true

                },
            });
           
        } 
      
      return BaseDatabase.knex_connection
    }

    public static async destroyConnection(){
        if(BaseDatabase.knex_connection !== null){
            await BaseDatabase.knex_connection.destroy()
        }
        BaseDatabase.knex_connection = null
    }

    protected convertBooleanToTinyInt(value: boolean): number {
        return value ? 1 : 0;
    }

    protected convertTinyIntToBoolean(value: number): boolean {
        return value === 1;
    }
}