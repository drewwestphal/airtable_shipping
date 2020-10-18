import Record from '@airtable/blocks/dist/types/src/models/record'
import { Moment } from 'moment'
import { HydratedRow, RelField, HydratedWrappedField } from './Airtable'
import { Schema } from './Schema'
import { SkuOrderPipelineRoot } from '../pipeline/SkuOrderPipeline'

export class SkuOrderTracking extends HydratedRow {
  trackingNumberPK: HydratedWrappedField<string>
  skuOrdersRel: HydratedWrappedField<RelField<string>>
  isReceivedRO: HydratedWrappedField<boolean>
  receivedAtDateTime: HydratedWrappedField<Moment>
  receivingNotes: HydratedWrappedField<string>
  warehouseNotes: HydratedWrappedField<string>

  constructor(schema: Schema, record: Record) {
    super(schema, schema.skuOrdersTracking.table, record)

    this.trackingNumberPK = schema.skuOrdersTracking.trackingNumberPK.hydrate(
      record
    )
    this.skuOrdersRel = schema.skuOrdersTracking.skuOrdersRel.hydrate(record)
    this.isReceivedRO = schema.skuOrdersTracking.isReceivedRO.hydrate(record)
    this.receivedAtDateTime = schema.skuOrdersTracking.receivedAtDateTime.hydrate(
      record
    )
    this.receivingNotes = schema.skuOrdersTracking.receivingNotes.hydrate(
      record
    )
    this.warehouseNotes = schema.skuOrdersTracking.warehouseNotes.hydrate(
      record
    )
  }

  skuOrderPipelineRoots(
    shouldUseWithHook?: boolean
  ): Array<SkuOrderPipelineRoot> {
    return SkuOrderPipelineRoot.followRelTowardMe(
      this.schema,
      this.skuOrdersRel,
      this.schema.skuOrders.allFields,
      [],
      shouldUseWithHook
    )
  }
}
