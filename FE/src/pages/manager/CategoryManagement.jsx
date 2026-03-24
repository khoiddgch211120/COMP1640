import { useState } from "react";
import {
  Table, Button, Modal, Form, Input, Tag, Space, Tooltip,
  Popconfirm, message, Badge, Empty, Card
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, TagsOutlined,
  CheckCircleOutlined, StopOutlined, SearchOutlined
} from "@ant-design/icons";
import "../../styles/category-management.css";

/* ── Mock data – replace with Redux thunks ── */
const INITIAL_CATEGORIES = [
  { id: 1, name: "Technology Innovation", is_used: true,  ideaCount: 45, createdAt: "2024-01-10" },
  { id: 2, name: "Process Improvement",   is_used: true,  ideaCount: 38, createdAt: "2024-01-12" },
  { id: 3, name: "Cost Reduction",        is_used: true,  ideaCount: 29, createdAt: "2024-01-15" },
  { id: 4, name: "Customer Experience",   is_used: true,  ideaCount: 22, createdAt: "2024-02-01" },
  { id: 5, name: "Sustainability",        is_used: false, ideaCount: 0,  createdAt: "2024-02-10" },
  { id: 6, name: "Employee Wellbeing",    is_used: false, ideaCount: 0,  createdAt: "2024-03-01" },
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [searchText,  setSearchText]  = useState("");
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editTarget,  setEditTarget]  = useState(null); // null = add mode
  const [loading,     setLoading]     = useState(false);
  const [form] = Form.useForm();

  /* ── Filtered list ── */
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  /* ── Open modal ── */
  const openAdd = () => {
    setEditTarget(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditTarget(record);
    form.setFieldsValue({ name: record.name });
    setModalOpen(true);
  };

  /* ── Submit (add / edit) ── */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const trimmed = values.name.trim();

      // Check duplicate
      const duplicate = categories.find(
        (c) => c.name.toLowerCase() === trimmed.toLowerCase() && c.id !== editTarget?.id
      );
      if (duplicate) {
        form.setFields([{ name: "name", errors: ["Category name already exists."] }]);
        return;
      }

      setLoading(true);
      // Simulate API delay
      await new Promise((r) => setTimeout(r, 500));

      if (editTarget) {
        setCategories((prev) =>
          prev.map((c) => c.id === editTarget.id ? { ...c, name: trimmed } : c)
        );
        message.success("Category updated successfully.");
      } else {
        const newCat = {
          id: Date.now(),
          name: trimmed,
          is_used: false,
          ideaCount: 0,
          createdAt: new Date().toISOString().split("T")[0],
        };
        setCategories((prev) => [newCat, ...prev]);
        message.success("Category added successfully.");
      }

      setModalOpen(false);
      form.resetFields();
    } catch (_) {
      // validation error – do nothing, antd handles display
    } finally {
      setLoading(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (record) => {
    if (record.is_used) {
      message.error("Cannot delete: this category is assigned to one or more ideas.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setCategories((prev) => prev.filter((c) => c.id !== record.id));
    message.success("Category deleted.");
    setLoading(false);
  };

  /* ── Table columns ── */
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (_, __, idx) => (
        <span className="cat-row-num">{idx + 1}</span>
      ),
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <span className="cat-name">
          <TagsOutlined className="cat-name-icon" /> {name}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_used",
      key: "is_used",
      width: 130,
      filters: [
        { text: "In Use",    value: true },
        { text: "Available", value: false },
      ],
      onFilter: (value, record) => record.is_used === value,
      render: (used) =>
        used ? (
          <Badge status="processing" text={<span className="cat-badge-used">In Use</span>} />
        ) : (
          <Badge status="default"    text={<span className="cat-badge-free">Available</span>} />
        ),
    },
    {
      title: "Ideas Linked",
      dataIndex: "ideaCount",
      key: "ideaCount",
      width: 120,
      sorter: (a, b) => a.ideaCount - b.ideaCount,
      render: (val) => (
        <Tag color={val > 0 ? "blue" : "default"} className="cat-idea-tag">
          {val} idea{val !== 1 ? "s" : ""}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (d) => <span className="cat-date">{d}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 110,
      render: (_, record) => (
        <Space size={6}>
          <Tooltip title="Edit name">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              className="cat-action-btn cat-action-edit"
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Tooltip title={record.is_used ? "Cannot delete: category is in use" : "Delete"}>
            <Popconfirm
              title="Delete category?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record)}
              okText="Delete"
              okType="danger"
              cancelText="Cancel"
              disabled={record.is_used}
            >
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                className="cat-action-btn cat-action-delete"
                disabled={record.is_used}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="cat-page">

      {/* ── Page header ── */}
      <div className="cat-page-header">
        <div className="cat-page-title-block">
          <TagsOutlined className="cat-page-icon" />
          <div>
            <h2 className="cat-page-title">Category Management</h2>
            <p className="cat-page-sub">
              {categories.length} categories &bull; {categories.filter((c) => c.is_used).length} in use
            </p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAdd}
          className="cat-add-btn"
        >
          Add Category
        </Button>
      </div>

      {/* ── Summary pills ── */}
      <div className="cat-summary-row">
        <div className="cat-pill cat-pill-blue">
          <CheckCircleOutlined />
          <span>{categories.filter((c) => c.is_used).length} In Use</span>
        </div>
        <div className="cat-pill cat-pill-gray">
          <StopOutlined />
          <span>{categories.filter((c) => !c.is_used).length} Available</span>
        </div>
      </div>

      {/* ── Table card ── */}
      <Card className="cat-table-card">
        {/* Search bar */}
        <div className="cat-search-row">
          <Input
            placeholder="Search categories..."
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="cat-search-input"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="No categories found" /> }}
          className="cat-table"
        />
      </Card>

      {/* ── Add / Edit Modal ── */}
      <Modal
        title={
          <span className="cat-modal-title">
            {editTarget ? <><EditOutlined /> &nbsp;Edit Category</> : <><PlusOutlined /> &nbsp;Add New Category</>}
          </span>
        }
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        okText={editTarget ? "Save Changes" : "Add Category"}
        confirmLoading={loading}
        destroyOnClose
        className="cat-modal"
      >
        <Form form={form} layout="vertical" className="cat-form">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: "Please enter a category name." },
              { min: 2, message: "Must be at least 2 characters." },
              { max: 80, message: "Must be at most 80 characters." },
            ]}
          >
            <Input
              placeholder="e.g. Process Improvement"
              maxLength={80}
              showCount
              autoFocus
            />
          </Form.Item>
        </Form>
        {!editTarget && (
          <p className="cat-modal-hint">
            New categories are created with <strong>Available</strong> status and can be assigned to ideas immediately.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default CategoryManagement;