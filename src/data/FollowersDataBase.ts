import { BaseDatabase } from "./BaseDatabase";

export class FollowersDatabase extends BaseDatabase {

  private static TABLE_NAME: string = "UserFollowers";

  public async insertFollowUser(
    followerId: string,
    followingId: string,

  ): Promise<void> {
    await this.connection()
      .insert({
        follower_user_id: followerId,
        following_user_id: followingId
      })
      .into(FollowersDatabase.TABLE_NAME)
  }
  public async deleteFollowUser(
    followerId: string,
    followingId: string,
  ): Promise<any> {
    await this.connection()
      .delete().from(FollowersDatabase.TABLE_NAME)
      .where({
        follower_user_id: followerId,
        following_user_id: followingId,
      })
  }
  public async deleteByUser(id:string):Promise<void>{
    await this.connection()
    .delete().from(FollowersDatabase.TABLE_NAME)
    .where({
      follower_user_id: id,
    }).orWhere({
      following_user_id: id,
    })
  }
}