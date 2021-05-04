import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button } from "../../components";
import Card from "../../components/Card/Card";
import InnerPageContainer from "../../components/InnerPageContainer/InnerPageContainer";
import withBreadcrumb from "../../utils/breadcrumb/breadcrumb";
import { useAuth } from "../../context/AuthProvider/AuthProvider";
import { useNotifications } from "../../context/NotificationsProvider/NotificationsProvider";
import { handleError } from "../../utils/errors";
import { useLoader } from "../../context/LoaderProvider/LoaderProvider";

const LoginPage = () => {
    const history = useHistory();
    const location = useLocation();
    const { logIn, logOut } = useAuth();
    const notify = useNotifications();
    const { setLoading } = useLoader();

    const [accountInfo, setAccountInfo] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        if (location.search.indexOf('logout=1') > 0) {
            logOut();
            history.push('/login');
        }
    }, [history, location.search, logOut]);

    const onAccountInfoChange = (event) => {
        event.preventDefault();
        setAccountInfo({
            ...accountInfo,
            [event.target.name]: event.target.value
        });
    };

    const login = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            await logIn(accountInfo.username, accountInfo.password);
            history.push('/domains');
        } catch (error) {
            handleError(error, notify.error);
        }
        setLoading(false);
    }

    return (
        <Card>
            <form onSubmit={login}>
                <label>
                    Username:
                </label>
                <input type="text" name={'username'} value={accountInfo.username} onChange={onAccountInfoChange} />
                <label>
                    Password:
                </label>
                <input type="password" name={'password'} value={accountInfo.password} onChange={onAccountInfoChange} />
                <div className={'button-group'}>
                    <Button type="submit" onClick={login}>Sign in</Button>
                </div>
            </form>
        </Card>
    )
};

const LoginPageWrapper = () => {
    const LoginPageWithBreadcrumb = withBreadcrumb(LoginPage);
    return (
        <InnerPageContainer>
            <LoginPageWithBreadcrumb />
        </InnerPageContainer>
    );
};

export default LoginPageWrapper;