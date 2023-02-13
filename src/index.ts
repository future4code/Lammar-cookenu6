import express from "express";
import { AddressInfo } from "net";
import dotenv from "dotenv";
import { signupEndpoint } from "./endpoints/signupEndpoint";
import { loginEndpoint } from "./endpoints/loginEndpoint";
import { getUserByIDEndpoint } from "./endpoints/getUserEndpoint";
import { createRecipeEndpoint } from "./endpoints/createRecipeEndpoint";
import { getRecipeEndpoint } from "./endpoints/getRecipeEndpoint";
import { getRecipesFeedEndpoint } from "./endpoints/getRecipesFeedEndpoint";
import { getProfileEndpoint } from "./endpoints/getProfileEndpoint";
import { followProfileEndpoint } from "./endpoints/followUserEndpoint";
import { unfollowProfileEndpoint} from "./endpoints/unfollowUserEndpoint";
import { deleteRecipeEndpoint } from "./endpoints/deleteRecipeEndpoint";
import { updateRecipeEndpoint } from "./endpoints/updateRecipeEndpoint";
import { refreshAccessTokenEndpoint } from "./endpoints/refreshAccessTokenEndpoint";
import { deleteProfileEndpoint } from "./endpoints/deleteUserEndpoint";

dotenv.config();

const app = express();

app.use(express.json());

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});

app.post("/signup", signupEndpoint);
app.post("/login", loginEndpoint);
app.post("/recipe", createRecipeEndpoint);
app.post("/recipe/update", updateRecipeEndpoint);
app.post("/user/follow", followProfileEndpoint);
app.post("/user/unfollow", unfollowProfileEndpoint);
app.post("/refresh/token", refreshAccessTokenEndpoint)

app.get("/user/profile", getProfileEndpoint);
app.get("/user/:id", getUserByIDEndpoint);
app.get("/recipe/feed", getRecipesFeedEndpoint);
app.get("/recipe/:id", getRecipeEndpoint);

app.delete("/delete/user", deleteProfileEndpoint);
app.delete("/delete/:id", deleteRecipeEndpoint);