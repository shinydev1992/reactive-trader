import React, { PureComponent } from 'react'
import styled from 'styled-components'

interface RfqTimerProps {
  onRejected: () => void
  receivedTime: number
  timeout: number
  isAnalyticsView: boolean
}

interface RfqTimerState {
  timeLeft: number
}

const UPDATE_FREQ_MS = 200

const TimeLeft = styled.div`
  font-size: 10px;
  opacity: 0.6;
  grid-area: TimeLeft;
`

const ProgressBarWrapper = styled.div`
  background-color: ${({ theme }) => theme.core.darkBackground};
  height: 6px;
  width: 100%;
  grid-area: ProgressBar;
`

const ProgressBar = styled.div`
  background-color: ${({ theme }) => theme.template.blue.normal};
  border-radius: 3px;
  transition: width ${UPDATE_FREQ_MS}ms linear;
  height: 100%;
`

const RejectQuoteButton = styled.button`
  background-color: ${({ theme }) => `${theme.core.lightBackground}`};
  border: ${({ theme }) => `2px solid ${theme.core.darkBackground}`};
  border-radius: 3px;
  font-size: 12px;
  padding: 4px 5px;
  margin-left: 3px;
  grid-area: RejectQuoteButton;
`

const TimerWrapper = styled.div<{ isAnalyticsView: boolean }>`
  display: grid;
  width: ${({ isAnalyticsView }) => (isAnalyticsView ? '105%' : '100%')};
  align-items: center;
  grid-template-columns: 35px auto 55px;
  grid-template-rows: 5px 20px;
  grid-template-areas: 'TimeLeft . .' 'ProgressBar ProgressBar RejectQuoteButton';
  margin-bottom: -12px;
`

class RfqTimer extends PureComponent<RfqTimerProps, RfqTimerState> {
  intervalId = 0

  static defaultProps = {
    timeout: 60000,
  }

  state = {
    timeLeft: calculateTimeLeft(this.props.receivedTime, this.props.timeout),
  }

  componentDidMount() {
    this.intervalId = setInterval(this.updateTimeLeft, UPDATE_FREQ_MS)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  updateTimeLeft = () => {
    this.setState(prevState => {
      if (prevState.timeLeft > 0) {
        return {
          timeLeft: calculateTimeLeft(this.props.receivedTime, this.props.timeout),
        }
      }
      clearInterval(this.intervalId)
      return prevState
    })
  }

  render() {
    const { timeout, onRejected, isAnalyticsView } = this.props
    const { timeLeft } = this.state
    const percentageLeft = (100 * timeLeft) / timeout
    const timeLeftSecs = Math.ceil(timeLeft / 1000)

    return (
      <TimerWrapper isAnalyticsView={isAnalyticsView}>
        <TimeLeft data-qa="rfq-timer__time-left">
          {timeLeftSecs} sec{timeLeftSecs > 1 ? 's' : ''}
        </TimeLeft>
        <ProgressBarWrapper>
          <ProgressBar style={{ width: `${percentageLeft}%` }} data-qa="rfq-timer__progress-bar" />
        </ProgressBarWrapper>
        <RejectQuoteButton onClick={onRejected} data-qa="rfq-timer__reject-quote-button">
          Reject
        </RejectQuoteButton>
      </TimerWrapper>
    )
  }
}

function calculateTimeLeft(receivedTime: number, timeout: number) {
  return Math.max(0, receivedTime + timeout - Date.now())
}

export default RfqTimer
