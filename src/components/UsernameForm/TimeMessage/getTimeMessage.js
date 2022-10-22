import React from 'react';
import * as moment from 'moment';
class RemainTime extends React.Component {
  state = { days: null, hours: null, minutes: null, seconds: null };
  componentDidMount() {
    setInterval(() => {
      const currYear = new Date().getFullYear();
      const now = moment();
      const festEnd = moment(
        `11-01-${currYear} 00:00 AM`,
        'MM-DD-YYYY hh:mm A'
      );
      const diff = festEnd.diff(now);
      const diffDuration = moment.duration(diff);
      this.setState({
        days: String(diffDuration.days()).padStart(2, '0'),
        hours: String(diffDuration.hours()).padStart(2, '0'),
        minutes: String(diffDuration.minutes()).padStart(2, '0'),
        seconds: String(diffDuration.seconds()).padStart(2, '0'),
      });
    }, 1000);
  }

  render() {
    var timeMessage = '';
    var remainTime = '';
    const today = new Date();
    const currentMonth = today.getMonth();
    const daysLeft = 31 - today.getDate();
    if (currentMonth !== 9) {
      timeMessage = "It isn't even October yet!";
    } else if (daysLeft === 0) {
      timeMessage = "It's the very last day! Get your last PRs in!";
    } else if (daysLeft === 1) {
      timeMessage = 'One more day, keep it going!';
    } else if (daysLeft < 10) {
      timeMessage = `There are only ${daysLeft} days left! You can do it!`;
    } else {
      timeMessage = `There are ${daysLeft} days remaining!`;
    }
    if (currentMonth == 9) {
      remainTime = `Remaining time: ${this.state.days}:${this.state.hours}:${this.state.minutes}:${this.state.seconds}`;
    }
    return (
      <div className="time">
        {timeMessage}
        <br />
        {remainTime}
      </div>
    );
  }
}

export default RemainTime;
