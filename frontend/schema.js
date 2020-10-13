import { useBase } from '@airtable/blocks/ui'

export default function getSchema () {
  const base = useBase()
  const schema = { base: base }

  {
    let table = base.getTableByName('SKU Orders Tracking')
    schema.skuOrdersTracking = {}
    schema.skuOrdersTracking.view = {}
    schema.skuOrdersTracking.field = {}
    schema.skuOrdersTracking.table = table
    schema.skuOrdersTracking.field.trackingNumberPK = table.primaryField
    schema.skuOrdersTracking.field.trackingNumberReceived = table.getFieldByName(
      'Tracking # Received?'
    )
    schema.skuOrdersTracking.field.skuOrdersRel = table.getFieldByName(
      'SKU Orders'
    )
    schema.skuOrdersTracking.allViews = Object.values(
      schema.skuOrdersTracking.view
    )
    schema.skuOrdersTracking.allFields = Object.values(
      schema.skuOrdersTracking.field
    )
  }
  {
    let table = base.getTableByName('SKU Orders')
    schema.skuOrders = {}
    schema.skuOrders.view = {}
    schema.skuOrders.field = {}
    schema.skuOrders.table = table
    schema.skuOrders.field.skuOrderPK = table.primaryField
    schema.skuOrders.field.trackingNumberReceived = table.getFieldByName(
      'Tracking # Received?'
    )
    schema.skuOrders.field.orderRel = table.getFieldByName('Order')
    schema.skuOrders.field.skuRel = table.getFieldByName('SKU')
    schema.skuOrders.field.skuName = table.getFieldByName('gtg_sku_name')
    schema.skuOrders.field.quantityOrdered = table.getFieldByName(
      'Quantity Ordered'
    )
    schema.skuOrders.field.externalProductName = table.getFieldByName(
      'External Product Name'
    )
    schema.skuOrders.field.skuIsReceived = table.getFieldByName('SKU Received?')
    schema.skuOrders.field.onboardDestinationRel = table.getFieldByName(
      'Onboard Destination'
    )
    schema.skuOrders.field.destinationPrefix = table.getFieldByName(
      'gtg_dest_prefix'
    )
    schema.skuOrders.field.receivingNotes = table.getFieldByName(
      'SKU Receiving Notes'
    )

    schema.skuOrders.allViews = Object.values(schema.skuOrders.view)
    schema.skuOrders.allFields = Object.values(schema.skuOrders.field)
  }
  return schema
}
