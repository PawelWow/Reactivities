import { observable, action, computed, runInAction } from 'mobx';
import { IUser, IUserFormValues } from '../models/user';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { history } from '../..';

export default class UserStore {
    refreshTokenTimout: any;
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }
    
    @observable user: IUser | null = null;
    @observable loading: boolean = false;

    @computed get isLoggedIn() { return !!this.user }

    @action login = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.login(values);
            runInAction(() => {
                this.user = user;
            });

            this.rootStore.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);

            this.rootStore.modalStore.closeModal();
            history.push('/activities');
            
        } catch (error) {
            throw error;
        }
    }

    @action logout = () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/');
    }

    @action fbLogin = async (response: any) => {
        this.loading = true;
        try {
            const user = await agent.User.fbLogin(response.accessToken);
            
            runInAction(() => {
                this.user = user;
                this.rootStore.commonStore.setToken(user.token);
                this.startRefreshTokenTimer(user);
                this.rootStore.modalStore.closeModal();
            });

            history.push('/activities');
        } catch (error) {
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }

    }

    @action register = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.register(values);
            this.rootStore.modalStore.closeModal();
            history.push('/user/registerSuccess?email=' + values.email);
        } catch (error) {
            throw error;
        }
    }

    @action refreshToken = async () => {
        this.stopRefreshTokenTimer();
        try {
            const user = await agent.User.refreshToken();
            runInAction(() => {
                this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);

        } catch (error) {
            console.log(error);
        }
    }

    @action getUser = async () => {
        try {
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            });

            this.rootStore.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    }

    private startRefreshTokenTimer(user: IUser) {
        // get payload from token (expire time)
        const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000);

        // 1 minute before
        const timeout = expires.getTime() - Date.now() - (60 * 1000);

        this.refreshTokenTimout = setTimeout(this.refreshToken, timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimout);
    }
}