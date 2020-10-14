import {
  useRecords,
  Button,
  Dialog,
  Heading,
  Text,
  SelectButtons,
} from '@airtable/blocks/ui'
import React from 'react'
import { connect } from 'react-redux'
import {
  trackingReceiveDialogSetFocus,
  warehouseNotesDidChange,
  persistValueToRecordField,
  trackingDisplayChoiceDidChange,
} from '../store/actions'
import { Schema } from '../schema'
import Record from '@airtable/blocks/dist/types/src/models/record'
import { ApplicationState } from '../store/reducer'
import moment from 'moment'
import { PersistFieldToRecordArgs, TrackingDisplayChoice } from '../store/types'

interface StateProps {
  searchString: string
  trackingReceiveDialogFocusedRecordId: string | null
  warehouseNotesForDialog: string
  trackingDisplayChoice: TrackingDisplayChoice
}
interface OwnProps {
  schema: Schema
}

interface DispatchProps {
  warehouseNotesDidChange(str: string): void
  persistValueToRecordField(args: PersistFieldToRecordArgs): void
  trackingReceiveDialogShiftFocusToRecord(str: string): void
  trackingReceiveDialogClose(): void
  trackingDisplayChoiceDidChange(tdc: TrackingDisplayChoice): void
}

interface Props extends StateProps, DispatchProps, OwnProps {}

