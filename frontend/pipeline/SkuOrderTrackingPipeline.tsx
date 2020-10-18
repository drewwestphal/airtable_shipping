//import { SkuOrderPipelineRoot } from './SkuOrderPipeline'
import { SkuOrderTrackingPipelineCell } from './/PipelineCell'

// 1 andc only
export class SkuOrderTrackingNumberRoot extends SkuOrderTrackingPipelineCell {
  next() {
    if (this.isReceivedRO.val()) {
      return new SKUOrderTrackingNumberEditRevert(this.schema, this.record)
    } else {
      return new SKUOrderTrackingNumberReceiving(this.schema, this.record)
    }
  }
  action() {
    return null
  }
}

export class SKUOrderTrackingNumberReceiving extends SkuOrderTrackingPipelineCell {
  next() {
    return null
  }
  action() {
    //return this.updateField(this.schema.skuOrders.field)
  }
}

export class SKUOrderTrackingNumberEditRevert extends SkuOrderTrackingPipelineCell {
  next() {
    return null
  }
  /*  skuOrderPipelineRoots() {
    return this.skuOrderPipelineRoots()
  }*/
}
