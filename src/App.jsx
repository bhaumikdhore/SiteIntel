import { useRef, useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, ArrowUpRight, Bell, CalendarDays, Camera, Check, CheckCircle2, ChevronRight, CloudUpload, FileText, Gauge, HardHat, LayoutDashboard, MapPinned, Menu, Network, Paperclip, Play, Radar, RefreshCw, ShieldAlert, SlidersHorizontal, Sparkles, Upload, UserRound, X, Zap } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import * as XLSX from 'xlsx';

const projectName = 'OIL Assam Pipeline Expansion - Construction Package';
const demoDocument = 'OIL_Assam_Pipeline_DPR_Demo.xlsx';

const baseState = {
  metrics: {
    actual: 68,
    planned: 74,
    variance: -6,
    risk: 'MEDIUM',
    activities: 42,
    completed: 25,
    inProgress: 11,
    delayed: 6,
    health: 72,
  },
  chartData: [
    { month: 'Apr', planned: 8, actual: 7 },
    { month: 'May', planned: 19, actual: 16 },
    { month: 'Jun', planned: 32, actual: 28 },
    { month: 'Jul', planned: 46, actual: 40 },
    { month: 'Aug', planned: 60, actual: 53 },
    { month: 'Sep', planned: 74, actual: 68 },
  ],
  activities: [
    { name: 'Right of Way Preparation', zone: 'Section A', planned: 100, actual: 100, status: 'Completed', risk: 'LOW' },
    { name: 'Pipeline Trench Preparation', zone: 'Section A - Ch. 12+500', planned: 100, actual: 100, status: 'Completed', risk: 'LOW' },
    { name: 'Pipeline Valve Installation', zone: 'Section B - Ch. 15+200', planned: 70, actual: 58, status: 'Delayed', risk: 'HIGH' },
    { name: 'Bedding and Lowering', zone: 'Section B', planned: 72, actual: 63, status: 'Delayed', risk: 'MEDIUM' },
    { name: 'Stringing and Welding', zone: 'Section B', planned: 74, actual: 66, status: 'Delayed', risk: 'MEDIUM' },
    { name: 'Hydrotest Preparation', zone: 'Section C', planned: 40, actual: 30, status: 'Delayed', risk: 'HIGH' },
    { name: 'Access Track Restoration', zone: 'Section A - East', planned: 66, actual: 54, status: 'In Progress', risk: 'LOW' },
    { name: 'Camp Utility Shifting', zone: 'Section C', planned: 64, actual: 59, status: 'In Progress', risk: 'LOW' },
    { name: 'Pipeline Reinstatement', zone: 'Section C', planned: 38, actual: 31, status: 'Delayed', risk: 'LOW' },
  ],
  extracted: [
    { raw: 'Trench preparation completed at Ch. 12+500 in Section A.', normalized: 'Pipeline Trench Preparation', schedule: 'Pipeline Trench Preparation - Section A - Chainage 12+500', progress: 100, confidence: 94, location: 'Section A · Ch. 12+500', date: '12 Sep 2026', source: demoDocument, sheet: 'Progress Report', row: 11, rawText: 'Trench preparation completed at Ch. 12+500 in Section A. Excavation and bedding work completed.' },
    { raw: 'ROW clearing', normalized: 'Right of Way Preparation', schedule: 'Right of Way Preparation - Section A', progress: 100, confidence: 91, location: 'Section A', date: '12 Sep 2026', source: demoDocument, sheet: 'Progress Report', row: 12, rawText: 'Right of way preparation completed for the trench work front.' },
    { raw: 'Valve installation', normalized: 'Pipeline Valve Installation', schedule: 'Pipeline Valve Installation - Section B', progress: 58, confidence: 87, location: 'Section B', date: '12 Sep 2026', source: demoDocument, sheet: 'Progress Report', row: 14, rawText: 'Valve installation remains behind the planned sequence in Section B.' },
    { raw: 'Hydrotest preparation', normalized: 'Hydrotest Preparation', schedule: 'Hydrotest Preparation - Section C', progress: 30, confidence: 93, location: 'Section C', date: '12 Sep 2026', source: demoDocument, sheet: 'Progress Report', row: 17, rawText: 'Hydrotest preparation is progressing in the Section C work front.' },
  ],
  matches: [
    { field: 'Trench preparation completed at Ch. 12+500 in Section A.', schedule: 'Pipeline Trench Preparation - Section A - Chainage 12+500', confidence: 94, status: 'Matched' },
    { field: 'ROW clearing', schedule: 'Right of Way Preparation - Section A', confidence: 91, status: 'Matched' },
    { field: 'Valve installation', schedule: 'Pipeline Valve Installation - Section B', confidence: 87, status: 'Matched' },
    { field: 'Hydrotest preparation', schedule: 'Hydrotest Preparation - Section C', confidence: 93, status: 'Matched' },
  ],
  alerts: [
    { level: 'CRITICAL', title: 'Pipeline Valve Installation', detail: '12% behind planned progress', page: 'risk' },
    { level: 'CRITICAL', title: 'Hydrotest Preparation - Section C', detail: 'High risk activity', page: 'risk' },
    { level: 'WARNING', title: 'Activity Matching', detail: '1 prototype match requires review', page: 'matching' },
    { level: 'WARNING', title: 'Document Quality', detail: '2 fields require confirmation', page: 'documents' },
  ],
  alertFeed: [
    { id: 'valve-delay', category: 'Critical', title: 'Pipeline Valve Installation is 12% behind schedule.', detail: 'Section B · Prototype risk signal', destination: 'risk', activity: 'Pipeline Valve Installation' },
    { id: 'section-c-risk', category: 'Critical', title: 'Hydrotest Preparation is high risk.', detail: 'Section C · Prototype risk signal', destination: 'zones', zone: 'Section C' },
    { id: 'incomplete-reports', category: 'Warning', title: '2 progress reports contain incomplete information.', detail: 'Document quality review', destination: 'documents' },
    { id: 'match-review', category: 'Warning', title: 'Prototype activity match requires review.', detail: 'Human-in-the-loop queue', destination: 'matching' },
    { id: 'dpr-processed', category: 'Information', title: 'Oil India prototype DPR processed successfully.', detail: '4 activities extracted and normalized', destination: 'documents' },
    { id: 'row-resolved', category: 'Resolved', title: 'Section A terminology match confirmed.', detail: 'Resolved in the prototype scenario', destination: 'matching' },
  ],
  insightCards: [
    { title: 'Pipeline Valve Installation is delayed', source: demoDocument, confidence: 94, activity: 'Pipeline Valve Installation - Section B' },
    { title: 'Hydrotest Preparation is high risk', source: demoDocument, confidence: 91, activity: 'Hydrotest Preparation - Section C' },
    { title: 'Section A terminology was normalized', source: demoDocument, confidence: 94, activity: 'Pipeline Trench Preparation' },
    { title: 'Prototype report fields need confirmation', source: demoDocument, confidence: 86, activity: 'Document quality review' },
  ],
  quality: {
    score: 76,
    impact: 'Progress confidence reduced from 94% to 76%.',
  },
  timeline: [
    { name: 'Right of Way Preparation', status: 'Completed', start: '01 Apr', end: '12 Apr', progress: 100, planned: 100, variance: 0, risk: 'LOW', dependency: 'Pipeline Trench Preparation' },
    { name: 'Pipeline Trench Preparation', status: 'Completed', start: '10 Apr', end: '25 May', progress: 100, planned: 100, variance: 0, risk: 'LOW', dependency: 'Bedding and Lowering' },
    { name: 'Bedding and Lowering', status: 'Delayed', start: '18 Apr', end: '10 Jun', progress: 63, planned: 72, variance: -9, risk: 'MEDIUM', dependency: 'Stringing and Welding' },
    { name: 'Pipeline Valve Installation', status: 'Delayed', start: '01 Jun', end: '22 Jul', progress: 58, planned: 70, variance: -12, risk: 'HIGH', dependency: 'Hydrotest Preparation' },
    { name: 'Hydrotest Preparation', status: 'Delayed', start: '10 Jul', end: '25 Aug', progress: 30, planned: 40, variance: -10, risk: 'HIGH', dependency: 'Pipeline Reinstatement' },
    { name: 'Access Track Restoration', status: 'In Progress', start: '15 Aug', end: '10 Sep', progress: 54, planned: 66, variance: -12, risk: 'LOW', dependency: 'Pipeline Reinstatement' },
    { name: 'Camp Utility Shifting', status: 'In Progress', start: '20 Jul', end: '18 Aug', progress: 59, planned: 64, variance: -5, risk: 'LOW', dependency: 'Hydrotest Preparation' },
    { name: 'Pipeline Reinstatement', status: 'Delayed', start: '01 Sep', end: '30 Sep', progress: 31, planned: 38, variance: -7, risk: 'LOW', dependency: 'ROW Handover' },
  ],
  zones: [
    { name: 'Section A', progress: 100, status: 'On Track', risk: 'LOW', activities: ['Pipeline Trench Preparation'], delayed: 0, highRisk: 0, missingReports: 0, note: 'Trench excavation and bedding completed at Chainage 12+500.' },
    { name: 'Section B', progress: 61, status: 'High Risk', risk: 'HIGH', activities: ['Pipeline Valve Installation', 'Bedding and Lowering', 'Access Track Restoration'], delayed: 3, highRisk: 2, missingReports: 1, note: 'Primary prototype risk concentration around the Section B work front.' },
    { name: 'Section C', progress: 73, status: 'At Risk', risk: 'MEDIUM', activities: ['Hydrotest Preparation', 'Pipeline Reinstatement'], delayed: 1, highRisk: 0, missingReports: 0, note: 'Testing and reinstatement activities need close monitoring.' },
  ],
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'documents', label: 'Document Intelligence', icon: FileText },
  { id: 'matching', label: 'Activity Matching', icon: Network },
  { id: 'risk', label: 'Progress & Risk', icon: Radar },
  { id: 'timeline', label: 'Project Timeline', icon: CalendarDays },
  { id: 'zones', label: 'Site / Zones', icon: MapPinned },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'simulator', label: 'Scenario Simulator', icon: SlidersHorizontal },
  { id: 'insights', label: 'Project Insights', icon: Sparkles },
  { id: 'demo', label: 'Demo Mode', icon: Play },
];

const pipelineStages = [
  'Uploading document',
  'Reading document',
  'Extracting construction activities',
  'Normalizing terminology',
  'Matching schedule activities',
  'Analyzing progress',
  'Generating project intelligence',
];

function buildProjectState() {
  return JSON.parse(JSON.stringify(baseState));
}

