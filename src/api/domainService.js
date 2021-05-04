import { client } from './httpClient';
import { configuration } from "../config.js";

const urlPrefix = configuration.baseUrl + configuration.paths.domain.url;

const getDomains = async () => {
    const result = await client.get(urlPrefix);
    return result.data;
};

const getDomainWithName = async (name) => {
    const result = await client.get(`${urlPrefix}/${name}`);
    return result.data;
};

const createDomain = async (domainResource) => {
    const result = await client.post(urlPrefix, domainResource);
    return result.response;
};

const updateDomain = async (domainName, domainResource) => {
    const result = await client.put(`${urlPrefix}/${domainName}`, domainResource);
    return result.response;
};

const deleteDomain = async (name) => {
    const result = await client.delete(`${urlPrefix}/${name}`);
    return result.response;
};

export { getDomains, getDomainWithName, createDomain, updateDomain, deleteDomain };
