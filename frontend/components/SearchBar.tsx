import { FormField, Input } from '@airtable/blocks/ui'
import React from 'react'
import { connect } from 'react-redux'
import { searchBarValueDidChange } from '../store/actions'
import { ApplicationState } from '../store/types'

interface Props {
  searchString: string
  updateSearchStr(searchString: string): void
}

const SearchBarImpl = (props: Props) => {
  return (
    <FormField label="Tracking Number Search">
      <Input
        value={props.searchString}
        onChange={(e) => props.updateSearchStr(e.target.value)}
        placeholder="Search..."
        size="large"
        width="320px"
      />
    </FormField>
  )
}

export const SearchBar = connect(
  // mapStateToProps
  (state: ApplicationState) => ({
    searchString: state.searchString,
  }),
  // mapDispatchToProps
  {
    updateSearchStr: searchBarValueDidChange,
  }
)(SearchBarImpl)
