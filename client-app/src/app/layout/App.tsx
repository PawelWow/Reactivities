import React, { useEffect, Fragment, useContext } from 'react';
import {observer} from 'mobx-react-lite';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';

import ActivityStore from '../stores/activityStore';
import NavBar from '../../features/nav/NavBar';
import HomePage from '../../features/home/HomePage';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import { Container } from 'semantic-ui-react';
import LoadingComponent from './LoadingComponent';

const App: React.FC<RouteComponentProps> = ({location}) => {
    const activityStore = useContext(ActivityStore);

    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);

    if(activityStore.loadingInitial) {
        return <LoadingComponent content="Loading activities..." />
    }

    return (
        <Fragment>
            <Route exact path='/' component={HomePage} />
            <Route path={'/(.+)'} render={() => (
                <Fragment>
                    <NavBar />
                    <Container style={{ marginTop: '7em' }}>
                        <Route exact path='/activities' component={ActivityDashboard} />
                        <Route path='/activities/:id' component={ActivityDetails} />
                        <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
                    </Container>   
                </Fragment>
            )} />
             
        </Fragment>
    );
}


export default withRouter(observer(App));
