import React from 'react';
import './analytics.scss';

export default class PNLBar extends React.Component{

  static propTypes = {
    index : React.PropTypes.number,
    model: React.PropTypes.object,
    isPnL: React.PropTypes.bool,
    maxMinValues: React.PropTypes.object,
    ratio: React.PropTypes.ratio,
    containerWidth: React.PropTypes.number
  }

  render(){
    let baseValue = this.props.isPnL ? this.props.model.basePnl : this.props.model.baseTradedAmount;
    let isPositive = baseValue > 0;
    let displayValue = Math.abs(baseValue * this.props.ratio);
    let xPos = isPositive ? this.props.containerWidth/2 : (this.props.containerWidth/2 - displayValue);
    let clName = isPositive ? 'analytics__barchart-indicator-green' : 'analytics__barchart-indicator-red';
    let amountStr = this.props.isPnL ? this.props.model.basePnl : this.props.model.baseTradedAmount;

    return(
      <div className='analytics__barchart-container'>
        <div>
          <label className='analytics__barchart-label'>{this.props.model.symbol}</label>
          <label className='barchart-amount'>{amountStr}</label>
          <span>
            <svg id='container' className='analytics__barchart-bar' width={this.props.containerWidth}>
              <g>
                <rect width={this.props.containerWidth} className='analytics__barchart-background'></rect>
                <rect width={displayValue} className={clName} x={xPos}></rect>
                </g>
            </svg>
            <label className='analytics__barchart-label'></label>
          </span>
        </div>
      </div>
    );
  }
}
