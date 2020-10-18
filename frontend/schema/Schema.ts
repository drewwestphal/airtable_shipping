import Field from '@airtable/blocks/dist/types/src/models/field'

import Table from '@airtable/blocks/dist/types/src/models/table'
import View from '@airtable/blocks/dist/types/src/models/view'
import { useBase } from '@airtable/blocks/ui'
import { Moment } from 'moment'
import { WrappedField, RelField } from './Airtable'

/**
 * This file comes from the excel sheet in this repo
 *
 * The yellow column generates the typedef and the far right green column
 * generates the body of construct.
 *
 * Note that the code in the sheet is fine except for view generation which
 * is totally hacked since we only use one.
 */
export class Schema {
  skuOrdersTracking: {
    table: Table
    view: { hasTrackingNumber: View }
    trackingNumberPK: WrappedField<string>
    skuOrdersRel: WrappedField<RelField<string>>
    isReceivedRO: WrappedField<boolean>
    receivedAtDateTime: WrappedField<Moment>
    receivingNotes: WrappedField<string>
    warehouseNotes: WrappedField<string>
    allFields: Array<Field>
  }
  skuOrders: {
    table: Table
    skuOrderPK: WrappedField<string>
    trackingNumberRel: WrappedField<RelField<string>>
    orderRel: WrappedField<RelField<string>>
    skuRel: WrappedField<RelField<string>>
    boxDestRel: WrappedField<RelField<string>>
    quantityExpected: WrappedField<number>
    quantityReceived: WrappedField<number>
    quantityPacked: WrappedField<number>
    boxedCheckbox: WrappedField<boolean>
    externalProductName: WrappedField<string>
    skuIsReceived: WrappedField<boolean>
    destinationPrefix: WrappedField<string>
    receivingNotes: WrappedField<string>
    allFields: Array<Field>
  }
  skus: {
    table: Table
    skuPk: WrappedField<string>
    serialNumber: WrappedField<string>
    isSerialRequired: WrappedField<boolean>
    lifetimeOrderQty: WrappedField<number>
    allFields: Array<Field>
  }
  boxDestinations: {
    table: Table
    boxDestNamePK: WrappedField<string>
    boxesRel: WrappedField<RelField<string>>
    currentMaximalBoxNumber: WrappedField<number>
    destinationPrefix: WrappedField<string>
    boxOffset: WrappedField<number>
    isSerialBox: WrappedField<boolean>
    allFields: Array<Field>
  }
  boxes: {
    table: Table
    boxNumberPK: WrappedField<string>
    boxLinesRel: WrappedField<RelField<string>>
    boxDestRel: WrappedField<RelField<string>>
    boxNumberOnly: WrappedField<string>
    isMaxBox: WrappedField<boolean>
    isToggledForPacking: WrappedField<boolean>
    isPenultimateBox: WrappedField<boolean>
    isEmpty: WrappedField<boolean>
    allFields: Array<Field>
  }
  boxLines: {
    table: Table
    boxLinePK: WrappedField<string>
    boxRel: WrappedField<RelField<string>>
    skuRel: WrappedField<RelField<string>>
    skuOrderRel: WrappedField<RelField<string>>
    skuQty: WrappedField<number>
    allFields: Array<Field>
  }
  constructor() {
    const base = useBase()

    this.skuOrdersTracking = {
      table: base.getTableByName('SKU Orders Tracking'),
      view: {
        hasTrackingNumber: base
          .getTableByName('SKU Orders Tracking')
          .getViewByName('gtg_searchable_tracking_numbers'),
      },
      trackingNumberPK: new WrappedField<string>(
        base.getTableByName('SKU Orders Tracking'),
        base.getTableByName('SKU Orders Tracking').primaryField
      ),
      skuOrdersRel: new WrappedField<RelField<string>>(
        base.getTableByName('SKU Orders Tracking'),
        base.getTableByName('SKU Orders Tracking').getFieldByName('SKU Orders')
      ),
      isReceivedRO: new WrappedField<boolean>(
        base.getTableByName('SKU Orders Tracking'),
        base
          .getTableByName('SKU Orders Tracking')
          .getFieldByName('gtg_was_tracking_number_received')
      ),
      receivedAtDateTime: new WrappedField<Moment>(
        base.getTableByName('SKU Orders Tracking'),
        base
          .getTableByName('SKU Orders Tracking')
          .getFieldByName('Date Received')
      ),
      receivingNotes: new WrappedField<string>(
        base.getTableByName('SKU Orders Tracking'),
        base
          .getTableByName('SKU Orders Tracking')
          .getFieldByName('Receiving Notes (JoCo)')
      ),
      warehouseNotes: new WrappedField<string>(
        base.getTableByName('SKU Orders Tracking'),
        base
          .getTableByName('SKU Orders Tracking')
          .getFieldByName('Warehouse Notes (GTG)')
      ),
      allFields: [],
    }
    this.skuOrders = {
      table: base.getTableByName('SKU Orders'),
      skuOrderPK: new WrappedField<string>(
        base.getTableByName('SKU Orders'),
        base.getTableByName('SKU Orders').primaryField
      ),
      trackingNumberRel: new WrappedField<RelField<string>>(
        base.getTableByName('SKU Orders'),
        base.getTableByName('SKU Orders').getFieldByName('Tracking Number')
      ),
      orderRel: new WrappedField<RelField<string>>(
        base.getTableByName('SKU Orders'),
        base.getTableByName('SKU Orders').getFieldByName('Order')
      ),
      skuRel: new WrappedField<RelField<string>>(
        base.getTableByName('SKU Orders'),
        base.getTableByName('SKU Orders').getFieldByName('SKU')
      ),
      boxDestRel: new WrappedField<RelField<string>>(
        base.getTableByName('SKU Orders'),
        base.getTableByName('SKU Orders').getFieldByName('Onboard Destination')
      ),
      quantityExpected: new WrappedField<number>(
        base.getTableByName('SKU Orders'),
        base.getTableByName('SKU Orders').getFieldByName('Quantity Ordered')
      ),
      quantityReceived: new WrappedField<number>(
        base.getTableByName('SKU Orders'),
        base.getTableByName('SKU Orders').getFieldByName('Quantity Received')
      ),
      quantityPacked: new WrappedField<number>(
        base.getTableByName('SKU Orders'),
        base.getTableByName('SKU Orders').getFieldByName('gtg_packed_qty')
      ),
      boxedCheckbox: new WrappedField<boolean>(
        base.getTableByName('SKU Orders'),
        base.getTableByName('SKU Orders').getFieldByName('Boxed?')
      ),
      externalProductName: new WrappedField<string>(
        base.getTableByName('SKU Orders'),
        base
          .getTableByName('SKU Orders')
          .getFieldByName('External Product Name')
      ),
      skuIsReceived: new WrappedField<boolean>(
        base.getTableByName('SKU Orders'),
        base.getTableByName('SKU Orders').getFieldByName('SKU Received?')
      ),
      destinationPrefix: new WrappedField<string>(
        base.getTableByName('SKU Orders'),
        base.getTableByName('SKU Orders').getFieldByName('gtg_dest_prefix')
      ),
      receivingNotes: new WrappedField<string>(
        base.getTableByName('SKU Orders'),
        base.getTableByName('SKU Orders').getFieldByName('SKU Receiving Notes')
      ),
      allFields: [],
    }
    this.skus = {
      table: base.getTableByName('SKUs'),
      skuPk: new WrappedField<string>(
        base.getTableByName('SKUs'),
        base.getTableByName('SKUs').primaryField
      ),
      serialNumber: new WrappedField<string>(
        base.getTableByName('SKUs'),
        base.getTableByName('SKUs').getFieldByName('Serial Number')
      ),
      isSerialRequired: new WrappedField<boolean>(
        base.getTableByName('SKUs'),
        base.getTableByName('SKUs').getFieldByName('gtg_is_serial_required')
      ),
      lifetimeOrderQty: new WrappedField<number>(
        base.getTableByName('SKUs'),
        base.getTableByName('SKUs').getFieldByName('gtg_lifetime_ordered_qty')
      ),
      allFields: [],
    }
    this.boxDestinations = {
      table: base.getTableByName('Box Destinations'),
      boxDestNamePK: new WrappedField<string>(
        base.getTableByName('Box Destinations'),
        base.getTableByName('Box Destinations').primaryField
      ),
      boxesRel: new WrappedField<RelField<string>>(
        base.getTableByName('Box Destinations'),
        base.getTableByName('Box Destinations').getFieldByName('Boxes')
      ),
      currentMaximalBoxNumber: new WrappedField<number>(
        base.getTableByName('Box Destinations'),
        base
          .getTableByName('Box Destinations')
          .getFieldByName('Current Maximal Box #')
      ),
      destinationPrefix: new WrappedField<string>(
        base.getTableByName('Box Destinations'),
        base.getTableByName('Box Destinations').getFieldByName('Prefix')
      ),
      boxOffset: new WrappedField<number>(
        base.getTableByName('Box Destinations'),
        base.getTableByName('Box Destinations').getFieldByName('Box Offset')
      ),
      isSerialBox: new WrappedField<boolean>(
        base.getTableByName('Box Destinations'),
        base.getTableByName('Box Destinations').getFieldByName('Serial Box?')
      ),
      allFields: [],
    }
    this.boxes = {
      table: base.getTableByName('Boxes'),
      boxNumberPK: new WrappedField<string>(
        base.getTableByName('Boxes'),
        base.getTableByName('Boxes').primaryField
      ),
      boxLinesRel: new WrappedField<RelField<string>>(
        base.getTableByName('Boxes'),
        base.getTableByName('Boxes').getFieldByName('Constituent Box Lines')
      ),
      boxDestRel: new WrappedField<RelField<string>>(
        base.getTableByName('Boxes'),
        base.getTableByName('Boxes').getFieldByName('Onboard Destination')
      ),
      boxNumberOnly: new WrappedField<string>(
        base.getTableByName('Boxes'),
        base.getTableByName('Boxes').getFieldByName('# Only')
      ),
      isMaxBox: new WrappedField<boolean>(
        base.getTableByName('Boxes'),
        base.getTableByName('Boxes').getFieldByName('gtg_is_max_box')
      ),
      isToggledForPacking: new WrappedField<boolean>(
        base.getTableByName('Boxes'),
        base
          .getTableByName('Boxes')
          .getFieldByName('gtg_is_user_toggled_for_packing')
      ),
      isPenultimateBox: new WrappedField<boolean>(
        base.getTableByName('Boxes'),
        base.getTableByName('Boxes').getFieldByName('gtg_is_penultimate_box')
      ),
      isEmpty: new WrappedField<boolean>(
        base.getTableByName('Boxes'),
        base.getTableByName('Boxes').getFieldByName('gtg_is_empty')
      ),
      allFields: [],
    }
    this.boxLines = {
      table: base.getTableByName('Box Lines'),
      boxLinePK: new WrappedField<string>(
        base.getTableByName('Box Lines'),
        base.getTableByName('Box Lines').primaryField
      ),
      boxRel: new WrappedField<RelField<string>>(
        base.getTableByName('Box Lines'),
        base.getTableByName('Box Lines').getFieldByName('Box #')
      ),
      skuRel: new WrappedField<RelField<string>>(
        base.getTableByName('Box Lines'),
        base.getTableByName('Box Lines').getFieldByName('SKU')
      ),
      skuOrderRel: new WrappedField<RelField<string>>(
        base.getTableByName('Box Lines'),
        base.getTableByName('Box Lines').getFieldByName('SKU Order')
      ),
      skuQty: new WrappedField<number>(
        base.getTableByName('Box Lines'),
        base.getTableByName('Box Lines').getFieldByName('SKU Qty')
      ),
      allFields: [],
    }
    /**
     *
     *
     *
     *
     *
     *
     *
     *
     */

    for (const [tableName, props] of Object.entries(this)) {
      // it's a Schema Table
      for (const [fieldName, fieldObjProbably] of Object.entries(props)) {
        if (!['allFields', 'table', 'view'].includes(fieldName)) {
          //@ts-expect-error
          this[tableName].allFields.push(fieldObjProbably.field)
        }
      }
    }
  }
}
