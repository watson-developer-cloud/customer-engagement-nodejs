import React from 'react';

const ConversationItem = React.createClass({
  displayName: 'ConversationItem',

  propTypes: {
    //eslint-disable-next-line
    utterance: React.PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      utterance: '',
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
          { tones.length === 0 ?
            <div className="tone_text">{ 'None' }</div> :
            tones.map(t => (
              <div>
                <div
                  className={this.isFirstToneNegative(tones) ? 'tone_text negative' : 'tone_text'}
                >{t.tone}
                </div>
                <div
                  className={this.isFirstToneNegative(tones) ? 'tone_score negative' : 'tone_score'}
                >{parseFloat(t.score).toFixed(2)}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  },
});

export default ConversationItem;
