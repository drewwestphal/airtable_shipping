import Record from '@airtable/blocks/dist/types/src/models/record'
import { WrappedRow, WrappedField, RelField } from './Airtable'
import { Schema } from './Schema'
import { Box } from './Box'

export class BoxDestination extends WrappedRow {
  //pk
  boxDestNamePK: WrappedField<string>
  //rel
  boxesRel: WrappedField<RelField<string>>
  //data
  currentMaximalBoxNumber: WrappedField<number>
  destinationPrefix: WrappedField<string>
  boxOffset: WrappedField<number>
  isSerialBox: WrappedField<boolean>

  constructor(schema: Schema, record: Record) {
    super(schema, schema.boxDestinations.table, record)
    let fields = schema.boxDestinations.field
    //pk
    this.boxDestNamePK = this.makeWrapped<string>(fields.boxDestNamePK)
    //rel
    this.boxesRel = this.makeWrapped<RelField<string>>(fields.boxesRel)
    //data
    this.currentMaximalBoxNumber = this.makeWrapped<number>(
      fields.currentMaximalBoxNumber
    )
    this.destinationPrefix = this.makeWrapped<string>(fields.destinationPrefix)
    this.boxOffset = this.makeWrapped<number>(fields.boxOffset)
    this.isSerialBox = this.makeWrapped<boolean>(fields.isSerialBox)
  }

  boxes(shouldUseWithHook?: boolean): Array<Box> {
    return this.followRel(
      this.boxesRel,
      this.schema.boxes.allFields,
      [],
      (schema: Schema, record: Record) => {
        return new Box(schema, record)
      },
      shouldUseWithHook
    )
  }
}
