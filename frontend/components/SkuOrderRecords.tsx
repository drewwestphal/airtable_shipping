import { Button, CellRenderer, Heading, useRecords } from '@airtable/blocks/ui'
import { connect } from 'react-redux'
import { Schema } from '../schema'
import { ApplicationState } from '../store/reducer'
import React from 'react'
import Record from '@airtable/blocks/dist/types/src/models/record'
import { skuOrderReceiveDialogSetFocus } from '../store/actions'

interface StateProps {
  searchString: string
  skuOrderReceiveDialogFocusedRecordId: string | null
}
interface OwnProps {
  schema: Schema
}
interface DispatchProps {
  skuOrderReceiveDialogSetFocus(id: string | null): void
}
interface Props extends StateProps, DispatchProps, OwnProps {}

const SkuOrderRecordsImpl = (props: Props) => {
  const schema = props.schema
  const searchResults: Record[] = useRecords(
    schema.skuOrders.view.hasTrackingNumber,
    {
      fields: schema.skuOrders.allFields,
      sorts: [
        {
          field: schema.skuOrders.field.destinationPrefix,
          direction: 'desc',
        },
      ],
    }
  ).filter((skuOrder: Record) => {
    return schema.skuOrders.stringVal
      .trackingNumberRel(skuOrder)
      .includes(props.searchString)
  })
  if (props.searchString.trim().length === 0) {
    return <span></span>
  }
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
          {searchResults.map((skuOrder: Record) => {
            const skuName = schema.skuOrders.stringVal.skuOrderPK(skuOrder)
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
                    field={schema.skuOrders.field.boxDestinationRel}
                    record={skuOrder}
                  />
                </td>
                <td>
                  <Button
                    onClick={() =>
                      props.skuOrderReceiveDialogSetFocus(skuOrder.id)
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

export const SkuOrderRecords = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  ApplicationState
>(
  // mapStateToProps
  (state: ApplicationState, ownProps: OwnProps) => ({
    schema: ownProps.schema,

    searchString: state.searchString,
    skuOrderReceiveDialogFocusedRecordId:
      state.skuOrderReceiveDialogFocusedRecordId,
  }),
  { skuOrderReceiveDialogSetFocus: skuOrderReceiveDialogSetFocus }
)(SkuOrderRecordsImpl)