function parseWorkbook(file) {
  return new Promise((resolve) => {
    const workbook = XLSX.read(file, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    const sourceRows = rows.length ? rows : [{}, {}, {}, {}];
    resolve(sourceRows.slice(0, 4).map((row, index) => ({
      raw: row.activity || row.Activity || ['Trench preparation completed at Ch. 12+500 in Section A.', 'ROW clearing', 'Valve installation', 'Hydrotest preparation'][index],
      normalized: row.normalized || ['Pipeline Trench Preparation', 'Right of Way Preparation', 'Pipeline Valve Installation', 'Hydrotest Preparation'][index],
      schedule: row.schedule || ['Pipeline Trench Preparation - Section A - Chainage 12+500', 'Right of Way Preparation - Section A', 'Pipeline Valve Installation - Section B', 'Hydrotest Preparation - Section C'][index],
      progress: row.progress || [100, 100, 58, 30][index],
      confidence: row.confidence || [94, 91, 87, 93][index],
      location: row.location || ['Section A · Ch. 12+500', 'Section A', 'Section B', 'Section C'][index],
      date: row.date || '12 Sep 2026',
      source: file.name || demoDocument,
      sheet: sheet.name || 'Progress Report',
      row: index + 2,
      rawText: row.description || `${row.activity || row.Activity || 'Construction activity'} reported in the field update.`,
    })));
  });
}

function projectAssistant(question, projectState = baseState, reviewState = {}) {
  const q = String(question).toLowerCase();
  const delayed = projectState.activities.filter((item) => item.status === 'Delayed');
  const highest = projectState.activities.reduce((current, item) => (item.actual - item.planned < current.actual - current.planned ? item : current), projectState.activities[0]);
  const reviewCount = projectState.matches.filter((item) => item.confidence < 75 && reviewState[item.field] !== 'Confirmed').length;
  if (q.includes('highest variance') || q.includes('largest variance')) return { answer: `${highest.name} currently has the largest variance at ${highest.actual - highest.planned}%.`, evidence: `Planned: ${highest.planned}% · Actual: ${highest.actual}% · Risk: ${highest.risk}`, source: demoDocument, destination: 'risk', activity: highest.name };
  if (q.includes('section b') || q.includes('zone b') || q.includes('risk')) return { answer: 'Section B contains multiple delayed pipeline activities, including valve installation and bedding work.', evidence: 'Progress: 61% · Delayed activities: 3 · High-risk activities: 2', source: demoDocument, destination: 'zones', zone: 'Section B' };
  if (q.includes('prioritized') || q.includes('priorit')) return { answer: 'Prioritize Pipeline Valve Installation, Hydrotest Preparation, and incomplete prototype reports.', evidence: 'Valve installation is 12% below plan; hydrotest work is high risk; reporting quality is 76%.', source: demoDocument, destination: 'risk' };
  if (q.includes('review')) return { answer: reviewCount ? `${reviewCount} activity match${reviewCount === 1 ? '' : 'es'} require manual confirmation.` : 'All activity matches have been confirmed.', evidence: `Current review queue: ${reviewCount} item${reviewCount === 1 ? '' : 's'}.`, source: demoDocument, destination: 'matching' };
  if (q.includes('schedule') || q.includes('affect')) return { answer: 'Pipeline Valve Installation is the main schedule pressure, with downstream dependency on Hydrotest Preparation.', evidence: 'Planned: 70% · Actual: 58% · Variance: -12% · Risk: HIGH', source: demoDocument, destination: 'risk', activity: 'Pipeline Valve Installation' };
  if (q.includes('delayed') || q.includes('delay')) return { answer: `${delayed.length} pipeline activities are delayed, led by Pipeline Valve Installation at -12%.`, evidence: `Delayed activities: ${delayed.map((item) => item.name).join(', ')}.`, source: demoDocument, destination: 'risk' };
  return { answer: 'Prioritize the Section A trench record and verify the next Section B field update before the next review cycle.', evidence: 'Planned: 74% · Actual: 68% · Variance: -6% · Risk: MEDIUM', source: demoDocument, destination: 'insights' };
}

function scenarioImpact(delayDays) {
  return {
    'Pipeline Valve Installation': Math.max(1, Math.round(7 + delayDays / 2)),
    'Hydrotest Preparation': Math.max(1, Math.round(6 + delayDays / 2)),
    'Pipeline Reinstatement': Math.max(1, Math.round(5 + delayDays / 2)),
    'ROW Handover': Math.max(1, Math.round(3 + delayDays / 2)),
  };
}

function StatusBadge({ status }) {
  const safe = String(status || '').toLowerCase();
  return <span className={`status-badge ${safe.replace(/\s+/g, '-')}`}>{status}</span>;
}

function RiskBadge({ risk }) {
  const safe = String(risk || '').toLowerCase();
  return <span className={`risk-badge ${safe}`}>{risk}</span>;
}

function MetricCard({ label, value, hint, icon: Icon, accent = 'teal', onClick }) {
  return (
    <button className="metric-card" onClick={onClick} type="button" title={`${label}: ${hint}`}>
      <div className="metric-topline">
        <span>{label}</span>
        <span className={`metric-icon ${accent}`}><Icon size={16} /></span>
      </div>
      <strong>{value}</strong>
      <small>{hint}</small>
    </button>
  );
}

function Dashboard({ projectState, onNavigate }) {
  const health = projectState.metrics.health;
  const delayed = projectState.metrics.delayed;
  const total = projectState.metrics.activities;
  const statusCounts = {
    completed: projectState.metrics.completed,
    progress: projectState.metrics.inProgress,
    delayed: projectState.metrics.delayed,
    remaining: total - projectState.metrics.completed - projectState.metrics.inProgress - projectState.metrics.delayed,
  };

  return (
    <>
      <section className="hero-panel">
        <div>
          <div className="eyebrow"><span className="live-dot" /> Active project</div>
          <h2>{projectName}</h2>
          <p>Integrated field intelligence across {total} activities and {projectState.alerts.length} active alerts.</p>
        </div>
        <button className="outline-button" type="button" onClick={() => onNavigate('documents')}><CloudUpload size={16} /> Ingest DPR</button>
      </section>

      <div className="metric-grid">
        <MetricCard label="Actual Progress" value="68%" hint="Current site completion" accent="teal" icon={Gauge} onClick={() => onNavigate('documents')} />
        <MetricCard label="Planned Progress" value="74%" hint="Approved baseline" accent="amber" icon={Activity} onClick={() => onNavigate('insights')} />
        <MetricCard label="Schedule Variance" value="-6%" hint="Below baseline" accent="red" icon={Radar} onClick={() => onNavigate('risk')} />
        <MetricCard label="Delayed Activities" value="6" hint="2 high risk · priority intervention" accent="violet" icon={ShieldAlert} onClick={() => onNavigate('risk')} />
      </div>

      <div className="content-grid dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Project Health</span>
              <h3>{health} / 100</h3>
            </div>
            <button className="link-button" onClick={() => onNavigate('insights')} type="button">View insights <ArrowUpRight size={15} /></button>
          </div>

          <div className="health-wrap">
            <div className="health-ring" aria-label="Project health score">
              <span>{health}</span>
            </div>
            <div className="health-bars">
              <div><label>Schedule Health</label><div className="mini-bar"><span style={{ width: '64%' }} /></div><small>64</small></div>
              <div><label>Progress Health</label><div className="mini-bar"><span style={{ width: '71%' }} /></div><small>71</small></div>
              <div><label>Reporting Quality</label><div className="mini-bar"><span style={{ width: '82%' }} /></div><small>82</small></div>
              <div><label>Activity Risk</label><div className="mini-bar"><span style={{ width: '69%' }} /></div><small>69</small></div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Activity status</span>
              <h3>Portfolio summary</h3>
            </div>
            <button className="icon-button" type="button" aria-label="Refresh"><RefreshCw size={16} /></button>
          </div>

          <div className="donut-wrap">
            <div className="donut-chart"><div><strong>{total}</strong><span>activities</span></div></div>
            <div className="status-stack">
              <div><span className="dot completed" /> Completed <b>{statusCounts.completed}</b></div>
              <div><span className="dot in-progress" /> In progress <b>{statusCounts.progress}</b></div>
              <div><span className="dot delayed" /> Delayed <b>{statusCounts.delayed}</b></div>
              <div><span className="dot not-started" /> Not started <b>{statusCounts.remaining}</b></div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-grid dashboard-grid">
        <div className="panel chart-panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Planned vs Actual</span>
              <h3>Schedule trajectory</h3>
            </div>
            <span className="pill">Apr - Sep 2024</span>
          </div>
          <div className="legend-row">
            <span><i className="legend planned" /> Planned</span>
            <span><i className="legend actual" /> Actual</span>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectState.chartData} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0b9693" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0b9693" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#dfe9e9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#778a8d' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#778a8d' }} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value, name) => [`${value}%`, name]} labelFormatter={(label) => `Month: ${label}`} />
                <Area type="monotone" dataKey="planned" stroke="#a4b7bc" strokeDasharray="5 5" strokeWidth={2} fill="none" />
                <Area type="monotone" dataKey="actual" stroke="#0a8f8b" strokeWidth={3} fill="url(#areaFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel alerts-panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Critical Project Alerts</span>
              <h3>{projectState.alerts.length} issues</h3>
            </div>
            <button className="link-button" type="button" onClick={() => onNavigate('risk')}>View all <ArrowUpRight size={15} /></button>
          </div>
          <div className="alert-list">
            {projectState.alerts.map((alert, index) => (
              <button className="alert-item" key={`${alert.title}-${index}`} type="button" onClick={() => onNavigate(alert.page || 'risk')}>
                <span className={`alert-icon ${alert.level.toLowerCase()}`}><AlertTriangle size={15} /></span>
                <div>
                  <strong>{alert.title}</strong>
                  <small>{alert.detail}</small>
                </div>
                <span className={`alert-tag ${alert.level.toLowerCase()}`}>{alert.level}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="latest-intelligence panel"><div className="latest-icon"><Sparkles size={19} /></div><div><span className="section-kicker">Latest Intelligence · Prototype Demo Project</span><h3>Pipeline Valve Installation is currently the largest schedule variance at -12%.</h3><p>Actual progress is 58% against a 70% plan. Risk is HIGH and Hydrotest Preparation is the critical dependency.</p></div><div className="latest-actions"><button className="primary-button small" type="button" onClick={() => onNavigate('risk')}>View Analysis <ArrowUpRight size={14} /></button><button className="outline-button small dark-text" type="button" onClick={() => onNavigate('documents')}>View Evidence <FileText size={14} /></button></div></div>
    </>
  );
}

function Documents({ projectState, onUpload, processing, processed, fileName, onReset, pipelineStep, processingError, reviewState, onReviewActivity, onNavigate }) {
  const inputRef = useRef(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [sourcePreview, setSourcePreview] = useState(false);
  const highConfidence = projectState.extracted.filter((item) => item.confidence >= 90).length;
  const reviewCount = projectState.extracted.filter((item) => item.confidence < 75 && reviewState[item.raw] !== 'Confirmed').length;
  const selectedStatus = selectedActivity ? reviewState[selectedActivity.raw] || (selectedActivity.confidence < 75 ? 'Needs Review' : 'Matched') : '';

  return (
    <>
      <PageIntro eyebrow="Document Intelligence" title="Turn field reports into structured project intelligence" description="Upload a project document to extract construction activities, normalize terminology, and connect field information with the project schedule." />

      <div className="document-layout">
        <div className="panel upload-panel">
          <div className="document-heading"><div className="document-icon"><FileText size={19} /></div><div><span className="section-kicker">Document intake</span><h3>Upload project document</h3></div></div>
          <div className={`dropzone ${processing ? 'processing' : processed ? 'complete' : ''}`} onClick={() => inputRef.current?.click()} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click(); }}>
            <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv,.pdf,.docx" hidden onChange={(event) => onUpload(event.target.files?.[0])} />
            {processingError ? (
              <><div className="error-mark"><X size={24} /></div><h3>Unable to process document</h3><p>{processingError}</p><small className="format-note">Supported formats: XLS, XLSX, PDF, DOCX, CSV</small><button className="outline-button small" type="button" onClick={(event) => { event.stopPropagation(); inputRef.current?.click(); }}><RefreshCw size={15} /> Try again</button></>
            ) : processing ? (
              <>
                <div className="orbit"><RefreshCw size={26} /></div>
                <h3>Processing {fileName || demoDocument}</h3>
                <p>Running the deterministic prototype intelligence pipeline.</p>
              </>
            ) : processed ? (
              <>
                <div className="success-mark"><Check size={24} /></div>
                <h3>Document Successfully Processed</h3>
                <p>{projectState.extracted.length} activities extracted · {projectState.extracted.length} normalized · {projectState.matches.length} schedule matches</p>
                <button className="outline-button small" type="button" onClick={(event) => { event.stopPropagation(); inputRef.current?.click(); }}><Upload size={15} /> Process another</button>
              </>
            ) : (
              <>
                <div className="upload-mark"><CloudUpload size={28} /></div>
                <h3>Drop a report here or browse</h3>
                <p>XLS, XLSX, PDF, DOCX, or CSV local prototype path.</p>
                <button className="primary-button small" type="button"><Upload size={15} /> Choose document</button>
              </>
            )}
          </div>

          <div className="pipeline-steps">
            {pipelineStages.map((stage, index) => (
              <div className={`pipeline-step ${pipelineStep > index ? 'done' : pipelineStep === index && processing ? 'active' : ''}`} key={stage}>
                <span>{pipelineStep > index ? <Check size={12} /> : String(index + 1).padStart(2, '0')}</span>
                <div><strong>{stage}</strong>{pipelineStep > index && <small>{['Document successfully loaded', 'Spreadsheet structure identified', 'Construction activities detected', 'Inconsistent names standardized', 'Activities linked to schedule', 'Planned vs actual calculated', 'Risks and insights generated'][index]}</small>}</div>
              </div>
            ))}
          </div>

          <div className="sample-row">
            <div className="sample-meta"><FileText size={18} /><div><strong>Sample Document</strong><small>{demoDocument} · Weekly Daily Progress Report</small><small>Project: {projectName}</small></div></div>
            <button className="link-button" type="button" onClick={() => onUpload({ name: demoDocument, demo: true })}>Use sample <ArrowUpRight size={15} /></button>
          </div>
        </div>

        <div className="panel extraction-panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Document quality</span>
              <h3>{projectState.quality.score} / 100</h3>
            </div>
            <button className="link-button" type="button" onClick={onReset}>Reset demo</button>
          </div>

          <div className="quality-list">
            <div className="quality-item"><span className="check yes"><Check size={12} /></span><div><strong>Activity identified</strong></div></div>
            <div className="quality-item"><span className="check yes"><Check size={12} /></span><div><strong>Progress identified</strong></div></div>
            <div className="quality-item"><span className="check yes"><Check size={12} /></span><div><strong>Reporting date identified</strong></div></div>
            <div className="quality-item"><span className="check warn"><AlertTriangle size={12} /></span><div><strong>Location partially missing</strong></div></div>
            <div className="quality-item"><span className="check warn"><AlertTriangle size={12} /></span><div><strong>Quantity not reported</strong></div></div>
          </div>

          <div className="impact-box">
            <span>Potential impact on analysis</span>
            <strong>{projectState.quality.impact}</strong>
          </div>

          <div className="terminology-flow">
            <span className="section-kicker">Terminology normalization</span>
            <div className="flow-line"><div><small>RAW TERM</small><strong>"{(selectedActivity || projectState.extracted[0]).raw}"</strong></div><ArrowRight size={17} /><div><small>NORMALIZED TERM</small><strong>{(selectedActivity || projectState.extracted[0]).normalized}</strong></div><ArrowRight size={17} /><div><small>SCHEDULE ACTIVITY</small><strong>{(selectedActivity || projectState.extracted[0]).schedule}</strong></div></div>
            <span className="normalized-label"><Check size={13} /> Terminology Normalized</span>
          </div>

          <div className="processing-summary">
            <div><span>Document</span><strong>{fileName || demoDocument}</strong></div><div><span>Activities Extracted</span><strong>{projectState.extracted.length}</strong></div><div><span>Normalized</span><strong>{projectState.extracted.length}</strong></div><div><span>Schedule Matches</span><strong>{projectState.matches.length}</strong></div><div><span>High Confidence</span><strong>{highConfidence}</strong></div><div><span>Items Requiring Review</span><strong className={reviewCount ? 'negative' : ''}>{reviewCount}</strong></div>
          </div>

          <div className="extracted-table">
            <div className="table-section-heading"><div><span className="section-kicker">Extraction results</span><h3>Extracted Activities</h3></div><span className="review-count">{reviewCount} requiring review</span></div>
            <div className="table-head">
              <span>Raw activity</span>
              <span>Normalized</span>
              <span>Progress</span>
              <span>Confidence</span>
            </div>
            {projectState.extracted.map((item, index) => (
              <button className={`extracted-row ${selectedActivity?.raw === item.raw ? 'selected' : ''}`} key={`${item.raw}-${index}`} type="button" onClick={() => setSelectedActivity(item)}>
                <div><strong>{item.raw}</strong><small>{item.source}</small></div>
                <div><strong>{item.normalized}</strong><small>{item.location} · {item.schedule}</small></div>
                <div>{item.progress}%</div>
                <div className="confidence-box"><b>{item.confidence}%</b><div className="tiny-bar"><span style={{ width: `${item.confidence}%` }} /></div>{item.confidence < 75 && <StatusBadge status={reviewState[item.raw] || 'Needs Review'} />}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="document-lower-grid">
        <div className="panel evidence-panel">
          <div className="panel-header"><div><span className="section-kicker">Evidence</span><h3>{selectedActivity ? selectedActivity.normalized : 'Select an extracted activity'}</h3></div>{selectedActivity && <button className="outline-button small dark-text" type="button" onClick={() => setSourcePreview(true)}><FileText size={14} /> View Source</button>}</div>
          {selectedActivity ? <div className="evidence-grid"><div><span>Source</span><strong>{selectedActivity.source}</strong></div><div><span>Sheet</span><strong>{selectedActivity.sheet}</strong></div><div><span>Row</span><strong>{selectedActivity.row}</strong></div><div><span>Location</span><strong>{selectedActivity.location}</strong></div><div><span>Progress</span><strong>{selectedActivity.progress}%</strong></div><div><span>Date</span><strong>{selectedActivity.date}</strong></div></div> : <p className="empty-copy">Click a row above to inspect source evidence and traceability.</p>}
          {selectedActivity && <div className="evidence-quote"><span>Extracted Information</span><p>"{selectedActivity.rawText}"</p></div>}
        </div>
        <div className="panel recent-panel"><div className="panel-header"><div><span className="section-kicker">Processing history</span><h3>Recent Documents</h3></div><FileText className="teal-icon" size={19} /></div><div className="recent-list">{[`${demoDocument}|Today|4|Complete`, 'DPR_Zone_B.xlsx|Yesterday|7|Complete', 'Site_Report_12.xlsx|2 days ago|5|Review'].map((entry) => { const [name, time, count, status] = entry.split('|'); return <button type="button" key={name} className="recent-item" onClick={() => name === demoDocument && onUpload({ name: demoDocument, demo: true })}><FileText size={16} /><span><strong>{name}</strong><small>{time} · {count} activities</small></span><StatusBadge status={status} /></button>; })}</div></div>
      </div>

      {selectedActivity && selectedActivity.confidence < 75 && <div className="review-banner"><AlertTriangle size={18} /><div><strong>Low-confidence extraction</strong><p>Some information may require manual verification before it enters the project intelligence layer.</p></div><button className="primary-button small" type="button" onClick={() => onReviewActivity(selectedActivity, 'Confirmed')}>Review</button></div>}

      {selectedActivity && sourcePreview && <div className="modal-backdrop" onClick={() => setSourcePreview(false)}><div className="source-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setSourcePreview(false)}><X size={18} /></button><span className="section-kicker">Source preview · Prototype Demo Project</span><h2>{selectedActivity.source}</h2><p>Progress Report · highlighted source row {selectedActivity.row}</p><div className="source-sheet"><div className="sheet-title">OIL Assam Pipeline DPR - Demo</div><div className="sheet-head"><span>Activity</span><span>Location</span><span>Progress</span></div>{projectState.extracted.map((item) => <div className={`sheet-row ${item.raw === selectedActivity.raw ? 'highlight' : ''}`} key={item.raw}><span>{item.raw}</span><span>{item.location}</span><span>{item.progress}%</span></div>)}</div><button className="outline-button small dark-text" type="button" onClick={() => setSourcePreview(false)}>Close preview</button></div></div>}

      {selectedActivity && <ActivityDrawer activity={selectedActivity} status={selectedStatus} onAction={onReviewActivity} onViewSource={() => { setSourcePreview(true); setSelectedActivity(null); }} onClose={() => setSelectedActivity(null)} />}
    </>
  );
}

function ActivityDrawer({ activity, status, onAction, onViewSource, onClose }) {
  return <div className="modal-backdrop" onClick={onClose}><aside className="activity-drawer" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={onClose}><X size={18} /></button><span className="section-kicker">Activity detail and traceability</span><h2>{activity.normalized}</h2><p className="modal-subtitle">Source-linked extraction from the project report.</p><div className="drawer-status"><StatusBadge status={activity.confidence < 75 ? status : 'Matched'} /><RiskBadge risk={activity.progress < 60 ? 'HIGH' : 'LOW'} /></div><div className="review-evidence"><div><span>Raw text</span><strong>"{activity.rawText}"</strong></div><div><span>Normalized activity</span><strong>{activity.normalized}</strong></div><div><span>Location</span><strong>{activity.location}</strong></div><div><span>Reported progress</span><strong>{activity.progress}%</strong></div><div><span>Reporting date</span><strong>{activity.date}</strong></div><div><span>Prototype Confidence</span><strong>{activity.confidence}%</strong></div><div><span>Schedule activity</span><strong>{activity.schedule}</strong></div><div><span>Source document</span><strong>{activity.source}</strong></div><div><span>Source sheet / row</span><strong>{activity.sheet} / {activity.row}</strong></div></div><button className="outline-button small dark-text full-width" type="button" onClick={onViewSource}><FileText size={14} /> View Source</button>{activity.confidence < 75 && <><div className="low-confidence-note"><AlertTriangle size={16} /><div><strong>Low-confidence extraction</strong><p>Some information may require manual verification.</p></div></div><div className="review-actions"><button className="primary-button" type="button" onClick={() => { onAction(activity, 'Confirmed'); onClose(); }}><Check size={15} /> Confirm Match</button><button className="outline-button dark-text" type="button" onClick={() => { onAction(activity, 'Rejected'); onClose(); }}>Reject</button><button className="link-button" type="button" onClick={onClose}>Keep for Review</button></div></>}</aside></div>;
}

function Matching({ projectState, reviewState, onStatusChange, onNavigate }) {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [duplicateAction, setDuplicateAction] = useState('');
  const matches = projectState.matches.map((row) => ({
    ...row,
    extracted: projectState.extracted.find((item) => item.raw === row.field),
  }));
  const getStatus = (row) => reviewState[row.field] || (row.confidence < 75 ? 'Needs Review' : 'Confirmed');
  const confirmed = matches.filter((row) => getStatus(row) === 'Confirmed').length;
  const needsReview = matches.filter((row) => getStatus(row) === 'Needs Review').length;
  const avg = matches.length ? Math.round(matches.reduce((sum, item) => sum + item.confidence, 0) / matches.length) : 0;

  return (
    <>
      <PageIntro eyebrow="Activity Matching" title="Connect field language to the approved schedule" description="Raw field language is normalized, compared with the master schedule, and surfaced with deterministic factors for human review." />

      <div className="match-toolbar">
        <div className="match-counts"><div><strong>{matches.length}</strong><span>Matches</span></div><div className="confirmed-count"><strong>{confirmed}</strong><span>Confirmed</span></div><div className="review-count-card"><strong>{needsReview}</strong><span>Needs Review</span></div></div>
        <button className="primary-button" type="button" onClick={() => onNavigate('risk')}><Radar size={16} /> View Progress &amp; Risk <ArrowUpRight size={15} /></button>
      </div>

      <div className="banner-box">
        <div className="banner-icon"><Network size={18} /></div>
        <div><strong>Terminology normalization is active</strong><p>Field report language is being linked to standardized schedule activities before progress is analyzed.</p></div>
        <span className="banner-score">{avg}%<small>average confidence</small></span>
      </div>

      <div className="panel table-panel">
        <div className="panel-header"><div><span className="section-kicker">Match queue</span><h3>Field report to schedule activity</h3></div><span className="pill">Human review enabled</span></div>
        <div className="matching-table data-table">
          <div className="table-head"><span>Field Activity</span><span>Normalized Activity</span><span>Schedule Activity</span><span>Confidence</span><span>Status</span><span>Action</span></div>
          {matches.map((row) => { const status = getStatus(row); return <div className="table-row match-row" key={row.field}><div><strong>{row.field}</strong><small>Field report input</small></div><div><strong>{row.extracted?.normalized || row.field}</strong><small>{row.extracted?.progress || 0}% reported progress</small></div><div><strong>{row.schedule}</strong><small>{row.extracted?.location || 'Schedule context'}</small></div><div className="confidence-box"><b>{row.confidence}%</b><div className="tiny-bar"><span style={{ width: `${row.confidence}%` }} /></div></div><div><StatusBadge status={status} /></div><div className="action-stack"><button className="link-button mini" type="button" onClick={() => setSelectedMatch(row)}>Why this match?</button>{status === 'Needs Review' && <button className="link-button mini" type="button" onClick={() => onStatusChange(row, 'Confirmed')}>Confirm Match</button>}</div></div>; })}
        </div>
      </div>

      <div className="matching-lower-grid">
        <div className="panel comparison-panel"><div className="panel-header"><div><span className="section-kicker">Match comparison</span><h3>From site report to schedule</h3></div><Network className="teal-icon" size={19} /></div><div className="comparison-flow"><div><small>FIELD REPORT</small><strong>"Trench preparation completed at Ch. 12+500 in Section A."</strong></div><ArrowRight size={17} /><div><small>NORMALIZED</small><strong>"Pipeline Trench Preparation"</strong></div><ArrowRight size={17} /><div><small>SCHEDULE</small><strong>"Pipeline Trench Preparation - Section A - Chainage 12+500"</strong><b>94% confidence</b></div></div></div>
        <div className="panel duplicate-panel"><div className="panel-header"><div><span className="section-kicker">Similar activity detection</span><h3>Possible duplicate</h3></div><AlertTriangle className="amber-icon" size={19} /></div><div className="duplicate-compare"><strong>Trench excavation Section A</strong><span>vs.</span><strong>Pipeline trench preparation Ch. 12+500</strong><b>96% similarity</b></div><div className="duplicate-actions"><button className="outline-button small dark-text" type="button" onClick={() => setDuplicateAction('Compared')}>Compare</button><button className="primary-button small" type="button" onClick={() => setDuplicateAction('Merged')}>Merge</button><button className="link-button" type="button" onClick={() => setDuplicateAction('Kept Separate')}>Keep Separate</button></div>{duplicateAction && <small className="action-result">Duplicate decision: {duplicateAction}</small>}</div>
      </div>

      {selectedMatch && <MatchExplanation match={selectedMatch} status={getStatus(selectedMatch)} onAction={(status) => { onStatusChange(selectedMatch, status); setSelectedMatch(null); }} onClose={() => setSelectedMatch(null)} />}
    </>
  );
}

function MatchExplanation({ match, status, onAction, onClose }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="match-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={onClose}><X size={18} /></button><span className="section-kicker">Why this match?</span><h2>{match.extracted?.normalized || match.field}</h2><p className="modal-subtitle">Explainable deterministic matching factors for the prototype scenario.</p><div className="match-detail-grid"><div><span>Field Activity</span><strong>{match.field}</strong></div><div><span>Matched Activity</span><strong>{match.schedule}</strong></div><div><span>Confidence</span><strong>{match.confidence}%</strong></div><div><span>Status</span><strong>{status}</strong></div></div><div className="factor-list"><div><span>Keyword similarity</span><b>94%</b><div className="tiny-bar"><span style={{ width: '94%' }} /></div></div><div><span>Section match</span><b>91%</b><div className="tiny-bar"><span style={{ width: '91%' }} /></div></div><div><span>Schedule context</span><b>96%</b><div className="tiny-bar"><span style={{ width: '96%' }} /></div></div></div><div className="match-arrow-note"><strong>{match.field} <ArrowRight size={15} /> {match.extracted?.normalized || 'Standardized activity'}</strong><small>Section A · Chainage 12+500 <ArrowRight size={13} /> Schedule match</small></div><div className="review-actions"><button className="primary-button" type="button" onClick={() => { onAction('Confirmed'); }}><Check size={15} /> Confirm Match</button><button className="outline-button dark-text" type="button" onClick={() => onAction('Rejected')}>Reject Match</button><button className="link-button" type="button" onClick={() => onAction('Needs Review')}>Keep for Review</button></div></div></div>;
}

function Risk({ projectState, selectedActivity, onSelectActivity, onNavigate }) {
  const [filter, setFilter] = useState('All');
  const [impactOpen, setImpactOpen] = useState(false);
  const activities = projectState.activities;
  const current = selectedActivity || activities.find((item) => item.name === 'Pipeline Valve Installation') || activities[0];
  const maxVariance = Math.min(...activities.map((item) => item.actual - item.planned));
  const riskScore = Math.max(0, 50 - Math.abs(maxVariance));
  const filters = ['All', 'HIGH', 'MEDIUM', 'LOW', 'Delayed'];
  const filteredActivities = activities.filter((item) => filter === 'All' || (filter === 'Delayed' ? item.status === 'Delayed' : item.risk === filter));
  const riskCounts = { HIGH: activities.filter((item) => item.risk === 'HIGH').length, MEDIUM: activities.filter((item) => item.risk === 'MEDIUM').length, LOW: activities.filter((item) => item.risk === 'LOW').length };
  const variance = current.actual - current.planned;

  return (
    <>
      <PageIntro eyebrow="Progress & Risk" title="See delay before it becomes disruption" description="The system does not just show progress; it identifies where the project is falling behind and explains what needs attention." />

      <div className="risk-summary">
        <div className="risk-card large">
          <span className="section-kicker">Project risk index</span>
          <div className="risk-value-wrap"><strong>{riskScore}</strong><span>/ 100</span></div>
          <div className="meter"><span style={{ width: `${riskScore}%` }} /></div>
          <small>Medium risk · recovery required</small>
        </div>
        <div className="risk-card"><span className="dot delayed" /> <strong>{projectState.metrics.delayed}</strong><small>Delayed activities</small></div>
        <div className="risk-card"><span className="dot high-risk" /> <strong>{riskCounts.HIGH}</strong><small>High-risk activities</small></div>
        <div className="risk-card"><span className="dot in-progress" /> <strong>{Math.abs(maxVariance)}%</strong><small>Largest variance</small></div>
      </div>

      <div className="progress-overview panel"><div><span className="section-kicker">Progress overview</span><h3>Planned vs Actual</h3></div><div className="progress-bars"><div><span>Planned Progress</span><strong>74%</strong><div className="progress-track"><i style={{ width: '74%' }} /></div></div><div><span>Actual Progress</span><strong>68%</strong><div className="progress-track actual-track"><i style={{ width: '68%' }} /></div></div><div className="progress-variance"><span>Variance</span><strong>-6%</strong><small>Below baseline</small></div></div></div>

      <div className="risk-category-panel panel"><div><span className="section-kicker">Project risk</span><strong>Filter the activity register by risk category</strong></div><div className="risk-category-list">{[['HIGH', riskCounts.HIGH], ['MEDIUM', riskCounts.MEDIUM], ['LOW', riskCounts.LOW]].map(([level, count]) => <button type="button" key={level} className={filter === level ? 'selected' : ''} onClick={() => setFilter(level)}><RiskBadge risk={level} /><strong>{count}</strong></button>)}</div></div>

      <div className="content-grid risk-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Activity register</span>
              <h3>Planned vs actual progress</h3>
            </div>
            <div className="filter-tabs">{filters.map((item) => <button type="button" key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item === 'HIGH' || item === 'MEDIUM' || item === 'LOW' ? `${item[0]}${item.slice(1).toLowerCase()} Risk` : item}</button>)}</div>
          </div>

          <div className="data-table risk-table">
            <div className="table-head">
              <span>Activity</span>
              <span>Planned</span>
              <span>Actual</span>
              <span>Variance</span>
              <span>Status</span>
              <span>Risk</span>
            </div>
            {filteredActivities.map((item) => (
              <button className="table-row risk-row" key={item.name} type="button" onClick={() => onSelectActivity(item)}>
                <div><strong>{item.name}</strong><small>{item.zone}</small></div>
                <div>{item.planned}%</div>
                <div>{item.actual}%</div>
                <div className={item.actual - item.planned < 0 ? 'negative' : 'positive'}>{item.actual - item.planned}%</div>
                <div><StatusBadge status={item.status} /></div>
                <div><RiskBadge risk={item.risk} /></div>
              </button>
            ))}
            {!filteredActivities.length && <div className="empty-copy">No activities match this filter.</div>}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Current status</span>
              <h3>{current.name}</h3>
            </div>
            <RiskBadge risk={current.risk} />
          </div>

          <div className="status-box">
            <div><span>Planned</span><strong>{current.planned}%</strong></div>
            <div><span>Actual</span><strong>{current.actual}%</strong></div>
            <div><span>Variance</span><strong className={variance < 0 ? 'negative' : 'positive'}>{variance}%</strong></div>
            <div><span>Risk</span><strong>{current.risk}</strong></div>
          </div>

          <div className="explain-box">
            <strong>Likely Causes</strong>
            <ul>
              <li>Valve installation sequence delay</li>
              <li>Section B crew re-sequencing</li>
              <li>Slow progress at the current work front</li>
            </ul>
          </div>

          <div className="recommendation-box">
            <strong>Recommended action</strong>
            <p>Prioritize pipeline valve installation in Section B.</p>
          </div>
          <div className="risk-explanation"><strong>Why is this activity high risk?</strong><ul><li>Progress is 12% below plan</li><li>Valve installation is delayed</li><li>Hydrotest preparation depends on it</li></ul></div>
          <button className="primary-button full-width" type="button" disabled={current.status !== 'Delayed'} onClick={() => setImpactOpen(true)}><Radar size={15} /> Analyze Impact</button>
          <button className="source-link" type="button" onClick={() => onNavigate('documents')}><FileText size={14} /> Source: {demoDocument} <ArrowUpRight size={14} /></button>
        </div>
      </div>

      <div className="priority-panel panel"><div className="panel-header"><div><span className="section-kicker">Recommended actions</span><h3>Priority Actions</h3></div><Zap className="amber-icon" size={19} /></div><div className="priority-list"><div><RiskBadge risk="HIGH" /><strong>Resolve Section B valve installation delay.</strong></div><div><RiskBadge risk="HIGH" /><strong>Review Hydrotest Preparation progress.</strong></div><div><RiskBadge risk="MEDIUM" /><strong>Verify incomplete prototype reports.</strong></div><div><RiskBadge risk="LOW" /><strong>Review downstream pipeline dependencies.</strong></div></div></div>

      {impactOpen && <div className="modal-backdrop" onClick={() => setImpactOpen(false)}><div className="impact-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setImpactOpen(false)}><X size={18} /></button><span className="section-kicker">Delay impact analysis</span><h2>Pipeline Valve Installation</h2><div className="dependency-flow"><strong>Pipeline Valve Installation</strong><ArrowRight size={16} /><strong>Hydrotest Preparation</strong><ArrowRight size={16} /><strong>Pipeline Reinstatement</strong><ArrowRight size={16} /><strong>ROW Handover</strong></div><div className="impact-metrics"><div><span>Affected Activities</span><strong>3</strong></div><div><span>Potential Downstream Impact</span><strong>+7 days</strong></div><div><span>Critical Dependency</span><strong>Hydrotest Preparation</strong></div></div><button className="outline-button small dark-text" type="button" onClick={() => setImpactOpen(false)}>Close analysis</button></div></div>}
    </>
  );
}

function Timeline({ projectState, onNavigate }) {
  const [selected, setSelected] = useState(null);
  const monthColumns = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const statusClass = (status) => status.toLowerCase().replace(/\s+/g, '-');

  return (
    <>
      <PageIntro eyebrow="Project Timeline" title="See the construction sequence at a glance" description="A deterministic schedule view connects planned dates, current progress, and dependencies so the next delay is easier to anticipate." />
      <div className="timeline-banner panel"><div className="timeline-banner-icon"><CalendarDays size={20} /></div><div><span className="section-kicker">Schedule baseline · Prototype Demo Project</span><h3>Weekly pipeline control timeline</h3><p>Today marker: <strong>12 Sep 2026</strong> · Assam pipeline package</p></div><button className="primary-button" type="button" onClick={() => onNavigate('risk')}><Radar size={15} /> View Risk Analysis</button></div>
      <div className="timeline-legend"><span><i className="status-dot completed" /> Completed</span><span><i className="status-dot in-progress" /> In Progress</span><span><i className="status-dot at-risk" /> At Risk</span><span><i className="status-dot delayed" /> Delayed</span></div>
      <div className="panel timeline-panel">
        <div className="timeline-scale"><div>Activity</div><div className="scale-months">{monthColumns.map((month) => <span key={month}>{month}</span>)}<i className="today-line" /><b className="today-label">Today</b></div></div>
        <div className="timeline-grid">
          {projectState.timeline.map((item, index) => <button className="timeline-row" type="button" key={item.name} onClick={() => setSelected(item)}><div className="timeline-name"><strong>{item.name}</strong><small>{item.start} - {item.end}</small></div><div className="timeline-track"><i className={`timeline-bar ${statusClass(item.status)}`} style={{ left: `${Math.min(78, index * 10 + (index === 0 ? 0 : 4))}%`, width: `${Math.max(13, 27 - index)}%` }}><b style={{ width: `${item.progress}%` }} /></i><span className="timeline-progress">{item.progress}%</span></div><div className="timeline-meta"><StatusBadge status={item.status} /><RiskBadge risk={item.risk} /></div></button>)}
        </div>
      </div>
      <div className="timeline-note panel"><strong>Timeline signal</strong><span>Pipeline Valve Installation is the critical delayed activity feeding Hydrotest Preparation. Select an activity to inspect its dependency and risk context.</span></div>
      {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="timeline-detail-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setSelected(null)}><X size={18} /></button><span className="section-kicker">Timeline activity</span><h2>{selected.name}</h2><div className="timeline-detail-values"><div><span>Progress</span><strong>{selected.progress}%</strong></div><div><span>Planned</span><strong>{selected.planned}%</strong></div><div><span>Variance</span><strong className={selected.variance < 0 ? 'negative' : 'positive'}>{selected.variance}%</strong></div><div><span>Risk</span><strong>{selected.risk}</strong></div><div><span>Status</span><strong>{selected.status}</strong></div><div><span>Dependency</span><strong>{selected.dependency}</strong></div></div><div className="dependency-callout"><span>Schedule relationship</span><p>{selected.name} feeds the next planned package milestone through <strong>{selected.dependency}</strong>.</p></div><button className="primary-button full-width" type="button" onClick={() => { setSelected(null); onNavigate('risk'); }}><Radar size={15} /> View Risk Analysis</button></div></div>}
    </>
  );
}

function Zones({ projectState, onNavigate, initialZone }) {
  const [selectedZone, setSelectedZone] = useState(() => projectState.zones.find((zone) => zone.name === initialZone) || null);
  return (
    <>
      <PageIntro eyebrow="Site / Zones" title="See where project pressure is concentrated" description="A lightweight site schematic connects location, activity progress, and risk without requiring a geographic map service." />
      <div className="site-status panel"><div><span className="section-kicker">Site status · Prototype Demo Project</span><h3>Pipeline work fronts</h3></div><div className="zone-summary-row">{projectState.zones.map((zone) => <button type="button" key={zone.name} className={selectedZone?.name === zone.name ? 'selected' : ''} onClick={() => setSelectedZone(zone)}><span>{zone.name}</span><strong>{zone.progress}%</strong><RiskBadge risk={zone.risk} /></button>)}</div></div>
      <div className="zone-layout"><div className="panel site-schematic"><div className="panel-header"><div><span className="section-kicker">Project schematic</span><h3>Pipeline work fronts</h3></div><MapPinned className="teal-icon" size={20} /></div><div className="site-road"><span>Section A</span><i /><span>Section B</span><i /><span>Section C</span></div><div className="zone-blocks">{projectState.zones.map((zone, index) => <button type="button" key={zone.name} className={`zone-block zone-${index + 1} ${selectedZone?.name === zone.name ? 'selected' : ''}`} onClick={() => setSelectedZone(zone)}><span className="zone-pin"><MapPinned size={16} /></span><strong>{zone.name}</strong><b>{zone.progress}%</b><small>{zone.status}</small><RiskBadge risk={zone.risk} /></button>)}</div></div><div className="panel zone-detail-panel">{selectedZone ? <><div className="panel-header"><div><span className="section-kicker">Work front detail</span><h3>{selectedZone.name}</h3></div><RiskBadge risk={selectedZone.risk} /></div><div className="zone-detail-stat"><span>Progress</span><strong>{selectedZone.progress}%</strong><small>{selectedZone.status}</small></div><div className="zone-detail-grid"><div><span>Delayed Activities</span><strong>{selectedZone.delayed}</strong></div><div><span>High Risk Activities</span><strong>{selectedZone.highRisk}</strong></div><div><span>Missing Reports</span><strong>{selectedZone.missingReports}</strong></div></div><p className="zone-note">{selectedZone.note}</p><div className="zone-activities"><span>Activities</span>{selectedZone.activities.map((activity) => <strong key={activity}>{activity}</strong>)}</div><div className="zone-actions"><button className="primary-button small" type="button" onClick={() => onNavigate('matching')}>View Activities</button><button className="outline-button small dark-text" type="button" onClick={() => onNavigate('risk')}>View Risks</button></div></> : <div className="zone-empty"><MapPinned size={25} /><h3>Select a section</h3><p>Choose Section A, B, or C in the schematic to inspect its project context.</p></div>}</div></div>
    </>
  );
}

function Alerts({ projectState, reviewState, onAlert }) {
  const [filter, setFilter] = useState('All');
  const unresolvedReviews = projectState.matches.filter((row) => row.confidence < 75 && reviewState[row.field] !== 'Confirmed').length;
  const alerts = projectState.alertFeed.map((alert) => alert.id === 'match-review' && unresolvedReviews === 0 ? { ...alert, category: 'Resolved', title: 'Activity matches confirmed.', detail: 'Human-in-the-loop queue cleared' } : alert);
  const categories = ['All', 'Critical', 'Warning', 'Information', 'Resolved'];
  const filtered = alerts.filter((alert) => filter === 'All' || alert.category === filter);
  const count = (category) => alerts.filter((alert) => alert.category === category).length;

  return (
    <>
      <PageIntro eyebrow="Alerts Center" title="Detect the issues that need attention" description="Project alerts bring schedule variance, document quality, matching review, and zone risk into one actionable queue." />
      <div className="alert-counts">{[['Critical', count('Critical')], ['Warning', count('Warning')], ['Information', count('Information')], ['Resolved', count('Resolved')]].map(([category, value]) => <button type="button" key={category} className={filter === category ? 'selected' : ''} onClick={() => setFilter(category)}><span>{category}</span><strong>{value}</strong></button>)}</div>
      <div className="alert-filter-tabs">{categories.map((category) => <button type="button" key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div>
      <div className="alerts-center-list">{filtered.map((alert) => <button type="button" className={`center-alert ${alert.category.toLowerCase()}`} key={alert.id} onClick={() => onAlert(alert)}><span className="center-alert-icon"><AlertTriangle size={17} /></span><span className="center-alert-copy"><strong>{alert.title}</strong><small>{alert.detail}</small></span><span className="center-alert-category">{alert.category}</span><ArrowUpRight size={16} /></button>)}</div>
      {!filtered.length && <div className="panel empty-copy alert-empty">No alerts in this category.</div>}
    </>
  );
}

function ScenarioSimulator({ onReset }) {
  const [delay, setDelay] = useState(7);
  const [manpower, setManpower] = useState(20);
  const [delayResult, setDelayResult] = useState(null);
  const [recoveryResult, setRecoveryResult] = useState(null);

  const simulateDelay = () => setDelayResult({ pier: delay, girder: Math.max(1, delay - 1), deck: Math.max(1, delay - 2), road: Math.max(1, delay - 4), variance: -11 - delay });
  const simulateRecovery = () => setRecoveryResult({ manpower, days: Math.round(manpower / 5), variance: -12 + Math.round(manpower * 0.35) });
  const reset = () => { setDelay(7); setManpower(20); setDelayResult(null); setRecoveryResult(null); onReset(); };
  const projectedRecovery = recoveryResult?.variance ?? -5;
  const delayedVariance = delayResult?.variance ?? -18;

  return (
    <>
      <PageIntro eyebrow="Scenario Simulator" title="Explore the effect of delay or recovery" description="Use deterministic project inputs to explore how schedule pressure could move through the existing dependency chain." />
      <div className="illustrative-banner"><AlertTriangle size={17} /><div><strong>Illustrative Scenario</strong><span>These are deterministic mock estimates for demonstration, not real predictions.</span></div><button className="link-button" type="button" onClick={reset}><RefreshCw size={14} /> Reset Scenario</button></div>
      <div className="scenario-layout">
        <div className="scenario-controls">
          <div className="panel scenario-card"><div className="panel-header"><div><span className="section-kicker">Delay scenario</span><h3>What if Pipeline Valve Installation is delayed further?</h3></div><Radar className="red-icon" size={19} /></div><div className="scenario-baseline"><div><span>Current variance</span><strong>-12%</strong></div><div><span>Current delay</span><strong>7 days</strong></div></div><label className="scenario-label">Additional delay <strong>{delay} days</strong></label><input type="range" min="1" max="15" value={delay} onChange={(event) => setDelay(Number(event.target.value))} /><div className="range-labels"><span>1 day</span><span>15 days</span></div><button className="primary-button full-width" type="button" onClick={simulateDelay}><Radar size={15} /> Simulate Impact</button></div>
          <div className="panel scenario-card"><div className="panel-header"><div><span className="section-kicker">Recovery scenario</span><h3>What if additional manpower is assigned?</h3></div><Zap className="amber-icon" size={19} /></div><label className="scenario-label">Additional manpower <strong>{manpower}%</strong></label><div className="segmented-control">{[10, 20, 30].map((value) => <button type="button" key={value} className={manpower === value ? 'active' : ''} onClick={() => setManpower(value)}>{value}%</button>)}</div><button className="outline-button small dark-text full-width" type="button" onClick={simulateRecovery}><Zap size={15} /> Simulate Recovery</button></div>
        </div>
        <div className="scenario-results">
          <div className="panel result-card"><div className="panel-header"><div><span className="section-kicker">Scenario result</span><h3>Delay impact</h3></div><span className="risk-badge high">HIGH</span></div>{delayResult ? <><div className="scenario-dependencies"><div><strong>Pipeline Valve Installation</strong><b>+{delayResult.pier} days</b></div><ArrowRight size={15} /><div><strong>Hydrotest Preparation</strong><b>+{delayResult.girder} days</b></div><ArrowRight size={15} /><div><strong>Pipeline Reinstatement</strong><b>+{delayResult.deck} days</b></div><ArrowRight size={15} /><div><strong>ROW Handover</strong><b>+{delayResult.road} days</b></div></div><div className="scenario-impact-total"><span>Potential project impact</span><strong>+{delayResult.pier} days</strong></div></> : <div className="scenario-placeholder"><Radar size={22} /><p>Run the delay scenario to see the downstream dependency chain.</p></div>}</div>
          <div className="panel result-card"><div className="panel-header"><div><span className="section-kicker">Illustrative scenario estimate</span><h3>Recovery outlook</h3></div><span className="risk-badge medium">MEDIUM</span></div>{recoveryResult ? <div className="recovery-result"><div><span>Current variance</span><strong>-12%</strong></div><div><span>Additional manpower</span><strong>+{recoveryResult.manpower}%</strong></div><div><span>Illustrative recovery</span><strong>{recoveryResult.days} days</strong></div><div><span>Projected variance</span><strong className="negative">{recoveryResult.variance}%</strong></div></div> : <div className="scenario-placeholder"><Zap size={22} /><p>Choose a manpower option to explore a deterministic recovery estimate.</p></div>}</div>
        </div>
      </div>
      <div className="panel scenario-comparison"><div className="panel-header"><div><span className="section-kicker">Compare scenarios</span><h3>Current vs Delayed vs Recovery</h3></div><SlidersHorizontal className="teal-icon" size={19} /></div><div className="scenario-compare-grid"><div><span>Current</span><strong>-12%</strong><RiskBadge risk="HIGH" /></div><div><span>Additional Delay</span><strong>{delayedVariance}%</strong><RiskBadge risk="HIGH" /></div><div><span>Recovery</span><strong>{projectedRecovery}%</strong><RiskBadge risk="MEDIUM" /></div></div></div>
    </>
  );
}

function AskSiteIntel({ projectState, reviewState, onNavigate }) {
  const examples = ['Which activities are delayed?', 'Which activity has the highest variance?', 'Why is Section B at risk?', 'What should be prioritized?', 'Show activities requiring review.', 'What is affecting the project schedule?'];
  const [prompt, setPrompt] = useState(examples[0]);
  const [reply, setReply] = useState(() => projectAssistant(examples[0], projectState, reviewState));
  const ask = (question = prompt) => { setPrompt(question); setReply(projectAssistant(question, projectState, reviewState)); };
  return <div className="panel ask-panel"><div className="panel-header"><div><span className="section-kicker">Project Intelligence Assistant</span><h3>Ask SiteIntel</h3></div><Sparkles className="teal-icon" size={19} /></div><div className="example-questions">{examples.map((example) => <button type="button" key={example} onClick={() => ask(example)}>{example}</button>)}</div><div className="ask-input-row"><input value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') ask(); }} /><button className="primary-button small" type="button" onClick={() => ask()}>Ask</button></div><div className="assistant-response insight-response"><strong>Answer</strong><p>{reply.answer}</p><strong>Evidence</strong><p>{reply.evidence}</p><small>Source: {reply.source}</small>{reply.destination && <button className="link-button" type="button" onClick={() => onNavigate(reply.destination)}><ArrowUpRight size={14} /> Open related analysis</button>}</div></div>;
}

function Insights({ projectState, reviewState, reportOpen, onOpenReport, onCloseReport, onNavigate }) {
  const reviewCount = projectState.matches.filter((item) => item.confidence < 75 && reviewState[item.field] !== 'Confirmed').length;
  return (
    <>
      <PageIntro eyebrow="Project Insights" title="Weekly Project Intelligence" description="A deterministic executive view connecting captured field data, schedule variance, site risk, and recommended action." />

      <div className="report-header">
        <div>
          <span className="section-kicker">Workbook-derived summary</span>
          <h3>Imported activities are progressing, with focused recovery needed on delayed work.</h3>
        </div>
        <button className="primary-button" type="button" onClick={onOpenReport}><FileText size={17} /> Generate Project Report</button>
      </div>

      <div className="summary-metrics">
        <div><span>Actual Progress</span><strong>68%</strong></div><div><span>Planned Progress</span><strong>74%</strong></div><div><span>Variance</span><strong className="negative">-6%</strong></div><div><span>Project Health</span><strong>72 / 100</strong></div><div><span>Risk</span><strong className="risk-text">MEDIUM</strong></div>
      </div>

      <div className="content-grid insights-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Key findings</span>
              <h3>What changed in the workbook</h3>
            </div>
            <CheckCircle2 className="teal-icon" size={20} />
          </div>
          <div className="finding-cards"><div><b>01</b><strong>Schedule Delay</strong><span>Pipeline Valve Installation is 12% below planned progress.</span><button className="link-button" type="button" onClick={() => onNavigate('risk')}>View Evidence <ArrowUpRight size={13} /></button></div><div><b>02</b><strong>Section Risk</strong><span>Section B contains multiple delayed pipeline activities.</span><button className="link-button" type="button" onClick={() => onNavigate('zones')}>View Evidence <ArrowUpRight size={13} /></button></div><div><b>03</b><strong>Reporting Quality</strong><span>Some prototype reports contain incomplete information.</span><button className="link-button" type="button" onClick={() => onNavigate('documents')}>View Evidence <ArrowUpRight size={13} /></button></div><div><b>04</b><strong>Matching Review</strong><span>{reviewCount} activity requires manual confirmation.</span><button className="link-button" type="button" onClick={() => onNavigate('matching')}>View Evidence <ArrowUpRight size={13} /></button></div></div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Priority actions</span>
              <h3>Next best steps</h3>
            </div>
            <Zap className="amber-icon" size={20} />
          </div>
          <div className="insight-priority-list"><div><RiskBadge risk="HIGH" /><strong>Resolve Section B valve installation delay.</strong><button className="link-button" type="button" onClick={() => onNavigate('risk')}>Open</button></div><div><RiskBadge risk="HIGH" /><strong>Review Hydrotest Preparation.</strong><button className="link-button" type="button" onClick={() => onNavigate('zones')}>Open</button></div><div><RiskBadge risk="MEDIUM" /><strong>Verify incomplete prototype reports.</strong><button className="link-button" type="button" onClick={() => onNavigate('documents')}>Open</button></div><div><RiskBadge risk="LOW" /><strong>Review downstream pipeline dependencies.</strong><button className="link-button" type="button" onClick={() => onNavigate('timeline')}>Open</button></div></div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <span className="section-kicker">Evidence links</span>
            <h3>Traceable findings</h3>
          </div>
        </div>
        <div className="insight-cards">
          {projectState.insightCards.map((item, index) => (
            <div className="insight-card" key={`${item.title}-${index}`}>
              <strong>{item.title}</strong>
              <span>Source: {item.source}</span>
              <span>Confidence: {item.confidence}%</span>
              <span>Related activity: {item.activity}</span>
              <button className="link-button" type="button" onClick={() => onNavigate(item.activity.includes('Drainage') ? 'risk' : item.activity.includes('Pier') ? 'risk' : 'documents')}>View Evidence <ArrowUpRight size={13} /></button>
            </div>
          ))}
        </div>
      </div>

      <AskSiteIntel projectState={projectState} reviewState={reviewState} onNavigate={onNavigate} />

      {reportOpen && (
        <div className="modal-backdrop" onClick={onCloseReport}>
          <div className="report-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={onCloseReport}><X size={18} /></button>
            <div className="report-icon"><FileText size={22} /></div>
            <span className="section-kicker">Generated project report</span>
            <h2>Project intelligence brief</h2>
            <p className="modal-subtitle">{projectName} · Prototype Demo Project</p>
            <div className="generated-report">
              <div><span>Overall progress</span><strong>68%</strong></div>
              <div><span>Schedule variance</span><strong className="negative">-6%</strong></div>
              <hr />
              <strong>Executive summary</strong>
              <p>Actual progress is 68% against a 74% baseline, leaving a -6% variance. Project health is 72 / 100 with MEDIUM risk. Pipeline Valve Installation, Section B, and reporting quality are the current decision points.</p>
              <strong>Delayed activities</strong>
              <ul><li>Pipeline Valve Installation: 58% actual vs 70% planned (-12%).</li><li>Hydrotest Preparation: 30% actual vs 40% planned (-10%).</li><li>Bedding and Lowering: 63% actual vs 72% planned (-9%).</li></ul>
              <strong>Risk summary</strong>
              <p>2 HIGH, 3 MEDIUM, and 5 LOW risk activities are tracked in the current project scenario.</p>
              <strong>Source documents</strong>
              <p>{demoDocument}</p>
              <strong>Priority actions</strong>
              <ul>
                <li>Prioritize pipeline valve installation in Section B.</li>
                <li>Verify incomplete prototype reports before the next cycle.</li>
                <li>Review downstream pipeline dependencies.</li>
              </ul>
            </div>
            <button className="primary-button full-width" type="button" onClick={onCloseReport}><Check size={16} /> Close report</button>
          </div>
        </div>
      )}
    </>
  );
}

function DemoControls({ onAssist, onReset }) {
  const [delay, setDelay] = useState(7);
  const [prompt, setPrompt] = useState('Which activities are delayed?');
  const [reply, setReply] = useState(projectAssistant('Which activities are delayed?'));
  const [simulation, setSimulation] = useState(null);

  return (
    <>
      <PageIntro eyebrow="Demo Mode" title="Scenario simulator and project assistant" description="Use the interactive simulation to check how schedule pressure changes when project delays increase or when new questions are asked about the current scenario." />

      <div className="content-grid demo-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Scenario simulator</span>
              <h3>What happens if the delay increases?</h3>
            </div>
          </div>

          <div className="scenario-row">
            <label>Delay days</label>
            <input type="range" min="1" max="15" value={delay} onChange={(event) => setDelay(Number(event.target.value))} />
            <strong>{delay} days</strong>
          </div>
          <button className="primary-button full-width" type="button" onClick={() => setSimulation(onAssist('simulate', delay))}><Play size={15} /> Simulate impact</button>
          {simulation && <div className="assistant-response demo-simulation"><strong>Illustrative impact</strong><p>Pipeline Valve Installation +{simulation['Pipeline Valve Installation']} days · Hydrotest Preparation +{simulation['Hydrotest Preparation']} days</p></div>}
          <button className="outline-button full-width" type="button" onClick={onReset}><RefreshCw size={15} /> Reset sample scenario</button>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Project intelligence</span>
              <h3>Natural-language answers</h3>
            </div>
          </div>

          <div className="assistant-box">
            <input value={prompt} onChange={(event) => setPrompt(event.target.value)} />
            <button className="primary-button small" type="button" onClick={() => setReply(projectAssistant(prompt))}>Ask</button>
          </div>
          <div className="assistant-response">
            <strong>Answer</strong>
            <p>{reply.answer}</p>
            <strong>Evidence</strong>
            <p>{reply.evidence}</p>
            <small>Source: {reply.source}</small>
          </div>
        </div>
      </div>
    </>
  );
}

function PageIntro({ eyebrow, title, description }) {
  return (
    <div className="page-intro">
      <span className="section-kicker">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

const supervisorReportDefaults = {
  report: 'Trench preparation completed at Ch. 12+500 in Section A. Excavation and bedding work completed.',
  section: 'A',
  chainage: '12+500',
  progress: '100',
  remarks: 'Excavation and bedding work completed.',
};

function RoleSelection({ onSelect }) {
  return <div className="role-selection"><div className="role-selection-visual"><div className="brand-wrap role-brand"><div className="brand-mark"><HardHat size={20} /></div><div><strong>site<span>intel</span></strong><small>PROJECT INTELLIGENCE</small></div></div><div className="role-visual-copy"><span className="eyebrow"><span className="live-dot" /> Prototype Demo</span><h1>Turn construction documents into actionable project intelligence.</h1><p>Choose a working view for the shared OIL Assam Pipeline Expansion scenario.</p></div><small className="role-footer">ONE SHARED PROJECT STATE · FICTIONAL DEMO DATA</small></div><div className="role-selection-card"><span className="section-kicker">Welcome to SiteIntel</span><h2>Choose your workspace</h2><p>Project Manager and Site Supervisor views use the same project and activity data.</p><div className="role-options"><button type="button" onClick={() => onSelect('manager')}><span className="role-option-icon"><LayoutDashboard size={19} /></span><span><strong>Project Manager</strong><small>Monitor intelligence, risks, timeline, and actions.</small></span><ArrowRight size={17} /></button><button type="button" onClick={() => onSelect('supervisor')}><span className="role-option-icon supervisor"><UserRound size={19} /></span><span><strong>Site Supervisor</strong><small>Report today’s work and verify site activity matches.</small></span><ArrowRight size={17} /></button></div><small className="role-note">Prototype Demo Project · OIL Assam Pipeline Expansion</small></div></div>;
}

function SupervisorReport({ projectState, onClose, onUseDemo, report, setReport }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="supervisor-report-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={onClose}><X size={18} /></button><div className="report-icon"><FileText size={21} /></div><span className="section-kicker">Field update</span><h2>Report Site Progress</h2><p className="modal-subtitle">Add a site note for the shared project activity state.</p><button className="demo-scenario-button" type="button" onClick={onUseDemo}><Sparkles size={15} /> Use Demo Scenario</button><label className="field-label">Site Report<textarea value={report.report} onChange={(event) => setReport({ ...report, report: event.target.value })} rows="4" /></label><div className="field-grid"><label className="field-label">Section<input value={report.section} onChange={(event) => setReport({ ...report, section: event.target.value })} /></label><label className="field-label">Chainage<input value={report.chainage} onChange={(event) => setReport({ ...report, chainage: event.target.value })} /></label><label className="field-label">Progress (%)<input type="number" min="0" max="100" value={report.progress} onChange={(event) => setReport({ ...report, progress: event.target.value })} /></label></div><label className="field-label">Remarks<textarea value={report.remarks} onChange={(event) => setReport({ ...report, remarks: event.target.value })} rows="2" /></label><div className="attachment-row"><button type="button"><Camera size={16} /> Site Photo</button><button type="button"><Paperclip size={16} /> Document Attachment</button></div><button className="primary-button full-width" type="button" onClick={onClose}><Check size={16} /> Process with AI</button><small className="prototype-note">Prototype flow: AI processing will be connected after supervisor verification is implemented.</small></div></div>;
}

function SupervisorDashboard({ projectState, onSwitchRole }) {
  const [reportOpen, setReportOpen] = useState(false);
  const [report, setReport] = useState(supervisorReportDefaults);
  const trench = projectState.activities.find((item) => item.name === 'Pipeline Trench Preparation') || projectState.activities[0];
  const completed = projectState.activities.filter((item) => item.status === 'Completed').length;
  const inProgress = projectState.activities.filter((item) => item.status === 'In Progress').length;
  const issues = projectState.activities.filter((item) => item.status === 'Delayed').length;
  const useDemo = () => { setReport(supervisorReportDefaults); setReportOpen(true); };

  return <div className="supervisor-shell"><aside className="supervisor-sidebar"><div className="brand-wrap role-brand"><div className="brand-mark"><HardHat size={20} /></div><div><strong>site<span>intel</span></strong><small>FIELD INTELLIGENCE</small></div></div><div className="supervisor-project"><span>Prototype Demo</span><strong>OIL Assam Pipeline Expansion</strong><small>Construction Package</small></div><nav><button className="active" type="button"><LayoutDashboard size={17} /> Dashboard</button><button type="button"><CheckCircle2 size={17} /> Today's Work</button><button type="button" onClick={() => setReportOpen(true)}><FileText size={17} /> Report Progress</button><button type="button"><AlertTriangle size={17} /> Site Issues</button><button type="button"><FileText size={17} /> Recent Reports</button></nav><div className="supervisor-sidebar-bottom"><div className="supervisor-user"><div className="avatar supervisor-avatar">NK</div><div><strong>Neha Kulkarni</strong><small>Site Supervisor</small></div></div><button className="switch-role-button" type="button" onClick={onSwitchRole}><ArrowRight size={15} /> Switch Role</button></div></aside><main className="supervisor-main"><header className="supervisor-topbar"><div><span className="section-kicker">Site Supervisor</span><strong>Neha Kulkarni</strong></div><div className="supervisor-context"><span>{projectName}</span><i>PROTOTYPE DEMO</i></div><div className="top-avatar">NK</div></header><div className="supervisor-content"><div className="supervisor-heading"><div><span className="eyebrow"><span className="live-dot" /> Field workspace</span><h1>Good morning, Neha.</h1><p>Monitor today's pipeline construction work and report what's happening on site.</p></div><button className="primary-button supervisor-report-button" type="button" onClick={() => setReportOpen(true)}>+ Report Site Progress</button></div><div className="supervisor-summary"><div><span>Today's Activities</span><strong>{projectState.activities.length}</strong></div><div className="good"><span>Completed</span><strong>{completed}</strong></div><div className="progress"><span>In Progress</span><strong>{inProgress}</strong></div><div className="issue"><span>Issues</span><strong>{issues}</strong></div></div><div className="supervisor-grid"><section className="panel supervisor-work-panel"><div className="panel-header"><div><span className="section-kicker">Today's Work</span><h2>Assigned site activities</h2></div><span className="pill">Shared with Project Manager</span></div><div className="supervisor-work-list"><div className="supervisor-work-card featured"><div className="work-status"><CheckCircle2 size={17} /><span>Completed</span></div><h3>{trench.name}</h3><p>Section A · Chainage 12+500</p><div className="work-progress"><div><span>Progress</span><strong>{trench.actual}%</strong></div><div className="progress-track actual-track"><i style={{ width: `${trench.actual}%` }} /></div></div><div className="work-source"><span>Latest field context</span><strong>Excavation and bedding work completed.</strong></div></div>{projectState.activities.filter((item) => item.name !== 'Pipeline Trench Preparation').slice(0, 3).map((item) => <div className="supervisor-work-card compact" key={item.name}><div className="work-card-top"><strong>{item.name}</strong><StatusBadge status={item.status} /></div><p>{item.zone}</p><span className="work-progress-label">{item.actual}% progress</span></div>)}</div></section><section className="panel supervisor-journey-panel"><span className="section-kicker">Field workflow</span><h2>From site report to shared progress</h2><div className="supervisor-steps"><div><b>01</b><span>See today's work</span></div><div><b>02</b><span>Report site progress</span></div><div><b>03</b><span>Verify the suggested activity</span></div><div><b>04</b><span>Project Manager sees the same update</span></div></div><button className="outline-button small dark-text full-width" type="button" onClick={useDemo}><Sparkles size={15} /> Use Demo Scenario</button></section></div></div></main>{reportOpen && <SupervisorReport projectState={projectState} onClose={() => setReportOpen(false)} onUseDemo={useDemo} report={report} setReport={setReport} />}</div>;
}

function App() {
  const [activeRole, setActiveRole] = useState('manager');
  const [roleSelectionOpen, setRoleSelectionOpen] = useState(false);
  const [page, setPage] = useState('dashboard');
  const [projectState, setProjectState] = useState(buildProjectState());
  const [selectedActivity, setSelectedActivity] = useState('Pipeline Valve Installation');
  const [reportOpen, setReportOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(true);
  const [fileName, setFileName] = useState(demoDocument);
  const [reviewState, setReviewState] = useState({});
  const [zoneToOpen, setZoneToOpen] = useState(null);
  const [pipelineStep, setPipelineStep] = useState(7);
  const [processingError, setProcessingError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentActivity = projectState.activities.find((item) => item.name === selectedActivity);

  const handleUpload = async (file) => {
    if (!file) return;
    setFileName(file.name || demoDocument);
    setProcessing(true);
    setProcessed(false);
    setProcessingError('');
    setPipelineStep(0);
    setPage('documents');

    const isDemo = file.demo === true;
    const extension = String(file.name || '').split('.').pop().toLowerCase();
    const supported = ['xlsx', 'xls', 'csv', 'pdf', 'docx'];
    if (!isDemo && !supported.includes(extension)) {
      setProcessing(false);
      setProcessed(false);
      setProcessingError('The selected file could not be processed in the prototype.');
      return;
    }
    let stage = 0;
    const stageTimer = window.setInterval(() => {
      stage += 1;
      setPipelineStep(stage);
      if (stage >= pipelineStages.length) window.clearInterval(stageTimer);
    }, 130);

    window.setTimeout(async () => {
      try {
        const next = isDemo
          ? { extracted: buildProjectState().extracted, matches: buildProjectState().matches, quality: { score: 76, impact: 'Some missing fields may reduce confidence in downstream project analysis.' } }
          : ['xlsx', 'xls'].includes(extension)
            ? { extracted: await parseWorkbook(await file.arrayBuffer()), matches: [], quality: { score: 80, impact: 'Prototype upload processed successfully.' } }
            : { extracted: buildProjectState().extracted, matches: buildProjectState().matches, quality: { score: 76, impact: 'Simulated extraction completed; source fields may require manual verification.' } };
        setProjectState((current) => ({ ...current, extracted: next.extracted, matches: next.matches, quality: next.quality }));
        setPipelineStep(7);
        setProcessing(false);
        setProcessed(true);
      } catch {
        setProcessing(false);
        setProcessed(false);
        setProcessingError('The selected file could not be processed in the prototype.');
      }
    }, 1000);
  };

  const resetDemo = () => {
    setProjectState(buildProjectState());
    setSelectedActivity(null);
    setReviewState({});
    setZoneToOpen(null);
    setReportOpen(false);
    setProcessing(false);
    setProcessed(true);
    setPipelineStep(7);
    setProcessingError('');
    setFileName(demoDocument);
    setPage('dashboard');
  };

  const handleReview = (match, status) => {
    setReviewState((current) => ({ ...current, [match.field]: status }));
    setPage('matching');
  };

  const handleReviewActivity = (activity, status) => {
    setReviewState((current) => ({ ...current, [activity.raw]: status }));
  };

  const handleAlert = (alert) => {
    if (alert.activity) setSelectedActivity(alert.activity);
    if (alert.zone) setZoneToOpen(alert.zone);
    setPage(alert.destination);
  };

  const handleAssistant = (type, value) => {
    if (type === 'simulate') {
      return scenarioImpact(Number(value) || 7);
    }
    return null;
  };

  const renderPage = () => {
    switch (page) {
      case 'documents':
        return <Documents projectState={projectState} onUpload={handleUpload} processing={processing} processed={processed} fileName={fileName} onReset={resetDemo} pipelineStep={pipelineStep} processingError={processingError} reviewState={reviewState} onReviewActivity={handleReviewActivity} onNavigate={setPage} />;
      case 'matching':
        return <Matching projectState={projectState} reviewState={reviewState} onStatusChange={handleReview} onNavigate={setPage} />;
      case 'risk':
        return <Risk projectState={projectState} selectedActivity={currentActivity} onSelectActivity={(item) => setSelectedActivity(item.name)} onNavigate={setPage} />;
      case 'timeline':
        return <Timeline projectState={projectState} onNavigate={setPage} />;
      case 'zones':
        return <Zones projectState={projectState} onNavigate={setPage} initialZone={zoneToOpen} />;
      case 'alerts':
        return <Alerts projectState={projectState} reviewState={reviewState} onAlert={handleAlert} />;
      case 'simulator':
        return <ScenarioSimulator onReset={resetDemo} />;
      case 'insights':
        return <Insights projectState={projectState} reviewState={reviewState} reportOpen={reportOpen} onOpenReport={() => setReportOpen(true)} onCloseReport={() => setReportOpen(false)} onNavigate={setPage} />;
      case 'demo':
        return <DemoControls onAssist={handleAssistant} onReset={resetDemo} />;
      default:
        return <Dashboard projectState={projectState} onNavigate={setPage} />;
    }
  };

  if (roleSelectionOpen) return <RoleSelection onSelect={(role) => { setActiveRole(role); setRoleSelectionOpen(false); setPage('dashboard'); }} />;
  if (activeRole === 'supervisor') return <SupervisorDashboard projectState={projectState} onSwitchRole={() => setRoleSelectionOpen(true)} />;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand-wrap">
          <div className="brand-mark"><HardHat size={20} /></div>
          <div>
            <strong>site<span>intel</span></strong>
            <small>PROJECT INTELLIGENCE</small>
          </div>
          <button className="close-sidebar" type="button" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>

        <div className="project-mini">
          <span>Active project</span>
          <strong>{projectName}</strong>
          <small>Prototype Demo Project • Assam</small>
          <div className="health-inline"><i /> <span>Health score</span> <b>72</b></div>
        </div>

        <nav>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={page === id ? 'active' : ''} type="button" onClick={() => { setPage(id); setMobileOpen(false); }}>
              <Icon size={18} />
              <span>{label}</span>
              {id === 'demo' && <i className="nav-dot">On</i>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className="live-dot" />
            <div>
              <strong>All systems operational</strong>
              <small>Last sync • 12 min ago</small>
            </div>
          </div>
          <button className="demo-button" type="button" onClick={resetDemo}><RefreshCw size={15} /> Reset Demo</button>
          <button className="switch-role-button pm-switch" type="button" onClick={() => setRoleSelectionOpen(true)}><UserRound size={15} /> Switch Role</button>
          <div className="user-mini">
            <div className="avatar">AM</div>
            <div>
              <strong>Arjun Mehta</strong>
              <small>Project Manager</small>
            </div>
            <ChevronRight size={15} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="menu-button" type="button" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumb">
            <span>Projects</span>
            <ChevronRight size={12} />
            <strong>{navItems.find((item) => item.id === page)?.label || 'Dashboard'}</strong>
          </div>
          <div className="global-project-context"><strong>{projectName}</strong><span>Health <b>72 / 100</b></span><span>Progress <b>68%</b></span><span>Risk <b className="risk-text">MEDIUM</b></span><i>DEMO MODE</i></div>
          <div className="top-actions">
            <span className="sync-label"><span className="live-dot" /> Synced 12m ago</span>
            <button className="icon-button notification" type="button" aria-label="Notifications"><Bell size={18} /><i /></button>
            <div className="top-avatar">AM</div>
          </div>
        </header>

        <div className="page-content">{renderPage()}</div>
      </main>
    </div>
  );
}

export default App;
