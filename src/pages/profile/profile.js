import React, { useState } from "react";
import { Button } from "../../components";
import Card from "../../components/Card/Card";
import InnerPageContainer from "../../components/InnerPageContainer/InnerPageContainer";
import withBreadcrumb from "../../utils/breadcrumb/breadcrumb";
import { updateUser } from "../../api/userService";
import { useAuth } from "../../context/AuthProvider/AuthProvider";
import { useNotifications } from "../../context/NotificationsProvider/NotificationsProvider";
import { handleError } from "../../utils/errors";
import { validateEmail } from "../../utils/email";
import { useLoader } from "../../context/LoaderProvider/LoaderProvider";

const ProfilePage = () => {
    const notify = useNotifications();
    const { loggedInUser, logOut } = useAuth();
    const { setLoading } = useLoader();

    const [accountInfo, setAccountInfo] = useState({
        login: loggedInUser,
        password: '',
        newPassword: '',
        newPasswordConfirmation: ''
    });

    const onAccountInfoChange = (event) => {
        setAccountInfo({
            ...accountInfo,
            [event.target.name]: event.target.value
        });
    };

    const update = async (event) => {
        event.preventDefault();

        if (!validateEmail(accountInfo.login)) {
            notify.error("Invalid email address: " + accountInfo.login);
            return;
        }
        if (accountInfo.newPassword !== '' && accountInfo.newPassword !== accountInfo.newPasswordConfirmation) {
            notify.error("Passwords do not match");
            return;
        }
        if (accountInfo.password === '') {
            notify.error("Current password must not be empty");
            return;
        }

        try {
            setLoading(true);
            await updateUser(loggedInUser, accountInfo);
            await logOut();
        } catch (error) {
            handleError(error, notify.error, logOut);
        }
        setLoading(false);
    }

    return (
        <Card>
            <form onSubmit={update}>
                <label>
                    Username:
                </label>
                <input type="text" name={'login'} value={accountInfo.login} onChange={onAccountInfoChange} />
                <label>
                    Current Password:
                </label>
                <input type="password" name={'password'} value={accountInfo.password} onChange={onAccountInfoChange} />
                <label>
                    New Password:
                </label>
                <input type="password" name={'newPassword'} value={accountInfo.newPassword} onChange={onAccountInfoChange} />
                <label>
                    Confirm Password:
                </label>
                <input type="password" name={'newPasswordConfirmation'} value={accountInfo.newPasswordConfirmation} onChange={onAccountInfoChange} />
                <div className={'button-group'}>
                    <Button type="submit" onClick={update}>Update</Button>
                </div>
            </form>
        </Card>
    )
};

const ProfilePageWrapper = () => {
    const ProfilePageWithBreadcrumb = withBreadcrumb(ProfilePage);
    return (
        <InnerPageContainer>
            <ProfilePageWithBreadcrumb />
        </InnerPageContainer>
    );
};

export default ProfilePageWrapper;