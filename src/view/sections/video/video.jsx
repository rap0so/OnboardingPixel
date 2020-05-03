import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function getYoutubeIdFromURL(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}

const VideoStyle = styled.div`
  display: flex;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: auto;
  min-height: 350px;
  margin: 0 20px;
`;

export default function Video(props) {
  // eslint-disable-next-line
  let { value, styles } = props;
  value = getYoutubeIdFromURL(value);
  return (
    <VideoStyle style={styles}>
      <Iframe
        title={value}
        src={`https://www.youtube.com/embed/${value}?rel=0&showinfo=0`}
        frameBorder="0"
      />
    </VideoStyle>
  );
}

Video.defaultProps = {
  value: '',
  styles: {}
};

Video.propTypes = {
  value: PropTypes.string,
  styles: PropTypes.shape({})
};
