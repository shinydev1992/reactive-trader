import { TileView } from "@/App/LiveRates/selectedView"
import { BASE_PATH, ROUTES_CONFIG } from "@/constants"
import { TornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { MainRoute } from "./MainRoute"
import { TearOutRouteWrapper } from "./Web.styles"
import { Trades } from "@/App/Trades"
import { Analytics } from "@/App/Analytics"
import { LiveRates } from "@/App/LiveRates"
import { TearOutContext } from "../App/TearOutSection/tearOutContext"
import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"
import { lazy, Suspense } from "react"
import { Admin } from "@/App/Admin"
import { FEATURE_FLAG, useFeature } from "@/utils/featureFlag"

const StyleguideRoute = lazy(() => import("@/styleguide"))

export const WebApp: React.FC = () => {
  const canUseAdmin = useFeature(FEATURE_FLAG.ADMIN)

  return (
    <Suspense fallback={<div />}>
      <BrowserRouter basename={BASE_PATH}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <>
                <DisconnectionOverlay />
                <MainRoute />
              </>
            )}
          />
          <Route
            path={ROUTES_CONFIG.tile}
            render={({
              location: { search },
              match: {
                params: { symbol },
              },
            }) => {
              const query = new URLSearchParams(search)
              const view = query.has("tileView")
                ? (query.get("tileView") as TileView)
                : TileView.Analytics

              return (
                <>
                  <DisconnectionOverlay />
                  <TearOutRouteWrapper>
                    <TornOutTile symbol={symbol!} view={view} />
                  </TearOutRouteWrapper>
                </>
              )
            }}
          />
          <Route
            path={ROUTES_CONFIG.styleguide}
            render={() => <StyleguideRoute />}
          />
          {canUseAdmin && (
            <Route path={ROUTES_CONFIG.admin} render={() => <Admin />} />
          )}
          <TearOutContext.Provider value={{ isTornOut: true }}>
            <Route
              path={ROUTES_CONFIG.tiles}
              render={() => {
                return (
                  <>
                    <LiveRates />
                    <DisconnectionOverlay />
                  </>
                )
              }}
            />
            <Route
              path={ROUTES_CONFIG.blotter}
              render={() => {
                return (
                  <>
                    <Trades />
                    <DisconnectionOverlay />
                  </>
                )
              }}
            />
            <Route
              path={ROUTES_CONFIG.analytics}
              render={() => {
                return (
                  <>
                    <Analytics hideIfMatches={""} />
                    <DisconnectionOverlay />
                  </>
                )
              }}
            />
          </TearOutContext.Provider>
        </Switch>
      </BrowserRouter>
    </Suspense>
  )
}
