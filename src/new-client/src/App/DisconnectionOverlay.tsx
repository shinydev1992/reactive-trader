import {
  initConnection,
  ConnectionStatus,
  connectionStatus$,
  useConnectionStatus,
} from "@/services/connection"
import { bind } from "@react-rxjs/core"
import { map, scan } from "rxjs/operators"
import { Modal } from "@/components/Modal"
import styled from "styled-components"

// TODO - Use component from styleguide when available
const Button = styled.button`
  background-color: ${({ theme }) => theme.button.primary.backgroundColor};
  color: #ffffff;
  padding: 5px 9px;
  border-radius: 4px;
  font-size: 0.6875rem;
  margin-top: 20px;
  
  &:hover {
    background-color: ${({ theme }) => theme.accents.primary.darker};
  }
`

const [useHideOverlay] = bind(
  connectionStatus$.pipe(
    map((connection) => connection === ConnectionStatus.CONNECTED),
    scan(
      (acc, connected) => {
        return {
          connected,
          hasBeenConnnected: acc.hasBeenConnnected || connected,
        }
      },
      { connected: true, hasBeenConnnected: false },
    ),
    map(({ hasBeenConnnected, connected }) => connected || !hasBeenConnnected),
  ),
  true,
)

export const DisconnectionOverlay: React.FC = () => {
  const connectionStatus = useConnectionStatus()
  return useHideOverlay() ? null : (
    <Modal shouldShow>
      {connectionStatus === ConnectionStatus.IDLE_DISCONNECTED ? (
        <>
          <p>You have been disconnected due to inactivity.</p>
          <Button onClick={initConnection}>Reconnect</Button>
        </>
      ) : (
        "Trying to re-connect to the server..."
      )}
    </Modal>
  )
}
