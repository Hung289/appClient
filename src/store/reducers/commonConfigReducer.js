import * as ActionTypes from '../ActionType/CommonConfigTypeAction';

const initialState = {
    isInit: false,
    searchModel: {PageIndex: 1, PageSize: 20},
    showDetailModal: false,
    showEditModal: false,
    entityObj: {},
    lstEntity: {},
    IsUpdate: true,
    IsShowSearch: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.HASUPDATE_COMMONCONFIG:
            return {
                ...state,
                IsUpdate: true
            };

        case ActionTypes.LOAD_COMMONCONFIG:
            return {
                ...state,
                lstEntity: action.allData,
                IsUpdate: false,
                searchModel: action.searchModelaction
            };
        case ActionTypes.COMMONCONFIG_OPEN_VIEWDETAIL:
            return {
                ...state,
                entityObj: action.entityObj,
                showDetailModal: true
            };

        case ActionTypes.COMMONCONFIG_CLOSE_VIEWDETAIL:
            return {
                ...state,
                showDetailModal: false
            };
        case ActionTypes.COMMONCONFIG_EDIT_OPEN:
            return {
                ...state,
                entityObj: action.entityObj,
                showEditModal: true
            };

        case ActionTypes.COMMONCONFIG_EDIT_CLOSE:
            return {
                ...state,
                showEditModal: false
            };
        case ActionTypes.COMMONCONFIG_EDIT_SAVE:
            return {
                ...state,
                showEditModal: false,
                IsUpdate: true
            };

        case ActionTypes.COMMONCONFIG_SEARCH_SAVE:
            return {
                ...state,
                searchModel: action.searchModel,
                IsUpdate: true
            };
        case ActionTypes.COMMONCONFIG_SEARCH_TOGGLE:
            return {
                ...state,
                IsShowSearch: !state.IsShowSearch
            };

        default:
            return {...initialState};
    }
};

export default reducer;
