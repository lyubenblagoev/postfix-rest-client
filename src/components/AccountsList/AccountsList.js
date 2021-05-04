import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import * as accountService from "../../api/accountService";
import { useAuth } from "../../context/AuthProvider/AuthProvider";
import { useLoader } from "../../context/LoaderProvider/LoaderProvider";
import { useNotifications } from "../../context/NotificationsProvider/NotificationsProvider";
import { handleError } from "../../utils/errors";
import List from '../List/List';

export default function AccountsList(props) {
    const [accounts, setAccounts] = useState([]);
    const { error } = useNotifications();
    const { logOut } = useAuth();
    const { setLoading } = useLoader();

    useEffect(() => {
        (async function loadAccounts() {
            setLoading(true);
            let accounts = [];
            try {
                 accounts = await accountService.getAccounts(props.domainName)
                 setLoading(false);
            } catch (e) {
                handleError(e, error, logOut);
                setLoading(false);
                return;
            }
            setAccounts(accounts.sort((a, b) => a.username.localeCompare(b.username)));
        })();
    }, [props.domainName, error, logOut, setLoading]);

    const match = useRouteMatch();

    let accountElements = <p>No email accounts for domain name {props.domainName}</p>;

    if (accounts.length > 0) {
        accountElements = (
            <List
                items={accounts}
                renderLink={(item) => (`${match.url}/${item.username}`)}
                renderLabel={(item) => (`${item.username}@${props.domainName} ${item.enabled ? '' : '[disabled]'}`)}
            />
        )
    }

    return (
        <div className={'accounts-list-wrapper'}>
            {accountElements}
        </div>
    );
}
