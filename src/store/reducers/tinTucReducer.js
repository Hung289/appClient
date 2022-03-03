import * as ActionTypes from '../ActionType/TinTucTypeAction';

const initialState = {
    isInit: false,
    searchModel: {PageIndex: 1, PageSize: 20},
    showDetailModal: false,
    showEditModal: false,
    tintucObj: {},
    lstTinTuc: {},
    lstCatetory: [],
    IsUpdate: true
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.HASUPDATE_TINTUC:
            return {
                ...state,
                IsUpdate: true
            };

        case ActionTypes.LOAD_TINTUC:
            return {
                ...state,
                lstTinTuc: action.allData,
                IsUpdate: false,
                searchModel: action.searchModelaction
            };
        case ActionTypes.TINTUC_OPEN_VIEWDETAIL:
            return {
                ...state,
                tintucObj: action.tintucObj,
                showDetailModal: true
            };

        case ActionTypes.TINTUC_CLOSE_VIEWDETAIL:
            return {
                ...state,
                showDetailModal: false
            };
        case ActionTypes.TINTUC_EDIT_OPEN:
            return {
                ...state,
                tintucObj: action.tintucObj,
                showEditModal: true
            };

        case ActionTypes.TINTUC_EDIT_CLOSE:
            return {
                ...state,
                showEditModal: false
            };
        case ActionTypes.TINTUC_EDIT_SAVE:
            return {
                ...state,
                showEditModal: false,
                IsUpdate: true
            };
        case ActionTypes.TINTUC_GET_CATEGORY:
            return {
                ...state,
                lstCatetory: action.lstCatetory,
                isInit: true
            };
        case ActionTypes.TINTUC_SEARCH_SAVE:
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
