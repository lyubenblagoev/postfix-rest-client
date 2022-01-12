import React, { useEffect, useState } from 'react';
import { Switch, Route, useParams, useRouteMatch, useHistory } from 'react-router-dom';
import { AccountsList, Button, DateTime } from '../../components';
import * as accountService from '../../api/accountService';
import InnerPageContainer from '../../components/InnerPageContainer/InnerPageContainer';
import Modal from '../../components/Modal/Modal';
import withDomainStatuserroring from '../../utils/domainStatus';
import withBreadcrumb from '../../utils/breadcrumb/breadcrumb';
import Card from '../../components/Card/Card';
import { useNotifications } from '../../context/NotificationsProvider/NotificationsProvider';
import { handleError } from '../../utils/errors';
import { useAuth } from '../../context/AuthProvider/AuthProvider';
import { useLoader } from '../../context/LoaderProvider/LoaderProvider';

const AccountsListPage = () => {
    const { domainName } = useParams();
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const notify = useNotifications();
    const { logOut } = useAuth();
    const { setLoading } = useLoader();

    const onCreateBtnClick = (event) => {
        history.push(`/domains/${domainName}/accounts/new`);
    };

    const onDeleteBtnClick = () => {
        setShowModal(true);
    };

    const onDeleteConfirmation = async (confirmed) => {
        setShowModal(false);
        if (confirmed) {
            await deleteAccounts();
        }
    }

    const deleteAccounts = async (event) => {
        try {
            setLoading(true);
            const accounts = await accountService.getAccounts(domainName);
            accounts.forEach(async (account) => {
                await accountService.deleteAccount(domainName, account.username);
            });
            notify.info('Accounts deleted successfully');
            history.push(`/domains/${domainName}`);
        } catch (error) {
            handleError(error, notify.error, logOut);
        }
        setLoading(false);
    };

    return (
        <>
            <div className={'flex-container'}>
                <Card>
                    <AccountsList domainName={domainName} />
                    <div className={'button-group'}>
                        <Button onClick={onCreateBtnClick}>Create account</Button>
                        <Button classNames={'important-btn'} onClick={onDeleteBtnClick}>Delete accounts</Button>
                    </div>
                </Card>
                <Card>
                    <h3>Related actions:</h3>
                    <div className={'button-group'}>
                        <Button onClick={() => history.push(`/domains/${domainName}/aliases`)}>Show aliases</Button>
                        <Button onClick={() => history.push(`/domains/${domainName}`)}>Edit domain</Button>
                    </div>
                </Card>
            </div>
            <Modal show={showModal}>
                <p>Are you sure you want to delete all accounts in domain <span className={'important'}>{domainName}</span>?</p>
                <div style={{ 'textAlign': 'center' }}>
                    <Button onClick={() => onDeleteConfirmation(true)} classNames={'important-btn'}>Delete</Button>
                    <Button onClick={() => onDeleteConfirmation(false)}>Cancel</Button>
                </div>
            </Modal>
        </>
    );
};

const AccountCreatePage = () => {
    const { domainName } = useParams();
    const history = useHistory();
    const match = useRouteMatch();
    const notify = useNotifications();
    const { logOut } = useAuth();
    const { setLoading } = useLoader();

    const [accountInfo, setAccountInfo] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        enabled: false
    });
    const [confirmPassword, setConfirmPassword] = useState('');

    const onUsernameChange = (event) => {
        setAccountInfo({ ...accountInfo, username: event.target.value });
    };

    const onStatusChange = (event) => {
        setAccountInfo({ ...accountInfo, enabled: event.target.checked });
    }

    const onPasswordChange = (event) => {
        setAccountInfo({ ...accountInfo, password: event.target.value });
    };

    const onPasswordConfirmationChange = (event) => {
        setConfirmPassword(event.target.value);
        setAccountInfo({ ...accountInfo, confirmPassword: event.target.value });
    };

    const createAccount = async (event) => {
        event.preventDefault();
        if (!accountInfo.password) {
            notify.error('Password must not be blank');
            return;
        }
        if (accountInfo.password !== confirmPassword) {
            notify.error('Passwords do not match');
            return
        }
        try {
            setLoading(true);
            await accountService.createAccount(domainName, accountInfo);
            notify.info('Account created');
            history.push(match.url.substring(0, match.url.lastIndexOf('/')));
        } catch (error) {
            handleError(error, notify.error, logOut);
        }
        setLoading(false);
    };

    return (
        <Card>
            <form onSubmit={createAccount}>
                <label>
                    Username:<br />
                </label>
                <div>
                    <input type="text" value={accountInfo.username} onChange={onUsernameChange} />@{domainName}
                </div>
                <label>
                    Password:<br />
                </label>
                <input type="password" value={accountInfo.password} onChange={onPasswordChange} />
                <label>
                    Confirm Password:<br />
                </label>
                <input type="password" value={confirmPassword} onChange={onPasswordConfirmationChange} />
                <label>
                    Enabled:<br />
                </label>
                <input type="checkbox" checked={accountInfo.enabled} onChange={onStatusChange} />
                <div className={'button-group'}>
                    <Button onClick={createAccount}>Save</Button>
                </div>
            </form>
        </Card>
    )
};

