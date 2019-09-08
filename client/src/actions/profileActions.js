import axios from 'axios';
import {GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_REQUESTS, GET_ERRORS} from "./types";

//Get current profile
export const getCurrentProfile = () => dispatch => {
    dispatch(setProfileLoading());
    axios.get('/api/users/current')
        .then(res =>
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_PROFILE,
                payload: {}
            })
        )
};

//Profile loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    }
};

//Clear profile
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    }
};

//Get requests from current user
export const getRequests = id => dispatch => {
    dispatch(setProfileLoading());
    axios
        .get(`/api/request/user/${id}`)
        .then(res =>
            dispatch({
                type: GET_REQUESTS,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_REQUESTS,
                payload: null
            })
        );
};

//Create a new request
export const createRequest = (newData, history) => dispatch => {
    axios.post('api/request/user/', newData)
        .then(res =>
                dispatch({
                    type: GET_REQUESTS,
                    payload: res.data
                }),
            history.push('/login'),
        )
        .catch(err =>
            dispatch({
                type: GET_REQUESTS,
                payload: null
            })
        )
};

//Delete a request from the list
export const deleteRequest = (id, history) => dispatch => {
    axios.delete(`api/request/user/${id}`)
        .then(res =>
                dispatch({
                    type: GET_REQUESTS,
                    payload: res.data
                }),
            history.push('/main'),
        )
        .catch(err =>
            dispatch({
                type: GET_REQUESTS,
                payload: null
            })
        )
};