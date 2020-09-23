import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import { Button, Grid, Loader } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';

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
                <InfiniteScroll 
                    pageStart={0}
                    loadMore={onGetNext}
                    hasMore={!loadingNext && page + 1 < totalPages}
                    initialLoad={false}
                />
                <ActivityList />

            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity filters</h2>                
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />             
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDashboard);