import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { DomainsList, Button, DateTime } from '../../components';
import * as domainService from '../../api/domainService';
import Modal from '../../components/Modal/Modal';
import withBreadcrumb from '../../utils/breadcrumb/breadcrumb';
import Card from '../../components/Card/Card';
import { useNotifications } from '../../context/NotificationsProvider/NotificationsProvider';
import InnerPageContainer from '../../components/InnerPageContainer/InnerPageContainer';
import { handleError } from '../../utils/errors';
import { useAuth } from '../../context/AuthProvider/AuthProvider';
import { useLoader } from '../../context/LoaderProvider/LoaderProvider';

const DomainEditPage = () => {
    const { domainName } = useParams();
    const history = useHistory();
    const [domainInfo, setDomainInfo] = useState({});
    const [showModal, setShowModal] = useState(false);
    const notify = useNotifications();
    const { logOut } = useAuth();
    const { setLoading } = useLoader();

    useEffect(() => {
        (async () => {
            setLoading(true);
            let domain;
            try {
                domain = await domainService.getDomainWithName(domainName);
            } catch (error) {
                handleError(error, notify.error, logOut);
                setLoading(false);
                return;
            }
            setDomainInfo({ ...domain });
            setLoading(false);
        })();
    }, [domainName, logOut, notify.error, notify.warn, setLoading]);

    const updateDomain = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            await domainService.updateDomain(domainName, domainInfo);
            setLoading(false);
            notify.info('Domain updated successfully');
            history.push('/domains');
        } catch (error) {
            handleError(error, notify.error, logOut);
            setLoading(false);
        }
    };

    const onDeleteBtnClick = () => {
        setShowModal(true);
    };

    const deleteDomain = async () => {
        try {
            setLoading(true);
            await domainService.deleteDomain(domainName);
            setLoading(false);
            notify.info('Domain deleted successfully');
            history.push(`/domains`);
        } catch (error) {
            handleError(error, notify.error, logOut);
        }
    };

    const onDeleteConfirmation = async (confirmed) => {
        setShowModal(false);
        if (confirmed) {
            deleteDomain();
        }
    };

    const onDomainNameChange = (event) => {
        setDomainInfo({ ...domainInfo, name: event.target.value });
    };

    const onStatusChange = (event) => {
        setDomainInfo({ ...domainInfo, enabled: event.target.checked });
    };

    if (domainInfo.id) {
        return (
            <>
                <div className={'flex-container'}>
                    <Card>
                        <form onSubmit={updateDomain}>
                            <label>
                                Domain name:
                        </label>
                            <input type="text" value={domainInfo.name} onChange={onDomainNameChange} />
                            <label>
                                Created on:
                        </label>
                            <DateTime date={domainInfo.created} />
                            <label>
                                Last updated:
                        </label>
                            <DateTime date={domainInfo.updated} />
                            <label>
                                Enabled:
                        </label>
                            <input type="checkbox" checked={domainInfo.enabled} onChange={onStatusChange} />
                            <div className={'button-group'}>
                                <Button onClick={updateDomain}>Save</Button>
                                <Button classNames={'important-btn'} onClick={onDeleteBtnClick}>Delete</Button>
                            </div>
                        </form>
                    </Card>
                    <Card>
                        <h3>Related actions:</h3>
                        <div className={'button-group'}>
                            <Button onClick={() => history.push(`/domains/${domainName}/accounts`)}>Show Accounts</Button>
                            <Button onClick={() => history.push(`/domains/${domainName}/aliases`)}>Show Aliases</Button>
                        </div>
                    </Card>
                </div>
                <Modal show={showModal}>
                    <p>Warning: Removing a domain removes all configured items like accounts and aliases!</p>
                    <p>Are you sure you want to remove the domain <span className={'important'}>{domainName}</span>?</p>
                    <div style={{ textAlign: 'center' }}>
                        <Button onClick={() => onDeleteConfirmation(true)} classNames={'important-btn'}>Delete</Button>
                        <Button onClick={() => onDeleteConfirmation(false)}>Cancel</Button>
                    </div>
                </Modal>
            </>
        );
    } else {
        return (
            <Card>
                <p>Domain {domainName} does not exist</p>
            </Card>
        );
    }
};

const DomainCreatePage = () => {
    const history = useHistory();
    const notify = useNotifications();
    const { logOut } = useAuth();
    const { setLoading } = useLoader();

    const [domainInfo, setDomainInfo] = useState({
        name: '',
        enabled: false
    });

    const onDomainNameChange = (event) => {
        setDomainInfo({ ...domainInfo, name: event.target.value });
    };

    const onStatusChange = (event) => {
        setDomainInfo({ ...domainInfo, enabled: event.target.checked });
    };

    const createDomain = async (event) => {
        setLoading(true);
        event.preventDefault();
        try {
            await domainService.createDomain(domainInfo);
            notify.info("Domain created successfully");
            history.push('/domains');
        } catch (error) {
            handleError(error, notify.error, logOut);
        }
        setLoading(false);
    };

    return (
        <Card>
            <form onSubmit={createDomain}>
                <label>
                    Domain name:
                </label>
                <input type="text" value={domainInfo.name} onChange={onDomainNameChange} />
                <label>
                    Enabled:
                </label>
                <input type="checkbox" checked={domainInfo.enabled} onChange={onStatusChange} />
                <div className={'button-group'}>
                    <Button onClick={createDomain}>Save</Button>
                </div>
            </form>
        </Card>
    )
}

const DomainsListPage = () => {
    const history = useHistory();

    const onCreateBtnClick = (event) => {
        history.push(`/domains/new`);
    };

    return (
        <Card>
            <DomainsList renderLink={(domain) => (`/domains/${domain.details.name}`)} />
            <Button onClick={onCreateBtnClick}>Create domain</Button>
        </Card>
    );
}

const DomainsPage = () => {
    const CreatePage = withBreadcrumb(DomainCreatePage);
    const EditPage = withBreadcrumb(DomainEditPage);
    const ListPage = withBreadcrumb(DomainsListPage);

    return (
        <InnerPageContainer>
            <Switch>
                <Route exact path={`/domains/new`}>
                    <CreatePage />
                </Route>
                <Route exact path={`/domains/:domainName`}>
                    <EditPage />
                </Route>
                <Route exact path={`/domains`}>
                    <ListPage />
                </Route>
            </Switch>
        </InnerPageContainer>
    )
};

export default DomainsPage;