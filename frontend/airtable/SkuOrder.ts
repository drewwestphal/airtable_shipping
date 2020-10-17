import { SkuOrderPipelineCell, BoxWrapper } from './RecordWrappers'
import { PotentialBoxesForReceiving } from '../store/types'

// 1 andc only
export class SkuOrderDisplay extends SkuOrderPipelineCell {
  next() {
    if (
      this.sku().skuName().trim().length > 0 &&
      this.skuExpectQty() > 0 &&
      this.skuDestId().trim().length > 0
    ) {
      // must be true for all
      if (this.sku().isSerialRequired()) {
        return new SkuOrderCollectSerialNumber(
          this.schema,
          this.table,
          this.record
        )
      } else {
        return new SkuOrderReceiveQty(this.schema, this.table, this.record)
      }
    } else {
      return 'Data corruption'
    }
  }
  action() {
    return null
  }
}

export class SkuOrderCollectSerialNumber extends SkuOrderPipelineCell {
  next() {
    if (this.sku().lifetimeOrderQty() !== 1) {
      return 'Serial number items are unique but more than one item with this SKU has been ordered. This must be repaired manually.'
    }
    if (this.sku().serial().length > 4) {
      return new SkuOrderSerialReceiveOneItem(
        this.schema,
        this.table,
        this.record
      )
    } else {
      return 'Must enter a serial number of 5 or more characters'
    }
  }
  action() {
    return null
  }
}

export class SkuOrderSerialReceiveOneItem extends SkuOrderPipelineCell {
  next() {
    if (this.sku().skuNameIsSerialized()) {
      return new SkuOrderBoxSKU(this.schema, this.table, this.record)
    }
    if (this.sku().skuNameIsSerialTemplate()) {
      return 'Waiting to serialize SKU Name'
    }
    return `Data corruption in SKU Name--can't update sku name`
  }
  action() {
    if (this.sku().skuNameIsSerialTemplate()) {
      return Promise.all([
        this.sku().updateField(
          this.schema.skus.field.skuPk,
          this.sku().serializeSkuName(this.sku().serial())
        ),
        this.updateField(this.schema.skuOrders.field.quantityReceived, 1),
      ])
    }
  }
}
export class SkuOrderReceiveQty extends SkuOrderPipelineCell {
  next() {
    let selbo = new SkuOrderBoxSKU(this.schema, this.table, this.record)
    if (this.quantityReceived() != this.quantityExpected()) {
      if (this.receivingNotes().length > 1) {
        return selbo
      }
      return 'You must enter a note about why the quantity received is not the quantity expected'
    }
    return selbo
  }
  action() {
    return null
  }
}
export class SkuOrderBoxSKU extends SkuOrderPipelineCell {
  potentialBoxes() {
    this.dest()
      .boxes()
      .reduce(
        (accum: PotentialBoxesForReceiving, boxWrapper: BoxWrapper) => {
          if (boxWrapper.isMax()) {
            accum.extantMaxBox = boxWrapper
          } else if (boxWrapper.isPenultimate()) {
            accum.extantPenultimateBox = boxWrapper
          } else if (boxWrapper.isEmpty()) {
            accum.extantEmptyNonMaxBoxes.push(boxWrapper)
          } else if (boxWrapper.isUserSelected()) {
            accum.extantNonEmptyUserSelectedBoxes.push(boxWrapper)
          }
          return accum
        },
        {
          extantMaxBox: null,
          extantPenultimateBox: null,
          extantEmptyNonMaxBoxes: [],
          extantNonEmptyUserSelectedBoxes: [],
          maxBoxToMake: {
            boxNumberOnly: this.dest().maximalBoxNumber(),
            boxDestinationId: this.dest().record.id,
            notes: 'Created by receiving tool',
          },
        }
      )
  }
}
