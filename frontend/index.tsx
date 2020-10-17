import {
  initializeBlock,
  useBase,
  useRecords,
  ViewportConstraint,
} from '@airtable/blocks/ui'
import React from 'react'
import { Provider } from 'react-redux'

import { Schema } from './schema/Schema'
import { store } from './store/store'
import { SearchBar } from './components/SearchBar'
import { TrackingRecords } from './components/TrackingRecords'
import { SkuOrderRecords } from './components/SkuOrderRecords'
import { ReceivingWorkflow } from './components/ReceivingWorkflow'
import Record from '@airtable/blocks/dist/types/src/models/record'
import { SkuOrderTrackingNumberRoot } from './airtable/SkuOrderTrackingNumber'
import { SkuOrderTracking } from './schema/SkuOrderTracking'
import { SkuOrder } from './schema/SkuOrder'
import { BoxDestination } from './schema/BoxDestination'
import { Box } from './schema/Box'
function App() {
  const schema = new Schema()

  const skuOrdersTrackings = SkuOrderTracking.useWrapped(
    schema,
    schema.skuOrdersTracking.view.hasTrackingNumber,
    {
      fields: schema.skuOrdersTracking.allFields,
      sorts: [
        {
          field: schema.skuOrdersTracking.field.isReceivedRO,
          direction: 'asc',
        },
      ],
    }
  )

  /**
   * follow (AND USE) the whole tree now
   * we start large and the tree shrinks later
   * we use EVERYTHING in this call
   * we are grabbing all the fields in all the tables we
   * need and having airtable keep them up to date for us
   *
   * later, we can just call the relationship methods again
   * in the background, those records will be loaded and will
   * not throw exceptions when we try to use them
   */
  skuOrdersTrackings.forEach((sot: SkuOrderTracking) => {
    sot.skuOrders(true).forEach((so: SkuOrder) => {
      so.skus(true)
      so.boxDestinations(true).forEach((bd: BoxDestination) => {
        bd.boxes(true).forEach((box: Box) => {
          box.boxLines(true)
        })
      })
    })
  })
  return (
    <Provider store={store}>
      <ViewportConstraint minSize={{ width: 800 }} />
      <div>EHLO</div>
    </Provider>
  )
}

initializeBlock(() => <App />)
