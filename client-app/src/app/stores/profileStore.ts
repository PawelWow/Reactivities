import { toast } from 'react-toastify';

import { RootStore } from './rootStore';
import { action, observable, runInAction, computed, reaction } from 'mobx';
import { IPhoto, IProfile, IUserActivity } from '../models/profile';
import agent from '../api/agent';

export default class ProfileStore {
    rootStore: RootStore
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        reaction(
            () => this.activeTab,
            activeTab => {
                if(activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate)
                } else {
                    this.followings = [];
                }
            }
        );
    }

    @observable profile: IProfile | null = null;

    // Powinno być false. Ustawiliśmy na true, bo dostajemy po drodze nulla, a to jest najprostszy sposób na jego rozwiązanie
    @observable loadingProfile = true;
    
    @observable uploadingPhoto = false;
    @observable loading = false;
    @observable followings: IProfile[] = [];
    @observable activeTab: number = 0;
    @observable userActivities: IUserActivity[] = [];
    @observable loadingActivities = false;

    @computed get isCurrentUser() {
        if(this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        } else {
            return false;
        }
    }

    @action loadUserActivities = async (username: string, predicate?: string) => {
        this.loadingActivities = true;
        try {
            const activities = await agent.Profiles.listActivities(username, predicate!);
            runInAction(() => {
                this.userActivities = activities;                
            });
        } catch (error) {
            toast.error('Problem loading activities');
        }finally{
            runInAction(() => {
                this.loadingActivities = false;
            })
        }
    }

    @action setActiveTab = (activeIndex: number) => {
        this.activeTab = activeIndex;
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

    @action setMainPhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction(() => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(p => p.isMain)!.isMain = false;
                this.profile!.photos.find(p => p.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
            });
        } catch (error) {
            toast.error('Problem setting photo as main');
        }finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    @action deletePhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                this.profile!.photos = this.profile!.photos.filter(p => p.id !== photo.id);
            });
        } catch (error) {
            toast.error('Problem deleting the photo.');
            console.log(error);
        }finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    @action editProfile = async (newValues: Partial<IProfile>) => {

        this.loading = true;
        try {
            await agent.Profiles.update(newValues);
            runInAction(() => {
                if(this.rootStore.userStore.user!.displayName !== newValues.displayName ){
                    this.rootStore.userStore.user!.displayName = newValues.displayName!;
                }

                this.profile = { ...this.profile!, ...newValues };

            });
            
            
        } catch (error) {
            toast.error('Problem editing the profile.');
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    @action follow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.follow(username);
            runInAction(() => {
                this.profile!.following = true;
                this.profile!.followersCount++;
            });
        } catch (error) {
            toast.error('Problem following user...');
        }finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    @action unfollow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.unfollow(username);
            runInAction(() => {
                this.profile!.following = false;
                this.profile!.followersCount--;
            });
        } catch (error) {
            toast.error('Problem unfollowing user...');
        }finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    @action loadFollowings = async (predicate: string) => {
        this.loading = true;
        try {
            const profiles = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = profiles;
            })
        } catch (error) {
            toast.error("Problem loading the followings");
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}