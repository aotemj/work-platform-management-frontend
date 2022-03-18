import {GET_USERS_FROM_ONE} from '../actions/actionTypes';

const initialState = {
    users: {
        list: [],
        map: new Map(),
    },
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_USERS_FROM_ONE:
            return {
                ...state,
                users: action.payload,
            };
        default: {
            return state;
        }
    }
};
