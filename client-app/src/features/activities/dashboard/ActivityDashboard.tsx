import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import { Grid, Loader } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';

import { RootStoreContext } from '../../../app/stores/rootStore';
import ActivityList from './ActivityList';
import ActivityFilters from './ActivityFilters';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

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

    return (
        <Grid>
            <Grid.Column width={10}>
                { loadingInitial && page === 0 ? <ActivityListItemPlaceholder /> : (
                    <InfiniteScroll 
                    pageStart={0}
                    loadMore={onGetNext}
                    hasMore={!loadingNext && page + 1 < totalPages}
                    initialLoad={false}
                    >
                        <ActivityList />
                    </InfiniteScroll>
                )}


            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityFilters />              
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />             
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDashboard);