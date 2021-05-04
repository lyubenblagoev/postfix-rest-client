const emailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;

export const validateEmail = (email) => email.match(emailFormat);