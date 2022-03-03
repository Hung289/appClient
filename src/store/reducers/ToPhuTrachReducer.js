import * as ActionTypes from '../ActionType/ToPhuTrachTypeAction';

const initialState = {
    isInit: false,
    searchModel: {PageIndex: 1, PageSize: 5},
    showDetailModal: false,
    showEditModal: false,
    entityObj: {},
    lstEntity: {},
    IsUpdate: true
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.HASUPDATE_TOPHUTRACH:
            return {
                ...state,
                IsUpdate: true
            };

        case ActionTypes.LOAD_TOPHUTRACH:
            return {
                ...state,
                lstEntity: action.allData,
                IsUpdate: false,
                searchModel: action.searchModelaction
            };
        case ActionTypes.TOPHUTRACH_OPEN_VIEWDETAIL:
            return {
                ...state,
                entityObj: action.entityObj,
                showDetailModal: true
            };

        case ActionTypes.TOPHUTRACH_CLOSE_VIEWDETAIL:
            return {
                ...state,
                showDetailModal: false
            };
        case ActionTypes.TOPHUTRACH_EDIT_OPEN:
            return {
                ...state,
                entityObj: action.entityObj,
                showEditModal: true
            };

        case ActionTypes.TOPHUTRACH_EDIT_CLOSE:
            return {
                ...state,
                showEditModal: false
            };
        case ActionTypes.TOPHUTRACH_EDIT_SAVE:
            return {
                ...state,
                showEditModal: false,
                IsUpdate: true
            };

        case ActionTypes.TOPHUTRACH_SEARCH_SAVE:
            return {
                ...state,
                searchModel: action.searchModel,
                IsUpdate: true
            };

        default:
            return {...initialState};
    }
};

export default reducer;
