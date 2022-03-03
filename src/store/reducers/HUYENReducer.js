import * as ActionTypes from '../ActionType/HUYENTypeAction';

const initialState = {
    isInit: false,
    searchModel: {PageIndex: 1, PageSize: 20},
    showDetailModal: false,
    showEditModal: false,
    entityObj: {},
    lstEntity: {},
    TinhInfo: {},
    IsUpdate: true
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.HASUPDATE_HUYEN:
            return {
                ...state,
                IsUpdate: true
            };

        case ActionTypes.LOAD_HUYEN:
            return {
                ...state,
                lstEntity: action.allData,
                IsUpdate: false,

                searchModel: action.searchModelaction
            };
        case ActionTypes.LOAD_HUYEN_PARRENT:
            return {
                ...state,

                TinhInfo: action.TinhInfo
            };
        case ActionTypes.HUYEN_OPEN_VIEWDETAIL:
            return {
                ...state,
                entityObj: action.entityObj,
                showDetailModal: true
            };

        case ActionTypes.HUYEN_CLOSE_VIEWDETAIL:
            return {
                ...state,
                showDetailModal: false
            };
        case ActionTypes.HUYEN_EDIT_OPEN:
            return {
                ...state,
                entityObj: action.entityObj,
                showEditModal: true
            };

        case ActionTypes.HUYEN_EDIT_CLOSE:
            return {
                ...state,
                showEditModal: false
            };
        case ActionTypes.HUYEN_EDIT_SAVE:
            return {
                ...state,
                showEditModal: false,
                IsUpdate: true
            };

        case ActionTypes.HUYEN_SEARCH_SAVE:
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
