import React, { useEffect, Fragment, useContext } from 'react';
import {observer} from 'mobx-react-lite';
import { Route } from 'react-router-dom';

import ActivityStore from '../stores/activityStore';
import NavBar from '../../features/nav/NavBar';
import HomePage from '../../features/home/HomePage';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import { Container } from 'semantic-ui-react';
import LoadingComponent from './LoadingComponent';

const App = () => {
    const activityStore = useContext(ActivityStore);

    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);

    if(activityStore.loadingInitial) {
        return <LoadingComponent content="Loading activities..." />
    }

    return (
        <Fragment>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
                <Route exact path='/' component={HomePage} />
                <Route exact path='/activities' component={ActivityDashboard} />
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route path='/createActivity' component={ActivityForm} />
            </Container>                
        </Fragment>
    );
}


export default observer(App);
