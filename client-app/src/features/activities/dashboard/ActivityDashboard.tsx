import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import { Button, Grid } from 'semantic-ui-react';

import { RootStoreContext } from '../../../app/stores/rootStore';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityList from './ActivityList';

const ActivityDashboard = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadActivities,
        loadingInitial,
        setPage,
        page,
        totalPages
    } = rootStore.activityStore;

    const [loadingNext, setLoadingNext] = useState(false);

    const onGetNext = () => {
        setLoadingNext(true);
        setPage(page + 1);
        loadActivities().then(() => setLoadingNext(false))
    }

    useEffect(() => {
        loadActivities();
    }, [loadActivities]);

    if(loadingInitial && page === 0) {
        return <LoadingComponent content="Loading activities..." />
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
                <Button
                    floated='right'
                    content='More...'
                    positive
                    disabled={totalPages === page + 1}
                    onClick={onGetNext}
                    loading={loadingNext}
                />
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity filters</h2>                
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDashboard);