import { initializeBlock, ViewportConstraint } from '@airtable/blocks/ui'
import React from 'react'
import { Provider } from 'react-redux'

import { Schema } from './schema'
import { store } from './store/store'
import { SearchBar } from './components/SearchBar'
import { TrackingRecords } from './components/TrackingRecords'

function HelloWorldTypescriptApp() {
  const schema = new Schema()
  // YOUR CODE GOES HERE
  return (
    <Provider store={store}>
      <ViewportConstraint minSize={{ width: 800 }} />
      <SearchBar />
      <TrackingRecords schema={schema} />
    </Provider>
  )
}

initializeBlock(() => <HelloWorldTypescriptApp />)
