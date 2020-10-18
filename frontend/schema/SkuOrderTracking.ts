import Record from '@airtable/blocks/dist/types/src/models/record'
import Table from '@airtable/blocks/dist/types/src/models/table'
import View from '@airtable/blocks/dist/types/src/models/view'
import { Moment } from 'moment'
import { WrappedRow, WrappedField, RelField } from './Airtable'
import { Schema } from './Schema'
import { SkuOrder } from './SkuOrder'

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
    super(schema, schema.skuOrdersTracking.table, record)
    let fields = schema.skuOrdersTracking.field

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

  skuOrders(shouldUseWithHook?: boolean): Array<SkuOrder> {
    return this.followRel(
      this.skuOrdersRel,
      this.schema.skuOrders.allFields,
      [],
      (schema: Schema, record: Record) => {
        return new SkuOrder(schema, record)
      },
      shouldUseWithHook
    )
  }
  static useWrapped(
    schema: Schema,
    tableOrView: Table | View,
    useRecordsQuery: any
  ) {
    return SkuOrderTracking.useWrappedRecords<SkuOrderTracking>(
      schema,
      tableOrView,
      useRecordsQuery,
      (schema: Schema, record: Record) => {
        return new this(schema, record)
      }
    )
  }
}
