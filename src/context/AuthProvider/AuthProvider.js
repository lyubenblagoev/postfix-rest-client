import { createContext, useCallback, useContext, useState } from 'react';
import { logIn as userLogIn, logOut as userLogOut } from '../../api/userService';
import { configuration } from '../../config';

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = (props) => {
    const [authenticated, setAuthenticated] = useState(localStorage.getItem(configuration.authTokenKey) !== null);
    const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem(configuration.authUserKey));

    const clearAuthenticationState = useCallback(() => {
        setAuthenticated(false);
        localStorage.removeItem(configuration.authTokenKey);
        localStorage.removeItem(configuration.refreshTokenKey);
        localStorage.removeItem(configuration.authUserKey);
    }, [setAuthenticated]);

    const initAuthenticationState = useCallback((username, token, refreshToken) => {
        localStorage.setItem(configuration.authTokenKey, token);
        localStorage.setItem(configuration.authUserKey, username);
        localStorage.setItem(configuration.refreshTokenKey, refreshToken)
        setLoggedInUser(username);
        setAuthenticated(true);
    }, [setLoggedInUser, setAuthenticated]);
    
    const logIn = useCallback(async (username, password) => {
        try {
            const { token, refreshToken } = await userLogIn(username, password);
            initAuthenticationState(username, token, refreshToken);
        } catch (e) {
            clearAuthenticationState()
            throw e;
        }
    }, [clearAuthenticationState, initAuthenticationState]);

    const logOut = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem(configuration.refreshTokenKey);
            if (authenticated && refreshToken) {
                await userLogOut(loggedInUser, refreshToken);
            }
        } catch (e) {
        }
        clearAuthenticationState();
    }, [authenticated, loggedInUser, clearAuthenticationState]);

    return (
        <AuthContext.Provider value={{ isAuthenticated: authenticated, loggedInUser, logIn, logOut }}>
            {props.children}
        </AuthContext.Provider>
    )
};

export { AuthProvider, useAuth }
