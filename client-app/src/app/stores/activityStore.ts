import { createContext } from 'react';
import { observable, action } from 'mobx';
import { IActivity } from '../models/activity';

import agent from '../api/agent';

class ActivityStore {
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined;
    @observable loadingInitial = false;
    @observable editMode = false;

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                activity.date = activity.date.split('.')[0];
                this.activities.push(activity);
            });
        } catch (error) {
            console.log(error);
        } finally {
            this.loadingInitial = false;
        }
    };

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activities.find(activity => activity.id === id);
        this.editMode = false;
    };
}

export default createContext(new ActivityStore());