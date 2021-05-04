import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as domainService from '../api/domainService';
import { logOut } from '../api/userService';
import { useNotifications } from '../context/NotificationsProvider/NotificationsProvider';
import { handleError } from './errors';

const withDomainStatusWarning = (Component) => {
    return (props) => {
        const params = useParams();
        const { warn, error } = useNotifications();

        useEffect(() => {
            (async () => {
                if (!params.domainName) {
                    return;
                }
                try {
                    const domainInfo = await domainService.getDomainWithName(params.domainName);
                    if (!domainInfo.enabled) {
                        warn([`Warning: Domain ${params.domainName} is disabled`]);
                    }
                } catch (e) {
                    handleError(e, error, logOut)
                }
            })();
        }, [params.domainName, warn]);

        return <Component {...props} />;
    };
};

export default withDomainStatusWarning;