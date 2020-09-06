import { createContext, SyntheticEvent } from 'react';
import { observable, action, computed } from 'mobx';
import { IActivity } from '../models/activity';

import agent from '../api/agent';

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined;
    @observable loadingInitial = false;
    @observable editMode = false;
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
            activities.forEach(activity => {
                activity.date = activity.date.split('.')[0];
                this.activityRegistry.set(activity.id, activity);
            });
        } catch (error) {
            console.log(error);
        } finally {
            this.loadingInitial = false;
        }
    };

    @action openCreateForm = () => {
        this.selectedActivity = undefined;
        this.editMode = true;
    }

    @action openEditForm = (id: string) => {
        this.selectActivity = this.activityRegistry.get(id);
        this.editMode = true;
    }

    @action cancelFormOpen = () => {
        this.editMode = false;
    }

    @action cancelSelectActivity = () => {
        this.selectedActivity = undefined;
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            this.activityRegistry.set(activity.id, activity);
            this.selectedActivity = activity;
         
        } catch (error) {
            console.log(error);
        } finally {
            this.submitting = false;
            this.editMode = false;
        }
    }

    @action editActivity = async(activity: IActivity) => {
        this.submitting = true;
        this.editMode = true;

        try {
            await agent.Activities.update(activity);
            this.activityRegistry.set(activity.id, activity);
            this.selectedActivity = activity;

        } catch (error) {
            console.log(error);
        }finally {
            this.submitting = false;
            this.editMode = false;
        }
    }

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    };

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            this.activityRegistry.delete(id);
        } catch (error) {
            console.log(error);
        } finally {
            this.submitting = false;
            this.target = '';
        }
    }


}

export default createContext(new ActivityStore());