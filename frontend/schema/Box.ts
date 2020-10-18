import Record from '@airtable/blocks/dist/types/src/models/record'
import { HydratedRow, HydratedWrappedField, RelField } from './Airtable'
import { Schema } from './Schema'
import { BoxLine } from './BoxLine'

export class Box extends HydratedRow {
  boxNumberPK: HydratedWrappedField<string>
  boxLinesRel: HydratedWrappedField<RelField<string>>
  boxDestRel: HydratedWrappedField<RelField<string>>
  boxNumberOnly: HydratedWrappedField<string>
  isMaxBox: HydratedWrappedField<boolean>
  isToggledForPacking: HydratedWrappedField<boolean>
  isPenultimateBox: HydratedWrappedField<boolean>
  isEmpty: HydratedWrappedField<boolean>

  constructor(schema: Schema, record: Record) {
    super(schema, schema.boxes.table, record)

    this.boxNumberPK = schema.boxes.boxNumberPK.hydrate(record)
    this.boxLinesRel = schema.boxes.boxLinesRel.hydrate(record)
    this.boxDestRel = schema.boxes.boxDestRel.hydrate(record)
    this.boxNumberOnly = schema.boxes.boxNumberOnly.hydrate(record)
    this.isMaxBox = schema.boxes.isMaxBox.hydrate(record)
    this.isToggledForPacking = schema.boxes.isToggledForPacking.hydrate(record)
    this.isPenultimateBox = schema.boxes.isPenultimateBox.hydrate(record)
    this.isEmpty = schema.boxes.isEmpty.hydrate(record)
  }

  boxLines(shouldUseWithHook?: boolean): Array<BoxLine> {
    return BoxLine.followRelTowardMe(
      this.schema,
      this.boxLinesRel,
      this.schema.boxLines.allFields,
      [],
      shouldUseWithHook
    )
  }
}
