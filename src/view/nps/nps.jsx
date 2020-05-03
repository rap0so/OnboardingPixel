import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { I18n } from 'react-i18nify';
import { ContextModel } from '../../io/models';
import NpsStyle from './npsStyle';
import { Section, Overlay, CloseButton } from '../components';
import { setTheme } from '../../modules';

class NpsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defStyle: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: '10',
        display: 'flex',
        overflow: 'auto',
        position: 'fixed',
        zIndex: 2147483632,
        alignItems: 'center',
        justifyContent: 'center'
      },
      values: [
        { id: 0, value: 0 },
        { id: 1, value: 1 },
        { id: 2, value: 2 },
        { id: 3, value: 3 },
        { id: 4, value: 4 },
        { id: 5, value: 5 },
        { id: 6, value: 6 },
        { id: 7, value: 7 },
        { id: 8, value: 8 },
        { id: 9, value: 9 },
        { id: 10, value: 10 }
      ],
      vote: false,
      comment: ''
    };
    this.maxLength = 2000;
    this.handleVote = this.handleVote.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.handleComment = this.handleComment.bind(this);
  }

  handleVote(event, result) {
    const { Context } = this.props;
    const { nps } = Context.state;

    event.currentTarget.classList.add('active');
    Context.dispatch({
      reducer: 'nps',
      type: 'VOTE_NPS',
      payload: {
        result,
        surveyId: nps._id
      }
    });

    this.setState({
      vote: true
    });
  }

  handleFinish(event) {
    const { state, props } = this;
    const { Context } = props;
    const { voteId } = Context.state;
    const { comment } = state;
    const element = event.currentTarget.closest('.front').parentNode;

    if (comment && voteId) {
      Context.dispatch({
        reducer: 'nps',
        type: 'COMMENT_VOTE_NPS',
        payload: {
          resultId: voteId,
          commentary: comment
        }
      });
    }

    window.setTimeout(() => {
      Context.dispatch({
        reducer: 'nps',
        type: 'CLOSE_NPS',
        payload: 'finish'
      });
    }, 3000);

    window.setTimeout(() => {
      element.classList.add('thank-you');
    }, 250);
  }

  handleComment(event) {
    const fieldName = event.currentTarget.id;
    const fieldValue = event.currentTarget.value;
    const newState = {
      ...this.state
    };

    if (fieldValue.length > this.maxLength) return;
    if (fieldName) newState[fieldName] = fieldValue;
    this.setState(newState);
  }

  render() {
    const { Context } = this.props;
    const { nps } = Context.state;
    const { vote, values, comment, defStyle } = this.state;

    if (!nps) {
      return null;
    }

    const newTheme = setTheme(nps.theme || {}, { mode: 'conpass' });

    return (
      <ThemeProvider theme={newTheme}>
        <div className="conpass-wrapper" style={defStyle}>
          <div>
            <Overlay show useFade Context={Context} stepType="nps" />
            <NpsStyle>
              <div className="front">
                <CloseButton
                  {...this.props}
                  stepType={(vote && 'nps') || 'npsNoVote'}
                  callback={e => {
                    const element = e.currentTarget.closest('.front')
                      .parentNode;
                    window.setTimeout(() => {
                      element.classList.add('thank-you');
                    }, 250);
                  }}
                />
                <Section
                  type="title"
                  components={[
                    {
                      type: 'title',
                      value: (!vote && nps.description) || nps.commentary
                    }
                  ]}
                  step={{ type: 'nps' }}
                  key={Math.random()}
                />
                {!vote && (
                  <React.Fragment>
                    <ul className="nps-list-values">
                      {values &&
                        values.map(item => (
                          <li key={item.id}>
                            <button
                              type="button"
                              className="nps-button-value"
                              onClick={e => this.handleVote(e, item.value)}
                            >
                              {item.value}
                            </button>
                          </li>
                        ))}
                    </ul>
                    <ul className="nps-legend">
                      <li>
                        <small>{I18n.t('nps.unlikely')}</small>
                      </li>
                      <li>
                        <small>{I18n.t('nps.likely')}</small>
                      </li>
                    </ul>
                  </React.Fragment>
                )}
                {vote && (
                  <React.Fragment>
                    <div className="nps-comment-container">
                      <textarea
                        id="comment"
                        name="comment"
                        value={comment}
                        placeholder={I18n.t('comment')}
                        className="nps-comment-value"
                        onChange={this.handleComment}
                      />
                      <small>{this.maxLength - comment.length}</small>
                    </div>
                    <div className="nps-actions-container">
                      <button
                        type="button"
                        className="comment"
                        onClick={this.handleFinish}
                      >
                        {I18n.t('submit')}
                      </button>
                    </div>
                  </React.Fragment>
                )}
              </div>
              <div className="back">
                <p>{nps.feedback}</p>
              </div>
            </NpsStyle>
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

NpsModal.defaultProps = {
  Context: {
    state: undefined,
    dispatch: () => {}
  }
};

NpsModal.propTypes = ContextModel;
export default NpsModal;
