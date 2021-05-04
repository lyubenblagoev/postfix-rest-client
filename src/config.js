const baseUrl = process.env.REACT_APP_BACKEND_API_BASE_URL ?? "localhost:8080";

const configuration = {
    authTokenKey: 'auth/token',
    refreshTokenKey: 'auth/refresh',
    authUserKey: 'auth/user',
    baseUrl: `http://${baseUrl}/api/v1`,
    paths: {
        domain: {
            url: '/domains'
        },
        auth: {
            login: {
                url: '/auth/signin'
            },
            logout: {
                url: '/auth/signout'
            },
            refreshToken: {
                url: '/auth/refresh-token'
            }
        },
        user: {
            url: '/users/:username'
        }
    }
};

export { configuration };