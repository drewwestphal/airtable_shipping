import Record from '@airtable/blocks/dist/types/src/models/record'
import { WrappedRow, WrappedField } from './Airtable'
import { Schema } from './Schema'
export class Sku extends WrappedRow {
  skuPk: WrappedField<string>
  // rels
  // data
  //trackingNumberReceived: WrappedField<string>
  serialNumber: WrappedField<string>
  isSerialRequired: WrappedField<boolean>
  lifetimeOrderQty: WrappedField<number>
  skuNameIsSerialTemplate: WrappedField<boolean>

  constructor(schema: Schema, record: Record) {
    super(schema.base, schema.skus.table, record)
    let fields = schema.skus.field
    this.skuPk = this.makeWrapped<string>(this.table.primaryField)
    // rels
    // data
    //trackingNumberReceived:  new WrappedField<string>(table, table.getFieldByName('temptemptemp')),
    this.serialNumber = this.makeWrapped<string>(fields.serialNumber)
    this.isSerialRequired = this.makeWrapped<boolean>(fields.isSerialRequired)
    this.lifetimeOrderQty = this.makeWrapped<number>(fields.lifetimeOrderQty)
    this.skuNameIsSerialTemplate = this.makeWrapped<boolean>(
      fields.skuNameIsSerialTemplate
    )
  }
}
