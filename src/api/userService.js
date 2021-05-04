import { configuration } from "../config.js";
import { client } from "./httpClient";

const loginUrl = configuration.baseUrl + configuration.paths.auth.login.url;
const logoutUrl = configuration.baseUrl + configuration.paths.auth.logout.url;
const updateUserUrl = configuration.baseUrl + configuration.paths.user.url;

const logIn = async (username, password) => {
    const result = await client.post(loginUrl, {
        login: username,
        password: password
    });
    return result.data;
};

const logOut = async (username, refreshToken) => {
    const result = await client.post(logoutUrl, {
        login: username,
        refreshToken: refreshToken
    });
    return result.data;
};

const updateUser = async (username, userResource) => {
    const updateUrlForUser = updateUserUrl.replace(':username', username);
    await client.put(updateUrlForUser, {
        email: userResource.login,
        password: userResource.newPassword,
        passwordConfirmation: userResource.newPasswordConfirmation,
        oldPassword: userResource.password
    });
};

export { logIn, logOut, updateUser };