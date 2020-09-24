import axios, { AxiosResponse } from 'axios';
import { IActivitiesEnvelope, IActivity } from '../models/activity';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';
import { IPhoto, IProfile } from '../models/profile';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('jwt');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(undefined, error => {

    // ale to jest słabe!!!
    if(error.message === 'Network Error' && !error.response){
        toast.error('Network error!');
    }

    const {status, data, config, headers} = error.response;

    if(status === 401 && isTokenExpiredRespone(headers['www-authenticate'])){
        console.log('here!');
        window.localStorage.removeItem('jwt');
        history.push('/');
        toast.info('Your session has expired. Login again.');
    }

    const notFound = '/notfound';

    if(status === 404) {
        // dzięki temu nie trzeba na każdym komponencie tego sprawdzać, nie trzeba przerzucać errorów
        history.push(notFound);
    }

    if(status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push(notFound);
    }

    if(status === 500) {
        toast.error('Server error - check the terminal to see more details!');
    }

    throw error.response;

});

// very primitive way to say the token is expired.
// In fact I've got header: e.g. Bearer error="invalid_token", error_description="The token expired at '09/24/2020 08:19:04'
// another version of API could have: Bearer error="invalid_token", error_description="The token is expired"
// So let's say the token is expired when that text (header) contains 'invalid_token' and 'expired' keywords.
// However it is very poor solution because the text can change
const isTokenExpiredRespone = (header: string): boolean => {
    var headerText = header.toLocaleLowerCase();

    const conditionInvalidToken = "invalid_token";
    const conditionExpired = "expired";

    return headerText.includes(conditionInvalidToken) && headerText.includes(conditionExpired);
}

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
    postForm: (url: string, file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post(url, formData, {
            headers: {'Content-type': 'multipart/form-data'}
        }).then(responseBody);
    }
};

const Activities = {
    list: (params: URLSearchParams): Promise<IActivitiesEnvelope> => 
        axios.get('/activities', {params: params}).then(responseBody),

    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
    attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
    unattend: (id: string) => requests.del(`/activities/${id}/attend`)

};

const User = {
    current: (): Promise<IUser> => requests.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => requests.post('/user/login', user),
    register: (user: IUserFormValues): Promise<IUser> => requests.post('/user/register', user),
};

const Profiles = {
    get: (username: string): Promise<IProfile> => requests.get(`/profiles/${username}`),
    update: (data: Partial<IProfile>) => requests.put('/profiles', data),
    uploadPhoto: (photo: Blob): Promise<IPhoto> => requests.postForm(`/photos`, photo),
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.del(`/photos/${id}`),  
    follow: (username: string) => requests.post(`/profiles/${username}/follow`, {}),
    unfollow: (username: string) => requests.del(`/profiles/${username}/follow`),
    
    listFollowings: (username: string, predicate: string) => 
        requests.get(`/profiles/${username}/follow?predicate=${predicate}`),

    listActivities: (username: string, predicate: string) => 
        requests.get(`/profiles/${username}/activities?predicate=${predicate}`)
}

export default {
    Activities,
    User,
    Profiles
}