import Record from '@airtable/blocks/dist/types/src/models/record'
import { WrappedRow, WrappedField, RelField } from './Airtable'
import { Schema } from './Schema'
export class BoxLine extends WrappedRow {
  boxLinePK: WrappedField<RelField<string>>
  //rel
  boxRel: WrappedField<RelField<string>>
  skuRel: WrappedField<RelField<string>>
  skuOrderRel: WrappedField<RelField<string>>
  //data
  skuQty: WrappedField<number>

  constructor(schema: Schema, record: Record) {
    super(schema.base, schema.boxLines.table, record)
    let fields = schema.boxLines.field
    this.boxLinePK = this.makeWrapped<RelField<string>>(this.table.primaryField)
    //rel
    this.boxRel = this.makeWrapped<RelField<string>>(fields.boxRel)
    this.skuRel = this.makeWrapped<RelField<string>>(fields.skuRel)
    this.skuOrderRel = this.makeWrapped<RelField<string>>(fields.skuOrderRel)
    //data
    this.skuQty = this.makeWrapped<number>(fields.skuQty)
  }
}
