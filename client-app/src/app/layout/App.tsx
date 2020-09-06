import React, { useState, useEffect, Fragment, SyntheticEvent, useContext } from 'react';
import {observer} from 'mobx-react-lite';

import { IActivity } from '../models/activity';

import ActivityStore from '../stores/activityStore';

import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { Container } from 'semantic-ui-react';
import agent from '../api/agent';

import LoadingComponent from './LoadingComponent';



const App = () => {
    const activityStore = useContext(ActivityStore);
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [target, setTarget] = useState('');

    const onActivitySelect = (id: string) => {
        setSelectedActivity(activities.filter(activity => activity.id === id)[0]);
        setEditMode(false);
    };

    const onCreateFormOpen = () => {
        setSelectedActivity(null);
        setEditMode(true);

    }    

    const onCreateActivity = (activity: IActivity) => {
        setSubmitting(true);

        agent.Activities.create(activity).then(() => {
            setActivities([...activities, activity]);
            setSelectedActivity(activity);
            setEditMode(false);
        }).then(() => setSubmitting(false));
    };

    const onEditActivity = (activity: IActivity) => {
        setSubmitting(true);

        agent.Activities.update(activity).then(() => {
        // a tutaj spread jest potrzebny? Podobno filter zwróci nam już nową kopię tablicy, więc chyba nie trzeba go używać?
        setActivities([...activities.filter(a => a.id !== activity.id), activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        }).then(() => setSubmitting(false));
    };

    const onDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        setSubmitting(true);
        setTarget(event.currentTarget.name);

        agent.Activities.delete(id).then(()=>{
            setActivities([...activities.filter(a => a.id !== id)]);
        }).then(() => setSubmitting(false));
    };

    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);

    if(activityStore.loadingInitial) {
        return <LoadingComponent content="Loading activities..." />
    }


    return (
        <Fragment>
            <NavBar openCreateForm={onCreateFormOpen} />
            <Container style={{ marginTop: '7em' }}>
                <ActivityDashboard
                    activities={activityStore.activities}
                    selectActivity={onActivitySelect}
                    setEditMode={setEditMode}
                    setSelectedActivity={setSelectedActivity}
                    createACtivity={onCreateActivity}
                    editActivity={onEditActivity}
                    deleteActivity={onDeleteActivity}
                    submitting={submitting}
                    target={target}
                />
            </Container>                
        </Fragment>
    );
}


export default observer(App);
