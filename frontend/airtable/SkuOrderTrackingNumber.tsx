import Record from '@airtable/blocks/dist/types/src/models/record'
import { SkuOrderTrackingPipelineCell } from './RecordWrappers'
import { SkuOrderDisplay } from './SkuOrder'
import { Schema } from './Schema'
import Table from '@airtable/blocks/dist/types/src/models/table'

// 1 andc only
export class SkuOrderTrackingNumberRoot extends SkuOrderTrackingPipelineCell {
  next() {
    if (this.isReceived()) {
      return new SKUOrderTrackingNumberEditRevert(
        this.schema,
        this.table,
        this.record
      )
    } else {
      return new SKUOrderTrackingNumberReceiving(
        this.schema,
        this.table,
        this.record
      )
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
  skuOrderPipelines() {
    return this.followRel(
      this.schema.skuOrdersTracking.field.skuOrdersRel,
      this.schema.skuOrders.allFields,
      [
        {
          field: this.schema.skuOrders.field.destinationPrefix,
          direction: 'desc',
        },
      ],
      (schema: Schema, table: Table, record: Record) => {
        return new SkuOrderDisplay(schema, table, record)
      }
    )
  }
}
