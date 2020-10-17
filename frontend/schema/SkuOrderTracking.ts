import Record from '@airtable/blocks/dist/types/src/models/record'
import { Moment } from 'moment'
import { WrappedRow, WrappedField, RelField } from './Airtable'
import { Schema } from './Schema'

export class SkuOrderTracking extends WrappedRow {
  trackingNumberPK: WrappedField<string>
  //rel
  skuOrdersRel: WrappedField<RelField<string>>
  //data
  isReceivedRO: WrappedField<boolean>
  receivedAtDateTime: WrappedField<Moment>
  receivingNotes: WrappedField<string>
  warehouseNotes: WrappedField<string>

  constructor(schema: Schema, record: Record) {
    super(schema.base, schema.skus.table, record)
    let fields = schema.skus.field

    this.trackingNumberPK = this.makeWrapped<string>(this.table.primaryField)
    //rel
    this.skuOrdersRel = this.makeWrapped<RelField<string>>(fields.skuOrdersRel)
    //data
    this.isReceivedRO = this.makeWrapped<boolean>(fields.isReceivedRO)
    this.receivedAtDateTime = this.makeWrapped<Moment>(
      fields.receivedAtDateTime
    )
    this.receivingNotes = this.makeWrapped<string>(fields.receivingNotes)
    this.warehouseNotes = this.makeWrapped<string>(fields.warehouseNotes)
  }
}
