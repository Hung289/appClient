import * as ActionTypes from '../ActionType/ChoGhepDaTuChoiTypeAction';

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
        case ActionTypes.LOAD_CHOGHEP_DATUCHOI:
            return {
                ...state,
                lstEntity: action.allData,
                IsUpdate: false,
                searchModel: action.searchModelaction
            };
        default:
            return {...initialState};
    }
};

export default reducer;
