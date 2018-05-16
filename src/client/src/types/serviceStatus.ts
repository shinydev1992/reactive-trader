/**
 * Provides a status of the instances for a given service type
 */

import { ServiceInstanceStatus } from '.'

export interface ServiceStatus {
  serviceType: string
  instanceStatuses: Map<string, ServiceInstanceStatus>
  isConnected: boolean
}
