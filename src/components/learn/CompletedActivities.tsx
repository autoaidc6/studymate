import React from 'react';
import { CheckCircle2, Star, User, Calendar } from 'lucide-react';
import { Score, UserProfile } from '../../../types';

interface CompletedActivitiesProps {
  students: UserProfile[];
}

const CompletedActivities: React.FC<CompletedActivitiesProps> = ({ students }) => {
  // In a real app, we'd fetch this from 'scores' collection
  const mockCompleted = [
    {
      id: '1',
      title: 'Multiplication Tables',
      subject: 'Maths',
      studentName: 'Yaya',
      score: 95,
      completedAt: '2024-03-10',
      pointsEarned: 10
    },
    {
      id: '2',
      title: 'Punctuation Practice',
      subject: 'English',
      studentName: 'Yaya',
      score: 88,
      completedAt: '2024-03-08',
      pointsEarned: 10
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Achievements</h2>
          <p className="text-sm text-slate-500">Activities your children have successfully completed.</p>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {mockCompleted.map((item) => (
            <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center text-xs text-slate-500">
                      <User className="h-3 w-3 mr-1" />
                      {item.studentName}
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {item.completedAt}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-lg font-black text-blue-600">{item.score}%</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
                </div>
                <div className="flex items-center px-3 py-1 bg-orange-50 dark:bg-orange-900/20 rounded-full border border-orange-100 dark:border-orange-800/30">
                  <Star className="h-3 w-3 text-orange-500 mr-1 fill-orange-500" />
                  <span className="text-xs font-bold text-orange-700 dark:text-orange-300">+{item.pointsEarned}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedActivities;
