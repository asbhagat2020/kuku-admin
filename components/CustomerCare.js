import React, { useState } from 'react';
import { 
  FaUserTie, 
  FaPhone, 
  FaCalendarAlt, 
  FaBarcode, 
  FaTruck,
  FaCheckCircle,
  FaBox,
  FaClock,
  FaEnvelope
} from 'react-icons/fa';

// Sample data for customer queries and support agents
const initialQueries = [
  {
    id: 1,
    customerName: 'John Doe',
    query: 'Item not received yet',
    status: 'pending',
    priority: 'high',
    timestamp: '2024-01-31 10:30 AM',
    category: 'Delivery'
  },
  {
    id: 2,
    customerName: 'Jane Smith',
    query: 'Wrong item received',
    status: 'assigned',
    priority: 'medium',
    timestamp: '2024-01-31 11:45 AM',
    category: 'Product'
  },
  {
    id: 3,
    customerName: 'Mike Johnson',
    query: 'Refund not processed',
    status: 'pending',
    priority: 'high',
    timestamp: '2024-01-31 09:15 AM',
    category: 'Billing'
  }
];

const supportAgents = [
  { 
    id: 1, 
    name: 'Alice Johnson', 
    email: 'alice.johnson@example.com', 
    role: 'Technical Support',
    expertise: ['Delivery', 'Technical'],
    activeTickets: 2,
    status: 'available'
  },
  { 
    id: 2, 
    name: 'Mark Lee', 
    email: 'mark.lee@example.com', 
    role: 'Billing Support',
    expertise: ['Billing', 'Refunds'],
    activeTickets: 1,
    status: 'busy'
  },
  { 
    id: 3, 
    name: 'Sophia Brown', 
    email: 'sophia.brown@example.com', 
    role: 'Product Support',
    expertise: ['Product', 'Quality'],
    activeTickets: 0,
    status: 'available'
  }
];

export const CustomerCare = () => {
  const [queries, setQueries] = useState(initialQueries);
  const [agents, setAgents] = useState(supportAgents);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [assignedQueries, setAssignedQueries] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleAssignAgent = (query, agent) => {
    if (agent.status === 'busy') {
      alert('This agent is currently busy with other tickets.');
      return;
    }

    // Update query status
    const updatedQueries = queries.map(q => 
      q.id === query.id ? { ...q, status: 'assigned' } : q
    );
    setQueries(updatedQueries);

    // Update agent status
    const updatedAgents = agents.map(a => 
      a.id === agent.id ? { ...a, activeTickets: a.activeTickets + 1, status: a.activeTickets + 1 >= 3 ? 'busy' : 'available' } : a
    );
    setAgents(updatedAgents);

    // Add to assigned queries
    setAssignedQueries([...assignedQueries, { ...query, agentId: agent.id }]);
    setSelectedQuery(null);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-green-100 text-green-800',
      resolved: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredQueries = filterStatus === 'all' 
    ? queries 
    : queries.filter(query => query.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FaUserTie className="text-4xl text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Care Dashboard</h1>
              <p className="text-gray-500">Manage customer queries and support team assignments</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Queries</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Queries List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Customer Queries</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredQueries.map((query) => (
                <div 
                  key={query.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                    selectedQuery?.id === query.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedQuery(query)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-medium text-gray-900">{query.customerName}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(query.priority)}`}>
                          {query.priority}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                          {query.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{query.query}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <FaClock className="mr-1.5 h-4 w-4" />
                          {query.timestamp}
                        </span>
                        <span className="flex items-center">
                          <FaBox className="mr-1.5 h-4 w-4" />
                          {query.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Agents Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Support Agents</h2>
            </div>
            <div className="p-6 space-y-6">
              {selectedQuery ? (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Assign query to:</h3>
                  {agents.map((agent) => (
                    <div 
                      key={agent.id}
                      className="mb-4 p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                          <p className="text-sm text-gray-500">{agent.role}</p>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              agent.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {agent.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {agent.activeTickets} active tickets
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssignAgent(selectedQuery, agent)}
                          disabled={agent.status === 'busy'}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            agent.status === 'busy'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FaEnvelope className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>Select a query to assign to an agent</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};