const AccountEditPage = () => {
    const { domainName, accountName } = useParams();
    const history = useHistory();
    const match = useRouteMatch();
    const notify = useNotifications();
    const { logOut } = useAuth();
    const { setLoading } = useLoader();

    const [accountInfo, setAccountInfo] = useState({});
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const account = await accountService.getAccount(domainName, accountName);
                setAccountInfo(account);
            } catch (e) {
                handleError(e, notify.error, logOut);
            }
            setLoading(false);
        })()
    }, [domainName, accountName, notify.error, logOut, setLoading]);

    const onUsernameChange = (event) => setAccountInfo({ ...accountInfo, username: event.target.value });
    const onStatusChange = (event) => setAccountInfo({ ...accountInfo, enabled: event.target.checked });
    const onPasswordChange = (event) => setPassword(event.target.value);
    const onPasswordConfirmationChange = (event) => setConfirmPassword(event.target.value);

    const updateAccount = async (event) => {
        event.preventDefault();

        let newAccountInfo = { ...accountInfo };

        if (password.length > 0 || confirmPassword.length > 0) {
            if (password !== confirmPassword) {
                notify.error('Passwords do not match');
                return;
            }
            newAccountInfo = {
                ...newAccountInfo,
                password: password,
                confirmPassword: confirmPassword
            };
        }

        try {
            setLoading(true);
            await accountService.updateAccount(domainName, accountName, newAccountInfo);
            notify.info('Account updated');
            history.push(match.url.substring(0, match.url.lastIndexOf('/')));
        } catch (error) {
            handleError(error, notify.error, logOut);
        }
        setLoading(false);
    };

    const onDeleteBtnClick = () => setShowModal(true);

    const onDeleteConfirmation = (confirmed) => {
        setShowModal(false);
        if (confirmed) {
            deleteAccount();
        }
    };

    const deleteAccount = async () => {
        try {
            setLoading(true);
            await accountService.deleteAccount(domainName, accountName);
            notify.info('Account deleted');
            history.push(match.url.substring(0, match.url.lastIndexOf('/')));
        } catch (error) {
            handleError(error, notify.error, logOut);
        }
        setLoading(false);
    }

    if (accountInfo.id) {
        return (
            <>
                <div className={'flex-container'}>
                    <Card>
                        <form onSubmit={updateAccount}>
                            <label>
                                Username:<br />
                            </label>
                            <div>
                                <input type="text" value={accountInfo.username} onChange={onUsernameChange} />@{accountInfo.domain}
                            </div>
                            <label>
                                Password:<br />
                            </label>
                            <input type="password" value={password} onChange={onPasswordChange} />
                            <label>
                                Confirm Password:<br />
                            </label>
                            <input type="password" value={confirmPassword} onChange={onPasswordConfirmationChange} />
                            <label>
                                Created on:<br />
                            </label>
                            <DateTime date={accountInfo.created} />
                            <label>
                                Last updated:<br />
                            </label>
                            <DateTime date={accountInfo.updated} />
                            <label>
                                Enabled:<br />
                            </label>
                            <input type="checkbox" checked={accountInfo.enabled} onChange={onStatusChange} />
                            <div className={'button-group'}>
                                <Button onClick={updateAccount}>Save</Button>
                                <Button classNames={'important-btn'} onClick={onDeleteBtnClick}>Delete</Button>
                            </div>
                        </form>
                    </Card>
                    <Card>
                        <h3>Related actions:</h3>
                        <div className={'button-group'}>
                            <Button onClick={() => history.push(`/domains/${domainName}/aliases`)}>Show aliases</Button>
                            <Button onClick={() => history.push(`/domains/${domainName}`)}>Edit domain</Button>
                        </div>
                    </Card>
                </div>
                <Modal show={showModal}>
                    <p>Are you sure you want to delete the email account <span className={'important'}>{accountName}@{domainName}</span>?</p>
                    <div style={{ 'textAlign': 'center' }}>
                        <Button onClick={() => onDeleteConfirmation(true)} classNames={'important-btn'}>Delete</Button>
                        <Button onClick={() => onDeleteConfirmation(false)}>Cancel</Button>
                    </div>
                </Modal>
            </>
        );
    } else {
        return (
            <Card>
                <p>Account {accountName}@{domainName} does not exist</p>
            </Card>
        );
    }
};

const AccountsPage = () => {
    const CreatePage = withBreadcrumb(withDomainStatuserroring(AccountCreatePage));
    const EditPage = withBreadcrumb(withDomainStatuserroring(AccountEditPage));
    const ListPage = withBreadcrumb(withDomainStatuserroring(AccountsListPage));

    return (
        <InnerPageContainer>
            <Switch>
                <Route exact path={`/domains/:domainName/accounts/new`}>
                    <CreatePage />
                </Route>
                <Route exact path={`/domains/:domainName/accounts`}>
                    <ListPage />
                </Route>
                <Route exact path={`/domains/:domainName/accounts/:accountName`}>
                    <EditPage />
                </Route>
            </Switch>
        </InnerPageContainer>
    )
};

export default AccountsPage;