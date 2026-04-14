import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db, auth } from '../../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc,
  updateDoc,
  increment,
  addDoc
} from 'firebase/firestore';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  BarChart3, 
  LogOut, 
  Star, 
  Clock, 
  ChevronRight,
  CheckCircle2,
  Layout,
  Award
} from 'lucide-react';
import { Activity, Score, Reward, UserProfile } from '../../../types';
import { signOut } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';

interface StudentDashboardProps {
  onSwitchView?: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onSwitchView }) => {
  const { profile } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'activities' | 'progress' | 'rewards'>('home');

  useEffect(() => {
    if (profile?.yearGroup) {
      const q = query(collection(db, 'activities'), where('yearGroup', '==', profile.yearGroup));
      const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          setActivities(snapshot.docs.map(doc => doc.data() as Activity));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'activities');
        }
      );
      return () => unsubscribe();
    }
  }, [profile]);

  useEffect(() => {
    if (profile?.uid) {
      const q = query(collection(db, 'scores'), where('userUid', '==', profile.uid));
      const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          setScores(snapshot.docs.map(doc => doc.data() as Score));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'scores');
        }
      );
      return () => unsubscribe();
    }
  }, [profile]);

  useEffect(() => {
    if (profile?.uid) {
      const q = query(collection(db, 'rewards'), where('studentUid', '==', profile.uid));
      const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          setRewards(snapshot.docs.map(doc => doc.data() as Reward));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'rewards');
        }
      );
      return () => unsubscribe();
    }
  }, [profile]);

  const mockActivities: Partial<Activity>[] = [
    { id: '1', title: 'Apply New Vocabulary', subject: 'English', pointsValue: 10, type: 'Worksheet' },
    { id: '2', title: 'Calculate Probability', subject: 'Maths', pointsValue: 10, type: 'Quiz' },
    { id: '3', title: 'Investigate the Use of Language', subject: 'English', pointsValue: 10, type: 'Worksheet' },
    { id: '4', title: 'Explore Pure Substances', subject: 'Science', pointsValue: 10, type: 'Worksheet' },
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities as Activity[];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-blue-600">StudyMate</div>
          <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Student Portal</div>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'activities', label: 'Activities', icon: BookOpen },
            { id: 'progress', label: 'Progress', icon: BarChart3 },
            { id: 'rewards', label: 'Rewards', icon: Trophy },
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Hi {profile?.name}</h1>
            <p className="text-slate-500 dark:text-slate-400">Ready to learn something new today?</p>
          </div>
          <div className="flex items-center gap-4">
            {onSwitchView && (
              <button 
                onClick={onSwitchView}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-bold flex items-center hover:bg-blue-50 transition-all"
              >
                <Layout className="h-4 w-4 mr-2" />
                Back to Parent View
              </button>
            )}
            <div className="flex items-center bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full border border-orange-200 dark:border-orange-800">
              <Star className="h-5 w-5 text-orange-500 mr-2 fill-orange-500" />
              <span className="font-bold text-orange-700 dark:text-orange-300">{profile?.points || 0} points</span>
            </div>
          </div>
        </header>

        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-orange-500 font-bold mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {scores.length} activities completed
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">View your assigned activities</h2>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden mb-6">
                    <div className="bg-orange-500 h-full w-1/2"></div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('activities')}
                    className="flex items-center text-blue-600 font-bold hover:underline"
                  >
                    Go to activities <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-orange-500/5 rounded-full"></div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Trophy className="h-6 w-6 text-purple-600 mr-3" />
                  Next Reward
                </h2>
                {rewards.length > 0 ? (
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">{rewards[0].description}</div>
                    <div className="text-sm text-slate-500 mb-4">{rewards[0].pointsRequired - (profile?.points || 0)} points to go!</div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full" 
                        style={{ width: `${Math.min(100, ((profile?.points || 0) / rewards[0].pointsRequired) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-500 text-sm mb-4">Ask your parent to set a reward for you!</p>
                    <Award className="h-12 w-12 text-slate-200 mx-auto" />
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Activities */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Assigned to you</h2>
                <div className="flex gap-2">
                  {['All', 'Maths', 'English', 'Science'].map(s => (
                    <button key={s} className={`px-3 py-1 rounded-full text-xs font-bold ${s === 'All' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {displayActivities.map((activity) => (
                  <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer group">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                        activity.subject === 'Maths' ? 'bg-green-500' : 
                        activity.subject === 'English' ? 'bg-orange-500' : 'bg-purple-600'
                      }`}>
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{activity.title}</div>
                        <div className="flex items-center mt-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full mr-3 ${
                            activity.subject === 'Maths' ? 'bg-green-100 text-green-700' : 
                            activity.subject === 'English' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {activity.subject}
                          </span>
                          <span className="text-xs text-slate-500">Assigned By: Parent</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center text-orange-500 font-bold">
                        <Star className="h-4 w-4 mr-1 fill-orange-500" />
                        {activity.pointsValue}
                      </div>
                      <div className={`p-2 rounded-lg transition-all ${
                        activity.subject === 'Maths' ? 'bg-green-500 text-white' : 
                        activity.subject === 'English' ? 'bg-orange-500 text-white' : 'bg-purple-600 text-white'
                      }`}>
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
