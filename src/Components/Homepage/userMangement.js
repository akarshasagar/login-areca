let isUserPresent = false;
let userData = null;
let userDetails = null;

export const setUserPresent = (value) => {
    isUserPresent = value;
};

export const setUserData = (data) => {
    userData = data;
};

export const setUserDetails = (details) => {
    userDetails = details;
};

export const getUserPresent = () => isUserPresent;
export const getUserData = () => userData;
export const getUserDetails = () => userDetails;