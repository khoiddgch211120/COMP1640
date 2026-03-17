import { useState } from "react";
import {
  Table, Tabs, Tag, Card, Avatar, Tooltip, Badge, Button,
  Input, Select, Empty, Modal, Descriptions, Divider
} from "antd";
import {
  WarningOutlined, MessageOutlined, EyeInvisibleOutlined,
  UserOutlined, SearchOutlined, CalendarOutlined, FilterOutlined,
  EyeOutlined, ExclamationCircleOutlined
} from "@ant-design/icons";
import "../../styles/exception-reports.css";

const { TabPane } = Tabs;
const { Option } = Select;

/* ── Mock data ── */
const NO_COMMENT_IDEAS = [
  {
    idea_id: 1,
    title: "Automate weekly report generation",
    dept_name: "Engineering",
    full_name: "Alice Johnson",
    submitted_at: "2024-03-01",
    days_open: 42,
    category_name: "Technology Innovation",
  },
  {
    idea_id: 2,
    title: "Reduce paper usage in HR processes",
    dept_name: "Human Resources",
    full_name: "Bob Smith",
    submitted_at: "2024-02-20",
    days_open: 51,
    category_name: "Sustainability",
  },
  {
    idea_id: 3,
    title: "Introduce flexible working hours",
    dept_name: "Operations",
    full_name: "Carol White",
    submitted_at: "2024-02-10",
    days_open: 61,
    category_name: "Employee Wellbeing",
  },
  {
    idea_id: 4,
    title: "Implement peer review for design decisions",
    dept_name: "Engineering",
    full_name: "David Lee",
    submitted_at: "2024-01-28",
    days_open: 74,
    category_name: "Process Improvement",
  },
  {
    idea_id: 5,
    title: "Customer feedback loop improvement",
    dept_name: "Marketing",
    full_name: "Eva Turner",
    submitted_at: "2024-01-15",
    days_open: 87,
    category_name: "Customer Experience",
  },
];

const ANONYMOUS_IDEAS = [
  {
    idea_id: 101,
    title: "Management communication is lacking clarity",
    content:
      "Meeting agendas are rarely shared in advance, making it hard to prepare. Consider a 24-hour notice policy for all recurring meetings.",
    submitted_at: "2024-03-05",
    days_open: 38,
    category_name: "Process Improvement",
    comments: [
      { full_name: "Anonymous", content: "Fully agree. Noticed this in our team too.", is_anonymous: true, created_at: "2024-03-06" },
      { full_name: "Carol White", content: "Happy to help draft the policy.", is_anonymous: false, created_at: "2024-03-07" },
    ],
  },
  {
    idea_id: 102,
    title: "Salary transparency within departments",
    content:
      "Some employees feel uncertain about pay equity. Publishing salary bands per role and level would help build trust.",
    submitted_at: "2024-02-28",
    days_open: 44,
    category_name: "Employee Wellbeing",
    comments: [
      { full_name: "Anonymous", content: "This is a sensitive but important topic.", is_anonymous: true, created_at: "2024-03-01" },
    ],
  },
  {
    idea_id: 103,
    title: "Bias in performance evaluations",
    content:
      "Evaluation criteria appear inconsistently applied across teams. A standardised rubric with examples would make results fairer.",
    submitted_at: "2024-02-14",
    days_open: 57,
    category_name: "Process Improvement",
    comments: [],
  },
  {
    idea_id: 104,
    title: "Improve onboarding for remote hires",
    content:
      "Remote employees miss informal introductions and early culture cues. A dedicated 30-day virtual onboarding track could fix this.",
    submitted_at: "2024-01-30",
    days_open: 72,
    category_name: "Employee Wellbeing",
    comments: [
      { full_name: "Anonymous", content: "Experienced this as a remote hire last year.", is_anonymous: true, created_at: "2024-02-01" },
      { full_name: "Alice Johnson", content: "We have resources we can adapt.", is_anonymous: false, created_at: "2024-02-02" },
      { full_name: "Anonymous", content: "Would love to join a working group on this.", is_anonymous: true, created_at: "2024-02-05" },
    ],
  },
];

