import React, { useState, useMemo } from "react";
import {
  Table,
  Space,
  Avatar,
  Button,
  Switch,
  Tag,
  Tooltip,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import {
  addUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from "../../redux/slices/authSlice";
import { ROLES } from "../../constants/roles";

const { Option } = Select;
const { confirm } = Modal;

const UsersManagement = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.auth.users);
  const currentUser = useSelector((state) => state.auth.user);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  /* =========================
       FILTER STATE
  ========================= */
  const [filters, setFilters] = useState({
    department: null,
    role: null,
    status: null,
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      department: null,
      role: null,
      status: null,
    });
  };

  /* =========================
       FILTERED DATA
  ========================= */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      return (
        (!filters.department || u.department === filters.department) &&
        (!filters.role || u.role === filters.role) &&
        (filters.status === null ||
          u.status === (filters.status === "true"))
      );
    });
  }, [users, filters]);

  /* =========================
       ADD USER
  ========================= */
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  /* =========================
       EDIT USER
  ========================= */
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  /* =========================
       DELETE USER
  ========================= */
  const handleDelete = (user) => {
    if (user.id === currentUser?.id) {
      message.warning("Bạn không thể xóa chính mình.");
      return;
    }

    confirm({
      title: "Xóa người dùng",
      icon: <ExclamationCircleOutlined />,
      okType: "danger",
      content: `Bạn có chắc muốn xóa "${user.fullName}" không?`,
      onOk() {
        dispatch(deleteUser(user.id));
      },
    });
  };

  /* =========================
       TOGGLE STATUS
  ========================= */
  const handleToggleStatus = (user) => {
    if (user.id === currentUser?.id) {
      message.warning("Bạn không thể khóa chính mình.");
      return;
    }

    dispatch(toggleUserStatus(user.id));
  };

  /* =========================
       SAVE USER
  ========================= */
  const handleSave = (values) => {
    if (!editingUser) {
      const newUser = {
        id: Date.now().toString(),
        ...values,
        status: true,
        password: "123456", // fake password
      };

      dispatch(addUser(newUser));
      message.success("Thêm người dùng thành công!");
    } else {
      dispatch(
        updateUser({
          ...editingUser,
          ...values,
        })
      );
      message.success("Cập nhật thành công!");
    }

    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  /* =========================
       TABLE COLUMNS
  ========================= */
  const columns = [
    {
      title: "STT",
      width: 70,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      align: "center",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      align: "center",
      render: (role) => {
        if (role === ROLES.ADMIN)
          return <Tag color="red">Admin</Tag>;
        if (role === ROLES.QA_MANAGER)
          return <Tag color="blue">QA Manager</Tag>;
        if (role === ROLES.QA_COORDINATOR)
          return <Tag color="gold">QA Coordinator</Tag>;
        return <Tag color="green">Staff</Tag>;
      },
    },
    {
      title: "Trạng thái",
      align: "center",
      render: (_, user) => (
        <Switch
          checked={user.status}
          onChange={() => handleToggleStatus(user)}
          checkedChildren="Active"
          unCheckedChildren="Locked"
        />
      ),
    },
    {
      title: "Thao tác",
      align: "center",
      render: (_, user) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(user)}
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(user)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const departmentOptions = [
    ...new Set(users.map((u) => u.department)),
  ];

  return (
    <div className="p-6 bg-white min-h-screen">

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          User Management
        </h2>

        <Button type="primary" onClick={handleAdd}>
          + Add User
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6">
        <Select
          placeholder="Department"
          allowClear
          style={{ width: 180 }}
          value={filters.department}
          onChange={(v) => handleFilterChange("department", v)}
        >
          {departmentOptions.map((d) => (
            <Option key={d} value={d}>
              {d}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Role"
          allowClear
          style={{ width: 180 }}
          value={filters.role}
          onChange={(v) => handleFilterChange("role", v)}
        >
          <Option value={ROLES.ADMIN}>Admin</Option>
          <Option value={ROLES.QA_MANAGER}>QA Manager</Option>
          <Option value={ROLES.QA_COORDINATOR}>QA Coordinator</Option>
          <Option value={ROLES.STAFF}>Staff</Option>
        </Select>

        <Select
          placeholder="Status"
          allowClear
          style={{ width: 150 }}
          value={filters.status}
          onChange={(v) => handleFilterChange("status", v)}
        >
          <Option value="true">Active</Option>
          <Option value="false">Locked</Option>
        </Select>

        <Button onClick={handleResetFilters}>
          Reset
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={filteredUsers}
        columns={columns}
        pagination={{ pageSize: 8 }}
      />

      {/* MODAL */}
      <Modal
        title={
          editingUser
            ? "Edit User"
            : "Add New User"
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingUser(null);
        }}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true },
              { type: "email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          {editingUser && (
            <Form.Item label="Role" name="role">
              <Select>
                <Option value={ROLES.ADMIN}>Admin</Option>
                <Option value={ROLES.QA_MANAGER}>QA Manager</Option>
                <Option value={ROLES.QA_COORDINATOR}>
                  QA Coordinator
                </Option>
                <Option value={ROLES.STAFF}>Staff</Option>
              </Select>
            </Form.Item>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={() => form.resetFields()}>
              Reset
            </Button>

            <Button type="primary" htmlType="submit">
              {editingUser ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersManagement;