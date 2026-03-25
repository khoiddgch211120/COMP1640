import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spin, Table, Card, Statistic, Row, Col, Select, Button, message, Space } from "antd";
import { BarChartOutlined, FileExcelOutlined } from "@ant-design/icons";
import {
  getStatisticsReport,
  exportToCSV,
  exportAttachmentsAsZip,
} from "../../services/reportService";

const { Option } = Select;

const Statistics = () => {
  const academicYearState = useSelector((state) => state.academicYear);
  const academicYears = academicYearState?.items || [];

  const [selectedYearId, setSelectedYearId] = useState(null);
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);

  // Auto-select first year
  useEffect(() => {
    if (academicYears.length > 0 && !selectedYearId) {
      setSelectedYearId(academicYears[0].id);
    }
  }, [academicYears, selectedYearId]);

  // Fetch statistics
  useEffect(() => {
    if (selectedYearId) {
      fetchStatistics();
    }
  }, [selectedYearId, selectedDeptId]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const data = await getStatisticsReport(selectedYearId, selectedDeptId);
      setStatistics(data || []);
    } catch (error) {
      console.error("Error fetching statistics:", error);
message.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const currentYear = academicYears.find((y) => y.id === selectedYearId);
  const totalIdeas = statistics.reduce((sum, stat) => sum + stat.ideaCount, 0);
  const totalContributors = statistics.reduce(
    (sum, stat) => sum + stat.contributorCount,
    0
  );
  const topDept = statistics.length > 0 ? statistics[0] : null;

  // Table columns
  const columns = [
    {
      title: "Department",
      dataIndex: "deptName",
      key: "deptName",
      sorter: (a, b) => a.deptName.localeCompare(b.deptName),
    },
    {
      title: "Ideas",
      dataIndex: "ideaCount",
      key: "ideaCount",
      sorter: (a, b) => a.ideaCount - b.ideaCount,
      align: "center",
      render: (count) => <strong>{count}</strong>,
    },
    {
      title: "% of Total",
      dataIndex: "percentageOfTotal",
      key: "percentageOfTotal",
      sorter: (a, b) => a.percentageOfTotal - b.percentageOfTotal,
      align: "center",
      render: (percentage) => `${percentage}%`,
    },
    {
      title: "Contributors",
      dataIndex: "contributorCount",
      key: "contributorCount",
      sorter: (a, b) => a.contributorCount - b.contributorCount,
      align: "center",
      render: (count) => <strong>{count}</strong>,
    },
  ];

  const handleExportCSV = async () => {
    try {
      await exportToCSV(selectedYearId);
      message.success("CSV exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      message.error("Failed to export CSV");
    }
  };

  const handleExportZip = async () => {
    try {
      await exportAttachmentsAsZip(selectedYearId);
      message.success("ZIP exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      message.error("Failed to export ZIP");
    }
  };

  return (
    <Spin spinning={loading}>
      <div style={{ padding: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px" }}>
          <BarChartOutlined style={{ marginRight: "8px" }} />
          System Statistics
        </h1>
        <p style={{ color: "#64748b", marginBottom: "24px" }}>
          Overview of idea contributions by department
        </p>

        {/* Year & Department Selection */}
        <Card style={{ marginBottom: "24px" }}>
          <Space size="large" wrap>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>
                Academic Year
              </label>
              <Select
                value={selectedYearId}
                onChange={setSelectedYearId}
                style={{ width: "200px" }}
                placeholder="Select Year"
              >
                {academicYears.map((year) => (
                  <Option key={year.id} value={year.id}>
                    {year.yearLabel}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>
                Department Filter (Optional)
              </label>
              <Select
                value={selectedDeptId}
                onChange={setSelectedDeptId}
                style={{ width: "200px" }}
                placeholder="All Departments"
                allowClear
              >
                {Array.from(
                  new Set(statistics.map((s) => s.deptName))
                ).map((dept) => (
                  <Option key={dept} value={dept}>
                    {dept}
                  </Option>
                ))}
              </Select>
            </div>
          </Space>
        </Card>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Total Ideas"
                value={totalIdeas}
                prefix={<BarChartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Departments Involved"
                value={statistics.length}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Total Contributors"
                value={totalContributors}
              />
            </Card>
          </Col>
        </Row>

        {/* Department Statistics Table */}
        <Card style={{ marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "600" }}>
            Statistics by Department
          </h3>
          <Table
            columns={columns}
            dataSource={statistics}
            rowKey="deptId"
            pagination={{ pageSize: 10 }}
            loading={loading}
          />
        </Card>

        {/* Export Buttons */}
        <Space>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={handleExportCSV}
            disabled={totalIdeas === 0}
          >
            Export Ideas & Comments CSV
          </Button>
          <Button
            type="default"
            onClick={handleExportZip}
            disabled={totalIdeas === 0}
          >
            Export Attachments ZIP
          </Button>
        </Space>
      </div>
    </Spin>
  );
};

export default Statistics;