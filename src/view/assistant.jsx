import React, { Component } from 'react';
import Img from 'react-image';
import { I18n } from 'react-i18nify';
import { ContextModel } from '../io/models';
import AssistantStyle from './assistantStyle';

function pickAvatarElement(assistant) {
  return (
    <Img
      id="pickAvatarButton"
      tabIndex="-1"
      className="pickAvatar"
      alt=""
      src={assistant.imgAssistant}
      loader={<div className="loading-spinner" />}
    />
  );
}

function conpassQuestElement(assistant) {
  return (
    <div
      id="conpassQuest"
      tabIndex="-1"
      className="conpassQuest"
      style={{
        backgroundColor: assistant.symbolColorTheme
      }}
    >
      {'?'}
    </div>
  );
}

function renderOptionsAssistant(assistant) {
  const optionsAssistant = assistant.optionsAssistant || 'avatar';
  if (optionsAssistant === 'symbol') {
    return null;
  }
  return pickAvatarElement(assistant);
}

function getStyle(assistant) {
  const assistantAxis = `${assistant.yAxis || 0}px`;
  const topPositions = ['top-left', 'top-right'];
  let offsetProperty;
  try {
    if (topPositions.includes(assistant.position)) {
      offsetProperty = 'marginTop';
    } else {
      offsetProperty = 'marginBottom';
    }
  } catch (err) {
    if (topPositions.indexOf(assistant.position) !== -1) {
      offsetProperty = 'marginTop';
    } else {
      offsetProperty = 'marginBottom';
    }
  }
  return {
    [offsetProperty]: assistantAxis
  };
}

function getClass(assistant) {
  return assistant.position || 'center-right';
}

class Assistant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        conpassAssistant: 'conpassAssistant'
      }
    };
  }

  render() {
    const { Context } = this.props;
    const { assistant } = Context.state;
    const { style } = this.state;
    const { conpassAssistant } = style;
    if (!assistant) {
      return null;
    }
    if (!assistant.showAssistant) {
      return null;
    }
    return (
      <AssistantStyle>
        <button
          tabIndex="0"
          title={I18n.t('assistant.title')}
          aria-label={I18n.t('assistant.title')}
          className={[conpassAssistant, getClass(assistant)].join(' ')}
          type="button"
          style={getStyle(assistant)}
          ref={node => {
            if (node) {
              node.focus();
            }
          }}
          onClick={() => {
            Context.dispatch({
              reducer: 'flow',
              type: 'RECEIVE_FLOW',
              payload: {
                success: true,
                data: assistant.flow
              },
              extra: {
                activity: {
                  type: 'startFlowByAssistant'
                },
                alwaysShow: true
              }
            });
          }}
        >
          <div
            id="conpassNews"
            tabIndex="-1"
            className="conpassNews"
            style={{
              display: 'none',
              backgroundColor: assistant.symbolColorTheme
            }}
          />
          {conpassQuestElement(assistant)}
          {renderOptionsAssistant(assistant)}
        </button>
      </AssistantStyle>
    );
  }
}

Assistant.defaultProps = {
  Context: {
    state: undefined,
    dispatch: () => {}
  }
};

Assistant.propTypes = ContextModel;
export default Assistant;
