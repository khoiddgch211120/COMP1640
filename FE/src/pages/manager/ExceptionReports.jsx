import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table, Tabs, Tag, Card, Avatar, Tooltip, Badge, Button,
  Input, Select, Empty, Modal, Descriptions, Divider, Spin, message
} from "antd";
import {
  WarningOutlined, MessageOutlined, EyeInvisibleOutlined,
  UserOutlined, SearchOutlined, CalendarOutlined, FilterOutlined,
  EyeOutlined, ExclamationCircleOutlined
} from "@ant-design/icons";
import { getIdeasWithoutComments, getAnonymousContent } from "../../services/reportService";
import "../../styles/exception-reports.css";

const { TabPane } = Tabs;
const { Option } = Select;

/* ── Sub-components ── */
const DaysOpenBadge = ({ date }) => {
  const submitted = new Date(date);
  const today = new Date();
  const daysOpen = Math.floor((today - submitted) / (1000 * 60 * 60 * 24));
  const color = daysOpen > 60 ? "red" : daysOpen > 30 ? "orange" : "green";
  const label = daysOpen > 60 ? "Overdue" : daysOpen > 30 ? "Pending" : "Recent";
  return (
    <Tag color={color} className="exc-days-tag">
      {daysOpen}d &bull; {label}
    </Tag>
  );
};

