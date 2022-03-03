import * as ActionTypes from '../ActionType/DangKyHienTangTypeAction';

const initialState = {
    isInit: false,
    searchModel: {PageIndex: 1, PageSize: 20},
    showDetailModal: false,
    showEditModal: false,
    showChangeStatusModal: false,
    statusNew: '',
    entityObj: {},
    lstEntityByStatus: {},
    lstEntity: {},
    FileDK: {},
    IsUpdate: true
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.HASUPDATE_DANGKYHIENTANG:
            return {
                ...state,
                IsUpdate: true
            };

        case ActionTypes.LOAD_DANGKYHIENTANG:
            return {
                ...state,
                lstEntity: action.allData,
                IsUpdate: false,
                searchModel: action.searchModelaction
            };
        // case ActionTypes.LOAD_DANGKYHIENTANG_TYPE:
        //     return {
        //         ...state,
        //         lstEntityByStatus: action.allData,
        //         IsUpdate: false,
        //         searchModel: action.searchModelaction
        //     };
        case ActionTypes.LOAD_DANGKYHIENTANG_FILE:
            return {
                ...state,
                FileDK: action.FileDK
            };
        case ActionTypes.DANGKYHIENTANG_OPEN_VIEWDETAIL:
            return {
                ...state,
                entityObj: action.entityObj,
                showDetailModal: true
            };

        case ActionTypes.DANGKYHIENTANG_CLOSE_VIEWDETAIL:
            return {
                ...state,
                showDetailModal: false
            };
        case ActionTypes.DANGKYHIENTANG_EDIT_OPEN:
            return {
                ...state,
                entityObj: action.entityObj,
                showEditModal: true
            };

        case ActionTypes.DANGKYHIENTANG_EDIT_CLOSE:
            return {
                ...state,
                showEditModal: false
            };
        case ActionTypes.DANGKYHIENTANG_EDIT_SAVE:
            return {
                ...state,
                showEditModal: false,
                IsUpdate: true
            };

        case ActionTypes.DANGKYHIENTANG_SEARCH_SAVE:
            return {
                ...state,
                searchModel: action.searchModel,
                IsUpdate: true
            };
        case ActionTypes.DANGKYHIENTANG_CHANGESTATUS_OPEN:
            return {
                ...state,
                entityObj: action.entityObj,
                statusNew: action.statusNew,
                showChangeStatusModal: true
            };

        case ActionTypes.DANGKYHIENTANG_CHANGESTATUS_CLOSE:
            return {
                ...state,
                showChangeStatusModal: false
            };
        case ActionTypes.DANGKYHIENTANG_CHANGESTATUS_SAVE:
            return {
                ...state,
                showChangeStatusModal: false,
                IsUpdate: true
            };
        default:
            return {...initialState};
    }
};

export default reducer;
