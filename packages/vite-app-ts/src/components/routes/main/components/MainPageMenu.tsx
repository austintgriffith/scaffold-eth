import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

interface IMainPageMenu {
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
}
export const MainPageMenu: FC<IMainPageMenu> = (props) => (
  <Menu
    style={{
      textAlign: 'center',
    }}
    selectedKeys={[props.route]}
    mode="horizontal">
    <Menu.Item key="/">
      <Link
        onClick={() => {
          props.setRoute('/');
        }}
        to="/">
        YourContract
      </Link>
    </Menu.Item>
    <Menu.Item key="/hints">
      <Link
        onClick={() => {
          props.setRoute('/hints');
        }}
        to="/hints">
        Hints
      </Link>
    </Menu.Item>
    <Menu.Item key="/exampleui">
      <Link
        onClick={() => {
          props.setRoute('/exampleui');
        }}
        to="/exampleui">
        ExampleUI
      </Link>
    </Menu.Item>
    <Menu.Item key="/mainnetdai">
      <Link
        onClick={() => {
          props.setRoute('/mainnetdai');
        }}
        to="/mainnetdai">
        Mainnet DAI
      </Link>
    </Menu.Item>
    <Menu.Item key="/subgraph">
      <Link
        onClick={() => {
          props.setRoute('/subgraph');
        }}
        to="/subgraph">
        Subgraph
      </Link>
    </Menu.Item>
  </Menu>
);
