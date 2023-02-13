import { BaseDatabase } from "./BaseDatabase";

export class RefreshTokenDatabase extends BaseDatabase{
    private static TABLE_NAME:string = "RefreshToken";

    public async create(
        token: string,
        device: string,
        isActive: boolean,
        userId:string
    ): Promise<void> {
        await this.connection().raw(`
            INSERT INTO ${RefreshTokenDatabase.TABLE_NAME}(refresh_token, device, is_active, user_id)
            VALUES(
                "${token}",
                "${device}",
                ${this.convertBooleanToTinyInt(isActive)},
                "${userId}"
            )
        `);
    }

    public async getByToken(token: string): Promise <any> {
        const result = await this.connection().raw(`
            SELECT * FROM ${RefreshTokenDatabase.TABLE_NAME}
            WHERE refresh_token = "${token}"
        `);

        const refreshTokenDb = result[0][0]

        return{
            refreshToken: refreshTokenDb.refresh_token,
            device: refreshTokenDb.device,
            userId: refreshTokenDb.user_id,
            isActive: this.convertTinyIntToBoolean(refreshTokenDb.is_active)
        }
    }

    public async getByUserIdAndDevice(userId: string, device: string): Promise <any> {
        const result = await this.connection().raw(`
            SELECT * FROM ${RefreshTokenDatabase.TABLE_NAME}
            WHERE user_id = "${userId}" AND device = "${device}"
        `);

        const refreshTokenDb = result[0][0]

        return refreshTokenDb && {
            refreshToken: refreshTokenDb.refresh_token,
            device: refreshTokenDb.device,
            userId: refreshTokenDb.user_id,
            isActive: this.convertTinyIntToBoolean(refreshTokenDb.is_active)
        }
    }

    public async delete(token: string){
        await this.connection().raw(`
            DELETE FROM ${RefreshTokenDatabase.TABLE_NAME}
            WHERE refresh_token = "${token}"
        `)
    }
}