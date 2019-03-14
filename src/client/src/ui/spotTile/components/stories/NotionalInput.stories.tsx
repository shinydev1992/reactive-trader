import React from 'react'
import NotionalInput from '../notional'
import { stories, Story, Centered } from './Initialise.stories'
import { action } from '@storybook/addon-actions'

stories.add('Notional input', () => (
  <Story>
    <Centered>
      <div style={{ padding: '1.5rem' }}>
        <NotionalInput
          notional="1,000,000"
          currencyPairSymbol="USD"
          updateNotional={action('Update notional')}
          setInErrorStatus={action('setInErrorStatus')}
          inError={false}
        />
      </div>
    </Centered>
  </Story>
))

stories.add('Notional input in error', () => (
  <Story>
    <Centered>
      <div style={{ padding: '1.5rem' }}>
        <NotionalInput
          notional="1,000,000"
          currencyPairSymbol="USD"
          updateNotional={action('Update notional')}
          setInErrorStatus={action('setInErrorStatus')}
          inError={true}
        />
      </div>
    </Centered>
  </Story>
))