/* ── Main Component ── */
const ExceptionReports = () => {
  const academicYearState = useSelector((state) => state.academicYear);
  const academicYears = academicYearState?.items || [];
  const [selectedYearId, setSelectedYearId] = useState(null);

  const [noCommentIdeas, setNoCommentIdeas] = useState([]);
  const [anonymousContents, setAnonymousContents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [noCommentSearch, setNoCommentSearch] = useState("");
  const [noCommentDept, setNoCommentDept] = useState("All");
  const [anonSearch, setAnonSearch] = useState("");
  const [detailModal, setDetailModal] = useState(null);

  // Auto-select first year
  useEffect(() => {
    if (academicYears.length > 0 && !selectedYearId) {
      setSelectedYearId(academicYears[0].id);
    }
  }, [academicYears, selectedYearId]);

  // Fetch data when year changes
  useEffect(() => {
    if (selectedYearId) {
      fetchData();
    }
  }, [selectedYearId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [noCommentData, anonymousData] = await Promise.all([
        getIdeasWithoutComments(selectedYearId),
        getAnonymousContent(selectedYearId)
      ]);
      setNoCommentIdeas(noCommentData || []);
      setAnonymousContents(anonymousData || []);
    } catch (error) {
      console.error("Error fetching exception reports:", error);
      message.error("Failed to load exception reports");
    } finally {
      setLoading(false);
    }
  };

  // Get unique departments from data
  const departments = Array.from(
    new Set(noCommentIdeas.map((i) => i.deptName).filter(Boolean))
  );

  /* ── No-comment filtered ── */
  const filteredNoComment = noCommentIdeas.filter((i) => {
    const matchSearch =
      i.title.toLowerCase().includes(noCommentSearch.toLowerCase()) ||
      (i.authorName &&
        i.authorName.toLowerCase().includes(noCommentSearch.toLowerCase()));
    const matchDept = noCommentDept === "All" || i.deptName === noCommentDept;
    return matchSearch && matchDept;
  });

  /* ── Anonymous filtered ── */
  const filteredAnon = anonymousContents.filter((item) =>
    item.contentPreview.toLowerCase().includes(anonSearch.toLowerCase())
  );

  /* ── No-comment columns ── */
  const noCommentColumns = [
    {
      title: "Idea",
      dataIndex: "title",
      key: "title",
      render: (title) => (
        <div className="exc-idea-cell">
          <span className="exc-idea-title">{title}</span>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "deptName",
      key: "deptName",
      width: 160,
      render: (d) => <span className="exc-dept">{d}</span>,
    },
    {
      title: "Submitted By",
      dataIndex: "authorName",
      key: "authorName",
      width: 160,
      render: (name, record) => (
        <div className="exc-author-cell">
          <Avatar size={26} icon={<UserOutlined />} className="exc-author-avatar" />
          <span className="exc-author-name">
            {record.isAnonymous ? "Anonymous" : name}
          </span>
        </div>
      ),
    },
    {
      title: "Submitted",
      dataIndex: "submittedAt",
      key: "submittedAt",
      width: 120,
      render: (d) => (
        <span className="exc-date">
          <CalendarOutlined style={{ marginRight: 4 }} />
          {new Date(d).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Time Open",
      dataIndex: "submittedAt",
      key: "submittedAt",
      width: 130,
      render: (date) => <DaysOpenBadge date={date} />,
    },
  ];

  /* ── Anonymous columns ── */
  const anonColumns = [
    {
      title: "Type",
      dataIndex: "contentType",
      key: "contentType",
      width: 80,
      render: (type) => (
        <Tag color={type === "IDEA" ? "blue" : "cyan"}>
          {type}
        </Tag>
      ),
    },
    {
      title: "Content",
      dataIndex: "contentPreview",
      key: "contentPreview",
      render: (text) => (
        <span className="exc-content-preview" title={text}>
          {text.length > 80 ? text.slice(0, 80) + "…" : text}
        </span>
      ),
    },
    {
      title: "Real Author",
      dataIndex: "authorRealName",
      key: "authorRealName",
      width: 140,
      render: (name) => (
        <div className="exc-author-cell">
          <Avatar size={24} icon={<UserOutlined />} className="exc-author-avatar" />
          <span className="exc-author-name">{name}</span>
        </div>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (d) => new Date(d).toLocaleDateString(),
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (date) => <DaysOpenBadge date={date} />,
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="exc-page">
        {/* ── Page header ── */}
        <div className="exc-page-header">
          <div className="exc-page-title-block">
            <WarningOutlined className="exc-page-icon" />
            <div>
              <h2 className="exc-page-title">Exception Reports</h2>
              <p className="exc-page-sub">
                {selectedYearId && academicYears.find((y) => y.id === selectedYearId)
                  ? `Academic Year: ${academicYears.find((y) => y.id === selectedYearId).yearLabel}`
                  : "Select an academic year"}
              </p>
            </div>
          </div>
          <Select
            value={selectedYearId || undefined}
            onChange={setSelectedYearId}
            placeholder="Select Academic Year"
            style={{ width: 200 }}
          >
            {academicYears.map((year) => (
              <Option key={year.id} value={year.id}>
                {year.yearLabel}
              </Option>
            ))}
          </Select>
        </div>

        {/* ── Alert banners ── */}
        <div className="exc-alert-row">
          <div className="exc-alert exc-alert-orange">
            <MessageOutlined />
            <span>
              <strong>{noCommentIdeas.length}</strong> ideas have received no
              comments since submission
            </span>
          </div>
          <div className="exc-alert exc-alert-violet">
            <EyeInvisibleOutlined />
            <span>
              <strong>{anonymousContents.length}</strong> ideas or comments were
              submitted anonymously
            </span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <Card className="exc-card">
          <Tabs defaultActiveKey="no-comment" className="exc-tabs">
            {/* ── Tab 1: No comments ── */}
            <TabPane
              tab={
                <span className="exc-tab-label">
                  <MessageOutlined className="exc-tab-icon" />
                  No Comments
                  <Badge
                    count={noCommentIdeas.length}
                    color="#ea580c"
                    style={{ marginLeft: 8 }}
                  />
                </span>
              }
              key="no-comment"
            >
              <div className="exc-filter-row">
                <Input
                  placeholder="Search by title or author..."
                  prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                  value={noCommentSearch}
                  onChange={(e) => setNoCommentSearch(e.target.value)}
                  allowClear
                  className="exc-search-input"
                />
                <Select
                  value={noCommentDept}
                  onChange={setNoCommentDept}
                  style={{ width: 180 }}
                >
                  <Option value="All">All Departments</Option>
                  {["All", ...departments].map((d) => (
                    <Option key={d} value={d}>
                      {d}
                    </Option>
                  ))}
                </Select>
              </div>

              <Table
                columns={noCommentColumns}
                dataSource={filteredNoComment}
                rowKey="ideaId"
                pagination={{ pageSize: 8, showSizeChanger: false }}
                locale={{
                  emptyText: <Empty description="No ideas without comments 🎉" />,
                }}
                className="exc-table"
              />
            </TabPane>

            {/* ── Tab 2: Anonymous content ── */}
            <TabPane
              tab={
                <span className="exc-tab-label">
                  <EyeInvisibleOutlined className="exc-tab-icon" />
                  Anonymous Content
                  <Badge
                    count={anonymousContents.length}
                    color="#7c3aed"
                    style={{ marginLeft: 8 }}
                  />
                </span>
              }
              key="anonymous"
            >
              <div className="exc-filter-row">
                <Input
                  placeholder="Search anonymous content..."
                  prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                  value={anonSearch}
                  onChange={(e) => setAnonSearch(e.target.value)}
                  allowClear
                  className="exc-search-input"
                />
              </div>

              <Table
                columns={anonColumns}
                dataSource={filteredAnon}
                rowKey={(record) => record.contentId}
                pagination={{ pageSize: 8, showSizeChanger: false }}
                locale={{
                  emptyText: <Empty description="No anonymous content found" />,
                }}
                className="exc-table"
              />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </Spin>
  );
};

export default ExceptionReports;