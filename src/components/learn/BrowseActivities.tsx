import React, { useState } from 'react';
import { BookOpen, Search, ChevronRight, Filter, Plus, User, X } from 'lucide-react';
import { UserProfile, Activity } from '../../../types';
import { db, auth } from '../../firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

interface BrowseActivitiesProps {
  students: UserProfile[];
  onAssign?: (activityId: string) => void;
}

const BrowseActivities: React.FC<BrowseActivitiesProps> = ({ students, onAssign }) => {
  const [activeSubject, setActiveSubject] = useState<'Maths' | 'English' | 'Science' | '11+'>('Maths');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [assigningActivity, setAssigningActivity] = useState<any | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const keyStages = [
    {
      name: 'Key stage 1',
      years: [
        { name: 'Year 1', activities: 254, topics: 25, ages: '5-6' },
        { name: 'Year 2', activities: 250, topics: 26, ages: '6-7' },
      ]
    },
    {
      name: 'Key stage 2',
      years: [
        { name: 'Year 3', activities: 285, topics: 25, ages: '7-8' },
        { name: 'Year 4', activities: 290, topics: 28, ages: '8-9' },
        { name: 'Year 5', activities: 349, topics: 32, ages: '9-10' },
        { name: 'Year 6', activities: 315, topics: 36, ages: '10-11' },
      ]
    },
    {
      name: 'Key stage 3',
      years: [
        { name: 'Year 7', activities: 225, topics: 34, ages: '11-12' },
        { name: 'Year 8', activities: 269, topics: 34, ages: '12-13' },
        { name: 'Year 9', activities: 230, topics: 29, ages: '13-14' },
      ]
    },
    {
      name: 'Key stage 4',
      years: [
        { name: 'Year 10', activities: 312, topics: 42, ages: '14-15' },
        { name: 'Year 11', activities: 285, topics: 38, ages: '15-16' },
      ]
    }
  ];

  const subjects = [
    { id: 'Maths', label: 'Maths', color: 'bg-green-500', icon: '📐' },
    { id: 'English', label: 'English', color: 'bg-orange-500', icon: '📝' },
    { id: 'Science', label: 'Science', color: 'bg-purple-500', icon: '🧪' },
    { id: '11+', label: '11+', color: 'bg-red-500', icon: '🎓' },
  ];

  // Mock activities for the selected year
  const mockActivities = [
    { id: 'act_1', title: 'Addition & Subtraction Mastery', points: 10, type: 'Worksheet' },
    { id: 'act_2', title: 'Geometry Basics', points: 15, type: 'Quiz' },
    { id: 'act_3', title: 'Word Problems Level 1', points: 20, type: 'Interactive' },
  ];

  const handleAssign = async (student: UserProfile) => {
    if (!assigningActivity) return;
    setIsAssigning(true);
    try {
      const assignmentRef = doc(collection(db, 'assignments'));
      await setDoc(assignmentRef, {
        id: assignmentRef.id,
        parentUid: auth.currentUser?.uid,
        studentUid: student.uid,
        activityId: assigningActivity.id,
        activityTitle: assigningActivity.title,
        subject: activeSubject,
        status: 'pending',
        assignedAt: new Date().toISOString()
      });
      setAssigningActivity(null);
      alert(`Assigned "${assigningActivity.title}" to ${student.name}`);
    } catch (error) {
      console.error("Error assigning activity:", error);
      alert("Failed to assign activity. Please check permissions.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-8">
      {selectedYear ? (
        <div className="space-y-6">
          <button 
            onClick={() => setSelectedYear(null)}
            className="flex items-center text-blue-600 font-bold hover:underline"
          >
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Year Groups
          </button>
          
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {selectedYear} - {activeSubject}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-xl mb-4">
                  {subjects.find(s => s.id === activeSubject)?.icon}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{activity.title}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{activity.type}</span>
                  <button 
                    onClick={() => setAssigningActivity(activity)}
                    className="flex items-center text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg hover:bg-blue-100 transition-all"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setActiveSubject(subject.id as any)}
                  className={`flex items-center px-4 py-2 rounded-lg font-bold transition-all ${
                    activeSubject === subject.id
                      ? `${subject.color} text-white shadow-lg scale-105`
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="mr-2">{subject.icon}</span>
                  {subject.label}
                </button>
              ))}
            </div>

            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-12">
            {keyStages.map((ks) => (
              <div key={ks.name} className="space-y-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">
                  {ks.name}
                </h2>
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
                  {ks.years.map((year) => (
                    <button
                      key={year.name}
                      onClick={() => setSelectedYear(year.name)}
                      className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
                    >
                      <div className="text-left">
                        <div className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {year.name}
                        </div>
                        <div className="text-sm text-slate-500 flex items-center gap-2">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{year.activities} activities</span>
                          <span>•</span>
                          <span>{year.topics} topics</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-400">Ages {year.ages}</span>
                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Assign Modal */}
      {assigningActivity && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Assign Activity</h2>
                <button onClick={() => setAssigningActivity(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                  <X className="h-6 w-6 text-slate-500" />
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Activity</div>
                <div className="font-bold text-slate-900 dark:text-white">{assigningActivity.title}</div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Select Student</label>
                {students.length > 0 ? (
                  <div className="space-y-2">
                    {students.map((student) => (
                      <button
                        key={student.uid}
                        disabled={isAssigning}
                        onClick={() => handleAssign(student)}
                        className="w-full flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group"
                      >
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                          {student.name.charAt(0)}
                        </div>
                        <div className="text-left flex-grow">
                          <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                          <div className="text-xs text-slate-500">{student.yearGroup}</div>
                        </div>
                        <Plus className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No students found. Please add a student first.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseActivities;
