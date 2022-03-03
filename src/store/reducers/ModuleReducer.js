import * as ActionTypes from '../ActionType/ModuleTypeAction';

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
        case ActionTypes.HASUPDATE_MODULE:
            return {
                ...state,
                IsUpdate: true
            };

        case ActionTypes.LOAD_MODULE:
            return {
                ...state,
                lstEntity: action.allData,
                IsUpdate: false,
                searchModel: action.searchModelaction
            };
        case ActionTypes.MODULE_OPEN_VIEWDETAIL:
            return {
                ...state,
                entityObj: action.entityObj,
                showDetailModal: true
            };

        case ActionTypes.MODULE_CLOSE_VIEWDETAIL:
            return {
                ...state,
                showDetailModal: false
            };
        case ActionTypes.MODULE_EDIT_OPEN:
            return {
                ...state,
                entityObj: action.entityObj,
                showEditModal: true
            };

        case ActionTypes.MODULE_EDIT_CLOSE:
            return {
                ...state,
                showEditModal: false
            };
        case ActionTypes.MODULE_EDIT_SAVE:
            return {
                ...state,
                showEditModal: false,
                IsUpdate: true
            };

        case ActionTypes.MODULE_SEARCH_SAVE:
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
