import _ from 'lodash'
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { styled, ThemeName, ThemeState } from 'rt-theme'

import FloatingTools from './components/FloatingsTools'
import { Block, SectionBlock } from './styled'

import Atoms from './sections/Atoms'
import ColorSpectrum from './sections/ColorSpectrum'
import CoreBranding from './sections/CoreBranding'
import FontFamilies from './sections/FontFamilies'
import Introduction from './sections/Introduction'

const sections = _.mapKeys(
  {
    Introduction,
    ColorSpectrum,
    CoreBranding,
    FontFamilies,
    Atoms,
    Ending: () => <SectionBlock mh={5} intent="inverted" />,
  },
  (value, key) => _.kebabCase(key),
)

export const StyleguideRoute: React.SFC = () => (
  <ThemeState.Provider name={ThemeName.LIGHT}>
    <Root>
      <ThemeState.Consumer>
        {({ name, setTheme }) => {
          return (
            <FloatingTools
              themeName={name}
              switchTheme={() =>
                setTheme({
                  name: name === ThemeName.DARK ? ThemeName.LIGHT : ThemeName.DARK,
                })
              }
            />
          )
        }}
      </ThemeState.Consumer>
      <BrowserRouter>
        <Switch>
          {_.map(sections, (Section, path) => (
            <Route key={path} path={`/styleguide/${path}`}>
              <Section />
            </Route>
          ))}

          <Route>
            <React.Fragment>
              {_.map(sections, (Section, path) => (
                <Section key={path} />
              ))}
            </React.Fragment>
          </Route>
        </Switch>
      </BrowserRouter>
    </Root>
  </ThemeState.Provider>
)

export const Root = styled(Block)`
  min-height: 100%;
  max-width: 100vw;
  overflow: hidden;
`
