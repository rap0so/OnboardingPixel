import React from 'react';
import PropTypes from 'prop-types';
import { ContextModel } from '../../../io/models';
import BranchStyle from './branchStyle';
import Button from '../button/button';
import htmlParser from '../../../modules/htmlParser';

function Branch(props) {
  const { Context, title, options, styles } = props;
  const currentFlowId =
    Context.state && Context.state.flow && Context.state.flow._id;
  const __html = htmlParser(title);
  return (
    <BranchStyle style={styles}>
      {/* eslint-disable-next-line react/no-danger */}
      <p className="title" dangerouslySetInnerHTML={{ __html }} />
      <div className="options">
        {options.map(option => {
          const newProps = {
            ...option,
            label: option.titleFlow,
            type: option.idFlow === currentFlowId ? 'next' : 'start_flow',
            Context
          };
          return (
            <Button key={option.idFlow} {...newProps} className="branch" />
          );
        })}
      </div>
    </BranchStyle>
  );
}

Branch.defaultProps = {
  title: '',
  styles: {},
  options: [],
  Context: {
    state: undefined,
    dispatch: () => {}
  }
};

Branch.propTypes = {
  title: PropTypes.string,
  styles: PropTypes.shape({}),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      idFlow: PropTypes.string,
      titleFlow: PropTypes.string
    })
  ),
  Context: ContextModel.Context
};

export default Branch;
