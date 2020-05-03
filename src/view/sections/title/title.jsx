import React from 'react';
import TitleStyle from './titleStyle';
import htmlParser from '../../../modules/htmlParser';
import getProps from '../../../helpers/get';

export default props => {
  // eslint-disable-next-line
  const { value, step } = props;
  // eslint-disable-next-line
  const { type } = step;
  const progress = getProps(props, 'Context.state.flow.progress', {});
  const { active, onStep, type: progressType, position } = progress;
  const shouldAddPadding =
    active &&
    onStep &&
    progressType === 'bar' &&
    position === 'top' &&
    type !== 'popover';
  const __html = htmlParser(value);
  return (
    <TitleStyle
      insertPadd={shouldAddPadding}
      type={type}
      dangerouslySetInnerHTML={{ __html }}
    />
  );
};
