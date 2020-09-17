import { RootStore } from './rootStore';
import { action, observable, runInAction, computed } from 'mobx';
import { IProfile } from '../models/profile';
import agent from '../api/agent';

export default class ProfileStore {
    rootStore: RootStore
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable profile: IProfile | null = null;

    // Powinno być false. Ustawiliśmy na true, bo dostajemy po drodze nulla, a to jest najprostszy sposób na jego rozwiązanie
    @observable loadingProfile = true;

    @computed get isCurrentUser() {
        if(this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        } else {
            return false;
        }
    }

    @action loadProfile = async(username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);

            runInAction(() => {
                this.profile = profile;            
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loadingProfile = false;
            });
        }
    }
}