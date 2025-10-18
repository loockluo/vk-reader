import { useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { SettingOutlined, AreaChartOutlined } from "@ant-design/icons";
import History from "./components/history";
import Setting from "./components/setting";

const items: MenuProps["items"] = [
  // {
  //   label: "数据",
  //   key: "history",
  //   icon: <AreaChartOutlined />,
  // },
  {
    label: "配置",
    key: "setting",
    icon: <SettingOutlined />,
  },
];

export default function IndexPage() {
  const [selectedKeys, setSelectedKeys] = useState("setting");

  return (
    <div className="w-[100vw] h-[100vh] app ">
      <Menu
        className="pt-20 pl-10 bg-[#1677ff] text-white"
        theme="dark"
        onClick={(e) => {
          setSelectedKeys(e.key);
        }}
        selectedKeys={[selectedKeys]}
        mode="horizontal"
        items={items}
      />
      <div className=" px-40 py-20">
        {selectedKeys === "history" ? <History /> : <Setting />}
      </div>
    </div>
  );
}
