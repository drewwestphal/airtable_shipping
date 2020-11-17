type airtableFieldId
type airtableRecordId
type airtableRawField = {
  name: string,
  @bs.as("type")
  _type: string,
}

type airtableUpdateFieldDetails

type airtableRawView
type airtableRawTable = {primaryField: airtableRawField}
type airtableRawBase
type airtableRawRecord = {id: string}
type airtableRawRecordQueryResult = {records: array<airtableRawRecord>}
type airtableMoment
type airtableRawSortParam = {
  field: airtableRawField,
  direction: string,
}

// their functions
@bs.module("@airtable/blocks/ui")
external useBase: unit => airtableRawBase = "useBase"
@bs.module("@airtable/blocks/ui")
external useRecords: airtableRawRecordQueryResult => array<airtableRawRecord> = "useRecords"
@bs.send @bs.return(nullable)
external getTableByName: (airtableRawBase, string) => option<airtableRawTable> =
  "getTableByNameIfExists"
@bs.send @bs.return(nullable)
external getViewByName: (airtableRawTable, string) => option<airtableRawView> =
  "getViewByNameIfExists"
@bs.send @bs.return(nullable)
external getFieldByName: (airtableRawTable, string) => option<airtableRawField> =
  "getFieldByNameIfExists"
@bs.send @bs.return(nullable)
external getRecordById: (airtableRawRecordQueryResult, string) => option<airtableRawRecord> =
  "getRecordByIdIfExists"

@bs.send
external format: (airtableMoment, unit) => string = "format"

@bs.send
external updateRecordAsync: (
  airtableRawTable,
  airtableRawRecord,
  airtableUpdateFieldDetails,
) => Js.Promise.t<unit> = "updateRecordAsync"

@bs.module("@airtable/blocks/ui")
external useLoadableHookInternal: airtableRawRecordQueryResult => unit = "useLoadable"
// make the above chainable
let useLoadableHook: airtableRawRecordQueryResult => airtableRawRecordQueryResult = arrqr => {
  useLoadableHookInternal(arrqr)
  arrqr
}
// this is ui thing, but we only use it in here
module CellRenderer = {
  @bs.module("@airtable/blocks/ui") @react.component
  external make: (~field: airtableRawField, ~record: airtableRawRecord) => React.element =
    "CellRenderer"
}

// my functions
@bs.module("./js_helpers")
external getString: (airtableRawRecord, airtableRawField) => string = "prepBareString"
@bs.module("./js_helpers")
external getStringOption: (airtableRawRecord, airtableRawField) => option<string> =
  "prepStringOption"
@bs.module("./js_helpers")
external getInt: (airtableRawRecord, airtableRawField) => int = "prepInt"
@bs.module("./js_helpers")
external getBool: (airtableRawRecord, airtableRawField) => bool = "prepBool"
@bs.module("./js_helpers")
external getIntAsBool: (airtableRawRecord, airtableRawField) => bool = "prepIntAsBool"
@bs.module("./js_helpers")
external getMomentOption: (airtableRawRecord, airtableRawField) => option<airtableMoment> =
  "prepMomentOption"
@bs.module("./js_helpers")
external getLinkedRecordQueryResult: (
  airtableRawRecord,
  airtableRawField,
  array<airtableRawField>,
  array<airtableRawSortParam>,
) => airtableRawRecordQueryResult = "prepRelFieldQueryResult"
@bs.module("./js_helpers")
external getTableRecordsQueryResult: (
  airtableRawTable,
  array<airtableRawField>,
  array<airtableRawSortParam>,
) => airtableRawRecordQueryResult = "selectRecordsFromTableOrView"
@bs.module("./js_helpers")
external getViewRecordsQueryResult: (
  airtableRawView,
  array<airtableRawField>,
  array<airtableRawSortParam>,
) => airtableRawRecordQueryResult = "selectRecordsFromTableOrView"

@bs.module("./js_helpers")
external buildUpdateFieldObject: array<(airtableRawField, _)> => airtableUpdateFieldDetails =
  "buildUpdateFieldObject"
@bs.module("./js_helpers")
external nowMoment: unit => airtableMoment = "moment"
