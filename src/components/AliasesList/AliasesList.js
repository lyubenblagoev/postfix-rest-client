import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import * as aliasesService from "../../api/aliasesService";
import { useAuth } from "../../context/AuthProvider/AuthProvider";
import { useLoader } from "../../context/LoaderProvider/LoaderProvider";
import { useNotifications } from "../../context/NotificationsProvider/NotificationsProvider";
import { handleError } from "../../utils/errors";
import List from '../List/List';
import './AliasesList.css';

export default function AliasesList(props) {
    const [aliases, setAliases] = useState([]);
    const { error } = useNotifications();
    const { logOut } = useAuth();
    const { loading, setLoading } = useLoader();

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const aliases = await aliasesService.getAliases(props.domainName);
                let aliasesByName = aliases
                    .reduce((obj, alias) => {
                        (obj[alias.name] = obj[alias.name] || []).push(alias);
                        return obj;
                    }, {});
                let aliasList = Object.keys(aliasesByName).sort()
                    .reduce((arr, key) => {
                        arr.push({
                            id: key,
                            name: key,
                            enabled: aliasesByName[key].length > 0 && aliasesByName[key].filter(a => a.enabled === true).length > 0,
                            recipients: aliasesByName[key].length
                        });
                        return arr;
                    }, []);
                setAliases(aliasList);
                setLoading(false);
            } catch (e) {
                handleError(e, error, logOut);
                setLoading(false);
                return;
            }
        })();
    }, [props.domainName, error, logOut, setLoading]);

    const match = useRouteMatch();

    let aliasElements = <p>No email aliases for domain name {props.domainName}</p>;

    if (aliases.length > 0) {
        aliasElements = (
            <List
                items={aliases}
                renderLink={(item) => (`${match.url}/${item.name}`)}
                renderLabel={(item) => (
                    <>
                        <p className={'aliases-list-p'}>{item.name}@{props.domainName} {item.enabled ? '' : '[disabled]'}</p>
                        <p className={'aliases-list-p'}><small>{item.recipients} recipient{item.recipients === 1 ? '' : 's'}</small></p>
                    </>
                )}
            />
        )
    }

    return (
        <div className={'aliases-list-wrapper'}>
            {loading ? <p>Please wait... </p> : aliasElements}
        </div>
    );
}
