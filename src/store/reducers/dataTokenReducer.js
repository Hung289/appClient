import * as ActionTypes from '../ActionType/DataTokenTypeAction';

const initialState = {
    value: ''
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.UPDATE_DATA_FROM_TOKEN:
            return {
                value: action.value
            };
        default:
            return {...initialState};
    }
};

export default reducer;
