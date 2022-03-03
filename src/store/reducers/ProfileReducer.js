import * as ActionTypes from '../ActionType/AccountTypeAction';

const initialState = {
    entityObj: {},
    showChangePWModal: false,
    isInit: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.LOAD_ACCOUNT_DETAILS:
            return {
                ...state,
                entityObj: action.entityObj,
                isInit: true
            };
        case ActionTypes.ACCOUNT_CHANGEPW_OPEN:
            return {
                ...state,
                showChangePWModal: true
            };
        case ActionTypes.ACCOUNT_CHANGEPW_CLOSE:
            return {
                ...state,
                showChangePWModal: false
            };
        case ActionTypes.ACCOUNT_RSPW_SAVE:
            return {
                ...state,
                showChangePWModal: false
            };
        default:
            return {...initialState};
    }
};

export default reducer;
