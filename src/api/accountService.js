import { client } from './httpClient';
import { configuration } from "../config.js";

const urlPrefix = configuration.baseUrl + configuration.paths.domain.url;

const getAccounts = async (domainName) => {
    const result = await client.get(`${urlPrefix}/${domainName}/accounts`);
    return result.data;
};

const getAccount = async (domainName, account) => {
    const result = await client.get(`${urlPrefix}/${domainName}/accounts/${account}`);
    return result.data;
};

const updateAccount = async (domainName, account, accountResource) => {
    const result = await client.put(`${urlPrefix}/${domainName}/accounts/${account}`, accountResource);
    return result.response;
}

const createAccount = async (domainName, accountResource) => {
    const result = await client.post(`${urlPrefix}/${domainName}/accounts/`, accountResource);
    return result.response;
}

const deleteAccount = async (domainName, accountName) => {
    const result = await client.delete(`${urlPrefix}/${domainName}/accounts/${accountName}`);
    return result.response;
}

export { getAccounts, getAccount, updateAccount, createAccount, deleteAccount };
