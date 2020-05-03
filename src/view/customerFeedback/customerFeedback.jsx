import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { I18n } from 'react-i18nify';
import { ContextModel } from '../../io/models';
import CustomerFeedbackStyle from './customerFeedbackStyle';
import { Section, Overlay, CloseButton } from '../components';
import { setTheme } from '../../modules';
import Like from './like';
import Dislike from './dislike';

class CustomerFeedback extends Component {
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
      }
    };
  }

  handleVote(event, vote) {
    const { Context } = this.props;
    const element = event.currentTarget.closest('.front').parentNode;

    event.currentTarget.classList.add('vote');
    Context.dispatch({
      reducer: 'customerFeedback',
      type: 'VOTE_CUSTOMER_FEEDBACK',
      payload: vote
    });
    window.setTimeout(() => {
      if (vote) element.classList.add('thank-you');
      else element.classList.add('thank-you-inverse');
    }, 250);
    window.setTimeout(() => {
      Context.dispatch({
        reducer: 'customerFeedback',
        type: 'CLOSE_CUSTOMER_FEEDBACK'
      });
    }, 2000);
  }

  render() {
    const { Context } = this.props;
    const { customerFeedback } = Context.state;
    const { defStyle } = this.state;

    if (!customerFeedback) {
      return null;
    }

    const newTheme = setTheme(customerFeedback.flow.theme, { mode: 'conpass' });

    return (
      <ThemeProvider theme={newTheme}>
        <div className="conpass-wrapper" style={defStyle}>
          <div>
            <Overlay
              show
              useFade
              Context={Context}
              stepType="customerFeedback"
            />
            <CustomerFeedbackStyle>
              <div className="front">
                <CloseButton {...this.props} stepType="customerFeedback" />
                <Section
                  type="title"
                  components={[
                    { type: 'title', value: customerFeedback.title }
                  ]}
                  step={{ type: 'customerFeedback' }}
                  key={Math.random()}
                />
                <ul className="customer-feedback-list-vote">
                  <li>
                    <button
                      type="button"
                      className="customer-feedback-like"
                      onClick={e => this.handleVote(e, 1)}
                    >
                      <Like />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="customer-feedback-dislike"
                      onClick={e => this.handleVote(e, 0)}
                    >
                      <Dislike />
                    </button>
                  </li>
                </ul>
              </div>
              <div className="back">
                <h4>{I18n.t('thankYou')}</h4>
              </div>
            </CustomerFeedbackStyle>
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

CustomerFeedback.defaultProps = {
  Context: {
    state: undefined,
    dispatch: () => {}
  }
};

CustomerFeedback.propTypes = ContextModel;
export default CustomerFeedback;
