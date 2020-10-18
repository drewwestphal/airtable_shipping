import Record from '@airtable/blocks/dist/types/src/models/record'
import { HydratedRow, HydratedWrappedField, RelField } from './Airtable'
import { Schema } from './Schema'
import { Sku } from './Sku'
import { BoxDestination } from './BoxDestination'

export class SkuOrder extends HydratedRow {
  skuOrderPK: HydratedWrappedField<string>
  trackingNumberRel: HydratedWrappedField<RelField<string>>
  orderRel: HydratedWrappedField<RelField<string>>
  skuRel: HydratedWrappedField<RelField<string>>
  boxDestRel: HydratedWrappedField<RelField<string>>
  quantityExpected: HydratedWrappedField<number>
  quantityReceived: HydratedWrappedField<number>
  quantityPacked: HydratedWrappedField<number>
  boxedCheckbox: HydratedWrappedField<boolean>
  externalProductName: HydratedWrappedField<string>
  skuIsReceived: HydratedWrappedField<boolean>
  destinationPrefix: HydratedWrappedField<string>
  receivingNotes: HydratedWrappedField<string>

  constructor(schema: Schema, record: Record) {
    super(schema, schema.skuOrders.table, record)

    this.skuOrderPK = schema.skuOrders.skuOrderPK.hydrate(record)
    this.trackingNumberRel = schema.skuOrders.trackingNumberRel.hydrate(record)
    this.orderRel = schema.skuOrders.orderRel.hydrate(record)
    this.skuRel = schema.skuOrders.skuRel.hydrate(record)
    this.boxDestRel = schema.skuOrders.boxDestRel.hydrate(record)
    this.quantityExpected = schema.skuOrders.quantityExpected.hydrate(record)
    this.quantityReceived = schema.skuOrders.quantityReceived.hydrate(record)
    this.quantityPacked = schema.skuOrders.quantityPacked.hydrate(record)
    this.boxedCheckbox = schema.skuOrders.boxedCheckbox.hydrate(record)
    this.externalProductName = schema.skuOrders.externalProductName.hydrate(
      record
    )
    this.skuIsReceived = schema.skuOrders.skuIsReceived.hydrate(record)
    this.destinationPrefix = schema.skuOrders.destinationPrefix.hydrate(record)
    this.receivingNotes = schema.skuOrders.receivingNotes.hydrate(record)
  }

  sku(shouldUseWithHook?: boolean): Sku {
    // idk why erroring?
    //@ts-expect-error
    return Sku.followRelTowardMe(
      this.schema,
      this.skuRel,
      this.schema.skus.allFields,
      [],
      shouldUseWithHook
    )[0]
  }
  boxDestination(shouldUseWithHook?: boolean): BoxDestination {
    // idk why erroring?
    //@ts-expect-error
    return BoxDestination.followRelTowardMe(
      this.schema,
      this.boxDestRel,
      this.schema.boxDestinations.allFields,
      [],
      shouldUseWithHook
    )[0]
  }
}
