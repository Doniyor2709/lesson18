import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

import { Layout, Menu, Button, theme, Modal, Flex,  } from "antd";

import "./style.scss";
import Cookies from "js-cookie";
import { PORT_TOKEN, PORT_USER } from "../../../constants";
import { removeAuth } from "../../../redux/slice/auth";
import { useDispatch } from "react-redux";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const logOutFunc = () => {
    Cookies.remove(PORT_TOKEN);
    localStorage.removeItem(PORT_USER);
    navigate("/login");
    dispatch(removeAuth());
  };

  return (
    <Layout>
      <Sider
        className="admin__asside"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="admin__logo">
          <NavLink to="/dashboard">
            {collapsed ? (
              <img className="logo_admin" src="https://o.remove.bg/downloads/f469eaa4-0260-4389-8a4f-08847ee6b6c4/photo_2023-10-31_21-31-20-removebg-preview.png" alt="" />
            ) : (
             <img className="logo_panel" src="https://exam-part1.vercel.app/assets/Screenshot_28-removebg-preview-f80103b9.png" alt="" />
            )}
          </NavLink>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={[
            {
              key: "/dashboard",
              icon: <HomeOutlined />,
              label: <NavLink to="/dashboard">Dashboard</NavLink>,
            },
            {
              key: "/users",
              icon: <UsergroupAddOutlined />,
              label: <NavLink to="/users">Users</NavLink>,
            },
            {
              key: "/skills",
              icon: <UsergroupAddOutlined />,
              label: <NavLink to="/skills">Skills</NavLink>,
            },
            {
              key: "/portfolios",
              icon: <UsergroupAddOutlined />,
              label: <NavLink to="/portfolios">Portfolios</NavLink>,
            },
            {
              key: "/education",
              icon: <UsergroupAddOutlined />,
              label: <NavLink to="/education">Education</NavLink>,
            },
            {
              key: "/experiences",
              icon: <UsergroupAddOutlined />,
              label: <NavLink to="/experiences">Experiences</NavLink>,
            },
            {
              className: "logout__btn",
              style: {
                fontWeight: 600,
                backgroundColor: "red",
              },
              icon: <UsergroupAddOutlined />,
              label: "Log Out",
              onClick: () => {
                Modal.confirm({
                  title: "Do you want to exit ?",
                  onOk: () => {
                    logOutFunc();
                  },
                });
              },
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className="admin__header"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Flex
            justify="space-between"
            style={{ paddingTop: "14px" }}
            gap={36}
            align="center"
          >
            <Button
              className="collapsed__bt"
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined style={{ fontSize: "24px" }} />
                ) : (
                  <MenuFoldOutlined style={{ fontSize: "24px" }} />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Flex>
        </Header>
        <Content
          className="admin__main"
          style={{
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
