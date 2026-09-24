const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')

const rows = [
  { Activity: 'Pipeline Trench Preparation', Zone: 'Section A · Ch. 12+500', Planned: 100, Actual: 100, Status: 'Completed', Risk: 'LOW', RawActivity: 'Trench preparation completed at Ch. 12+500 in Section A.', FieldReport: 'Trench preparation completed at Ch. 12+500 in Section A. Excavation and bedding work completed.', Confidence: 94, MatchedSchedule: 'Pipeline Trench Preparation – Section A – Chainage 12+500' },
  { Activity: 'Right of Way Preparation', Zone: 'Section A', Planned: 100, Actual: 100, Status: 'Completed', Risk: 'LOW', RawActivity: 'ROW clearing', FieldReport: 'Right of way preparation completed for the trench work front.', Confidence: 91, MatchedSchedule: 'Right of Way Preparation – Section A' },
  { Activity: 'Pipeline Valve Installation', Zone: 'Section B', Planned: 70, Actual: 58, Status: 'Delayed', Risk: 'HIGH', RawActivity: 'Valve installation', FieldReport: 'Valve installation remains behind the planned sequence in Section B.', Confidence: 87, MatchedSchedule: 'Pipeline Valve Installation – Section B' },
  { Activity: 'Hydrotest Preparation', Zone: 'Section C', Planned: 40, Actual: 30, Status: 'Delayed', Risk: 'HIGH', RawActivity: 'Hydrotest preparation', FieldReport: 'Hydrotest preparation is progressing in the Section C work front.', Confidence: 93, MatchedSchedule: 'Hydrotest Preparation – Section C' },
]

const workbook = XLSX.utils.book_new()
const sheet = XLSX.utils.json_to_sheet(rows)
sheet['!cols'] = [
  { wch: 25 }, { wch: 22 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 10 },
  { wch: 20 }, { wch: 58 }, { wch: 13 }, { wch: 38 },
]
XLSX.utils.book_append_sheet(workbook, sheet, 'DPR Activities')
fs.mkdirSync(path.join(__dirname, '..', 'public'), { recursive: true })
XLSX.writeFile(workbook, path.join(__dirname, '..', 'public', 'OIL_Assam_Pipeline_DPR_Demo.xlsx'))
