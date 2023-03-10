import { Subscribe } from "@react-rxjs/core"
import { Loader } from "@/components/Loader"
import {
  LogoWrapper,
  IntentWrapper,
  IntentActions,
  IntentActionWrapper,
  PlatformLogoWrapper,
  Suggestion,
  LoadingWrapper,
  InlineIntent,
} from "./styles"
import { reactiveTraderFxIcon } from "../icons"
import { NlpIntent } from "../services/nlpService"
import { handleIntent } from "./intents"
import { open } from "../tools"
import { appConfigs } from "../applicationConfigurations"
import { WithChildren } from "@/utils/utilityTypes"

export const SuggestionWrapper = ({
  children,
  intent,
  intentButtonText,
}: {
  intent: NlpIntent
  intentButtonText: string
} & WithChildren) => {
  return (
    <IntentWrapper>
      <IntentActions>
        <IntentActionWrapper>
          <LogoWrapper>
            <PlatformLogoWrapper>{reactiveTraderFxIcon}</PlatformLogoWrapper>
          </LogoWrapper>
          <span>Reactive Trader®</span>
        </IntentActionWrapper>
        <IntentActionWrapper>
          {/* TODO - Open and opened state should be a hook so opening here would set RT as opened in the launcher */}
          <button onClick={() => open(appConfigs[0])}>Launch Platform</button>
          <button onClick={() => handleIntent(intent)}>
            {intentButtonText}
          </button>
        </IntentActionWrapper>
      </IntentActions>
      <Suggestion>
        <InlineIntent>
          <Subscribe
            fallback={
              <LoadingWrapper>
                <Loader minWidth="18" />
              </LoadingWrapper>
            }
          >
            {children}
          </Subscribe>
        </InlineIntent>
      </Suggestion>
    </IntentWrapper>
  )
}