const TrackingResultsImpl = ({
  schema,
  searchString,
  trackingReceiveDialogFocusedRecordId,
  warehouseNotesForDialog,
  trackingDisplayChoice,
  trackingReceiveDialogShiftFocusToRecord,
  trackingReceiveDialogClose,
  warehouseNotesDidChange,
  persistValueToRecordField,
  trackingDisplayChoiceDidChange,
}: Props) => {
  const searchResults: Record[] = useRecords(
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
  ).filter((trackingRecord) => {
    return trackingRecord.name.includes(searchString)
  })

  return (
    <div>
      <Heading size="xsmall">Tracking Number Receiving</Heading>
      <SelectButtons
        width={600}
        marginBottom={'16px'}
        value={trackingDisplayChoice}
        // @ts-expect-error
        onChange={(newValue: TrackingDisplayChoice) =>
          trackingDisplayChoiceDidChange(newValue)
        }
        options={[
          {
            value: TrackingDisplayChoice.OnlySearch,
            label: 'Search Results',
          },
          {
            value: TrackingDisplayChoice.Unreceived,
            label: 'Only Unreceived',
          },
          {
            value: TrackingDisplayChoice.Received,
            label: 'Only Received',
          },
          {
            value: TrackingDisplayChoice.All,
            label: 'List All (Pre-Search)',
          },
        ]}
      />
      <table
        // @ts-expect-error
        border={1}
        style={{
          border: '1px solid #000',
          tableLayout: 'fixed',
          maxWidth: '100%',
        }}
      >
        <thead>
          <tr>
            <th>Received?</th>
            <th>Tracking Number</th>
            <th> JoCo Notes (Abbrev)</th>
            <th>Warehouse Notes (Abbrev)</th>
            <th>✏️</th>
          </tr>
        </thead>
        <tbody>
          {searchResults
            .filter((trackingRecord) => {
              switch (trackingDisplayChoice) {
                case TrackingDisplayChoice.OnlySearch: {
                  return searchString.trim().length > 0
                }
                case TrackingDisplayChoice.Unreceived: {
                  return !schema.skuOrdersTracking.val.isReceivedRO(
                    trackingRecord
                  )
                }
                case TrackingDisplayChoice.Received: {
                  return schema.skuOrdersTracking.val.isReceivedRO(
                    trackingRecord
                  )
                }
                default:
                  return true
              }
            })
            .map((trackingRecord) => {
              const isReceived = schema.skuOrdersTracking.val.isReceivedRO(
                trackingRecord
              )
              const receivingNotes = schema.skuOrdersTracking.stringVal.receivingNotes(
                trackingRecord
              )
              const warehouseNotes = schema.skuOrdersTracking.stringVal.warehouseNotes(
                trackingRecord
              )
              const abbrev = (str: string) => {
                return str.length < 100 ? str : str.substring(0, 99) + '...'
              }
              const persistNotes = () =>
                persistValueToRecordField({
                  table: schema.skuOrdersTracking.table,
                  field: schema.skuOrdersTracking.field.warehouseNotes,
                  record: trackingRecord,
                  val: warehouseNotesForDialog,
                })
              const toggleReceived = (dateTime: string | null) =>
                persistValueToRecordField({
                  table: schema.skuOrdersTracking.table,
                  field: schema.skuOrdersTracking.field.receivedAtDateTime,
                  record: trackingRecord,
                  val: dateTime,
                })

              return (
                <tr key={trackingRecord.id}>
                  <td style={{ textAlign: 'center' }}>
                    {isReceived ? '✅' : '❌'}
                  </td>
                  <td>{trackingRecord.name}</td>
                  <td style={{ width: '20%' }}>{abbrev(receivingNotes)}</td>
                  <td style={{ width: '20%' }}>{abbrev(warehouseNotes)}</td>
                  <td>
                    <Button
                      onClick={() => {
                        // because we edit them in here
                        warehouseNotesDidChange(warehouseNotes)
                        trackingReceiveDialogShiftFocusToRecord(
                          trackingRecord.id
                        )
                      }}
                      icon={isReceived ? 'edit' : 'bolt'}
                      variant={isReceived ? 'default' : 'primary'}
                    >
                      {isReceived ? 'Edit/View' : 'Receive'}{' '}
                      {trackingRecord.name}
                    </Button>

                    {trackingReceiveDialogFocusedRecordId ===
                      trackingRecord.id && (
                      <Dialog
                        width={800}
                        paddingTop={'28px'}
                        paddingX={'33px'}
                        paddingBottom={'55px'}
                        onClose={trackingReceiveDialogClose}
                      >
                        <Dialog.CloseButton />
                        <Heading marginBottom={'17px'}>
                          Receive tracking number {trackingRecord.name} ???
                        </Heading>
                        <Heading size="small">Review JoCo Notes</Heading>
                        <Text variant="paragraph">{receivingNotes}</Text>
                        <Heading size="small">
                          {isReceived ? 'Update' : 'Enter'} Warehouse Notes
                        </Heading>

                        <textarea
                          value={warehouseNotesForDialog}
                          onChange={(e) =>
                            warehouseNotesDidChange(e.target.value)
                          }
                          cols={80}
                          rows={3}
                        />
                        <Text
                          marginBottom={'17px'}
                          size="small"
                          textColor="light"
                        >
                          Should this field be required?
                        </Text>
                        {isReceived ? (
                          <Button
                            variant="danger"
                            marginRight={'12px'}
                            icon="warning"
                            onClick={() => {
                              persistNotes()
                              toggleReceived(null)
                              trackingReceiveDialogClose()
                            }}
                          >
                            Unreceive!
                          </Button>
                        ) : (
                          ''
                        )}
                        <Button
                          variant={isReceived ? 'default' : 'danger'}
                          icon="x"
                          marginRight={'12px'}
                          onClick={() => trackingReceiveDialogClose()}
                        >
                          Cancel Everything!
                        </Button>
                        <Button
                          icon="book"
                          marginRight={'12px'}
                          variant={isReceived ? 'primary' : 'default'}
                          onClick={() => {
                            //persistNotes()
                            persistValueToRecordField({
                              table: schema.skuOrdersTracking.table,
                              field:
                                schema.skuOrdersTracking.field.warehouseNotes,
                              record: trackingRecord,
                              val: warehouseNotesForDialog,
                            })

                            trackingReceiveDialogClose()
                          }}
                        >
                          {isReceived
                            ? `Update My Notes`
                            : `Save my notes & Don't receive`}
                        </Button>
                        {!isReceived ? (
                          <Button
                            variant="primary"
                            marginRight={'12px'}
                            icon="bell"
                            onClick={() => {
                              persistNotes()
                              toggleReceived(moment().format())
                              trackingReceiveDialogClose()
                            }}
                          >
                            {`Recevez S'il Vous Plait`}
                          </Button>
                        ) : (
                          ''
                        )}
                      </Dialog>
                    )}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

export const TrackingRecords = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  ApplicationState
>(
  // mapStateToProps
  (state: ApplicationState, ownProps: OwnProps) => ({
    searchString: state.searchString,
    trackingReceiveDialogFocusedRecordId:
      state.trackingReceiveDialogFocusedRecordId,
    warehouseNotesForDialog: state.warehouseNotes,
    trackingDisplayChoice: state.trackingDisplayChoice,
    schema: ownProps.schema,
  }),
  {
    trackingReceiveDialogShiftFocusToRecord: (idStr: string) => {
      return trackingReceiveDialogSetFocus(idStr)
    },
    trackingReceiveDialogClose: () => {
      return trackingReceiveDialogSetFocus(null)
    },
    warehouseNotesDidChange: warehouseNotesDidChange,
    persistValueToRecordField: persistValueToRecordField,
    trackingDisplayChoiceDidChange: trackingDisplayChoiceDidChange,
  }
)(TrackingResultsImpl)
