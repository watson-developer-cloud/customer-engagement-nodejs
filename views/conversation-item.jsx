import React from 'react';
import { ButtonsGroup, Icon, Colors } from 'watson-react-components';

const ConversationItem = React.createClass({
  displayName: 'ConversationItem',

  propTypes: {
    //eslint-disable-next-line
    utterance: React.PropTypes.object.isRequired,
    utterance_id: React.PropTypes.number.isRequired,
    //tone_analyzer_response: React.PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      utterance: '',
      utterance_id: '',
    };
  },

  getInitialState() {
    return {
      vote: null,
    };
  },

  isFirstToneNegative(tones) {
    const firstTone = tones[0];
    return (
      tones.length !== 0 &&
      (firstTone.tone === 'sad' ||
      firstTone.tone === 'frustrated' ||
      firstTone.tone === 'anxious' ||
      firstTone.tone === 'impolite')
    );
  },

  test(e, tone) {
    console.log('voted: '.concat(this.props.utterance.statement.text, ' ', tone, ' ', e.target.value));
  },

  render() {
    const user = this.props.utterance.user;
    const statement = this.props.utterance.statement;
    const tones = this.props.utterance.tones;

    return (
      <div className={user.type === 'customer' ? 'speaker consumer' : 'speaker'}>
        <div className="avatar">
          <div className={user.type === 'customer' ? 'customer_avatar' : 'agent_avatar'} />
        </div>
        <div className="statement_container">
          <span className="speaker_name">{user.name}</span>
          <span className="speaker_handle">{user.handle}</span>
          <span className="time_stamp"> {statement.timestamp}</span>
          <div
            className={this.isFirstToneNegative(tones) ? 'speaker_statement negative' : 'speaker_statement'}
          >
            { statement.text }
          </div>
        </div>
        <div className="score_container">
          <div className="agree_container"><span className="agree_link">Do you agree?</span></div>
          { tones.length === 0 ?
            <div className="tone_text">{ 'None' }</div> :
            tones.map((t, i) => (
              <div className="tone_results" key={`${t.tone}-${t.score}`}>
                <div
                  className={this.isFirstToneNegative(tones) ? 'tone_text negative' : 'tone_text'}
                >{t.tone}
                </div>
                <ButtonsGroup
                  type="radio"
                  name={'utterance'.concat('-', this.props.utterance_id, '-', i)}
                  onClick={e => this.test(e, t.tone)}
                  // onChange={}
                  buttons={[{
                    value: 0,
                    id: 'utterance'.concat('-', this.props.utterance_id, '-', i, '-', t.tone, '-true'),
                    text: <Icon type={'thumbs-up'} fill={Colors.gray_30} />,
                  }, {
                    value: 1,
                    id: 'utterance'.concat('-', this.props.utterance_id, '-', i, '-', t.tone, '-false'),
                    text: <Icon type={'thumbs-down'} fill={Colors.gray_30} />,
                  }]}
                />
              </div>
            ))}
        </div>
      </div>
    );
  },
});

export default ConversationItem;
