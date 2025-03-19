import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      message.error('Failed to load subscriptions.');
    }
  };

  const handleSubscribe = async (id) => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription_id: id }),
      });
      const data = await response.json();
      if (response.ok) {
        message.success(data.message);
      } else {
        message.error(data.error);
      }
    } catch (error) {
      message.error('Failed to subscribe.');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'Name', key: 'Name' },
    { title: 'Price', dataIndex: 'Price', key: 'Price' },
    { title: 'Duration (Days)', dataIndex: 'DurationDays', key: 'DurationDays' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => handleSubscribe(record.ID)}>Subscribe</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Available Subscriptions</h2>
      <Table dataSource={subscriptions} columns={columns} rowKey="ID" />
    </div>
  );
};

export default Subscriptions;