const DEPT_OPTIONS = ["All", "Engineering", "Human Resources", "Marketing", "Operations", "Finance"];

/* ── Sub-components ── */
const DaysOpenBadge = ({ days }) => {
  const color = days > 60 ? "red" : days > 30 ? "orange" : "green";
  const label = days > 60 ? "Overdue" : days > 30 ? "Pending" : "Recent";
  return (
    <Tag color={color} className="exc-days-tag">
      {days}d &bull; {label}
    </Tag>
  );
};

/* ── Main Component ── */
const ExceptionReports = () => {
  const [noCommentSearch,  setNoCommentSearch]  = useState("");
  const [noCommentDept,    setNoCommentDept]    = useState("All");
  const [anonSearch,       setAnonSearch]       = useState("");
  const [detailModal,      setDetailModal]      = useState(null);

  /* ── No-comment filtered ── */
  const filteredNoComment = NO_COMMENT_IDEAS.filter((i) => {
    const matchSearch = i.title.toLowerCase().includes(noCommentSearch.toLowerCase()) ||
                        i.full_name.toLowerCase().includes(noCommentSearch.toLowerCase());
    const matchDept   = noCommentDept === "All" || i.dept_name === noCommentDept;
    return matchSearch && matchDept;
  });

  /* ── Anonymous filtered ── */
  const filteredAnon = ANONYMOUS_IDEAS.filter((i) =>
    i.title.toLowerCase().includes(anonSearch.toLowerCase()) ||
    i.content.toLowerCase().includes(anonSearch.toLowerCase())
  );

  /* ── No-comment columns ── */
  const noCommentColumns = [
    {
      title: "Idea",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div className="exc-idea-cell">
          <span className="exc-idea-title">{title}</span>
          <Tag className="exc-category-tag">{record.category_name}</Tag>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "dept_name",
      key: "dept_name",
      width: 160,
      render: (d) => <span className="exc-dept">{d}</span>,
    },
    {
      title: "Submitted By",
      dataIndex: "full_name",
      key: "full_name",
      width: 160,
      render: (name) => (
        <div className="exc-author-cell">
          <Avatar size={26} icon={<UserOutlined />} className="exc-author-avatar" />
          <span className="exc-author-name">{name}</span>
        </div>
      ),
    },
    {
      title: "Submitted",
      dataIndex: "submitted_at",
      key: "submitted_at",
      width: 120,
      render: (d) => <span className="exc-date"><CalendarOutlined style={{ marginRight: 4 }} />{d}</span>,
    },
    {
      title: "Time Open",
      dataIndex: "days_open",
      key: "days_open",
      width: 130,
      sorter: (a, b) => a.days_open - b.days_open,
      defaultSortOrder: "descend",
      render: (days) => <DaysOpenBadge days={days} />,
    },
  ];

  /* ── Anonymous columns ── */
  const anonColumns = [
    {
      title: "Idea",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div className="exc-idea-cell">
          <span className="exc-idea-title">{title}</span>
          <Tag className="exc-category-tag">{record.category_name}</Tag>
        </div>
      ),
    },
    {
      title: "Preview",
      dataIndex: "content",
      key: "content",
      render: (text) => (
        <span className="exc-content-preview">
          {text.length > 80 ? text.slice(0, 80) + "…" : text}
        </span>
      ),
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      width: 110,
      render: (comments) => (
        <Badge count={comments.length} showZero color={comments.length > 0 ? "#2563eb" : "#94a3b8"}>
          <Tag icon={<MessageOutlined />} className="exc-comment-tag">
            {comments.length}
          </Tag>
        </Badge>
      ),
    },
    {
      title: "Time Open",
      dataIndex: "days_open",
      key: "days_open",
      width: 130,
      sorter: (a, b) => a.days_open - b.days_open,
      defaultSortOrder: "descend",
      render: (days) => <DaysOpenBadge days={days} />,
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Tooltip title="View details & comments">
          <Button
            type="text"
            icon={<EyeOutlined />}
            className="exc-view-btn"
            onClick={() => setDetailModal(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="exc-page">

      {/* ── Page header ── */}
      <div className="exc-page-header">
        <div className="exc-page-title-block">
          <WarningOutlined className="exc-page-icon" />
          <div>
            <h2 className="exc-page-title">Exception Reports</h2>
            <p className="exc-page-sub">Ideas requiring attention from QA Manager</p>
          </div>
        </div>
      </div>

      {/* ── Alert banners ── */}
      <div className="exc-alert-row">
        <div className="exc-alert exc-alert-orange">
          <MessageOutlined />
          <span>
            <strong>{NO_COMMENT_IDEAS.length}</strong> ideas have received no comments since submission
          </span>
        </div>
        <div className="exc-alert exc-alert-violet">
          <EyeInvisibleOutlined />
          <span>
            <strong>{ANONYMOUS_IDEAS.length}</strong> ideas were submitted anonymously
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
                <Badge count={NO_COMMENT_IDEAS.length} color="#ea580c" style={{ marginLeft: 8 }} />
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
                prefix={<FilterOutlined />}
              >
                {DEPT_OPTIONS.map((d) => <Option key={d} value={d}>{d}</Option>)}
              </Select>
            </div>

            <Table
              columns={noCommentColumns}
              dataSource={filteredNoComment}
              rowKey="idea_id"
              pagination={{ pageSize: 8, showSizeChanger: false }}
              locale={{ emptyText: <Empty description="No ideas without comments 🎉" /> }}
              className="exc-table"
            />
          </TabPane>

          {/* ── Tab 2: Anonymous content ── */}
          <TabPane
            tab={
              <span className="exc-tab-label">
                <EyeInvisibleOutlined className="exc-tab-icon" />
                Anonymous Content
                <Badge count={ANONYMOUS_IDEAS.length} color="#7c3aed" style={{ marginLeft: 8 }} />
              </span>
            }
            key="anonymous"
          >
            <div className="exc-filter-row">
              <Input
                placeholder="Search anonymous ideas..."
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
              rowKey="idea_id"
              pagination={{ pageSize: 8, showSizeChanger: false }}
              locale={{ emptyText: <Empty description="No anonymous ideas found" /> }}
              className="exc-table"
            />
          </TabPane>

        </Tabs>
      </Card>

      {/* ── Detail Modal (anonymous idea) ── */}
      <Modal
        title={
          <span className="exc-modal-title">
            <EyeInvisibleOutlined /> &nbsp;Anonymous Idea Detail
          </span>
        }
        open={!!detailModal}
        onCancel={() => setDetailModal(null)}
        footer={[
          <Button key="close" onClick={() => setDetailModal(null)}>Close</Button>
        ]}
        width={600}
        destroyOnClose
      >
        {detailModal && (
          <div className="exc-modal-body">
            <Descriptions column={1} bordered size="small" className="exc-descriptions">
              <Descriptions.Item label="Title">
                <strong>{detailModal.title}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                <Tag>{detailModal.category_name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Submitted">
                {detailModal.submitted_at}
              </Descriptions.Item>
              <Descriptions.Item label="Submitted By">
                <Tag icon={<EyeInvisibleOutlined />} color="purple">Anonymous</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Content">
                <p className="exc-modal-content">{detailModal.content}</p>
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left" className="exc-comment-divider">
              Comments ({detailModal.comments.length})
            </Divider>

            {detailModal.comments.length === 0 ? (
              <Empty description="No comments yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div className="exc-comment-list">
                {detailModal.comments.map((c, idx) => (
                  <div key={idx} className="exc-comment-item">
                    <div className="exc-comment-header">
                      {c.is_anonymous ? (
                        <Tag icon={<EyeInvisibleOutlined />} color="purple" className="exc-anon-tag">
                          Anonymous
                        </Tag>
                      ) : (
                        <div className="exc-commenter">
                          <Avatar size={24} icon={<UserOutlined />} className="exc-commenter-avatar" />
                          <span className="exc-commenter-name">{c.full_name}</span>
                        </div>
                      )}
                      <span className="exc-comment-date">{c.created_at}</span>
                    </div>
                    <p className="exc-comment-content">{c.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExceptionReports;