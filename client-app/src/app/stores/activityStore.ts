import { createContext } from 'react';
import { observable } from 'mobx';

class ActivityStore {
    @observable title = 'Hello from mobx'
}

export default createContext(new ActivityStore());