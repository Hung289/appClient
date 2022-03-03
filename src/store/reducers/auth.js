import * as ActionTypes from '../actions';

const getCurrentUser = () => {
    let us = {};
    try {
        us = JSON.parse(localStorage.getItem('userInfo'));
    } catch (e) {
        console.log(e);
    }
    return us;
};
const initialState = {
    isLoggedIn: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    typeUser: '',
    currentUser: getCurrentUser()
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN_USER:
            localStorage.setItem('token', action.token.Token);
            // localStorage.setItem('isAdmin', action.token.IsAdmin);
            // localStorage.setItem('userName', action.token.LoginName);
            return {
                ...state,
                isLoggedIn: true,
                token: action.token.Token,
                currentUser: {
                    ...action.token,
                    userName: action.token.LoginName,
                    email: null,
                    picture: action.token.Avatar,
                    isAdmin: action.token.IsAdmin,
                    typeUser: action.token.TypeUser
                }
            };
        case ActionTypes.LOGOUT_USER:
            localStorage.removeItem('token');
            // localStorage.removeItem('isAdmin');
            // localStorage.removeItem('userName');
            return {
                ...state,
                isLoggedIn: false,
                token: null,
                currentUser: {
                    email: '',
                    picture: null
                }
            };
        case ActionTypes.LOAD_USER:
            localStorage.setItem(
                'userInfo',
                JSON.stringify({
                    ...action.currentUser.Data,
                    userName: action.currentUser.Data.LoginName,
                    email: null,
                    picture: action.currentUser.Data.Avatar,
                    isAdmin: action.currentUser.Data.IsAdmin,
                    typeUser: action.currentUser.Data.TypeUser
                })
            );
            return {
                ...state,
                isLoggedIn: action.currentUser.Status,
                currentUser: {
                    userName: action.currentUser.Data.LoginName,
                    email: null,
                    picture: action.currentUser.Data.Avatar,
                    isAdmin: action.currentUser.Data.IsAdmin,
                    typeUser: action.currentUser.Data.TypeUser,
                    ...action.currentUser.Data
                }
            };
        default:
            return {...state};
    }
};

export default reducer;
