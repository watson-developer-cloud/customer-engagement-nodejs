import React from 'react';
import { ButtonsGroup, Icon, Colors } from 'watson-react-components';

const ConversationItem = React.createClass({
  displayName: 'ConversationItem',

  propTypes: {
    //eslint-disable-next-line
    utterance: React.PropTypes.object.isRequired,
    utterance_id: React.PropTypes.number.isRequired,
    onVote: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      utterance: '',
      utterance_id: '',
      onVote: React.PropTypes.func.isRequired,
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

  castVote(e, tone) {
    const voteData = {
      statement: this.props.utterance.statement.text,
      user_feedback: {
        tone,
        vote: e.target.value,
      },
      tone_analyzer_payload: this.props.utterance.tone_analyzer_payload,
    };
    console.log('voted: '.concat(JSON.stringify(voteData)));
    this.props.onVote.call(this, voteData);
  },

  render() {
    const user = this.props.utterance.user;
    const statement = this.props.utterance.statement;
    const tones = this.props.utterance.tones;

    return (
      <div>
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
            <div className="tone_results" key={'None'}>
              <div className="tone_text">{ 'None' }</div>
              <ButtonsGroup
                type="radio"
                name={'utterance'.concat('-', this.props.utterance_id)}
                onClick={e => this.castVote(e, 'None')}
                buttons={[{
                  value: 1,
                  id: 'utterance'.concat('-', this.props.utterance_id, '-None-true'),
                  text: <Icon className={'thumb'} type={'thumbs-up'} fill={Colors.gray_30} />,
                }, {
                  value: 0,
                  id: 'utterance'.concat('-', this.props.utterance_id, '-None-false'),
                  text: <Icon className={'thumb'} type={'thumbs-down'} fill={Colors.gray_30} />,
                }]}
              />
            </div>
            :
            tones.map((t, i) => (
              <div className="tone_results" key={`${t.tone}-${t.score}`}>
                <div
                  className={this.isFirstToneNegative(tones) ? 'tone_text negative' : 'tone_text'}
                >{t.tone}
                </div>
                <ButtonsGroup
                  type="radio"
                  name={'utterance'.concat('-', this.props.utterance_id, '-', i)}
                  onClick={e => this.castVote(e, t.tone)}
                  buttons={[{
                    value: 1,
                    id: 'utterance'.concat('-', this.props.utterance_id, '-', i, '-', t.tone, '-true'),
                    text: <Icon className={'thumb'} type={'thumbs-up'} fill={Colors.gray_30} />,
                  }, {
                    value: 0,
                    id: 'utterance'.concat('-', this.props.utterance_id, '-', i, '-', t.tone, '-false'),
                    text: <Icon className={'thumb'} type={'thumbs-down'} fill={Colors.gray_30} />,
                  }]}
                />
              </div>
            ))}
            <div className="other_tones"><a className="base--a jumbotron--nav-link" href="#">What other tones...?</a></div>
        </div>
      </div>
      <div className="speaker hidden">
        <span className="description"> What other tones do you think are in this staement?</span>
      </div>
    </div>
    );
  },
});

export default ConversationItem;
