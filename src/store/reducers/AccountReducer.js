import * as ActionTypes from '../ActionType/AccountTypeAction';

const initialState = {
    isInit: false,
    searchModel: {PageIndex: 1, PageSize: 20},
    showDetailModal: false,
    showEditModal: false,
    entityObj: {},
    lstEntity: {},
    IsUpdate: true
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.HASUPDATE_ACCOUNT:
            return {
                ...state,
                IsUpdate: true
            };

        case ActionTypes.LOAD_ACCOUNT:
            return {
                ...state,
                lstEntity: action.allData,
                IsUpdate: false,
                searchModel: action.searchModelaction
            };
        case ActionTypes.ACCOUNT_OPEN_VIEWDETAIL:
            return {
                ...state,
                entityObj: action.entityObj,
                showDetailModal: true
            };

        case ActionTypes.ACCOUNT_CLOSE_VIEWDETAIL:
            return {
                ...state,
                showDetailModal: false
            };
        case ActionTypes.ACCOUNT_EDIT_OPEN:
            return {
                ...state,
                entityObj: action.entityObj,
                showEditModal: true
            };

        case ActionTypes.ACCOUNT_EDIT_CLOSE:
            return {
                ...state,
                showEditModal: false
            };
        case ActionTypes.ACCOUNT_EDIT_SAVE:
            return {
                ...state,
                showEditModal: false,
                IsUpdate: true
            };
        case ActionTypes.ACCOUNT_SEARCH_SAVE:
            return {
                ...state,
                searchModel: action.searchModel,
                IsUpdate: true
            };
        case ActionTypes.ACCOUNT_RSPW_OPEN:
            return {
                ...state,
                entityObj: action.entityObj,
                showRSPWModal: true
            };
        case ActionTypes.ACCOUNT_RSPW_CLOSE:
            return {
                ...state,
                showRSPWModal: false
            };
        case ActionTypes.ACCOUNT_RSPW_SAVE:
            return {
                ...state,
                showRSPWModal: false,
                IsUpdate: true
            };
        default:
            return {...initialState};
    }
};

export default reducer;
