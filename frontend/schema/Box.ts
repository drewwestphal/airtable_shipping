import Record from '@airtable/blocks/dist/types/src/models/record'
import { WrappedRow, WrappedField, RelField } from './Airtable'
import { Schema } from './Schema'

export class Box extends WrappedRow {
  boxNumberPK: WrappedField<string>
  //rel
  boxDestRel: WrappedField<RelField<string>>
  boxNumberOnly: WrappedField<string>
  //data
  isMaxBox: WrappedField<boolean>
  isToggledForPacking: WrappedField<boolean>
  isPenultimateBox: WrappedField<boolean>
  isEmpty: WrappedField<boolean>
  notes: WrappedField<string>

  constructor(schema: Schema, record: Record) {
    super(schema.base, schema.boxes.table, record)
    let fields = schema.boxes.field
    this.boxNumberPK = this.makeWrapped<string>(fields.primaryField)
    this.boxDestRel = this.makeWrapped<RelField<string>>(fields.boxDestRel)
    this.boxNumberOnly = this.makeWrapped<string>(fields.boxNumberOnly)
    this.isMaxBox = this.makeWrapped<boolean>(fields.isMaxBox)
    this.isToggledForPacking = this.makeWrapped<boolean>(
      fields.isToggledForPacking
    )
    this.isPenultimateBox = this.makeWrapped<boolean>(fields.isPenultimateBox)
    this.isEmpty = this.makeWrapped<boolean>(fields.isEmpty)
    this.notes = this.makeWrapped<string>(fields.notes)
  }
}
