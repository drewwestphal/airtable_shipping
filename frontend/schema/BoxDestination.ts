import Record from '@airtable/blocks/dist/types/src/models/record'
import { HydratedRow, HydratedWrappedField, RelField } from './Airtable'
import { Schema } from './Schema'
import { Box } from './Box'

export class BoxDestination extends HydratedRow {
  boxDestNamePK: HydratedWrappedField<string>
  boxesRel: HydratedWrappedField<RelField<string>>
  currentMaximalBoxNumber: HydratedWrappedField<number>
  destinationPrefix: HydratedWrappedField<string>
  boxOffset: HydratedWrappedField<number>
  isSerialBox: HydratedWrappedField<boolean>

  constructor(schema: Schema, record: Record) {
    super(schema, schema.boxDestinations.table, record)

    this.boxDestNamePK = schema.boxDestinations.boxDestNamePK.hydrate(record)
    this.boxesRel = schema.boxDestinations.boxesRel.hydrate(record)
    this.currentMaximalBoxNumber = schema.boxDestinations.currentMaximalBoxNumber.hydrate(
      record
    )
    this.destinationPrefix = schema.boxDestinations.destinationPrefix.hydrate(
      record
    )
    this.boxOffset = schema.boxDestinations.boxOffset.hydrate(record)
    this.isSerialBox = schema.boxDestinations.isSerialBox.hydrate(record)
  }

  boxes(shouldUseWithHook?: boolean): Array<Box> {
    return Box.followRelTowardMe(
      this.schema,
      this.boxesRel,
      this.schema.boxes.allFields,
      [],
      shouldUseWithHook
    )
  }
}
