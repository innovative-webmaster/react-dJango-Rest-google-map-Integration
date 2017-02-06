import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authReducer from './auth';
import dataReducer from './data';
import accountReducer from './account';
import buildingReducer from './building';
import neighborhoodReducer from './neighborhood';
import unitReducer from './unit';
import reviewReducer from './review';
import userReducer from './user';

export default combineReducers({
    auth: authReducer,
    data: dataReducer,
    building: buildingReducer,
    neighborhood: neighborhoodReducer,
    routing: routerReducer,
    unit: unitReducer,
    review: reviewReducer,
    user: userReducer,
    account: accountReducer
});
