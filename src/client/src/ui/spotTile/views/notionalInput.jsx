import React from 'react';
import numeral from 'numeral';
import { utils } from '../../../system';
import classnames from 'classnames';
import { CurrencyPair } from '../../../services/model';
import './notionalInput.scss';

const MONTHS         = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      NUMERAL_FORMAT = '0,000,000[.]00',
      DOT            = '.';

/**
 * @Class Sizer
 */
export default class NotionalInput extends React.Component {

  static propTypes = {
    className: React.PropTypes.string,
    notional: React.PropTypes.number,
    currencyPair: React.PropTypes.instanceOf(CurrencyPair),
    onChange: React.PropTypes.func
  };

  /**
   * When we mount, get latest date and construct spot date
   */
  componentWillMount(){
    const today = new Date;
    this.SPOTDATE = ['SP.', today.getDate(), MONTHS[today.getMonth()]].join(' ');
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props.className !== nextProps.className ||
      this.props.notional !== nextProps.notional ||
      this.props.currencyPair.symbol !== nextProps.currencyPair.symbol || // note currencyPair always here
      this.props.onChange !== nextProps.onChange;
  }

  render(){
    const formattedSize = numeral(this.props.notional).format(NUMERAL_FORMAT);
    let classes = classnames(
      'notional',
      this.props.className
    );
    return (
      <div className={classes}>
        <label className='notional__currency-pair' >{this.props.currencyPair.base}</label>
        <input className='notional__size-input' type='text' ref='notionalInput' defaultValue={formattedSize} onChange={(e) => this._setNotionalFromDOMInput(e)}/>
        <span className='notional__date'>{this.SPOTDATE}</span>
      </div>
    );
  }

  /**
   * Sets trade amount. Supports k/m modifiers for 1000s or millions.
   * @param {DOMEvent=} e
   */
  _setNotionalFromDOMInput(e){
    const rawValue    = (this.refs.notionalInput.value || e.target.value).trim();
    const hasdot = rawValue.indexOf(DOT) !== -1;

    let notional = utils.convertNotionalShorthandToNumericValue(rawValue);

    hasdot && (notional += DOT);

    if (!isNaN(notional)){
      // send temp notional back to parent
      this.props.onChange(notional);

      // user may be trying to enter decimals. restore BACK into input
      if (rawValue.indexOf(DOT) === rawValue.length - 1){
        notional = notional + DOT;
      }

      // propagate change back to dom node's value
      this.refs.notionalInput.value = numeral(notional).format(NUMERAL_FORMAT);
    }
  }
}
