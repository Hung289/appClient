import * as ActionTypes from '../ActionType/DiachiTypeAction';

const initialState = {
    tinh: '',
    huyen: '',
    data_tinh: [],
    data_huyen: [],
    data_xa: [],
    tinhkhac: '',
    huyenkhac: '',
    data_tinhkhac: [],
    data_huyenkhac: [],
    data_xakhac: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.CHON_TINH:
            return {
                ...state,
                IsUpdate: true
            };

        case ActionTypes.CHON_TINHKHAC:
            return {
                ...state,
                lstTinTuc: action.allData,
                IsUpdate: false,
                searchModel: action.searchModelaction
            };
        case ActionTypes.CHON_HUYEN:
            return {
                ...state,
                tintucObj: action.tintucObj,
                showDetailModal: true
            };
        case ActionTypes.CHON_HUYENKHAC:
            return {
                ...state,
                showDetailModal: false
            };
        case ActionTypes.LOAD_TINH:
            console.log('state:', state);
            return {
                ...state,
                data_tinh: action.value
            };
        default:
            return {...initialState};
    }
};

export default reducer;
