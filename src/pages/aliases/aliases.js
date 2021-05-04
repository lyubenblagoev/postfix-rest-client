import React, { useEffect, useState } from 'react';
import { Switch, Route, useParams, useRouteMatch, useHistory } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { AliasesList, Button, DateTime, DomainsList } from '../../components';
import * as aliasesService from '../../api/aliasesService';
import InnerPageContainer from '../../components/InnerPageContainer/InnerPageContainer';
import Modal from '../../components/Modal/Modal';
import withDomainStatusWarning from '../../utils/domainStatus';
import withBreadcrumb from '../../utils/breadcrumb/breadcrumb';
import Card from '../../components/Card/Card';
import { useNotifications } from '../../context/NotificationsProvider/NotificationsProvider';
import { handleError } from '../../utils/errors';
import { useAuth } from '../../context/AuthProvider/AuthProvider';
import { validateEmail } from '../../utils/email';
import { useLoader } from '../../context/LoaderProvider/LoaderProvider';

const AliasesListPage = () => {
    const { domainName } = useParams();
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const notify = useNotifications();
    const { logOut } = useAuth();
    const { setLoading } = useLoader();

    const onCreateBtnClick = () => {
        history.push(`/domains/${domainName}/aliases/new`);
    };

    const onDeleteBtnClick = () => {
        setShowModal(true);
    };

    const onDeleteConfirmation = (confirmed) => {
        setShowModal(false);
        if (confirmed) {
            deleteAliases();
        }
    };

    const deleteAliases = async () => {
        try {
            setLoading(true);
            const domainAliases = await aliasesService.getAliases(domainName);
            domainAliases.forEach(async (alias) => {
                await aliasesService.deleteAlias(domainName, alias.name, alias.email);
            });
            notify.info('Aliases deleted successfully');
            history.push(`/domains/${domainName}/aliases`);
        } catch (error) {
            handleError(error, notify.error, logOut);
        }
        setLoading(false);
    };

    return (
        <>
            <div className={'flex-container'}>
                <Card>
                    <AliasesList domainName={domainName} />
                    <div className={'button-group'}>
                        <Button onClick={onCreateBtnClick}>Create alias</Button>
                        <Button onClick={onDeleteBtnClick} classNames={'important-btn'}>Delete aliases</Button>
                    </div>
                </Card>
                <Card>
                    <h3>Related actions:</h3>
                    <div className={'button-group'}>
                        <Button onClick={() => history.push(`/domains/${domainName}/accounts`)}>Show accounts</Button>
                        <Button onClick={() => history.push(`/domains/${domainName}`)}>Edit domain</Button>
                    </div>
                </Card>
            </div>
            <Modal show={showModal} onClose={() => { }}>
                <p>Are you sure you want to delete all email forwardings in domain <span className={'important'}>{domainName}</span>?</p>
                <div style={{ 'textAlign': 'center' }}>
                    <Button onClick={() => onDeleteConfirmation(true)} classNames={'important-btn'}>Delete</Button>
                    <Button onClick={() => onDeleteConfirmation(false)}>Cancel</Button>
                </div>
            </Modal>
        </>
    );
};

