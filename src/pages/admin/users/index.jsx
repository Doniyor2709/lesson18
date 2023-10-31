import { Fragment, useState } from "react";
import "./style.scss";
import {
  Button,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
  Upload,
} from "antd";
import { } from "@ant-design/icons";
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetUserMutation,
  useGetUsersQuery,
  useUploadPhotoMutation,
} from "../../../redux/queries/users";
import ColumnGroup from "antd/es/table/ColumnGroup";
import Column from "antd/es/table/Column";
import { USERS_LIMIT } from "../../../constants";
import { getUsersImage } from "../../../utils";
import TextArea from "antd/es/input/TextArea";
const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isRole, setIsRole] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [ setLoadingPhoto] = useState(false);
  const [form] = Form.useForm();
  let params = {
    page,
    search,
  };
  if (isRole !== "all") {
    params = {
      page,
      search,
      role: isRole,
    };
  }

  const {
    data: { users, total } = { users: [], total: 0 },
    isFetching,
    refetch,
  } = useGetUsersQuery({ ...params });
  const [uploadPhoto] = useUploadPhotoMutation();
  const [addUser] = useAddUserMutation();
  const [editUser] = useEditUserMutation();
  const [getUser] = useGetUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleChange = (value) => {
    setIsRole(value);
  };

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
    setSelected(null);
    setPhoto(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handlePhoto = async (e) => {
    setLoadingPhoto(true);
    const formData = new FormData();
    formData.append("file", e.file.originFileObj);
    const { data } = await uploadPhoto(formData);
    setLoadingPhoto(false);
    setPhoto(data);
  };

  const handleOk = async () => {
    try {
      setIsModalLoading(true);
      const values = await form.validateFields();
      values.photo = photo;
      if (selected === null) {
        await addUser(values);
      } else {
        await editUser({ id: selected, body: values });
      }
      refetch();
      setIsModalOpen(false);
      setPhoto(null);
      form.resetFields();
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setSelected(id);
    const { data } = await getUser(id);
    setPhoto(data?.photo);
    setIsModalOpen(true);
    form.setFieldsValue(data);
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    setPage(1);
    refetch();
  };

  return (
    <Fragment>
      <Flex justify="space-between" gap={36} align="center">
        <h1>Users ({total})</h1>
        <Input
          type="text"
          value={search}
          name="search"
          onChange={handleSearch}
          style={{ width: "auto", flexGrow: 1 }}
          placeholder="Searching..."
        />
        <Select
          value={isRole}
          onChange={(value) => {
            handleChange(value);
          }}
          style={{
            width: 120,
          }}
          options={[
            {
              value: "all",
              label: "All",
            },
            {
              value: "admin",
              label: "Admin",
            },
            {
              value: "client",
              label: "Client",
            },
            {
              value: "user",
              label: "User",
            },
          ]}
        />
        
        <button className="button-53" onClick={showModal} role="button">Add Users</button>
        
      </Flex>

      <Table
        scroll={{ x: 1000 }}
        loading={isFetching}
        pagination={false}
        dataSource={users}
      >
        <Column
          title="User Photo"
          dataIndex="photo"
          key="photo"
          render={(data) => {
            return <Image className="users__photo" src={getUsersImage(data)} />;
          }}
        />
        <ColumnGroup title="Full Name">
          <Column
            title="First Name"
            dataIndex="user"
            key="user"
            render={(_, data) => {
              return <p>{data?.firstName}</p>;
            }}
          />
          <Column
            title="Last Name"
            dataIndex="user"
            key="user"
            render={(_, data) => {
              return <p>{data?.lastName}</p>;
            }}
          />
        </ColumnGroup>
        <Column title="Role" dataIndex="role" key="role" />
        <Column title="Username" dataIndex="username" key="username" />

        <Column
          title="Action"
          key="action"
          render={(_, data) => {
            return (
              <Space size="middle">
                <Button
                  type="primary"
                  onClick={() => {
                    handleEdit(data?._id);
                  }}
                >
                  Edit
                </Button>
                <Button
                  danger
                  type="primary"
                  onClick={() => {
                    Modal.confirm({
                      title: "Do you want to delete this user?",
                      onOk: () => {
                        handleDelete(data?._id);
                      },
                    });
                  }}
                >
                  Delete
                </Button>
              </Space>
            );
          }}
        />
      </Table>

      {total > USERS_LIMIT ? (
        <Pagination
          total={total}
          pageSize={USERS_LIMIT}
          current={page}
          onChange={(page) => setPage(page)}
        />
      ) : null}

      <Modal
        title={selected === null ? `Add new users` : "Save users"}
        maskClosable={false}
        confirmLoading={isModalLoading}
        okText={selected === null ? "Add users" : "Save users"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
      >
        <Form
          name="users"
          autoComplete="off"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          form={form}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader upload__photo"
            showUploadList={false}
            onChange={handlePhoto}
          >
            
          </Upload>

          <Form.Item
            label="First name"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last name"
            name="lastName"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Info"
            name="info"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <TextArea />
          </Form.Item>

          <Form.Item label="Phone Number" name="phoneNumber">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default UsersPage;