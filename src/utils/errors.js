const extractErrorMessage = (error) => {
    if (!error.response) {
        if (error.message) {
            return error.message
        }
    }
    if (error.response.data) {
        if (error.response.data.status === 401) {
            return 'Unauthorized. Please log in.';
        } else if (error.response.data.message && error.response.data.message !== '') {
            return error.response.data.message;
        } else if (error.message && error.message !== '') {
            return error.message;
        }
    }
    return 'Unknown error';
};

const extractErrorStatus = (error) => {
    if (error.response && error.response.data) {
        return error.response.data.status;
    }
    return -1;
};

const extractErrorDetails = (error) => {
    const errorMessage = extractErrorMessage(error);
    return {
        status: extractErrorStatus(error),
        message: errorMessage.replace(/^./, errorMessage[0].toUpperCase())
    };
};

export const handleError = (error, notifyFunction, logOutFunction) => {
    let errorDetails = extractErrorDetails(error);
    if (notifyFunction && typeof notifyFunction === 'function') {
        notifyFunction(errorDetails.message);
    }
    if (logOutFunction && typeof logOutFunction === 'function' && errorDetails.status === 401) {
        logOutFunction();
    }
};
