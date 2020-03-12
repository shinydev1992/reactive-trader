import React, { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import Helmet from 'react-helmet'
import { Provider as ReduxProvider } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ThemeProvider } from 'rt-theme'
import { Router } from './data'
import GlobalScrollbarStyle from './GlobalScrollbarStyle'
import { getPlatformAsync, PlatformProvider } from 'rt-platforms'
import { createStore } from './store'

//TODO: Move to environment variables / config.
const trackingId = 'UA-156607742-1' //This is the tracking code for the PoC account. Waiting on HelpDesk...
ReactGA.initialize(trackingId, {
  debug: process.env.NODE_ENV === 'development',
})

const MainRoute = () => {
  const routeHistory = useHistory()

  const [platform, setPlatform] = useState()
  const [store, setStore] = useState()

  useEffect(() => {
    const getPlatform = async () => {
      const runningPlatform = await getPlatformAsync()
      const store = await createStore(runningPlatform)
      setPlatform(runningPlatform)
      setStore(store)
    }
    getPlatform()
  }, [])

  useEffect(() => {
    if (platform) {
      ReactGA.set({
        dimension1: platform.type,
        dimension2: platform.name,
        dimension3: process.env.NODE_ENV,
        page: window.location.pathname,
      })
      ReactGA.pageview(window.location.pathname)
      ReactGA.event({
        category: 'RT - App',
        action: 'open',
        label: `Platform: ${platform.name}`,
      })
    }
  }, [platform])

  useEffect(() => {
    const stopListening = routeHistory.listen(location => {
      ReactGA.set({ page: location.pathname })
      ReactGA.pageview(location.pathname)
    })
    return stopListening
  }, [routeHistory])

  if (!store || !platform) {
    return <></>
  }

  return (
    <React.Fragment>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
        />
      </Helmet>
      <ThemeProvider>
        <ReduxProvider store={store}>
          <PlatformProvider value={platform}>
            <React.Fragment>
              <GlobalScrollbarStyle />
              <Router />
            </React.Fragment>
          </PlatformProvider>
        </ReduxProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default MainRoute
