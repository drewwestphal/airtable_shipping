import { initializeBlock } from '@airtable/blocks/ui'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

//import { Schema } from './schema'
import reducer, { initialState } from './store/reducer'
import { SearchBar } from './components/SearchBar'

function HelloWorldTypescriptApp() {
  const store = createStore(reducer, initialState)
  //const schema = new Schema()
  // YOUR CODE GOES HERE
  return (
    <Provider store={store}>
      <SearchBar></SearchBar>
    </Provider>
  )
}

initializeBlock(() => <HelloWorldTypescriptApp />)
