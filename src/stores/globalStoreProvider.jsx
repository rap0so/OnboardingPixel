import React, { Component } from 'react';
import { ChildrenModel } from '../io/models';
import Actions from '../actions';
import storeContext from './storeContext';

class StoreProvider extends Component {
  constructor() {
    super();
    this.dispatch = this.dispatch.bind(this);
  }

  dispatch(action, callback = () => {}) {
    const { conpassMeta } = this.props;
    this.setState(
      state =>
        Actions[action.reducer](state, action, this.dispatch, conpassMeta),
      callback
    );
  }

  render() {
    const {
      state,
      dispatch,
      props: { children, conpassMeta }
    } = this;

    return (
      <storeContext.Provider
        value={{
          conpassMeta,
          state,
          dispatch
        }}
      >
        {children}
      </storeContext.Provider>
    );
  }
}

StoreProvider.propTypes = ChildrenModel;
export default StoreProvider;
