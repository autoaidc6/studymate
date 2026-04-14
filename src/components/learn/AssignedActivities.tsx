import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, User, ChevronRight, Trash2 } from 'lucide-react';
import { Assignment, UserProfile } from '../../../types';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';
import { useAuth } from '../../contexts/AuthContext';

interface AssignedActivitiesProps {
  students: UserProfile[];
}

const AssignedActivities: React.FC<AssignedActivitiesProps> = ({ students }) => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      const q = query(collection(db, 'assignments'), where('parentUid', '==', user.uid));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment)));
          setLoading(false);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'assignments');
          setLoading(false);
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this assignment?')) {
      try {
        await deleteDoc(doc(db, 'assignments', id));
      } catch (error) {
        console.error("Error deleting assignment:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Currently Assigned</h2>
          <p className="text-sm text-slate-500">Activities your children are currently working on.</p>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading assignments...</div>
          ) : assignments.length > 0 ? (
            assignments.map((item) => (
              <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                    item.subject === 'Maths' ? 'bg-green-500' : 
                    item.subject === 'English' ? 'bg-orange-500' : 'bg-purple-500'
                  }`}>
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-slate-900 dark:text-white">{item.activityTitle}</div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center text-xs text-slate-500">
                        <User className="h-3 w-3 mr-1" />
                        {students.find(s => s.uid === item.studentUid)?.name || 'Student'}
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Assigned {new Date(item.assignedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === 'completed' ? 'bg-green-100 text-green-700' :
                    item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="text-slate-400 mb-4">No activities assigned yet.</div>
              <p className="text-sm text-slate-500">Browse activities to assign work to your students.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignedActivities;
