import {
  Form,
  InputNumber,
  Popconfirm,
  Table,
  Button,
  Space,
  Input,
  Tag,
} from "antd";
import { useState } from "react";

import NavBar from "./NavBar";

const DUMMY_DATA = [
  {
    key: "1",
    timestampCreated: "2022-12-09",
    title: "Build a website",
    description: "Build a website for a small business",
    duedate: "2022-12-15",
    tag: ["website", "business"],
    status: "DONE",
  },
  {
    key: "2",
    timestampCreated: "2021-12-20",
    title: "Learn Crypography basics",
    description: "Encryption/description and key sharing algorithms",
    duedate: "2021-12-23",
    tag: ["Cryptography", "College"],
    status: "OPEN",
  },
  {
    key: "3",
    timestampCreated: "2023-02-14",
    title: "Design a logo",
    description: "Design a logo for a new brand",
    duedate: "2023-03-16",
    tag: ["logo", "branding"],
    status: "WORKING",
  },
  {
    key: "4",
    timestampCreated: "2023-01-30",
    title: "Graph Questions",
    description: "practice binary search tree interview questions",
    duedate: "2023-03-17",
    tag: ["Data Structure"],
    status: "OPEN",
  },
  {
    key: "5",
    timestampCreated: "2020-09-19",
    title: "groceries",
    description: "Get some fruits and salad",
    duedate: "2020-10-18",
    tag: ["healthy"],
    status: "OVERDUE",
  },
];

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const DataTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(DUMMY_DATA);
  const [editingKey, setEditingKey] = useState("");
  const [query, setQuery] = useState("");
  const isEditing = (record) => record.key === editingKey;

  let filteredData = data.filter((item) => {
    return (
      item.title.toLowerCase().includes(query.toLowerCase) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
  });

  const handleDelete = (value) => {
    const tempData = [...data];

    const filteredData = tempData.filter((item) => item.key !== value.key);
    console.log(filteredData);
    setData(filteredData);
  };

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const allTags = data.reduce((tags, record) => {
    record.tag.forEach((tag) => tags.add(tag));
    return tags;
  }, new Set());

  const filters = Array.from(allTags).map((tag) => ({ text: tag, value: tag }));

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
      sorter: {
        compare: (a, b) => a.title.localeCompare(b.title),
      },
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
      sorter: {
        compare: (a, b) => a.description.localeCompare(b.description),
      },
    },
    {
      title: "Due Date",
      dataIndex: "duedate",
      key: "duedate",
      editable: true,
      rules: [],
      sorter: {
        compare: (a, b) => a.duedate.localeCompare(b.duedate),
      },
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      editable: true,
      type: "tags",
      rules: [],
      sorter: {
        compare: (a, b) => a.tag.length - b.tag.length,
      },
      render: (tags) => (
        <>
          {tags.map((tag) => (
            <Tag color="pink" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      ),
      filters,
      onFilter: (value, record) =>
        record.tag.some((tag) => tag.includes(value)),
      ellipsis: true,
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
      sorter: {
        compare: (a, b) => a.status.localeCompare(b.status),
      },
      onFilter: (value, record) => record.status.includes(value),
      ellipsis: true,
      filters: [
        { text: "OPEN", value: "OPEN" },
        { text: "WORKING", value: "WORKING" },
        { text: "DONE", value: "DONE" },
        { text: "OVERDUE", value: "OVERDUE" },
      ],
    },

    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return data.length >= 1 ? (
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
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const addTodoHandler = (item) => {
    const updatedData = [
      ...data,
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
    setData(updatedData);
  };

  const queryHandler = (q) => {
    console.log(q);
    setQuery(q);
  };

  return (
    <>
      <NavBar onAdd={addTodoHandler} onQueryChange={queryHandler} />

      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={filteredData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </>
  );
};
export default DataTable;
