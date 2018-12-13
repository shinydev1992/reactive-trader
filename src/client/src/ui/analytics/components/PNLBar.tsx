import numeral from 'numeral'
import React from 'react'
import { CurrencyPair } from 'rt-types'
import { styled } from 'rt-theme'
import { css } from 'emotion'
export interface PNLBarProps {
  basePnl: number
  currencyPair: CurrencyPair
  index: number
  isPnL: boolean
  maxVal: number
  symbol: string
}

export default class PNLBar extends React.Component<PNLBarProps> {
  calculateOffset = () => {
    const { maxVal, basePnl } = this.props
    const logMaxVal = Math.log10(Math.abs(maxVal)) + 1
    const logBasePnl = Math.log10(Math.abs(basePnl))
    const translatePercent = (logBasePnl / logMaxVal) * 50
    return Math.round(translatePercent)
  }

  render() {
    const { symbol, basePnl } = this.props
    const sign = basePnl >= 0 ? 1 : -1
    const translation = this.calculateOffset() * sign
    return (
      <BarChart>
        <LabelBarWrapper>
          <Label>{symbol}</Label>
          <BarWrapper>
            <PriceDiamondWrapper translation={translation}>
              <Price colorSign={sign}>{numeral(Math.abs(basePnl)).format('0.0a')}</Price>
              <Diamond colorSign={sign} />
            </PriceDiamondWrapper>
            <Bar />
            <OriginTickWrapper>
              <OriginTick />
              <Origin>0</Origin>
            </OriginTickWrapper>
          </BarWrapper>
        </LabelBarWrapper>
      </BarChart>
    )
  }
}

const BarChart = styled.div``

const FontStyle = css`
  font-family: Lato;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.82;
  letter-spacing: normal;
`
const PriceDiamondWrapper = styled.div<{ translation: number }>`
  flex: 0.99;
  margin-bottom: -2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(${({ translation }) => translation}%);
`

const Price = styled.div<{ colorSign: number }>`
  flex: 1;
  width: 25px;
  height: 13px;
  font-size: 11px;
  composes: ${FontStyle};
  color: ${({ theme, colorSign }) => (colorSign > 0 ? theme.analytics.green.normal : theme.analytics.red.normal)};
`

const Diamond = styled.div<{ colorSign: number }>`
  width: 6px;
  height: 6px;
  transform: rotate(45deg);
  background-color: ${({ theme, colorSign }) =>
    colorSign > 0 ? theme.analytics.green.normal : theme.analytics.red.normal};
`

const LabelBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
const Label = styled.div`
  position: relative;
  top: 16px;
  width: 44px;
  height: 13px;
  opacity: 0.6;
  font-size: 11px;
  text-align: center;
  color: #ffffff;
  composes: ${FontStyle};
`
const BarWrapper = styled.div`
  flex: 0.99;
  vertical-align: middle;
  margin: auto 0;
  color: white;
`
const Bar = styled.div`
  height: 0.125rem;
  background-color: #444c5f;
  opacity: 1;
  width: 100%;
  position: relative;
  top: 5px;
  border: 1px solid #444c5f;
`

const OriginTickWrapper = styled.div``

const OriginTick = styled.div`
  position: relative;
  width: 1.6px;
  height: 6.9px;
  background-color: #444c5f;
  margin: 0 auto;
  top: 3px;
`
const Origin = styled.div`
  margin: 0 auto;
  display: block;
  height: 10px;
  margin-top: 1px;
  width: 5.9px;
  height: 20px;
  opacity: 0.6;
  font-size: 11px;
  text-align: center;
  composes: ${FontStyle};
`
