import React, { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, Space, message } from "antd";

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [config, setConfig] = useState({});

  useEffect(() => {
    fetch("/api/getConfig")
      .then((res) => res.json())
      .then((conf) => {
        console.log("%c Line:25 🥑 conf", "color:#33a5ff", conf);
        form.setFieldsValue(conf);
      })
      .catch((err) => {
        console.error("%c Line:30 🥐 err", "color:#b03734", err);
      });
  }, []);

  const onFinish = (values) => {
    console.log("%c Line:37 🍿 values", "color:#b03734", values);
    fetch("/api/setConfig", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((r) => {
        if (r.resoult === "ok") {
          message.success({
            content: "配置修改成功，重启电脑后生效！",
          });
        }
      })
      .catch((err) => {
        console.error("%c Line:48 🥐 err", "color:#b03734", err);
      });
  };

  return (
    <div className="p-40 flex justify-center">
      <Form
        onFinish={onFinish}
        form={form}
        name="dynamic_form_complex"
        style={{ maxWidth: 600 }}
        autoComplete="off"
        initialValues={{ list: [{}] }}
      >
        <Form.Item
          label="数据保存路径"
          name={"savePath"}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="检测频率"
          name={"second"}
          rules={[{ required: true }]}
        >
          <InputNumber addonAfter="秒" defaultValue={5} max={60} min={5} />
        </Form.Item>

        <Form.Item
          label="日志等级"
          name={"logLevel"}
          rules={[{ required: true }]}
        >
          <Select
            style={{ width: 120 }}
            options={[
              { value: "info", label: "info" },
              { value: "debug", label: "debug" },
              { value: "trace", label: "trace" },
              { value: "all", label: "all" },
            ]}
          />
        </Form.Item>

        {/* Nest Form.List */}
        <Form.Item label="设备" rules={[{ required: true }]}>
          <Form.List name={"divices"}>
            {(subFields, subOpt) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 16,
                }}
              >
                {subFields.map((subField) => (
                  <Space key={subField.key}>
                    <Form.Item
                      noStyle
                      name={[subField.name, "ip"]}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="ip地址" />
                    </Form.Item>
                    <Form.Item
                      noStyle
                      name={[subField.name, "port"]}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="端口" />
                    </Form.Item>
                    <CloseOutlined
                      onClick={() => {
                        subOpt.remove(subField.name);
                      }}
                    />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => subOpt.add()} block>
                  + 添加设备
                </Button>
              </div>
            )}
          </Form.List>
        </Form.Item>
        <div className="text-center">
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default function Setting() {
  return <App />;
}
