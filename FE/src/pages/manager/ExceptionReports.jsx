import { useEffect, useState } from "react";
import {
  Table, Tabs, Tag, Card, Avatar, Badge, Button,
  Input, Select, Empty, Spin, message,
} from "antd";
import {
  WarningOutlined, MessageOutlined, EyeInvisibleOutlined,
  UserOutlined, SearchOutlined, CalendarOutlined,
} from "@ant-design/icons";
import { getAcademicYears } from "../../services/academicYearService";
import { getIdeasWithoutComments, getAnonymousContent } from "../../services/reportService";
import "../../styles/exception-reports.css";

const { TabPane } = Tabs;
const { Option }  = Select;

/* ═══════════════════════════════════════════════════════════ */

const DaysOpenBadge = ({ date }) => {
  const daysOpen = Math.floor((new Date() - new Date(date)) / 86400000);
  const color = daysOpen > 60 ? "red" : daysOpen > 30 ? "orange" : "green";
  const label = daysOpen > 60 ? "Overdue" : daysOpen > 30 ? "Pending" : "Recent";
  return <Tag color={color} className="exc-days-tag">{daysOpen}d &bull; {label}</Tag>;
};

const ExceptionReports = () => {
  const [academicYears,     setAcademicYears]     = useState([]);
  const [selectedYearId,    setSelectedYearId]    = useState(null);
  const [noCommentIdeas,    setNoCommentIdeas]    = useState([]);
  const [anonymousContents, setAnonymousContents] = useState([]);
  const [loading,           setLoading]           = useState(false);
  const [fetchingYears,     setFetchingYears]     = useState(true);
  const [noCommentSearch,   setNoCommentSearch]   = useState("");
  const [noCommentDept,     setNoCommentDept]     = useState("All");
  const [anonSearch,        setAnonSearch]        = useState("");

  /* ── Load academic years ─────────────────────────────────── */
  useEffect(() => {
    const fetch = async () => {
      setFetchingYears(true);
      try {
        const data = await getAcademicYears();
        setAcademicYears(data ?? []);
        if (data?.length > 0) setSelectedYearId(data[0].yearId);
      } catch {
        message.error("Failed to load academic years");
      } finally {
        setFetchingYears(false);
      }
    };
    fetch();
  }, []);

  /* ── Reload reports when year changes ──────────────────── */
  useEffect(() => {
    if (!selectedYearId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const [noComment, anon] = await Promise.all([
          getIdeasWithoutComments(selectedYearId),
          getAnonymousContent(selectedYearId),
        ]);
        setNoCommentIdeas(noComment ?? []);
        setAnonymousContents(anon    ?? []);
      } catch {
        message.error("Failed to load exception reports");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [selectedYearId]);

  const departments = [...new Set(noCommentIdeas.map((i) => i.deptName).filter(Boolean))];

  const filteredNoComment = noCommentIdeas.filter((i) => {
    const matchSearch = i.title.toLowerCase().includes(noCommentSearch.toLowerCase());
    const matchDept   = noCommentDept === "All" || i.deptName === noCommentDept;
    return matchSearch && matchDept;
  });

  const filteredAnon = anonymousContents.filter((item) =>
    (item.contentPreview ?? "").toLowerCase().includes(anonSearch.toLowerCase())
  );

  const noCommentColumns = [
    {
      title: "Idea",
      dataIndex: "title",
      key: "title",
      render: (title) => <span className="exc-idea-title">{title}</span>,
    },
    {
      title: "Department",
      dataIndex: "deptName",
      key: "deptName",
      width: 160,
      render: (d) => <span className="exc-dept">{d}</span>,
    },
    {
      title: "Submitted",
      dataIndex: "submittedAt",
      key: "submittedAt",
      width: 120,
      render: (d) => (
        <span className="exc-date">
          <CalendarOutlined style={{ marginRight: 4 }} />
          {d ? new Date(d).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      title: "Time Open",
      dataIndex: "submittedAt",
      key: "timeOpen",
      width: 130,
      render: (date) => date ? <DaysOpenBadge date={date} /> : "—",
    },
  ];

  const anonColumns = [
    {
      title: "Type",
      dataIndex: "contentType",
      key: "contentType",
      width: 90,
      render: (type) => (
        <Tag color={type === "IDEA" ? "blue" : "cyan"}>{type}</Tag>
      ),
    },
    {
      title: "Content",
      dataIndex: "contentPreview",
      key: "contentPreview",
      render: (text) => (
        <span className="exc-content-preview" title={text}>
          {(text ?? "").length > 80 ? text.slice(0, 80) + "…" : text}
        </span>
      ),
    },
    {
      title: "Real Author",
      dataIndex: "authorRealName",
      key: "authorRealName",
      width: 150,
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
      render: (d) => d ? new Date(d).toLocaleDateString() : "—",
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "time",
      width: 130,
      render: (date) => date ? <DaysOpenBadge date={date} /> : "—",
    },
  ];

  const currentYearLabel = academicYears.find((y) => y.yearId === selectedYearId)?.yearLabel ?? "";

  return (
    <Spin spinning={fetchingYears || loading}>
      <div className="exc-page">
        <div className="exc-page-header">
          <div className="exc-page-title-block">
            <WarningOutlined className="exc-page-icon" />
            <div>
              <h2 className="exc-page-title">
                Exception Reports
              </h2>
              <p className="exc-page-sub">
                {currentYearLabel ? `Academic Year: ${currentYearLabel}` : "Select an academic year"}
              </p>
            </div>
          </div>
          <Select
            value={selectedYearId}
            onChange={setSelectedYearId}
            placeholder="Select Academic Year"
            style={{ width: 220 }}
          >
            {academicYears.map((y) => (
              <Option key={y.yearId} value={y.yearId}>{y.yearLabel}</Option>
            ))}
          </Select>
        </div>

        <div className="exc-alert-row">
          <div className="exc-alert exc-alert-orange">
            <MessageOutlined />
            <span><strong>{noCommentIdeas.length}</strong> ideas have received no comments</span>
          </div>
          <div className="exc-alert exc-alert-violet">
            <EyeInvisibleOutlined />
            <span><strong>{anonymousContents.length}</strong> ideas or comments submitted anonymously</span>
          </div>
        </div>

        <Card className="exc-card">
          <Tabs defaultActiveKey="no-comment" className="exc-tabs">
            <TabPane
              tab={
                <span className="exc-tab-label">
                  <MessageOutlined className="exc-tab-icon" />
                  No Comments
                  <Badge count={noCommentIdeas.length} color="#ea580c" style={{ marginLeft: 8 }} />
                </span>
              }
              key="no-comment"
            >
              <div className="exc-filter-row">
                <Input
                  placeholder="Search by title..."
                  prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                  value={noCommentSearch}
                  onChange={(e) => setNoCommentSearch(e.target.value)}
                  allowClear className="exc-search-input"
                />
                <Select value={noCommentDept} onChange={setNoCommentDept} style={{ width: 180 }}>
                  <Option value="All">All Departments</Option>
                  {departments.map((d) => <Option key={d} value={d}>{d}</Option>)}
                </Select>
              </div>
              <Table
                columns={noCommentColumns}
                dataSource={filteredNoComment}
                rowKey="ideaId"
                pagination={{ pageSize: 8, showSizeChanger: false }}
                locale={{ emptyText: <Empty description="No ideas without comments 🎉" /> }}
                className="exc-table"
              />
            </TabPane>

            <TabPane
              tab={
                <span className="exc-tab-label">
                  <EyeInvisibleOutlined className="exc-tab-icon" />
                  Anonymous Content
                  <Badge count={anonymousContents.length} color="#7c3aed" style={{ marginLeft: 8 }} />
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
                  allowClear className="exc-search-input"
                />
              </div>
              <Table
                columns={anonColumns}
                dataSource={filteredAnon}
                rowKey="contentId"
                pagination={{ pageSize: 8, showSizeChanger: false }}
                locale={{ emptyText: <Empty description="No anonymous content found" /> }}
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