import React, { useState, useEffect, Fragment } from 'react';
import { IActivity } from '../models/activity';

import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { Container } from 'semantic-ui-react';
import agent from '../api/agent';

import LoadingComponent from './LoadingComponent';

const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    const onActivitySelect = (id: string) => {
        setSelectedActivity(activities.filter(activity => activity.id === id)[0]);
        setEditMode(false);
    };

    const onCreateFormOpen = () => {
        setSelectedActivity(null);
        setEditMode(true);

    }    

    const onCreateActivity = (activity: IActivity) => {
        agent.Activities.create(activity).then(() => {
            setActivities([...activities, activity]);
            setSelectedActivity(activity);
            setEditMode(false);
        });
    };

    const onEditActivity = (activity: IActivity) => {
        agent.Activities.update(activity).then(() => {
        // a tutaj spread jest potrzebny? Podobno filter zwróci nam już nową kopię tablicy, więc chyba nie trzeba go używać?
        setActivities([...activities.filter(a => a.id !== activity.id), activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        });
    };

    const onDeleteActivity = (id: string) => {
        agent.Activities.delete(id).then(()=>{
            setActivities([...activities.filter(a => a.id !== id)]);
        });
    };

    useEffect(() => {
        agent.Activities.list().then(response => {
            let activities: IActivity[] = [];
            response.forEach(activity => {
                activity.date = activity.date.split('.')[0];
                activities.push(activity);
            });
            setActivities(activities);
        }).then(() => setLoading(false));
    }, []);

    if(loading) {
        return <LoadingComponent content="Loading activities..." />
    }


    return (
        <Fragment>
            <NavBar openCreateForm={onCreateFormOpen} />
            <Container style={{ marginTop: '7em' }}>
                <ActivityDashboard
                    activities={activities}
                    selectActivity={onActivitySelect}
                    selectedActivity={selectedActivity!}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    setSelectedActivity={setSelectedActivity}
                    createACtivity={onCreateActivity}
                    editActivity={onEditActivity}
                    deleteActivity={onDeleteActivity}
                />
            </Container>                
        </Fragment>
    );
}


export default App;
