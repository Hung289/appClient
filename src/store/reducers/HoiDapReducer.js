import * as ActionTypes from '../ActionType/HoiDapTypeAction';

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
        case ActionTypes.HASUPDATE_HOIDAP:
            return {
                ...state,
                IsUpdate: true
            };

        case ActionTypes.LOAD_HOIDAP:
            return {
                ...state,
                lstEntity: action.allData,
                IsUpdate: false,
                searchModel: action.searchModelaction
            };
        case ActionTypes.HOIDAP_OPEN_VIEWDETAIL:
            return {
                ...state,
                entityObj: action.entityObj,
                showDetailModal: true
            };

        case ActionTypes.HOIDAP_CLOSE_VIEWDETAIL:
            return {
                ...state,
                showDetailModal: false
            };
        case ActionTypes.HOIDAP_EDIT_OPEN:
            return {
                ...state,
                entityObj: action.entityObj,
                showEditModal: true
            };

        case ActionTypes.HOIDAP_EDIT_CLOSE:
            return {
                ...state,
                showEditModal: false
            };
        case ActionTypes.HOIDAP_EDIT_SAVE:
            return {
                ...state,
                showEditModal: false,
                IsUpdate: true
            };

        case ActionTypes.HOIDAP_SEARCH_SAVE:
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
