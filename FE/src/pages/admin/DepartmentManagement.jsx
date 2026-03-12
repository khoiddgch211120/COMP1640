import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Tooltip,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../redux/slices/departmentSlice";

const { confirm } = Modal;

const DepartmentManagement = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.department.departments);
  const users = useSelector((state) => state.auth.users);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingDept(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    form.setFieldsValue(dept);
    setModalVisible(true);
  };

  const handleDelete = (dept) => {
    const hasUsers = users.some((u) => u.department === dept.name);

    if (hasUsers) {
      message.warning("Không thể xóa phòng ban đang có người dùng.");
      return;
    }

    confirm({
      title: "Xóa phòng ban",
      icon: <ExclamationCircleOutlined />,
      okType: "danger",
      content: `Bạn có chắc muốn xóa "${dept.name}"?`,
      onOk() {
        dispatch(deleteDepartment(dept.id));
      },
    });
  };

  const handleSave = (values) => {
    if (!editingDept) {
      dispatch(
        addDepartment({
          id: Date.now().toString(),
          name: values.name,
        })
      );
      message.success("Thêm phòng ban thành công!");
    } else {
      dispatch(
        updateDepartment({
          ...editingDept,
          name: values.name,
        })
      );
      message.success("Cập nhật thành công!");
    }

    setModalVisible(false);
    setEditingDept(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
      width: 80,
      align: "center",
    },
    {
      title: "Tên phòng ban",
      dataIndex: "name",
    },
    {
      title: "Số lượng nhân sự",
      render: (_, dept) =>
        users.filter((u) => u.department === dept.name).length,
      align: "center",
    },
    {
      title: "Thao tác",
      align: "center",
      render: (_, dept) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(dept)}
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(dept)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Department Management</h2>

        <Button type="primary" onClick={handleAdd}>
          + Add Department
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={departments}
        columns={columns}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingDept ? "Edit Department" : "Add Department"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingDept(null);
        }}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item
            label="Department Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={() => form.resetFields()}>Reset</Button>

            <Button type="primary" htmlType="submit">
              {editingDept ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;