import { Button, CellRenderer, Heading, useRecords } from '@airtable/blocks/ui'
import { connect } from 'react-redux'
import { Schema } from '../airtable/Schema'
import { ApplicationState } from '../store/reducer'
import React from 'react'
import Record from '@airtable/blocks/dist/types/src/models/record'
import { skuReceivingSetSkuOrderFocus } from '../store/actions'

const SkuOrderRecordsImpl = (props: Props) => {
  const schema = props.schema
  return (
    <div>
      <Heading marginTop={'22px'} size="xsmall">
        SKU Receiving
      </Heading>

      <table // @ts-expect-error
        border={1}
      >
        <thead>
          <tr>
            <th>Tracking #</th>
            <th>SKU</th>
            <th>Desc</th>
            <th>Expect</th>
            <th>AlreadyPacked</th>
            <th>Dest</th>
            <th>Recv?</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {props.skuOrderSearchResults.map((skuOrder: Record) => {
            const skuName = schema.skuOrders.stringVal.skuRel(skuOrder)
            const skuExpectQty = schema.skuOrders.val.quantityExpected(skuOrder)
            const skuDest = schema.skuOrders.stringVal.destinationPrefix(
              skuOrder
            )
            const canReceive =
              skuName &&
              skuName.trim().length > 0 &&
              skuExpectQty &&
              skuExpectQty > 0 &&
              skuDest &&
              skuDest.trim().length > 0

            return (
              <tr key={skuOrder.id}>
                <td>
                  <CellRenderer
                    field={schema.skuOrders.field.trackingNumberRel}
                    record={skuOrder}
                  />
                </td>
                <td>
                  <CellRenderer
                    field={schema.skuOrders.field.skuRel}
                    record={skuOrder}
                  />
                </td>
                <td>
                  <CellRenderer
                    field={schema.skuOrders.field.externalProductName}
                    record={skuOrder}
                  />
                </td>
                <td>
                  <CellRenderer
                    field={schema.skuOrders.field.quantityExpected}
                    record={skuOrder}
                  />
                </td>
                <td>
                  <CellRenderer
                    field={schema.skuOrders.field.quantityPacked}
                    record={skuOrder}
                  />
                </td>
                <td>
                  <CellRenderer
                    field={schema.skuOrders.field.boxDestRel}
                    record={skuOrder}
                  />
                </td>
                <td>
                  <Button
                    onClick={() =>
                      props.skuReceivingSetSkuOrderFocus(skuOrder.id)
                    }
                    variant="primary"
                    icon="edit"
                    disabled={!canReceive}
                  >
                    Receive {skuName}
                  </Button>
                </td>
                <td>
                  <CellRenderer
                    field={schema.skuOrders.field.receivingNotes}
                    record={skuOrder}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

interface StateProps {
  skuOrderReceiveDialogFocusedRecordId: string | null
  skuOrderSearchResults: Record[]
}
interface OwnProps {
  schema: Schema
  skuOrderRecords: Record[]
}
interface DispatchProps {
  skuReceivingSetSkuOrderFocus(id: string | null): void
}
interface Props extends StateProps, DispatchProps, OwnProps {}

export const SkuOrderRecords = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  ApplicationState
>(
  // mapStateToProps
  (state: ApplicationState, ownProps: OwnProps) => ({
    schema: ownProps.schema,
    skuOrderSearchResults: ownProps.skuOrderRecords.filter(
      (skuOrder: Record) => {
        if (state.searchString.trim().length === 0) {
          return false
        }
        return ownProps.schema.skuOrders.stringVal
          .trackingNumberRel(skuOrder)
          .includes(state.searchString)
      }
    ),
    searchString: state.searchString,
    skuOrderReceiveDialogFocusedRecordId:
      state.skuReceivingDialogFocusedSkuOrderId,
  }),
  { skuReceivingSetSkuOrderFocus: skuReceivingSetSkuOrderFocus }
)(SkuOrderRecordsImpl)
