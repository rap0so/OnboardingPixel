import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import SectionStyle from './sectionStyle';
import { ContextModel } from '../../../io/models';
import {
  Content,
  Image,
  Video,
  Title,
  Header,
  Branch,
  Button
} from '../../sections';

function renderComponents(component, context, step, index) {
  const { type } = component;
  const newProps = {
    ...component,
    Context: context
  };

  if (!type) {
    return null;
  }
  switch (type) {
    case 'content':
      return <Content {...newProps} step={step} key={index} />;
    case 'image':
      return <Image {...newProps} step={step} key={index} />;
    case 'title':
      return <Title {...newProps} step={step} key={index} />;
    case 'video':
      return <Video {...newProps} step={step} key={index} />;
    case 'header':
      return <Header {...newProps} step={step} key={index} />;
    case 'branch':
      return <Branch {...newProps} step={step} key={index} />;
    case 'button':
      return <Button {...newProps} step={step} key={index} />;
    default:
      return <div>No content type</div>;
  }
}

function renderBlock(props) {
  const { type, components, Context, step, tabIndex } = props;
  if (!type) {
    return null;
  }

  return (
    <SectionStyle
      step={step}
      tabIndex={tabIndex}
      type={(components.length === 1 && components[0].type) || type}
      className={
        (components.length === 1 && `conpass-${components[0].type}`) ||
        'conpass-content'
      }
    >
      {components.map((component, index) =>
        renderComponents(component, Context, step, index)
      )}
    </SectionStyle>
  );
}

function Section(props) {
  return <Fragment>{renderBlock(props)}</Fragment>;
}

Section.defaultProps = {
  Context: {
    type: '',
    state: undefined,
    dispatch: () => {}
  }
};

renderBlock.propTypes = {
  type: PropTypes.string.isRequired,
  step: PropTypes.shape({}).isRequired,
  tabIndex: PropTypes.string.isRequired,
  Context: PropTypes.shape({}).isRequired,
  components: PropTypes.arrayOf.isRequired
};

Section.propTypes = ContextModel;

export default Section;
