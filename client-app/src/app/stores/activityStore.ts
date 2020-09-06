import { createContext, SyntheticEvent } from 'react';
import { observable, action, computed, configure, runInAction } from 'mobx';
import { IActivity } from '../models/activity';

import agent from '../api/agent';

configure({enforceActions: 'always'});

export class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target: string = '';

    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );
    };

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction('loading activities', () => {
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity);
                });
            });

        } catch (error) {
            runInAction(() => {
                console.log(error);
            });

        } finally {
            runInAction(() => {
                this.loadingInitial = false;
            });

        }
    };

    @action loadActivity = async(id: string) => {
        let activity = this.getActivity(id);
        if(activity) {
            this.activity = activity;
        }
        else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('getting activity', () =>{
                    this.activity = activity;
                });
            } catch (error) {
                runInAction(() =>{
                    console.log(error);
                });
                
            } finally {
                runInAction(() =>{
                    this.loadingInitial = false;
                });
                
            }
            
        }

    };

    @action clearActivity = () => {
        this.activity = null;
    };

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    };

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('creating new activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
            });

         
        } catch (error) {
            runInAction(() => {
                console.log(error);
            });

        } finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    };

    @action editActivity = async(activity: IActivity) => {
        this.submitting = true;

        try {
            await agent.Activities.update(activity);
            runInAction('editing activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
            });


        } catch (error) {
            runInAction(() => {
                console.log(error);
            });

        }finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    };

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('deleting activity', () => {
                this.activityRegistry.delete(id);
            });

        } catch (error) {
            runInAction(() => {
                console.log(error);
            });
        } finally {
            runInAction(() => {
                this.submitting = false;
                this.target = '';
            });
        }
    };
}

export default createContext(new ActivityStore());