const AliasCreatePage = () => {
    const { domainName } = useParams();
    const history = useHistory();
    const match = useRouteMatch();
    const notify = useNotifications();
    const { logOut } = useAuth();
    const { setLoading } = useLoader();

    const [aliasInfo, setAliasInfo] = useState({
        name: '',
        email: '',
        enabled: false
    });

    const onNameChange = (event) => {
        setAliasInfo({ ...aliasInfo, name: event.target.value });
    };

    const onEmailChange = (event) => {
        setAliasInfo({ ...aliasInfo, email: event.target.value });
    };

    const onStatusChange = (event) => {
        setAliasInfo({ ...aliasInfo, enabled: event.target.checked });
    }

    const createAlias = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            await aliasesService.createAlias(domainName, aliasInfo);
            notify.info('Alias created');
            history.push(match.url.substring(0, match.url.lastIndexOf('/') + 1) + aliasInfo.name);
        } catch (error) {
            handleError(error, notify.error, logOut);
        }
        setLoading(false);
    };

    return (
        <Card>
            <form onSubmit={createAlias}>
                <label>
                    Name:<br />
                </label>
                <div>
                    <input type="text" value={aliasInfo.name} onChange={onNameChange} />@{domainName}
                </div>
                <label>
                    Recipient:<br />
                </label>
                <input type="email" value={aliasInfo.email} onChange={onEmailChange} />
                <label>
                    Enabled:<br />
                </label>
                <input type="checkbox" checked={aliasInfo.enabled} onChange={onStatusChange} />
                <div className={'button-group'}>
                    <Button onClick={createAlias}>Save</Button>
                </div>
            </form>
        </Card>
    )
};

