import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { IActivity } from '../models/activity';

import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { Container } from 'semantic-ui-react';

const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    const [editMode, setEditMode] = useState(false);

    const onActivitySelect = (id: string) => {
        setSelectedActivity(activities.filter(activity => activity.id === id)[0]);
        setEditMode(false);
    };

    const onCreateFormOpen = () => {
        setSelectedActivity(null);
        setEditMode(true);
    }    

    const onCreateActivity = (activity: IActivity) => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
    };

    const onEditActivity = (activity: IActivity) => {
        // a tutaj spread jest potrzebny? Podobno filter zwróci nam już nową kopię tablicy, więc chyba nie trzeba go używać?
        setActivities([...activities.filter(a => a.id !== activity.id), activity]);
        setSelectedActivity(activity);
        setEditMode(false);
    };

    useEffect(() => {
        axios.get<IActivity[]>('http://localhost:5000/api/activities').then(response => {
            let activities: IActivity[] = [];
            response.data.forEach(activity => {
                activity.date = activity.date.split('.')[0];
                activities.push(activity);
            });
            setActivities(activities);
        });
    }, []);


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
                />
            </Container>                
        </Fragment>
    );
}


export default App;
