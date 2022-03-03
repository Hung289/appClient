import * as ActionTypes from '../ActionType/KQXetNghiemTypeAction';

const initialState = {
    isInit: false,
    searchModel: {PageIndex: 1, PageSize: 20},
    showDetailKQModal: false,
    showEditKQModal: false,
    showCreateKQModal: false,
    entityKQObj: {},
    lstEntity: {},
    statusNew: '',
    IsUpdate: true,
    showSearchPanel: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.HASUPDATE_KQXETNGHIEM:
            return {
                ...state,
                IsUpdate: true
            };

        case ActionTypes.LOAD_KQXETNGHIEM:
            return {
                ...state,
                lstEntity: action.allData,
                IsUpdate: false,
                searchModel: action.searchModelaction
            };
        case ActionTypes.KQXETNGHIEM_OPEN_VIEWDETAIL:
            return {
                ...state,
                entityKQObj: action.entityKQObj,
                showDetailKQModal: true
            };
        case ActionTypes.KQXETNGHIEM_OPEN_CREATE:
            return {
                ...state,
                showCreateKQModal: true
            };
        case ActionTypes.KQXETNGHIEM_CLOSE_CREATE:
            return {
                ...state,
                showCreateKQModal: false
            };

        // case ActionTypes.KQXETNGHIEM_CLOSE_VIEWDETAIL:
        //     return {
        //         ...state,
        //         showDetailKQModal: false
        //     };
        // case ActionTypes.KQXETNGHIEM_EDIT_OPEN:
        //     return {
        //         ...state,
        //         entityKQObj: action.entityKQObj,
        //         showEditKQModal: true
        //     };

        // case ActionTypes.KQXETNGHIEM_EDIT_CLOSE:
        //     return {
        //         ...state,
        //         showEditKQModal: false
        //     };
        // case ActionTypes.KQXETNGHIEM_EDIT_SAVE:
        //     return {
        //         ...state,
        //         showEditKQModal: false,
        //         IsUpdate: true
        //     };

        case ActionTypes.KQXETNGHIEM_SEARCH_SAVE:
            return {
                ...state,
                searchModel: action.searchModel,
                IsUpdate: true
            };

        case ActionTypes.KQXETNGHIEM_SEARCHTOGGLE:
            return {
                ...state,
                showSearchPanel: !state.showSearchPanel
            };

        default:
            return {...initialState};
    }
};

export default reducer;
