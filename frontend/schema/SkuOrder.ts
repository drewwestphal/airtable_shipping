import Record from '@airtable/blocks/dist/types/src/models/record'
import { WrappedRow, WrappedField, RelField } from './Airtable'
import { Schema } from './Schema'
import { Sku } from './Sku'
import { BoxDestination } from './BoxDestination'
import { Box } from '@airtable/blocks/ui'

export class SkuOrder extends WrappedRow {
  // pk
  skuOrderPK: WrappedField<string>
  // rels
  trackingNumberRel: WrappedField<RelField<string>>
  orderRel: WrappedField<RelField<string>>
  skuRel: WrappedField<RelField<string>>
  boxDestRel: WrappedField<RelField<string>>
  // data
  //trackingNumberReceived: WrappedField<string>
  quantityExpected: WrappedField<number>
  quantityReceived: WrappedField<number>
  quantityPacked: WrappedField<number>
  boxedCheckbox: WrappedField<boolean>
  externalProductName: WrappedField<string>
  skuIsReceived: WrappedField<boolean>
  destinationPrefix: WrappedField<string>
  receivingNotes: WrappedField<string>

  constructor(schema: Schema, record: Record) {
    super(schema, schema.skuOrders.table, record)
    let fields = schema.skuOrders.field
    this.skuOrderPK = this.makeWrapped<string>(this.table.primaryField)
    // rels
    this.trackingNumberRel = this.makeWrapped<RelField<string>>(
      fields.trackingNumberRel
    )
    this.orderRel = this.makeWrapped<RelField<string>>(fields.orderRel)
    this.skuRel = this.makeWrapped<RelField<string>>(fields.skuRel)
    this.boxDestRel = this.makeWrapped<RelField<string>>(fields.boxDestRel)
    // data
    //trackingNumberReceived:  new WrappedField<string>(table, table.getFieldByName('temptemptemp')),
    this.quantityExpected = this.makeWrapped<number>(fields.quantityExpected)
    this.quantityReceived = this.makeWrapped<number>(fields.quantityReceived)
    this.quantityPacked = this.makeWrapped<number>(fields.quantityPacked)
    this.boxedCheckbox = this.makeWrapped<boolean>(fields.boxedCheckbox)
    this.externalProductName = this.makeWrapped<string>(
      fields.externalProductName
    )
    this.skuIsReceived = this.makeWrapped<boolean>(fields.skuIsReceived)
    this.destinationPrefix = this.makeWrapped<string>(fields.destinationPrefix)
    this.receivingNotes = this.makeWrapped<string>(fields.receivingNotes)
  }

  skus(shouldUseWithHook?: boolean): Array<Sku> {
    return this.followRel(
      this.skuRel,
      this.schema.skus.allFields,
      [],
      (schema: Schema, record: Record) => {
        return new SkuOrder(schema, record)
      },
      shouldUseWithHook
    )
  }
  boxDestinations(shouldUseWithHook?: boolean): Array<BoxDestination> {
    return this.followRel(
      this.boxDestRel,
      this.schema.boxDestinations.allFields,
      [],
      (schema: Schema, record: Record) => {
        return new BoxDestination(schema, record)
      },
      shouldUseWithHook
    )
  }
}
