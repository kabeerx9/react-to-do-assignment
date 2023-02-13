import React, { useState } from "react";
import { Form, Input, Button, Select, DatePicker } from "antd";
import "antd/dist/reset.css";
import "./NewItemForm.css";

const { Option } = Select;

const NewItemForm = (props) => {
  const [formData, setFormData] = useState({
    timestampCreated: new Date(),
    title: "",
    description: "",
    duedate: null,
    tag: [],
    status: "OPEN",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagChange = (value) => {
    setFormData({ ...formData, tag: value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, status: value });
  };

  const handleDueDateChange = (date, dateString) => {
    setFormData({ ...formData, duedate: dateString });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    props.onAdd(formData);
    props.onclick(e);
    setFormData({
      timestampCreated: new Date(),
      title: "",
      description: "",
      duedate: null,
      tag: [],
      status: "OPEN",
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="form-container">
      <Form.Item label="Title" className="form-item">
        <Input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </Form.Item>
      <Form.Item label="Description" className="form-item">
        <Input.TextArea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </Form.Item>
      <Form.Item label="Due Date" className="form-item">
        <DatePicker onChange={handleDueDateChange} />
      </Form.Item>
      <Form.Item label="Tag" className="form-item">
        <Select
          mode="tags"
          name="tag"
          value={formData.tag}
          onChange={handleTagChange}
        />
      </Form.Item>
      <Form.Item label="Status" className="form-item">
        <Select
          name="status"
          value={formData.status}
          onChange={handleSelectChange}
        >
          <Option value="OPEN">OPEN</Option>
          <Option value="WORKING">WORKING</Option>
          <Option value="DONE">DONE</Option>
          <Option value="OVERDUE">OVERDUE</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={handleSubmit}>
          Add Item
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NewItemForm;
