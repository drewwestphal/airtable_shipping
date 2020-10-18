import Record from '@airtable/blocks/dist/types/src/models/record'
import { HydratedRow, HydratedWrappedField, RelField } from './Airtable'
import { Schema } from './Schema'

export class BoxLine extends HydratedRow {
  boxLinePK: HydratedWrappedField<string>
  boxRel: HydratedWrappedField<RelField<string>>
  skuRel: HydratedWrappedField<RelField<string>>
  skuOrderRel: HydratedWrappedField<RelField<string>>
  skuQty: HydratedWrappedField<number>

  constructor(schema: Schema, record: Record) {
    super(schema, schema.boxLines.table, record)

    this.boxLinePK = schema.boxLines.boxLinePK.hydrate(record)
    this.boxRel = schema.boxLines.boxRel.hydrate(record)
    this.skuRel = schema.boxLines.skuRel.hydrate(record)
    this.skuOrderRel = schema.boxLines.skuOrderRel.hydrate(record)
    this.skuQty = schema.boxLines.skuQty.hydrate(record)
  }
}
