import React, { useState } from "react";
import { Table, Tag, Button, Popconfirm, Space, Form, Input } from "antd";
import NavBar from "./NavBar";

const DUMMY_DATA = [
  {
    key: "1",
    timestampCreated: "2022-12-01 10:00:00",
    title: "Build a website",
    description: "Build a website for a small business",
    duedate: "2022-12-15",
    tag: ["website", "business"],
    status: "OPEN",
  },
  {
    key: "2",
    timestampCreated: "2022-12-01 10:30:00",
    title: "Design a logo",
    description: "Design a logo for a new brand",
    duedate: "2022-12-20",
    tag: ["logo", "branding"],
    status: "OPEN",
  },
];

const DataTable = () => {
  const [tableData, setTableData] = useState(DUMMY_DATA);
  const [editRowKey, setEditRowKey] = useState("");
  const [form] = Form.useForm();
  const [query, setQuery] = useState("");

  const filteredData = tableData.filter((item) => {
    return (
      item.title.toLowerCase().includes(query.toLowerCase) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
  });

  const handleDelete = (value) => {
    const data = [...tableData];

    const filteredData = data.filter((item) => item.key !== value.key);
    console.log(filteredData);
    setTableData(filteredData);
  };

  const isEditing = (record) => {
    return record.key === editRowKey;
  };

  const cancel = () => {
    setEditRowKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      console.log(row);
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setTableData(newData);
        setEditRowKey("");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const edit = (record) => {
    form.setFieldValue({
      title: "",
      description: "",
      duedate: "",
      tag: "",
      status: "",
      ...record,
    });
    setEditRowKey(record.key);
  };

  const columns = [
    {
      title: "Timestamp Created",
      dataIndex: "timestampCreated",
      key: "timestampCreated",
      editable: false,
      rules: [],
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      editable: true,
      rules: [
        {
          required: true,
          message: "Title is a mandatory field",
        },
        {
          max: 100,
          message: "Title length should not exceed 100 characters",
        },
      ],
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      editable: true,
      rules: [
        {
          required: true,
          message: "Description is a mandatory field",
        },
        {
          max: 1000,
          message: "Description length should not exceed 1000 characters",
        },
      ],
    },
    {
      title: "Due Date",
      dataIndex: "duedate",
      key: "duedate",
      editable: true,
      rules: [],
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      editable: true,
      type: "tags",
      rules: [],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      editable: true,
      rules: [
        {
          required: true,
          message: "Status is a mandatory field",
        },
      ],
      render: (status) => {
        switch (status) {
          case "OPEN":
            return <Tag color="blue">OPEN</Tag>;
          case "WORKING":
            return <Tag color="orange">WORKING</Tag>;
          case "DONE":
            return <Tag color="green">DONE</Tag>;
          case "OVERDUE":
            return <Tag color="red">OVERDUE</Tag>;
          default:
            return null;
        }
      },
      defaultValue: "OPEN",
      data: ["OPEN", "WORKING", "DONE", "OVERDUE"],
      type: "select",
    },
    {
      title: "Action",
      //   dataIndex: "action",
      key: "action",
      rules: [],
      render: (_, record) => {
        const editable = isEditing(record);
        return tableData.length >= 1 ? (
          <Space>
            <Popconfirm
              title="Are you sure u want to delte the data"
              onConfirm={() => handleDelete(record)}
            >
              <Button disabled={editable} danger type="primary">
                Delete
              </Button>
            </Popconfirm>
            {editable ? (
              <span>
                <Space size="middle">
                  <Button onClick={() => save(record.key)} type="primary">
                    Save
                  </Button>
                  <Popconfirm title="are u sure to cancel" onConfirm={cancel}>
                    <Button>Cancel</Button>
                  </Popconfirm>
                </Space>
              </span>
            ) : (
              <Button onClick={() => edit(record)}>Edit</Button>
            )}
          </Space>
        ) : null;
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        description: col.description,
        duedate: col.duedate,
        tag: col.tag,
        status: col.status,
      }),
    };
  });

  const EditableCell = ({
    editing,
    dataIndex,
    Title,
    record,
    children,
    ...restProps
  }) => {
    const input = <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `Please input some value in ${Title} Field`,
              },
            ]}
          >
            {input}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const addTodoHandler = (item) => {
    const updatedData = [
      ...tableData,
      {
        key: item.title,
        timestampCreated: item.timestampCreated,
        title: item.title,
        description: item.description,
        duedate: item.duedate,
        tag: item.tag,
        status: item.status,
      },
    ];
    setTableData(updatedData);
  };

  const searchHandler = (str) => {
    setQuery(str);
  };

  const queryHandler = (q) => {
    console.log(q);
    setQuery(q);
  };
  
  return (
    <>
      <NavBar
        onAdd={addTodoHandler}
        onChange={searchHandler}
        onQueryChange={queryHandler}
      />
      <Form form={form} component={false}>
        <Table
          columns={mergedColumns}
          dataSource={filteredData}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          pagination={{ pageSize: 5 }}
        />
      </Form>
    </>
  );
};

export default DataTable;
