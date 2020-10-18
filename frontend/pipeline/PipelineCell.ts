import { SkuOrderTracking } from '../schema/SkuOrderTracking'
import { SkuOrder } from '../schema/SkuOrder'

export abstract class PipelineCell {
  abstract next(): PipelineCell | string
  abstract action(): Promise<void> | null
}

export abstract class SkuOrderPipelineCell extends SkuOrder {}
export abstract class SkuOrderTrackingPipelineCell extends SkuOrderTracking {}
