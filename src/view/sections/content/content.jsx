import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import htmlParser from '../../../modules/htmlParser';

const ContentStyle = styled.div`
  margin: 5px 0;
  padding: ${props => (props.type === 'popover' ? '0' : '0 25px')};
  line-height: 130%;
  &[type='notification'] {
    text-align: center;
    white-space: pre-wrap;
  }
  p {
    display: inline;
    margin: 0;
    b {
      color: inherit;
      font-weight: bold;
    }
  }
`;

export default function Content(props) {
  const { styles, value, step } = props;
  const __html = htmlParser(value);
  return (
    <ContentStyle
      type={step.type}
      style={styles}
      dangerouslySetInnerHTML={{ __html }}
    />
  );
}

Content.defaultProps = {
  value: '',
  styles: {},
  step: {}
};

Content.propTypes = {
  value: PropTypes.string,
  styles: PropTypes.shape({}),
  step: PropTypes.shape({
    type: PropTypes.string
  })
};
