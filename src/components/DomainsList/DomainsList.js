import { useEffect, useState } from "react";
import * as domainService from "../../api/domainService";
import * as accountService from "../../api/accountService";
import * as aliasesService from "../../api/aliasesService";
import List from '../List/List';
import { useNotifications } from "../../context/NotificationsProvider/NotificationsProvider";
import { handleError } from "../../utils/errors";
import { useAuth } from "../../context/AuthProvider/AuthProvider";
import "./DomainsList.css";
import { useLoader } from "../../context/LoaderProvider/LoaderProvider";

export default function DomainList({ renderLink }) {
    const [domains, setDomains] = useState();
    const { error } = useNotifications();
    const { logOut } = useAuth();
    const { setLoading } = useLoader();

    useEffect(() => {
        (async function loadDomains() {
            setLoading(true);
            let domains = [];
            try {
                domains = await domainService.getDomains();
            } catch (e) {
                handleError(e, error, logOut);
                setLoading(false);
                return;
            }
            Promise.all(domains.map(async (domain) => {
                const accounts = await accountService.getAccounts(domain.name);
                const aliases = await aliasesService.getAliases(domain.name);
                const distinct = aliases.map(a => a.name).filter((val, index, self) => self.indexOf(val) === index);
                return {
                    id: domain.id,
                    details: domain,
                    accounts: accounts.length,
                    aliases: distinct.length,
                    enabled: domain.enabled
                }
            })).then(details => {
                setDomains(details.sort((a, b) => a.details.name.localeCompare(b.details.name)));
                setLoading(false);
            }).catch((e) => {
                handleError(e, error, logOut);
                setLoading(false)
            });
        })();
    }, [error, logOut, setLoading]);

    let domainElements = <p>Please wait...</p>;

    if (domains && domains.length > 0) {
        domainElements = (
            <List
                items={domains}
                renderLink={renderLink}
                renderLabel={(domain) => (
                    <>
                        <p className={'domain-list-p'}>
                            {domain.details.name} {domain.details.enabled ? '' : '[disabled]'}
                        </p>
                        <p className={'domain-list-p'}>
                            <small>
                                {domain.accounts} account{domain.accounts === 1 ? '' : 's'}, {domain.aliases} alias{domain.aliases === 1 ? '' : 'es'}
                            </small>
                        </p>
                    </>
                )}
            />
        );
    } else if (domains) {
        domainElements = <p>No domain names are configured on this server</p>;
    };

    return (
        <div>
            {domainElements}
        </div>
    );
}
