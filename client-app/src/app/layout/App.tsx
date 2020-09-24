import React, { Fragment, useContext, useEffect } from 'react';
import {observer} from 'mobx-react-lite';
import { Route, withRouter, RouteComponentProps, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { ToastContainer } from 'react-toastify';

import NavBar from '../../features/nav/NavBar';
import HomePage from '../../features/home/HomePage';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import ModalContainer from '../common/modals/ModalContainer';
import {RootStoreContext} from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoute from './PrivateRoute';

const App: React.FC<RouteComponentProps> = ({location}) => {

    const rootStore = useContext(RootStoreContext);
    const { setAppLoaded, token, appLoaded} = rootStore.commonStore;
    const {getUser} = rootStore.userStore;

    useEffect(() => {
        if(token) {
            getUser().finally(() => setAppLoaded());
        } else {
            setAppLoaded();
        }
    }, [getUser, setAppLoaded, token]);

    if(!appLoaded){
        return <LoadingComponent content='Loading...' />
    }

    return (
        <Fragment>
            <ModalContainer />
            <ToastContainer position='bottom-right' />
            <Route exact path='/' component={HomePage} />
            <Route path={'/(.+)'} render={() => (
                <Fragment>
                    <NavBar />
                    <Container style={{ marginTop: '7em' }}>
                        <Switch>
                            <PrivateRoute exact path='/activities' component={ActivityDashboard} />
                            <PrivateRoute path='/activities/:id' component={ActivityDetails} />
                            <PrivateRoute key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
                            <PrivateRoute path='/profile/:username' component={ProfilePage} />
                            <Route component={NotFound} />           
                        </Switch>
                    </Container>   
                </Fragment>
            )} />
             
        </Fragment>
    );
}


export default withRouter(observer(App));
