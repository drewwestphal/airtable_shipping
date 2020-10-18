import { SkuOrder } from '../schema/SkuOrder'

// finallyy.... from here: https://stackoverflow.com/a/42705697
export abstract class SkuOrderPipelineCell<
  T extends SkuOrderPipelineCell<any>
> extends SkuOrder {
  abstract next(): T | string

  abstract action(): Promise<void | Array<void>> | null
}

// 1 andc only
export class SkuOrderPipelineRoot extends SkuOrderPipelineCell<any> {
  next() {
    if (
      this.sku().skuPk.stringVal().trim().length > 0 &&
      this.quantityExpected.val() > 0 &&
      this.boxDestination().boxDestNamePK.stringVal().trim().length > 0
    ) {
      // must be true for all
      if (this.sku().isSerialRequired.val()) {
        return new SkuOrderCollectSerialNumber(this.schema, this.record)
      } else {
        return new SkuOrderReceiveQty(this.schema, this.record)
      }
    }
    return 'Data corruption'
  }
  action() {
    return null
  }
}

export class SkuOrderCollectSerialNumber extends SkuOrderPipelineCell<any> {
  next() {
    if (this.sku().lifetimeOrderQty.val() !== 1) {
      return 'Serial number items are unique but more than one item with this SKU has been ordered. This must be repaired manually.'
    }
    if (this.sku().serialNumber.stringVal().length > 4) {
      return new SkuOrderSerialReceiveOneItem(this.schema, this.record)
    } else {
      return 'Must enter a serial number of 5 or more characters'
    }
  }
  action() {
    return null
  }
}

export class SkuOrderSerialReceiveOneItem extends SkuOrderPipelineCell<any> {
  next() {
    /*
    if (this.sku().skuNameIsSerialized()) {
      return new SkuOrderBoxSKU(this.schema, this.table, this.record)
    }
    if (this.sku().skuNameIsSerialTemplate()) {
      return 'Waiting to serialize SKU Name'
    }
    return `Data corruption in SKU Name--can't update sku name`*/
    return 'boop'
  }
  action() {
    if (this.sku().getSerializedSkuNameIfExists().length > 0) {
      return Promise.all([
        this.sku().skuPk.updateAsync(this.sku().getSerializedSkuNameIfExists()),
        this.quantityReceived.updateAsync(1),
      ])
    }
    return null
  }
}
export class SkuOrderReceiveQty extends SkuOrderPipelineCell<any> {
  next() {
    /*
    let selbo = new SkuOrderBoxSKU(this.schema, this.record)
    if (this.quantityReceived.val() != this.quantityExpected.val()) {
      if (this.receivingNotes.val().length > 1) {
        return selbo
      }
      return 'You must enter a note about why the quantity received is not the quantity expected'
    }
    return selbo*/ return 'beep'
  }
  action() {
    return null
  }
}
/*
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
*/
