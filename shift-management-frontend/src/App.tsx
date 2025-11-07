import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit2, Clock, User, Briefcase } from 'lucide-react';

interface Shift {
  id: number;
  employee_name: string;
  position: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}

export default function App() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  
  const [formData, setFormData] = useState({
    employee_name: '',
    position: '',
    start_time: '',
    end_time: '',
    status: 'scheduled',
    notes: ''
  });

  const API_URL = 'http://localhost:3001/api/shifts';

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch shifts');
      const data = await response.json();
      setShifts(data);
      setError('');
    } catch (err) {
      setError('Unable to load shifts. Make sure your API is running on port 3001.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.employee_name || !formData.position || !formData.start_time || !formData.end_time) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const url = editingShift ? `${API_URL}/${editingShift.id}` : API_URL;
      const method = editingShift ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shift: formData }),
      });

      if (!response.ok) throw new Error('Failed to save shift');
      
      await fetchShifts();
      resetForm();
      setError('');
    } catch (err) {
      setError('Failed to save shift');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteShift = async (id: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this shift?')) return;
    
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete shift');
      
      setShifts(shifts.filter(s => s.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete shift');
      console.error(err);
    }
  };

  const editShift = (shift: Shift) => {
    setEditingShift(shift);
    setFormData({
      employee_name: shift.employee_name,
      position: shift.position,
      start_time: shift.start_time?.slice(0, 16) || '',
      end_time: shift.end_time?.slice(0, 16) || '',
      status: shift.status,
      notes: shift.notes || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      employee_name: '',
      position: '',
      start_time: '',
      end_time: '',
      status: 'scheduled',
      notes: ''
    });
    setEditingShift(null);
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-800">Shift Management</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              data-cy="toggle-form-btn"
            >
              <Plus className="w-5 h-5" />
              {showForm ? 'Cancel' : 'Add Shift'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {showForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingShift ? 'Edit Shift' : 'Create New Shift'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Name *
                  </label>
                  <input
                    type="text"
                    value={formData.employee_name}
                    onChange={(e) => setFormData({...formData, employee_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    data-cy="employee-name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    data-cy="position"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    data-cy="start-time"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    data-cy="end-time"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    data-cy="status"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    data-cy="notes"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
                  data-cy="save-shift-btn"
                >
                  {editingShift ? 'Update Shift' : 'Create Shift'}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading && shifts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Loading shifts...</div>
          ) : shifts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No shifts scheduled yet. Create your first shift above!
            </div>
          ) : (
            shifts.map((shift) => (
              <div
                key={shift.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                data-cy="shift-item"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <User className="w-5 h-5 text-purple-600" />
                      <h3 className="text-xl font-semibold text-gray-800">
                        {shift.employee_name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(shift.status)}`}>
                        {shift.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{shift.position}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatDateTime(shift.start_time)} → {formatDateTime(shift.end_time)}
                        </span>
                      </div>
                      {shift.notes && (
                        <p className="text-sm text-gray-500 mt-2">📝 {shift.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editShift(shift)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      data-cy="edit-shift-btn"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteShift(shift.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      data-cy="delete-shift-btn"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}