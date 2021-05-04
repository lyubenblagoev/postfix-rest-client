import { createContext, useContext, useState } from 'react';

const LoaderContext = createContext({});
const useLoader = () => useContext(LoaderContext);

const LoaderProvider = (props) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoaderContext.Provider value={{ loading, setLoading }} {...props} />
    );
};

export {
    LoaderProvider,
    useLoader,
};