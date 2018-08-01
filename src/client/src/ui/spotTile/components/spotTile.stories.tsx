import React from 'react'

import centered from '@storybook/addon-centered'
import { text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import { Flex } from 'rt-components'
import { Story } from 'rt-storybook'
import { Direction } from 'rt-types'
import PriceButton from './PriceButton'
import PriceMovement from './PriceMovement'

const stories = storiesOf('Spot Tile', module).addDecorator(centered)

stories.addDecorator(withKnobs)

stories.add('Price button', () => (
  <Story>
    <Flex>
      <PriceButton direction={Direction.Buy} big="33" pip="1" tenth="22" />
      <PriceButton direction={Direction.Sell} big="34" pip="2" tenth="22" />
    </Flex>
  </Story>
))

stories.add('Price movement', () => (
  <Story>
    <Flex height="150px">
      <PriceMovement priceMovementType={text('Direction', 'Down')} spread={{ formattedValue: '3.0' }} />
    </Flex>
  </Story>
))
