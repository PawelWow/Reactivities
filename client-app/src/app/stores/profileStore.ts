import { toast } from 'react-toastify';

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
    
    @observable uploadingPhoto = false;

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

    @action uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;

        try {
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction(() => {
                if(this.profile) {
                    this.profile.photos.push(photo);
                    if(photo.isMain && this.rootStore.userStore.user){
                        // Bez sensu trochę - czy jest możłiwość, żeby drugi warunek nie był spełniony (user)?
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url
                    }
                }
            })
        } catch (error) {
            console.log(error);
            toast.error('Problem uploading photo');
            
        } finally {
            runInAction(() => {
                this.uploadingPhoto = false;
            });
            
        }
    }
}