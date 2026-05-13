// Admin - Audit Logs Page (FR-RPT-003, FR-RPT-004)
import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, Input, Button } from '../../components/common';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ip_address: string;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    // Generate mock audit logs
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        timestamp: new Date(2026, 6, 28, 10, 30).toISOString(),
        user: 'admin@mint.gov.et',
        action: 'APPLICATION_APPROVED',
        resource: 'Application #app_1',
        details: 'Approved application for Abebe Alemu',
        ip_address: '192.168.1.100',
      },
      {
        id: '2',
        timestamp: new Date(2026, 6, 28, 10, 15).toISOString(),
        user: 'admin@mint.gov.et',
        action: 'USER_CREATED',
        resource: 'User #student_30',
        details: 'Created new student account',
        ip_address: '192.168.1.100',
      },
      {
        id: '3',
        timestamp: new Date(2026, 6, 28, 9, 45).toISOString(),
        user: 'supervisor1@mint.gov.et',
        action: 'MILESTONE_REVIEWED',
        resource: 'Milestone #milestone_1_3',
        details: 'Reviewed and accepted milestone submission',
        ip_address: '192.168.1.105',
      },
      {
        id: '4',
        timestamp: new Date(2026, 6, 28, 9, 30).toISOString(),
        user: 'student1@aau.edu.et',
        action: 'MILESTONE_SUBMITTED',
        resource: 'Milestone #milestone_1_3',
        details: 'Submitted Database Design milestone',
        ip_address: '192.168.1.120',
      },
      {
        id: '5',
        timestamp: new Date(2026, 6, 28, 9, 1).toISOString(),
        user: 'admin@mint.gov.et',
        action: 'ASSIGNMENT_CREATED',
        resource: 'Assignment #assign_19',
        details: 'Assigned supervisor to student',
        ip_address: '192.168.1.100',
      },
      {
        id: '6',
        timestamp: new Date(2026, 6, 27, 16, 30).toISOString(),
        user: 'coordinator.aau@aau.edu.et',
        action: 'APPLICATION_SUBMITTED',
        resource: 'Application #app_30',
        details: 'Submitted new internship application',
        ip_address: '192.168.1.110',
      },
      {
        id: '7',
        timestamp: new Date(2026, 6, 27, 15, 45).toISOString(),
        user: 'admin@mint.gov.et',
        action: 'APPLICATION_REJECTED',
        resource: 'Application #app_8',
        details: 'Rejected application - GPA below minimum',
        ip_address: '192.168.1.100',
      },
      {
        id: '8',
        timestamp: new Date(2026, 6, 27, 14, 20).toISOString(),
        user: 'supervisor2@mint.gov.et',
        action: 'EVALUATION_PUBLISHED',
        resource: 'Evaluation #eval_1',
        details: 'Published final evaluation for student',
        ip_address: '192.168.1.106',
      },
    ];
    setLogs(mockLogs);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'all' || log.action.toLowerCase().includes(filter.toLowerCase());
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getActionColor = (action: string) => {
    if (action.includes('APPROVED') || action.includes('PUBLISHED') || action.includes('CREATED')) {
      return 'bg-green-100 text-green-800';
    }
    if (action.includes('REJECTED') || action.includes('DELETED')) {
      return 'bg-red-100 text-red-800';
    }
    if (action.includes('SUBMITTED') || action.includes('REVIEWED')) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const handleExport = () => {
    alert('Exporting audit logs to CSV...');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-sm text-gray-600 mt-1">Track all system activities and user actions</p>
          </div>
          <Button variant="primary" onClick={handleExport}>
            Export Logs
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{logs.length}</div>
              <div className="text-sm text-gray-600">Total Actions</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {logs.filter(l => l.action.includes('APPROVED') || l.action.includes('CREATED')).length}
              </div>
              <div className="text-sm text-gray-600">Approvals/Creates</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {logs.filter(l => l.action.includes('SUBMITTED')).length}
              </div>
              <div className="text-sm text-gray-600">Submissions</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {logs.filter(l => l.action.includes('REJECTED')).length}
              </div>
              <div className="text-sm text-gray-600">Rejections</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="search"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              <Input
                type="date"
                label="From Date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <Input
                type="date"
                label="To Date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-mint-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Actions
              </button>
              <button
                onClick={() => setFilter('application')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'application'
                    ? 'bg-mint-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => setFilter('milestone')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'milestone'
                    ? 'bg-mint-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Milestones
              </button>
              <button
                onClick={() => setFilter('user')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'user'
                    ? 'bg-mint-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setFilter('evaluation')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'evaluation'
                    ? 'bg-mint-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Evaluations
              </button>
            </div>
          </div>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {log.resource}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.details}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ip_address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
