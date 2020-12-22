import axiosClient from './axiosClient';

const userApi = {
    signin: (user) => {
        const url = 'user/signin';
        return axiosClient.post(url, user);
    },
    signup: (user) => {
        const url = 'user/signup';
        return axiosClient.post(url, user); 
    },
    getUser: (userId) => {
        const url = `user/${userId}`;
        return axiosClient.get(url);
    },
    getCurUser: () => {
        const url = 'user';
        return axiosClient.get(url);
    },
    activeAccount: (token) => {
        const url = 'user/active';
        return axiosClient.post(url, {
            token: token
        });
    },
    forgetPassword: (email) => {
        const url = 'user/forgetPassword';
        return axiosClient.post(url, {
            email: email
        });
    },
    confirmToken: (token) => {
        const url = 'user/confirmToken';
        return axiosClient.post(url, {
            token: token
        });
    },
    resetPassword: (token, password) => {
        const url = 'user/resetPassword';
        return axiosClient.post(url, {
            token: token,
            password: password
        });
    },
    // checkLogin: () => {
    //     const url = 'user/checkLogin';
    //     return axiosClient.post(url);
    // },
    // changePassword: (data) => {
    //     const url = 'user/changePassword';
    //     return axiosClient.post(url, data);
    // },
    // updateUser: (id, user) => {
    //     const url = `user/${id}`;
    //     return axiosClient.patch(url, user);
    // }
};
export default userApi;