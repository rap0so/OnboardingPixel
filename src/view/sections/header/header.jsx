import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ContextModel } from '../../../io/models';
import Image from '../image/image';
import htmlParser from '../../../modules/htmlParser';

const Title = styled.p`
  font-size: 12px;
  margin: 5px 0 10px 0;
  color: ${props =>
    (props.theme && props.theme.modal && props.theme.modal.headerFontColor) ||
    '#fff'};
`;

const SubTitle = styled.div`
  margin: 10px 0;
  line-height: 20px;
  color: ${props =>
    (props.theme && props.theme.modal && props.theme.modal.headerFontColor) ||
    '#fff'};
  * {
    display: inline;
  }
`;

const HeaderStyle = styled.div`
  background-color: ${props =>
    (props.theme && props.theme.modal && props.theme.modal.headerBackground) ||
    '#12c1c7'};
  color: ${props =>
    (props.theme && props.theme.modal && props.theme.modal.headerFontColor) ||
    '#fff'};
  text-align: center;
  padding: 20px;
`;

export default function Header(props) {
  const { Context, avatarDescription, title, styles, step } = props;
  const { flow } = Context.state;
  const avatar =
    (step && step.properties && step.properties.imgAssistant) ||
    (flow.assistant && flow.assistant.imgAssistant);
  const __html = htmlParser(title);

  return (
    <HeaderStyle className="conpass-header" style={styles}>
      <Image imageType="circle" src={avatar} alt="Assistant" />
      <Title>{avatarDescription}</Title>
      <SubTitle dangerouslySetInnerHTML={{ __html }} />
    </HeaderStyle>
  );
}

Header.defaultProps = {
  title: '',
  avatarDescription: '',
  styles: {},
  step: {},
  Context: {
    state: undefined,
    dispatch: () => {}
  }
};

Header.propTypes = {
  title: PropTypes.string,
  avatarDescription: PropTypes.string,
  styles: PropTypes.shape({}),
  step: PropTypes.shape({
    properties: PropTypes.shape({
      imgAssistant: PropTypes.string
    })
  }),
  Context: ContextModel.Context
};
