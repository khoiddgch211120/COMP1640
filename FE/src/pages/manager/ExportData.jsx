import { useState } from "react";
import {
  Card, Button, Select, Alert, Tag, Divider, Steps,
  Tooltip, Spin, message, Badge
} from "antd";
import {
  DownloadOutlined, FileZipOutlined, FileTextOutlined,
  LockOutlined, CalendarOutlined, CheckCircleOutlined,
  ClockCircleOutlined, InfoCircleOutlined, DatabaseOutlined
} from "@ant-design/icons";
import "../../styles/export-data.css";

const { Option } = Select;

/* ── Mock academic years – replace with Redux ── */
const ACADEMIC_YEARS = [
  { year_id: 1, year_label: "Academic Year 2023–2024", final_closure_date: "2024-05-31", idea_count: 248, attachment_count: 134 },
  { year_id: 2, year_label: "Academic Year 2022–2023", final_closure_date: "2023-05-31", idea_count: 191, attachment_count: 98  },
  { year_id: 3, year_label: "Academic Year 2024–2025", final_closure_date: "2025-05-31", idea_count: 87,  attachment_count: 42  },
];

/* ── Helper: is export allowed? ── */
const isExportAllowed = (year) => {
  if (!year) return false;
  const today = new Date();
  const closure = new Date(year.final_closure_date);
  return today > closure; // only after final_closure_date
};

/* ── Progress step states ── */
const STEP_IDLE     = "idle";
const STEP_LOADING  = "loading";
const STEP_DONE     = "done";

