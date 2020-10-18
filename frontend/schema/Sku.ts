import Record from '@airtable/blocks/dist/types/src/models/record'
import { HydratedRow, HydratedWrappedField } from './Airtable'
import { Schema } from './Schema'

export class Sku extends HydratedRow {
  skuPk: HydratedWrappedField<string>
  serialNumber: HydratedWrappedField<string>
  isSerialRequired: HydratedWrappedField<boolean>
  lifetimeOrderQty: HydratedWrappedField<number>

  constructor(schema: Schema, record: Record) {
    super(schema, schema.skus.table, record)

    this.skuPk = schema.skus.skuPk.hydrate(record)
    this.serialNumber = schema.skus.serialNumber.hydrate(record)
    this.isSerialRequired = schema.skus.isSerialRequired.hydrate(record)
    this.lifetimeOrderQty = schema.skus.lifetimeOrderQty.hydrate(record)
  }

  skuNameIsSerialTemplate() {
    // they look like SKUNAME-XXXX or XXXY or somethign
    return this.skuPk.val().slice(-5).substr(0, 2) === '-X'
  }
  getSerializedSkuNameIfExists(): string {
    if (this.skuNameIsSerialTemplate()) {
      return (
        this.skuPk.stringVal().slice(0, -4) +
        this.serialNumber.stringVal().slice(-4)
      )
    }
    return ''
  }
  skuNameIsSerialized(): boolean {
    return this.getSerializedSkuNameIfExists() === this.skuPk.stringVal()
  }
}
