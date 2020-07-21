import {createStore} from 'redux';

export default createStore(function(state, action){
    console.log(state, action);
    if(state === undefined){
        return {user:""}
    }
    if(action.type === 'CREATE_USER'){
        //return {...state, user:action.user}
        return {...state, user:action.user, roomId:action.roomId, sellerId:action.sellerId}
    }
    return state;
},  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)