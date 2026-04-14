import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Spin, Table, Select, message, Alert } from "antd";
import {
  BarChartOutlined,
  FileExcelOutlined,
  FolderOpenOutlined,
  TeamOutlined,
  BulbOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { ROLES } from "../../constants/roles";
import { getAcademicYears } from "../../services/academicYearService";
import { getStatisticsReport, exportToCSV, exportAttachmentsAsZip } from "../../services/reportService";
import "../../styles/statistics.css";

const { Option } = Select;
const FULL_ACCESS_ROLES = [ROLES.ADMIN, ROLES.QA_MANAGER];

const Statistics = () => {
  const user = useSelector((state) => state.auth.user);
  const hasFullAccess = FULL_ACCESS_ROLES.includes(user?.role);

  // Match the exact 'departmentId' field from the user object
  const userDeptId = user?.departmentId || user?.deptId || user?.department_id || null;
  const userDeptName = user?.deptName || user?.role || "Department";

  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState(null);
  const [statistics, setStatistics] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [fetchingYears, setFetchingYears] = useState(true);

  // selectedDeptId: Default to userDeptId if not Admin
  const [selectedDeptId, setSelectedDeptId] = useState(hasFullAccess ? null : userDeptId);

  // Update selectedDeptId if userDeptId was initially null due to slow loading
  useEffect(() => {
    if (!hasFullAccess && userDeptId && !selectedDeptId) {
      setSelectedDeptId(userDeptId);
    }
  }, [userDeptId, hasFullAccess, selectedDeptId]);

  // Load Years
  useEffect(() => {
    const fetchYears = async () => {
      setFetchingYears(true);
      try {
        const data = await getAcademicYears();
        setAcademicYears(data ?? []);
        if (data?.length > 0) setSelectedYearId(data[0].yearId);
      } catch { message.error("Failed to load years"); }
      finally { setFetchingYears(false); }
    };
    fetchYears();
  }, []);

  // Load Data Report
  useEffect(() => {
    if (!selectedYearId) return;
    
    // If non-admin user and dept ID not yet loaded, skip API call
    if (!hasFullAccess && !userDeptId) return;

    const fetchReport = async () => {
      setLoading(true);
      try {
        const deptIdToFetch = hasFullAccess ? selectedDeptId : userDeptId;
        const data = await getStatisticsReport(selectedYearId, deptIdToFetch);
        setStatistics(data ?? []);
      } catch { message.error("Failed to load statistics"); }
      finally { setLoading(false); }
    };
    fetchReport();
  }, [selectedYearId, selectedDeptId, hasFullAccess, userDeptId]);

  /* ─── DATA FILTERING LOGIC (Show single row for Manager) ─── */
  const filteredData = useMemo(() => {
    if (!statistics || statistics.length === 0) return [];

    if (hasFullAccess) {
      if (!selectedDeptId) return statistics; 
      // Flexible ID field comparison across the returned array
      return statistics.filter(s => String(s.deptId || s.dept_id || s.departmentId) === String(selectedDeptId));
    }

    // For non-admin: Show only own department's row
    // String() to avoid type mismatch when comparing 1 (number) with "1" (string)
    return statistics.filter(s => String(s.deptId || s.dept_id || s.departmentId) === String(userDeptId));
  }, [statistics, hasFullAccess, selectedDeptId, userDeptId]);

  const totalIdeas = filteredData.reduce((s, d) => s + (d.ideaCount || d.idea_count || 0), 0);
  const totalContributors = filteredData.reduce((s, d) => s + (d.contributorCount || d.contributor_count || 0), 0);

  const columns = [
    { 
      title: "Department", 
      dataIndex: "deptName", 
      key: "deptName",
      render: (text, record) => text || record.dept_name 
    },
    { title: "Ideas", dataIndex: "ideaCount", key: "ideaCount", align: "center", render: (v, record) => <strong>{v ?? record.idea_count}</strong> },
    { title: "Contributors", dataIndex: "contributorCount", key: "contributorCount", align: "center", render: (v, record) => v ?? record.contributor_count },
    { title: "% of Total", dataIndex: "percentageOfTotal", key: "percentageOfTotal", align: "center", render: (v, record) => `${v ?? record.percentage_of_total}%` },
  ];

  return (
    <Spin spinning={fetchingYears}>
      <div className="stats-page">
        {/* ── Header ── */}
        <div className="stats-header">
          <div className="stats-header-left">
            <h1>
              <BarChartOutlined />
              System Statistics
            </h1>
            <p>
              {hasFullAccess
                ? "University-wide idea analytics and department performance"
                : `Department Dashboard — ${userDeptName}`}
            </p>
          </div>
          <span className="stats-header-badge">
            <EyeOutlined />
            {hasFullAccess ? "Full Access" : "Department View"}
          </span>
        </div>

        {/* Warning: Only show when dept ID truly not found after loading */}
        {!hasFullAccess && !userDeptId && !fetchingYears && (
          <Alert
            message="Error: Department ID not found"
            description="Your account is not linked to any department. Please contact Admin."
            type="error"
            showIcon
          />
        )}

        {/* ── Filter Bar ── */}
        <div className="stats-filter-bar">
          <div>
            <label>Academic Year:</label>
            <Select value={selectedYearId} onChange={setSelectedYearId} style={{ width: 160 }}>
              {academicYears.map((y) => (
                <Option key={y.yearId} value={y.yearId}>
                  {y.yearLabel}
                </Option>
              ))}
            </Select>
          </div>

          {hasFullAccess && (
            <div>
              <label>Department:</label>
              <Select
                value={selectedDeptId}
                onChange={setSelectedDeptId}
                style={{ width: 220 }}
                placeholder="All Departments"
                allowClear
              >
                {statistics.map((s) => (
                  <Option key={s.deptId || s.dept_id} value={s.deptId || s.dept_id}>
                    {s.deptName || s.dept_name}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {hasFullAccess && (
            <div className="stats-export-btns" style={{ marginLeft: "auto" }}>
              <button
                className="stats-export-btn stats-export-btn--primary"
                onClick={async () => {
                  try {
                    await exportToCSV(selectedYearId);
                    message.success("CSV exported successfully");
                  } catch {
                    message.error("Failed to export CSV");
                  }
                }}
              >
                <FileExcelOutlined /> Export CSV
              </button>
              <button
                className="stats-export-btn"
                onClick={async () => {
                  try {
                    await exportAttachmentsAsZip(selectedYearId);
                    message.success("Attachments exported successfully");
                  } catch {
                    message.error("Failed to export attachments");
                  }
                }}
              >
                <FolderOpenOutlined /> Export Attachments
              </button>
            </div>
          )}
        </div>

        {/* ── Stat Cards ── */}
        <div className="stats-cards-row">
          <div className="stats-card">
            <div className="stats-card-icon stats-card-icon--blue">
              <BulbOutlined />
            </div>
            <div className="stats-card-body">
              <div className="stats-card-label">Total Ideas</div>
              <div className="stats-card-value">{totalIdeas}</div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-card-icon stats-card-icon--green">
              <TeamOutlined />
            </div>
            <div className="stats-card-body">
              <div className="stats-card-label">Contributors</div>
              <div className="stats-card-value">{totalContributors}</div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-card-icon stats-card-icon--purple">
              <EyeOutlined />
            </div>
            <div className="stats-card-body">
              <div className="stats-card-label">Departments</div>
              <div className="stats-card-value">{filteredData.length}</div>
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="stats-table-card">
          <div className="stats-table-head">
            <span className="stats-table-title">
              <BarChartOutlined /> Department Breakdown
            </span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              {filteredData.length} {filteredData.length === 1 ? "department" : "departments"}
            </span>
          </div>
          <div className="stats-table-body">
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey={(record) => record.deptId || record.dept_id}
              loading={loading}
              pagination={hasFullAccess ? { pageSize: 10 } : false}
            />
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default Statistics;