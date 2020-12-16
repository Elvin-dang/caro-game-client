import axiosClient from './axiosClient';

const oauthApi =  {
    googleLogin: (data) => {
        const url = 'oauth/google';
        return axiosClient.post(url, data);
    },
    facebookLogin: (data) => {
        const url = 'oauth/facebook';
        return axiosClient.post(url, data);
    },
    getCurUser: () => {
        const url = 'user';
        return axiosClient.get(url);
    }
}

export default oauthApi;