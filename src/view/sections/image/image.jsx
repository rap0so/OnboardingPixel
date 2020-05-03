import React from 'react';
import styled from 'styled-components';
import Img from 'react-image';

const ImageStyle = styled.div`
  min-height: ${props =>
    (props.stepType === 'notification' && 'auto') || '60px'};
  max-height:  ${props =>
    (props.stepType === 'notification' && 'auto') || '270px'};
  height: ${props => (props.stepType === 'notification' && '270px') || 'auto'};
  overflow: hidden;
  margin-bottom: 15px;
  background-color: ${props => {
    if (props.stepType === 'popover') return 'transparent';

    if (props.theme.modal && props.theme.modal.headerBackground)
      return props.theme.modal && props.theme.modal.headerBackground;

    return '#12c1c7';
  }};
  div {
    width: 100%;
    height: auto;
    overflow: hidden;
  }
  .circle {
    width: 60px;
    height: 60px;
    margin: 0 auto;
    border-radius: 200px;
    border: 2px solid #fff;
  }

  .circle div {
    margin-top: 0;background-blend-mode
  }
`;

export default props => {
  // eslint-disable-next-line
  const { src, alt, imageType, stepType, step } = props;
  const { type } = step || {};

  return (
    <ImageStyle stepType={stepType || type}>
      {src && (
        <Img
          src={src}
          alt={alt}
          loader={<div className="loading-spinner" />}
          className={imageType === 'circle' ? 'circle' : 'normal'}
        />
      )}
    </ImageStyle>
  );
};
