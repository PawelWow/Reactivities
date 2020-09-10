import React, {useContext, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import { Grid } from 'semantic-ui-react';

import { RootStoreContext } from '../../../app/stores/rootStore';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityList from './ActivityList';

const ActivityDashboard = () => {
    const rootStore = useContext(RootStoreContext);
    const { loadActivities, loadingInitial } = rootStore.activityStore;

    useEffect(() => {
        loadActivities();
    }, [rootStore]);

    if(loadingInitial) {
        return <LoadingComponent content="Loading activities..." />
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity filters</h2>                
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDashboard);