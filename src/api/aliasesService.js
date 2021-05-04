import { client } from './httpClient';
import { configuration } from "../config.js";

const urlPrefix = configuration.baseUrl + configuration.paths.domain.url;

const getAliases = async (domainName) => {
    const result = await client.get(`${urlPrefix}/${domainName}/aliases`);
    return result.data;
};

const getAliasesFor = async (domainName, alias) => {
    const result = await client.get(`${urlPrefix}/${domainName}/aliases/${alias}`);
    return result.data;
};

const getAlias = async (domainName, alias, recipient) => {
    const result = await client.get(`${urlPrefix}/${domainName}/aliases/${alias}/${recipient}`);
    return result.data;
};

const updateAlias = async (domainName, alias, recipient, aliasResource) => {
    const result = await client.put(`${urlPrefix}/${domainName}/aliases/${alias}/${recipient}`, aliasResource);
    return result.response;
}

const createAlias = async (domainName, aliasResource) => {
    const result = await client.post(`${urlPrefix}/${domainName}/aliases`, aliasResource);
    return result.response;
}

const deleteAliases = async (domainName, aliasName) => {
    const result = await client.delete(`${urlPrefix}/${domainName}/aliases/${aliasName}`);
    return result.response;
}

const deleteAlias = async (domainName, aliasName, recipient) => {
    const result = await client.delete(`${urlPrefix}/${domainName}/aliases/${aliasName}/${recipient}`);
    return result.response;
}

export { getAliases, getAliasesFor, getAlias, updateAlias, createAlias, deleteAliases, deleteAlias };
