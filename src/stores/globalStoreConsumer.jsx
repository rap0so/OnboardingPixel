import React, { Component } from 'react';
import { ChildrenModel } from '../io/models';
import storeContext from './storeContext';

class StoreConsumer extends Component {
  render() {
    const {
      props: { children }
    } = this;

    return (
      <storeContext.Consumer>
        {Context => {
          const childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, { Context })
          );
          return childrenWithProps;
        }}
      </storeContext.Consumer>
    );
  }
}

StoreConsumer.propTypes = ChildrenModel;
export default StoreConsumer;
