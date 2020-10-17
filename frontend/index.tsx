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
function App() {
  const schema = new Schema()

  const skuOrdersTrackings = SkuOrderTracking.useWrappedRecords(
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
    },
    (schema, record) => {
      return new SkuOrderTracking(schema, record)
    }
  )

  // we use these records here but really airtable
  useRecords(schema.skuOrders.view.hasTrackingNumber, {
    fields: schema.skuOrders.allFields,
    sorts: [
      {
        field: schema.skuOrders.field.destinationPrefix,
        direction: 'desc',
      },
    ],
  })

  useRecords(schema.boxes.view.packableBoxes, {
    fields: schema.boxes.allFields,
  })

  useRecords(schema.boxDestinations.table, {
    fields: schema.boxDestinations.allFields,
  })

  useRecords(schema.boxes.table, {
    fields: [schema.boxes.field.boxDestRel],
  })

  return (
    <Provider store={store}>
      <ViewportConstraint minSize={{ width: 800 }} />
      <div>EHLO</div>
    </Provider>
  )
}

initializeBlock(() => <App />)
