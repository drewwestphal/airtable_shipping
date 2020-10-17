import Record from '@airtable/blocks/dist/types/src/models/record'
import { connect } from 'react-redux'
import { Schema } from '../airtable/Schema'
import { ApplicationState } from '../store/reducer'
import { SkuOrderTrackingNumberRoot } from '../airtable/SkuOrderTrackingNumber'
import React from 'react'

interface StateProps {}
interface OwnProps {
  schema: Schema
  skotnrs: SkuOrderTrackingNumberRoot[]
}
interface DispatchProps {}
interface Props extends StateProps, DispatchProps, OwnProps {}

const PipelineStateImpl = (props: Props) => {
  return (
    <div>
      <pre>{JSON.stringify(props.skotnrs)}</pre>
    </div>
  )
}

export const PipelineState = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  ApplicationState
>(
  // mapStateToProps
  (state: ApplicationState, ownProps: OwnProps) => ({
    schema: ownProps.schema,
    skotnrs: ownProps.skotnrs,
  }),
  {}
)(PipelineStateImpl)
