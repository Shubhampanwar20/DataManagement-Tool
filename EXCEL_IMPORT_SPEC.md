# Excel Import Specification

## Purpose
The Excel import module is the intake layer for client tracker workbooks. It transforms uploaded spreadsheets into structured audit data for the Request Tracker and downstream audit modules.

## Supported Inputs
- File type: .xlsx
- Optional support for .xls in later phases
- Workbook size should be managed for offline usage and reasonable browser limits

## Import Workflow
1. Upload workbook.
2. Read workbook structure using SheetJS.
3. Detect worksheets.
4. Detect workbook metadata such as client name and audit date.
5. Discover tabular structures, especially process summary tables.
6. Detect header rows and ignore blank rows.
7. Expand merged cells where possible.
8. Persist the original workbook locally in Dexie.
9. Parse and normalize rows into audit-friendly structures.
10. Generate initial data request records and process links.

## Detection Rules
The importer should identify the following where present:
- Client name from workbook labels such as Client Name, Auditee, Company, or Entity.
- Audit date from labels such as Audit Date, Date, or Period.
- Process summary tables using row headers such as Process, Total Items, Received, Pending, Partially Received, and Remarks.
- Worksheet names for preview and selection.

## Parsed Output Model
The import engine should produce:
- workbook metadata
- worksheet list
- header row information
- normalized row data
- detected client name
- detected audit date
- detected process summary rows
- import confidence score
- stored workbook payload

## Data Request Generation
Once the workbook is parsed, the system should create initial data request records from the detected process summary data. Each generated request should include:
- engagement context
- process association
- request description
- status
- received/pending state
- linked remarks

## Mapping and Confidence
The system should not perform automatic editing, but it should capture confidence for the detected structure:
- high confidence when the workbook structure clearly matches known patterns
- medium confidence when partial matching is found
- low confidence when the importer can only detect raw rows

## Storage Requirements
Imported data must be stored in Dexie using the following categories:
- source workbook payload
- parsed worksheet metadata
- normalized rows
- generated request candidates
- detected mappings and confidence values

## Future Extension Points
The import layer must support later mapping workflows for:
- document suggestions
- process mapping
- controls and risk recommendations
- sample guidance
- working paper generation