const ExportData = () => {
  const [selectedYearId, setSelectedYearId] = useState(null);
  const [csvStep,        setCsvStep]        = useState(STEP_IDLE);
  const [zipStep,        setZipStep]        = useState(STEP_IDLE);

  const selectedYear = ACADEMIC_YEARS.find((y) => y.year_id === selectedYearId) || null;
  // Export only allowed after final_closure_date — derived, no separate "closed" field needed
  const exportAllowed = isExportAllowed(selectedYear);

  /* ── Simulate CSV export ── */
  const handleExportCSV = async () => {
    if (!exportAllowed) return;
    setCsvStep(STEP_LOADING);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1800));

    // Create fake CSV blob
    const csvContent = [
      "id,title,department,submitted_by,submitted_at,category,comments_count",
      "1,Automate weekly reports,Engineering,Alice Johnson,2024-03-01,Technology Innovation,5",
      "2,Reduce paper usage,HR,Bob Smith,2024-02-20,Sustainability,3",
      "3,Flexible working hours,Operations,Carol White,2024-02-10,Employee Wellbeing,0",
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `ideas_year_${selectedYearId}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setCsvStep(STEP_DONE);
    message.success("CSV exported successfully!");
    setTimeout(() => setCsvStep(STEP_IDLE), 3000);
  };

  /* ── Simulate ZIP export ── */
  const handleExportZIP = async () => {
    if (!exportAllowed) return;
    setZipStep(STEP_LOADING);

    await new Promise((r) => setTimeout(r, 2400));

    // In real app: fetch blob from API, then trigger download
    message.success("ZIP archive downloaded successfully!");
    setZipStep(STEP_DONE);
    setTimeout(() => setZipStep(STEP_IDLE), 3000);
  };

  // Derive closed status from final_closure_date — no separate "closed" field in DB
  const YearStatusTag = ({ year }) => {
    const isClosed = new Date() > new Date(year.final_closure_date);
    return isClosed
      ? <Tag color="green" icon={<CheckCircleOutlined />}>Closed</Tag>
      : <Tag color="orange" icon={<ClockCircleOutlined />}>In Progress</Tag>;
  };

  return (
    <div className="exp-page">

      {/* ── Page header ── */}
      <div className="exp-page-header">
        <div className="exp-page-title-block">
          <DatabaseOutlined className="exp-page-icon" />
          <div>
            <h2 className="exp-page-title">Export Data</h2>
            <p className="exp-page-sub">Download ideas and attachments after final closure date</p>
          </div>
        </div>
      </div>

      {/* ── Info alert ── */}
      <Alert
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        className="exp-info-alert"
        message="Export Availability"
        description={
          <span>
            Both CSV and ZIP exports are <strong>only available after the academic year's final closure date</strong>.
            In-progress academic years cannot be exported until they are closed.
          </span>
        }
      />

      {/* ── Year selector ── */}
      <Card className="exp-selector-card">
        <div className="exp-selector-header">
          <CalendarOutlined className="exp-selector-icon" />
          <div>
            <p className="exp-selector-title">Select Academic Year</p>
            <p className="exp-selector-sub">Choose the year you want to export data from</p>
          </div>
        </div>

        <Select
          placeholder="Select an academic year..."
          value={selectedYearId}
          onChange={setSelectedYearId}
          style={{ width: "100%", maxWidth: 480 }}
          size="large"
          className="exp-year-select"
        >
          {ACADEMIC_YEARS.map((y) => (
            <Option key={y.year_id} value={y.year_id}>
              <div className="exp-year-option">
                <span className="exp-year-option-label">{y.year_label}</span>
                <YearStatusTag year={y} />
              </div>
            </Option>
          ))}
        </Select>

        {/* Year summary */}
        {selectedYear && (
          <div className="exp-year-summary">
            <div className="exp-year-stat">
              <span className="exp-year-stat-val">{selectedYear.idea_count}</span>
              <span className="exp-year-stat-key">Total Ideas</span>
            </div>
            <div className="exp-year-divider" />
            <div className="exp-year-stat">
              <span className="exp-year-stat-val">{selectedYear.attachment_count}</span>
              <span className="exp-year-stat-key">Attachments</span>
            </div>
            <div className="exp-year-divider" />
            <div className="exp-year-stat">
              <span className="exp-year-stat-val">{selectedYear.final_closure_date}</span>
              <span className="exp-year-stat-key">Final Closure</span>
            </div>
            <div className="exp-year-divider" />
            <div className="exp-year-stat">
              <YearStatusTag year={selectedYear} />
              <span className="exp-year-stat-key">Status</span>
            </div>
          </div>
        )}

        {/* Not yet closed warning */}
        {selectedYear && !exportAllowed && (
          <Alert
            type="warning"
            showIcon
            icon={<LockOutlined />}
            className="exp-locked-alert"
            message={`Export locked until ${selectedYear.final_closure_date}`}
            description="This academic year is still in progress. Export will be available after the final closure date."
          />
        )}
      </Card>

      {/* ── Export options ── */}
      <div className="exp-options-grid">

        {/* CSV Card */}
        <Card
          className={`exp-option-card ${!exportAllowed ? "exp-option-card--locked" : ""}`}
        >
          <div className="exp-option-icon-wrap exp-option-icon-csv">
            <FileTextOutlined />
          </div>
          <h3 className="exp-option-title">Export CSV</h3>
          <p className="exp-option-desc">
            Download all ideas and their comments as a structured CSV file.
            Includes idea title, department, author (with real identity for investigation), category, timestamps, and comment count.
          </p>

          <ul className="exp-feature-list">
            <li>✓ All ideas for selected year</li>
            <li>✓ All comments with real author names</li>
            <li>✓ Department & category breakdown</li>
            <li>✓ UTF-8 encoded, Excel-compatible</li>
          </ul>

          <Divider className="exp-divider" />

          <Tooltip title={!selectedYear ? "Select an academic year first" : !exportAllowed ? "Export locked — academic year not yet closed" : ""}>
            <Button
              type="primary"
              size="large"
              icon={csvStep === STEP_LOADING ? <Spin size="small" /> : csvStep === STEP_DONE ? <CheckCircleOutlined /> : <DownloadOutlined />}
              onClick={handleExportCSV}
              disabled={!exportAllowed || csvStep === STEP_LOADING}
              className={`exp-download-btn exp-download-btn--csv ${csvStep === STEP_DONE ? "exp-btn-done" : ""}`}
              block
            >
              {csvStep === STEP_LOADING ? "Preparing CSV…"
                : csvStep === STEP_DONE ? "Downloaded!"
                : "Download CSV"}
            </Button>
          </Tooltip>
        </Card>

        {/* ZIP Card */}
        <Card
          className={`exp-option-card ${!exportAllowed ? "exp-option-card--locked" : ""}`}
        >
          <div className="exp-option-icon-wrap exp-option-icon-zip">
            <FileZipOutlined />
          </div>
          <h3 className="exp-option-title">Export ZIP</h3>
          <p className="exp-option-desc">
            Download all uploaded attachments bundled into a single ZIP archive.
            Files are organised by idea ID for easy reference alongside the CSV export.
          </p>

          <ul className="exp-feature-list">
            <li>✓ All attachments for selected year</li>
            <li>✓ Organised by idea ID folder</li>
            <li>✓ Includes all file types (PDF, images…)</li>
            <li>✓ Compressed for fast download</li>
          </ul>

          <Divider className="exp-divider" />

          <Tooltip title={!selectedYear ? "Select an academic year first" : !exportAllowed ? "Export locked — academic year not yet closed" : ""}>
            <Button
              size="large"
              icon={zipStep === STEP_LOADING ? <Spin size="small" /> : zipStep === STEP_DONE ? <CheckCircleOutlined /> : <FileZipOutlined />}
              onClick={handleExportZIP}
              disabled={!exportAllowed || zipStep === STEP_LOADING}
              className={`exp-download-btn exp-download-btn--zip ${zipStep === STEP_DONE ? "exp-btn-done" : ""}`}
              block
            >
              {zipStep === STEP_LOADING ? "Packaging ZIP…"
                : zipStep === STEP_DONE ? "Downloaded!"
                : "Download ZIP"}
            </Button>
          </Tooltip>
        </Card>

      </div>

    </div>
  );
};

export default ExportData;