const AliasEditPage = () => {
    const { domainName, alias } = useParams();
    const history = useHistory();
    const notify = useNotifications();
    const { logOut } = useAuth();
    const { setLoading } = useLoader();

    const [aliasInfo, setAliasInfo] = useState({});
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const aliases = await aliasesService.getAliasesFor(domainName, alias);
                const aliasInfo = {
                    name: alias,
                    created: aliases.reduce((min, current) => Date.parse(current.created) < min ? Date.parse(current.created) : min, new Date()),
                    updated: aliases.reduce((max, current) => Date.parse(current.updated) > max ? Date.parse(current.updated) : max, new Date(0)),
                    enabledRecipients: aliases.filter(a => a.enabled).map(a => a.email).join('\n'),
                    disabledRecipients: aliases.filter(a => !a.enabled).map(a => a.email).join('\n')
                };
                setAliasInfo(aliasInfo);
            } catch (error) {
                handleError(error, notify.error, logOut);
            }
            setLoading(false);
        })()
    }, [domainName, alias, notify.warn, notify.error, logOut, setLoading]);

    const onNameChange = (event) => {
        setAliasInfo({ ...aliasInfo, name: event.target.value });
    };

    const onEmailChange = (event) => {
        setAliasInfo(aliasInfo => {
            return { ...aliasInfo, [event.target.name]: event.target.value }
        });
    };

    const updateAliases = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const existing = await aliasesService.getAliasesFor(domainName, alias);

            const listedEnabled = aliasInfo.enabledRecipients
                .split('\n')
                .map(e => e.trim())
                .filter(e => e.length > 0);
            const listedDisabled = aliasInfo.disabledRecipients
                .split('\n')
                .map(e => e.trim())
                .filter(e => e.length > 0);
            const allListed = listedEnabled.concat(listedDisabled);

            const invalidEmails = allListed.filter(email => !validateEmail(email));
            if (invalidEmails.length > 0) {
                invalidEmails.forEach(email => notify.error('Invalid email address: ' + email));
                setLoading(false);
                return;
            }
            if (!validateEmail(aliasInfo.name + '@' + domainName)) {
                notify.error('Invalid email prefix: ' + aliasInfo.name);
                setLoading(false);
                return;
            }

            const removed = existing
                .filter(a => !allListed.includes(a.email));
            const updated = existing
                .filter(a => listedEnabled.includes(a.email) && !a.enabled)
                .map(a => ({ ...a, name: aliasInfo.name, enabled: true }))
                .concat(existing
                    .filter(a => listedDisabled.includes(a.email) && a.enabled)
                    .map(a => ({ ...a, name: aliasInfo.name, enabled: false })))
                .concat(existing
                    .filter(a => !removed.includes(a))
                    .filter(a => a.name !== aliasInfo.name)
                    .map(a => ({ ...a, name: aliasInfo.name })));
            const added = listedEnabled
                .filter(r => !existing.map(a => a.email).includes(r))
                .map(e => ({ name: aliasInfo.name, email: e, enabled: true }))
                .concat(listedDisabled
                    .filter(r => !existing.map(a => a.email).includes(r))
                    .map(e => ({ name: aliasInfo.name, email: e, enabled: false })));

            const updatePromises = [];
            removed.forEach((a) => updatePromises.push(aliasesService.deleteAlias(domainName, alias, a.email)));
            updated.forEach((a) => updatePromises.push(aliasesService.updateAlias(domainName, alias, a.email, a)));
            added.forEach((a) => updatePromises.push(aliasesService.createAlias(domainName, a)));
            Promise.all(updatePromises)
                .then(() => {
                    notify.info('Aliases updated');
                    history.push(`/domains/${domainName}/aliases`);
                    setLoading(false);
                })
                .catch((e) => {
                    handleError(e, notify.error, logOut)
                    setLoading(false);
                });
        } catch (error) {
            handleError(error, notify.error, logOut);
            setLoading(false);
        }
    };

    const onDeleteBtnClick = () => {
        setShowModal(true);
    };

    const onDeleteConfirmation = (confirmed) => {
        setShowModal(false);
        if (confirmed) {
            deleteAliases();
        }
    }

    const deleteAliases = async () => {
        try {
            setLoading(true);
            await aliasesService.deleteAliases(domainName, alias,);
            notify.info('Aliases deleted');
            history.push(`/domains/${domainName}/aliases`);
        } catch (error) {
            handleError(error, notify.error, logOut);
        }
        setLoading(false);
    }

    if (aliasInfo.name) {
        return (
            <>
                <div className={'flex-container'}>
                    <Card>
                        <form onSubmit={updateAliases}>
                            <label>Name:</label>
                            <div>
                                <input type="text" value={aliasInfo.name} onChange={onNameChange} />@{domainName}
                            </div>
                            <label>Recipients (one per line):</label>
                            <TextareaAutosize name={'enabledRecipients'} style={{ height: '34px' }} value={aliasInfo.enabledRecipients} onChange={onEmailChange} />
                            <label>Inactive recipients (one per line):</label>
                            <TextareaAutosize name={'disabledRecipients'} style={{ height: '34px' }} value={aliasInfo.disabledRecipients} onChange={onEmailChange} />
                            <label>Created on:</label>
                            <DateTime date={aliasInfo.created} />
                            <label>Last updated:</label>
                            <DateTime date={aliasInfo.updated} />
                            <div className={'button-group'}>
                                <Button type="submit" onClick={updateAliases}>Save</Button>
                                <Button classNames={'important-btn'} onClick={onDeleteBtnClick}>Delete</Button>
                            </div>
                        </form>
                    </Card>
                    <Card>
                    <h3>Related actions:</h3>
                    <div className={'button-group'}>
                        <Button onClick={() => history.push(`/domains/${domainName}/accounts`)}>Show accounts</Button>
                        <Button onClick={() => history.push(`/domains/${domainName}`)}>Edit domain</Button>
                    </div>
                </Card>
                </div>
                <Modal show={showModal} onClose={() => { }}>
                    <p>Are you sure you want to delete the alias <span className={'important'}>{alias}@{domainName}</span>?</p>
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
                <p>Alias {alias}@{domainName} does not exist</p>
            </Card>
        )
    }
};

const AliasesPage = () => {
    const CreatePage = withBreadcrumb(withDomainStatusWarning(AliasCreatePage));
    const ListPage = withBreadcrumb(withDomainStatusWarning(AliasesListPage));
    const EditPage = withBreadcrumb(withDomainStatusWarning(AliasEditPage));

    return (
        <InnerPageContainer>
            <Switch>
                <Route exact path={`/domains/:domainName/aliases/new`}>
                    <CreatePage />
                </Route>
                <Route exact path={`/domains/:domainName/aliases`}>
                    <ListPage />
                </Route>
                <Route exact path={`/domains/:domainName/aliases/:alias/`}>
                    <EditPage />
                </Route>
            </Switch>
        </InnerPageContainer>
    )
};

export default AliasesPage;