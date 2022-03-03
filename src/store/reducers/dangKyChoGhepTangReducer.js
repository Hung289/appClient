import * as ActionTypes from '../ActionType/DangKyChoGhepTangTypeAction';

const initialState = {
    isInit: false,
    searchModel: {PageIndex: 1, PageSize: 20},
    showDetailModal: false,
    showEditModal: false,
    showEditKQModal: false,
    showDetailKQModal: false,
    showCreateKQModal: false,
    entityKQObj: {},
    showCreateModal: false,
    showChangeStatusModal: false,
    showThongBaoXNModal: false,
    showThongBaoXNModalmuti: false,
    entityObj: {},
    lstEntity: {},
    FileThanDK: {},
    FileKhacDK: {},
    statusNew: '',
    IsUpdate: true,
    typeCreate: '',
    showSearchPanel: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.HASUPDATE_DANGKYCHOGHEPTANG:
            return {
                ...state,
                IsUpdate: true
            };

        case ActionTypes.LOAD_DANGKYCHOGHEPTANG:
            return {
                ...state,
                lstEntity: action.allData,
                IsUpdate: false,
                searchModel: action.searchModelaction
            };
        case ActionTypes.DANGKYCHOGHEPTANG_OPEN_VIEWDETAIL:
            return {
                ...state,
                entityObj: action.entityObj,
                typeCreate: action.typeCreate,
                showDetailModal: true
            };
        case ActionTypes.LOAD_DANGKYCHOGHEPTANG_THAN_PDF:
            return {
                ...state,
                FileThanDK: action.FileThanDK
            };
        case ActionTypes.LOAD_DANGKYCHOGHEPTANG_KHAC_PDF:
            return {
                ...state,
                FileKhacDK: action.FileKhacDK
            };
        case ActionTypes.DANGKYCHOGHEPTANG_OPEN_CREATE:
            return {
                ...state,
                showCreateModal: true
            };
        case ActionTypes.DANGKYCHOGHEPTANG_CLOSE_CREATE:
            return {
                ...state,
                typeCreate: '',
                showCreateModal: false
            };

        case ActionTypes.DANGKYCHOGHEPTANG_CLOSE_VIEWDETAIL:
            return {
                ...state,
                showDetailModal: false
            };
        case ActionTypes.DANGKYCHOGHEPTANG_EDIT_OPEN:
            return {
                ...state,
                entityObj: action.entityObj,
                typeCreate: action.typeCreate,
                showEditModal: true
            };

        case ActionTypes.DANGKYCHOGHEPTANG_EDIT_CLOSE:
            return {
                ...state,
                showEditModal: false
            };
        case ActionTypes.DANGKYCHOGHEPTANG_EDIT_SAVE:
            return {
                ...state,
                showEditModal: false,
                IsUpdate: true
            };

        case ActionTypes.DANGKYCHOGHEPTANG_SEARCH_SAVE:
            return {
                ...state,
                searchModel: action.searchModel,
                IsUpdate: true
            };
        case ActionTypes.DANGKYCHOGHEPTANG_CHANGESTATUS_OPEN:
            return {
                ...state,
                entityObj: action.entityObj,
                statusNew: action.statusNew,
                showChangeStatusModal: true
            };
        case ActionTypes.DANGKYCHOGHEPTANG_CHANGESTATUS_CLOSE:
            return {
                ...state,
                showChangeStatusModal: false
            };
        case ActionTypes.DANGKYCHOGHEPTANG_CHANGESTATUS_SAVE:
            return {
                ...state,
                showChangeStatusModal: false,
                IsUpdate: true
            };
        case ActionTypes.DANGKYCHOGHEPTANG_THONGBAOXN_OPEN:
            return {
                ...state,
                entityObj: action.entityObj,
                showThongBaoXNModal: true
            };
        case ActionTypes.DANGKYCHOGHEPTANG_THONGBAOXNMUTI_OPEN:
            return {
                ...state,
                showThongBaoXNModalmuti: true
            };
        case ActionTypes.DANGKYCHOGHEPTANG_THONGBAOXNMUTI_CLOSE:
            return {
                ...state,
                showThongBaoXNModalmuti: false
            };
        case ActionTypes.DANGKYCHOGHEPTANG_THONGBAOXNMUTI_SAVE:
            return {
                ...state,
                showThongBaoXNModalmuti: false
            };
        case ActionTypes.DANGKYCHOGHEPTANG_THONGBAOXN_CLOSE:
            return {
                ...state,
                showThongBaoXNModal: false
            };
        case ActionTypes.DANGKYCHOGHEPTANG_THONGBAOXN_SAVE:
            return {
                ...state,
                showThongBaoXNModal: false,
                IsUpdate: true
            };
        case ActionTypes.DANGKYCHOGHEPTANG_CHANGETYPECREATE:
            return {
                ...state,
                typeCreate: action.typeCreate
            };
        case ActionTypes.DANGKYCHOGHEPTANG_SEARCHTOGGLE:
            return {
                ...state,
                showSearchPanel: !state.showSearchPanel
            };
        case ActionTypes.KQXETNGHIEM_EDIT_OPEN:
            return {
                ...state,
                entityKQObj: action.entityKQObj,
                showEditKQModal: true
            };
        case ActionTypes.KQXETNGHIEM_EDIT_CLOSE:
            return {
                ...state,
                showEditKQModal: false
            };
        case ActionTypes.KQXETNGHIEM_EDIT_SAVE:
            return {
                ...state,
                showEditKQModal: false,
                IsUpdate: true
            };
        case ActionTypes.KQXETNGHIEM_OPEN_VIEWDETAIL:
            return {
                ...state,
                entityKQObj: action.entityKQObj,
                showDetailKQModal: true
            };

        case ActionTypes.KQXETNGHIEM_CLOSE_VIEWDETAIL:
            return {
                ...state,
                showDetailKQModal: false
            };
        default:
            return {...initialState};
    }
};

export default reducer;
