import * as ActionTypes from '../ActionType/DangKyHienTangChoTiepNhanTypeAction';

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
        case ActionTypes.LOAD_DANGKYHIENTANGCHOTIEPNHAN_TYPE:
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
