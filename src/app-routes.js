import { DomainsPage, AccountsPage, AliasesPage, ProfilePage } from './pages';
import LoginPage from './pages/login/login';

const routes = [
    {
        path: '/domains',
        showInNavbar: true,
        authenticated: true,
        link: 'Domains',
        component: DomainsPage
    },
    {
        path: '/domains/:domainName',
        authenticated: true,
        link: ':domainName',
        component: DomainsPage
    },
    {
        path: '/domains/:domainName/accounts',
        authenticated: true,
        link: 'Accounts',
        component: AccountsPage
    },
    {
        path: '/domains/:domainName/accounts/:accountName',
        authenticated: true,
        link: ':accountName',
        component: AccountsPage
    },
    {
        path: '/domains/:domainName/aliases',
        authenticated: true,
        link: 'Aliases',
        component: AliasesPage
    },
    {
        path: '/domains/:domainName/aliases/:aliasName',
        authenticated: true,
        link: ':aliasName',
        component: AliasesPage
    },
    {
        path: '/login',
        link: 'Login',
        component: LoginPage
    },
    {
        path: '/profile',
        authenticated: true,
        link: 'Profile',
        component: ProfilePage
    },
];

export default routes;