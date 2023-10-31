import { Fragment } from "react";
import { Flex } from "antd";
import "./style.scss";
import { NavLink } from "react-router-dom";
const Header = () => {
  return (
    <Fragment>
      <header>
        <div className="container header__container">
          <Flex
            className="header__box"
            justify="space-between"
            gap={36}
            align="center"
          >
            <div className="header__logo__box">
              <NavLink>
                {" "}
                <img className="logo" src="https://exam-part1.vercel.app/assets/Screenshot_28-removebg-preview-f80103b9.png" alt="" />
                {" "}
              </NavLink>
            </div>
            <div className="auth__box" >
              <NavLink to="/login"><button className="button-89" role="button">Login</button></NavLink>
              <NavLink to="/register"><button className="button-89" role="button">Register</button></NavLink>
            </div>
          </Flex>
        </div>
      </header>
    </Fragment>
  );
};

export default Header;
