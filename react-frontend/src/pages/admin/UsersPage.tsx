// Admin - User Management Page (FR-ACCT)
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, Button, LoadingSpinner, EmptyState, Modal, Input, Select, StatusBadge } from '../../components/common';
import { User, UserRole, UserStatus } from '../../types';
import { allMockUsers } from '../../services/mock-data.service';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | UserRole>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: UserRole.STUDENT,
    status: UserStatus.ACTIVE,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(allMockUsers);
      setIsLoading(false);
    }, 500);
  };

  const filteredUsers = users.filter((user) => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = 
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getFilterCount = (role: 'all' | UserRole) => {
    if (role === 'all') return users.length;
    return users.filter(u => u.role === role).length;
  };

  const handleAddUser = () => {
    // Create new user in mock storage
    const newUser: User = {
      user_id: `user_${Date.now()}`,
      email: formData.email,
      full_name: formData.full_name,
      role: formData.role,
      status: formData.status,
      created_at: new Date().toISOString(),
    };
    
    // Add to users list
    setUsers([...users, newUser]);
    
    // Show success message
    alert(`✅ User ${formData.full_name} created successfully!`);
    
    setShowAddModal(false);
    setFormData({
      email: '',
      full_name: '',
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;
    
    // Update user in the list
    setUsers(users.map(u => 
      u.user_id === selectedUser.user_id 
        ? { ...u, ...formData }
        : u
    ));
    
    alert(`✅ User ${formData.full_name} updated successfully!`);
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
    if (window.confirm(`Are you sure you want to ${newStatus === UserStatus.ACTIVE ? 'activate' : 'deactivate'} ${user.full_name}?`)) {
      // Update user status
      setUsers(users.map(u => 
        u.user_id === user.user_id 
          ? { ...u, status: newStatus }
          : u
      ));
      
      alert(`✅ User ${user.full_name} ${newStatus === UserStatus.ACTIVE ? 'activated' : 'deactivated'} successfully!`);
    }
  };

  const handleResetPassword = (user: User) => {
    if (window.confirm(`Send password reset email to ${user.email}?`)) {
      alert(`✅ Password reset email sent to ${user.email}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{users.length}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {users.filter(u => u.role === UserRole.STUDENT).length}
              </div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {users.filter(u => u.role === UserRole.SUPERVISOR).length}
              </div>
              <div className="text-sm text-gray-600">Supervisors</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {users.filter(u => u.status === UserStatus.ACTIVE).length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <div className="space-y-4">
            <Input
              type="search"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-mint-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({getFilterCount('all')})
              </button>
              <button
                onClick={() => setFilter(UserRole.STUDENT)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === UserRole.STUDENT
                    ? 'bg-mint-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Students ({getFilterCount(UserRole.STUDENT)})
              </button>
              <button
                onClick={() => setFilter(UserRole.SUPERVISOR)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === UserRole.SUPERVISOR
                    ? 'bg-mint-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Supervisors ({getFilterCount(UserRole.SUPERVISOR)})
              </button>
              <button
                onClick={() => setFilter(UserRole.UNIVERSITY)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === UserRole.UNIVERSITY
                    ? 'bg-mint-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Universities ({getFilterCount(UserRole.UNIVERSITY)})
              </button>
              <button
                onClick={() => setFilter(UserRole.ADMIN)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === UserRole.ADMIN
                    ? 'bg-mint-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admins ({getFilterCount(UserRole.ADMIN)})
              </button>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading users..." />
            </div>
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              title="No users found"
              description="Try adjusting your search or filter criteria"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => handleEditUser(user)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant={user.status === UserStatus.ACTIVE ? 'danger' : 'success'}
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.status === UserStatus.ACTIVE ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleResetPassword(user)}>
                          Reset Password
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New User">
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            required
          >
            <option value={UserRole.STUDENT}>Student</option>
            <option value={UserRole.SUPERVISOR}>Supervisor</option>
            <option value={UserRole.UNIVERSITY}>University Coordinator</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </Select>
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
            required
          >
            <option value={UserStatus.ACTIVE}>Active</option>
            <option value={UserStatus.INACTIVE}>Inactive</option>
          </Select>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddUser}>
              Add User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit User">
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled
          />
          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            required
          >
            <option value={UserRole.STUDENT}>Student</option>
            <option value={UserRole.SUPERVISOR}>Supervisor</option>
            <option value={UserRole.UNIVERSITY}>University Coordinator</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </Select>
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
            required
          >
            <option value={UserStatus.ACTIVE}>Active</option>
            <option value={UserStatus.INACTIVE}>Inactive</option>
          </Select>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateUser}>
              Update User
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
