import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc,
  getDocs
} from 'firebase/firestore';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Plus, 
  Trash2, 
  Search,
  Filter,
  BarChart3,
  Settings
} from 'lucide-react';
import { Activity, UserProfile } from '../../../types';
import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';

const AdminDashboard: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'users'>('overview');
  const [showAddActivity, setShowAddActivity] = useState(false);

  // New activity state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<'Maths' | 'English' | 'Science'>('Maths');
  const [newYear, setNewYear] = useState('Year 1');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'activities'), 
      (snapshot) => {
        setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity)));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'activities');
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'), 
      (snapshot) => {
        setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'users');
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    const activity: Partial<Activity> = {
      title: newTitle,
      subject: newSubject,
      yearGroup: newYear,
      type: 'Worksheet',
      pointsValue: 10,
      createdAt: new Date().toISOString()
    };
    await addDoc(collection(db, 'activities'), activity);
    setShowAddActivity(false);
    setNewTitle('');
  };

  const handleDeleteActivity = async (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      await deleteDoc(doc(db, 'activities', id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="text-2xl font-bold text-blue-500">StudyMate</div>
          <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Admin Panel</div>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'activities', label: 'Activities', icon: BookOpen },
            { id: 'users', label: 'User Management', icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{activeTab}</h1>
          {activeTab === 'activities' && (
            <button 
              onClick={() => setShowAddActivity(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold flex items-center hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Activity
            </button>
          )}
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: users.length, icon: Users, color: 'blue' },
                { label: 'Activities', value: activities.length, icon: BookOpen, color: 'green' },
                { label: 'Parents', value: users.filter(u => u.role === 'parent').length, icon: Users, color: 'purple' },
                { label: 'Students', value: users.filter(u => u.role === 'student').length, icon: Users, color: 'orange' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className={`w-10 h-10 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg flex items-center justify-center mb-4`}>
                    <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search activities..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400">
                <Filter className="h-5 w-5" />
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Year Group</th>
                  <th className="px-6 py-4">Points</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{activity.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        activity.subject === 'Maths' ? 'bg-green-100 text-green-700' : 
                        activity.subject === 'English' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {activity.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{activity.yearGroup}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{activity.pointsValue}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add Activity Modal */}
      {showAddActivity && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Create New Activity</h2>
              <form onSubmit={handleAddActivity} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Activity Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., Fractions Basics"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                    <select
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value as any)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Maths">Maths</option>
                      <option value="English">English</option>
                      <option value="Science">Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Year Group</label>
                    <select
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'GCSE'].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddActivity(false)}
                    className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
