import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db, auth } from '../../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  setDoc, 
  doc,
  getDocs
} from 'firebase/firestore';
import { 
  Users, 
  BarChart3, 
  Trophy, 
  CreditCard, 
  Plus, 
  LogOut, 
  BookOpen, 
  CheckCircle2,
  Clock,
  ChevronRight,
  Settings
} from 'lucide-react';
import { UserProfile, Reward, Score, Activity } from '../../../types';
import { signOut } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';
import BrowseActivities from './BrowseActivities';
import AssignedActivities from './AssignedActivities';
import CompletedActivities from './CompletedActivities';
import StudentSettings from './StudentSettings';

interface ParentDashboardProps {
  onSwitchView?: () => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ onSwitchView }) => {
  const { user, profile } = useAuth();
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'rewards' | 'billing' | 'browse' | 'assigned' | 'completed'>('overview');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<UserProfile | null>(null);
  
  // New student form state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentYear, setNewStudentYear] = useState('Year 1');
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      const q = query(collection(db, 'users'), where('parentUid', '==', user.uid));
      const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          setStudents(snapshot.docs.map(doc => doc.data() as UserProfile));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'users');
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid) {
      const q = query(collection(db, 'rewards'), where('parentUid', '==', user.uid));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setRewards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reward)));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'rewards');
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    // In a real app, we'd use a cloud function to create a firebase auth user
    // For this demo, we'll just create a document in Firestore
    // and assume the student logs in with a generated username/password
    const studentUid = `student_${Math.random().toString(36).substr(2, 9)}`;
    const setupToken = Math.random().toString(36).substr(2, 12);
    const newStudent: UserProfile = {
      uid: studentUid,
      email: `${studentUid}@studymate.local`,
      username: `${newStudentName.toLowerCase().replace(/\s+/g, '')}${Math.floor(Math.random() * 1000)}`,
      role: 'student',
      name: newStudentName,
      parentUid: user.uid,
      yearGroup: newStudentYear,
      birthMonth: 1,
      birthYear: 2015,
      recommenderEnabled: true,
      selfAssignEnabled: true,
      setupToken: setupToken,
      points: 0,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', studentUid), newStudent);
    setInviteLink(`${window.location.origin}/setup?token=${setupToken}`);
    setNewStudentName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-blue-600">StudyMate</div>
          <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Parent Portal</div>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'browse', label: 'Browse activities', icon: BookOpen },
            { id: 'assigned', label: 'Assigned activities', icon: Clock },
            { id: 'completed', label: 'Completed activities', icon: CheckCircle2 },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'rewards', label: 'Rewards', icon: Trophy },
            { id: 'billing', label: 'Subscription', icon: CreditCard },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-xl transition-all"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hello, {profile?.name}!</h1>
            <p className="text-slate-500 dark:text-slate-400">Welcome back to your parent dashboard.</p>
          </div>
          <div className="flex gap-4">
            {onSwitchView && (
              <button 
                onClick={onSwitchView}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-bold flex items-center hover:bg-blue-50 transition-all"
              >
                <Users className="h-4 w-4 mr-2" />
                Switch to Student View
              </button>
            )}
            <button 
              onClick={() => setShowAddStudent(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold flex items-center hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+1 this month</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{students.length}</div>
                <div className="text-sm text-slate-500">Active Students</div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
                <div className="text-sm text-slate-500">Activities Completed</div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
                <div className="text-sm text-slate-500">Rewards Achieved</div>
              </div>
            </div>

            {/* Students List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Students</h2>
                <button 
                  onClick={() => setActiveTab('students')}
                  className="text-sm text-blue-600 font-bold hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {students.length > 0 ? students.map((student) => (
                  <div key={student.uid} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xl">
                        {student.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                        <div className="text-sm text-slate-500">{student.yearGroup}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{student.points || 0} pts</div>
                        <div className="text-xs text-slate-500">Total Score</div>
                      </div>
                      <div className="w-32 bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: '40%' }}></div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-all">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center">
                    <div className="text-slate-400 mb-4">No students added yet.</div>
                    <button 
                      onClick={() => setShowAddStudent(true)}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Add your first student
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'browse' && <BrowseActivities students={students} />}
        {activeTab === 'assigned' && <AssignedActivities students={students} />}
        {activeTab === 'completed' && <CompletedActivities students={students} />}

        {activeTab === 'students' && (
          <div className="space-y-6">
            {editingStudent ? (
              <StudentSettings 
                student={editingStudent} 
                onBack={() => setEditingStudent(null)} 
              />
            ) : (
              <>
                <div className="bg-[#1a103d] p-4 rounded-t-xl -mx-8 -mt-8 mb-8 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Manage students</h2>
                </div>

                <div className="flex justify-end mb-6">
                  <button 
                    onClick={() => setShowAddStudent(true)}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all"
                  >
                    Upgrade to add student
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-xs font-bold text-teal-500 uppercase tracking-wider">Active students</span>
                  </div>
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {students.map((student) => (
                      <div key={student.uid} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group">
                        <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                        <button 
                          onClick={() => setEditingStudent(student)}
                          className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-all"
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                    {students.length === 0 && (
                      <div className="p-12 text-center text-slate-500">
                        No students added yet.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Rewards & Incentives</h2>
                <p className="text-slate-500">Set goals and rewards to motivate your children.</p>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold flex items-center hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20">
                <Plus className="h-4 w-4 mr-2" />
                Create Reward
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rewards.length > 0 ? rewards.map((reward) => (
                <div key={reward.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{reward.description}</h3>
                    <p className="text-sm text-slate-500 mb-4">For: {students.find(s => s.uid === reward.studentUid)?.name || 'Student'}</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs font-bold text-purple-600 uppercase tracking-wider">Target</div>
                        <div className="text-xl font-black text-slate-900 dark:text-white">{reward.pointsRequired} pts</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        reward.status === 'achieved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {reward.status}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-purple-600/5 rounded-full"></div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                  <Trophy className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">No rewards set yet</h3>
                  <p className="text-slate-500 mb-6">Create your first reward to start motivating your students!</p>
                  <button className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all">
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Subscription Plan</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30 mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-blue-600 font-bold uppercase tracking-wider text-xs mb-1">Current Plan</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">Free Account</div>
                    <p className="text-slate-500 mt-2">Up to 5 activities a month for 1 student.</p>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">£0</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Upgrade to Premium</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 border-2 border-blue-600 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">Popular</div>
                    <div className="font-bold text-lg mb-1">Monthly Individual</div>
                    <div className="text-2xl font-bold mb-4">£17.99<span className="text-sm font-normal text-slate-500">/mo</span></div>
                    <ul className="text-sm space-y-2 mb-6">
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> Unlimited activities</li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> 1 student account</li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> Advanced AI Recommender</li>
                    </ul>
                    <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">Subscribe Now</button>
                  </div>
                  
                  <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-2xl">
                    <div className="font-bold text-lg mb-1">Monthly Family</div>
                    <div className="text-2xl font-bold mb-4">£24.99<span className="text-sm font-normal text-slate-500">/mo</span></div>
                    <ul className="text-sm space-y-2 mb-6">
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> Unlimited activities</li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> 2+ student accounts</li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> Advanced AI Recommender</li>
                    </ul>
                    <button className="w-full py-3 border border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all">Subscribe Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8">
              {inviteLink ? (
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Student Added!</h2>
                    <p className="text-slate-500 dark:text-slate-400">Share this link with your child to finish their setup.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl border border-slate-200 dark:border-slate-600 break-all text-sm font-mono text-blue-600 dark:text-blue-400">
                    {inviteLink}
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(inviteLink);
                      alert('Link copied to clipboard!');
                    }}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                  >
                    Copy Link
                  </button>
                  <button 
                    onClick={() => {
                      setShowAddStudent(false);
                      setInviteLink(null);
                    }}
                    className="w-full py-3 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 transition-all"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create your child's account</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">Tell us about them to start their learning journey.</p>
                  
                  <form onSubmit={handleAddStudent} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student first name*</label>
                      <input
                        type="text"
                        required
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g., Yaya"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start their journey with work from*</label>
                      <select
                        value={newStudentYear}
                        onChange={(e) => setNewStudentYear(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'GCSE'].map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        type="button"
                        onClick={() => setShowAddStudent(false)}
                        className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
