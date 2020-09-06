import React, { useEffect, Fragment, useContext } from 'react';
import {observer} from 'mobx-react-lite';

import ActivityStore from '../stores/activityStore';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
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
                <ActivityDashboard />
            </Container>                
        </Fragment>
    );
}


export default observer(App);
