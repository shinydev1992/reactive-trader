import React, { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import {
  AnalyticsRoute,
  BlotterRoute,
  SpotRoute,
  ShellRoute,
  TileRoute,
} from './routes'
import { RouteWrapper } from 'rt-components'

export const Router: FC = () => (
  <Switch>
    <Route
      exact
      path="/"
      render={() => (
        <RouteWrapper>
          <ShellRoute />
        </RouteWrapper>
      )}
    />
    <Route
      path="/analytics"
      render={() => (
        <RouteWrapper title="Analytics" windowType="sub">
          <AnalyticsRoute />
        </RouteWrapper>
      )}
    />
    <Route
      path="/blotter"
      render={routeProps => (
        <RouteWrapper title="Blotter" windowType="sub">
          <BlotterRoute {...routeProps} />
        </RouteWrapper>
      )}
    />
    <Route
      path="/tiles"
      render={() => (
        <RouteWrapper title="Spot Tiles" windowType="sub">
          <TileRoute />
        </RouteWrapper>
      )}
    />
    <Route
      path="/spot/:symbol"
      render={routeProps => (
        <RouteWrapper title="Spot Tile" windowType="sub">
          <SpotRoute {...routeProps} />
        </RouteWrapper>
      )}
    />
    <Route
      path="/footer"
      render={(routeProps) => (
          <RouteWrapper title="Blotter" windowType="sub">
              <BlotterRoute {...routeProps} />
          </RouteWrapper>
      )}
    />
  </Switch>
)
