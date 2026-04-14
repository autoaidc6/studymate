import React, { useState, useEffect } from 'react';
import { ArrowLeft, Info, HelpCircle, ChevronDown, Loader2 } from 'lucide-react';
import { UserProfile } from '../../../types';
import { db, auth } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail, sendSignInLinkToEmail } from 'firebase/auth';

interface StudentSettingsProps {
  student: UserProfile;
  onBack: () => void;
}

const StudentSettings: React.FC<StudentSettingsProps> = ({ student, onBack }) => {
  const [formData, setFormData] = useState({
    name: student.name || '',
    username: student.username || '',
    birthMonth: student.birthMonth || 1,
    birthYear: student.birthYear || 2015,
    school: student.school || '',
    yearGroup: student.yearGroup || 'Year 1',
    recommenderEnabled: student.recommenderEnabled ?? true,
    selfAssignEnabled: student.selfAssignEnabled ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isSendingMagic, setIsSendingMagic] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Generate username suggestions based on name
    if (formData.name.length >= 2) {
      const base = formData.name.toLowerCase().replace(/\s+/g, '');
      const newSuggestions = [
        `${base}${Math.floor(Math.random() * 1000)}`,
        `${base}${Math.floor(Math.random() * 1000)}`,
        `${base}${Math.floor(Math.random() * 1000)}`,
      ];
      setSuggestions(newSuggestions);
    }
  }, [formData.name]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const studentRef = doc(db, 'users', student.uid);
      await updateDoc(studentRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      alert('Student settings saved successfully!');
      onBack();
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!student.email || student.email.includes('@studymate.local')) {
      alert('This student has not finished setting up their account with a real email address yet.');
      return;
    }

    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, student.email);
      alert(`Password reset email sent to ${student.email}`);
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      alert('Failed to send password reset email: ' + error.message);
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleSendMagicLink = async () => {
    if (!student.email || student.email.includes('@studymate.local')) {
      alert('This student has not finished setting up their account with a real email address yet.');
      return;
    }

    setIsSendingMagic(true);
    try {
      const actionCodeSettings = {
        url: window.location.origin + '/learn',
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, student.email, actionCodeSettings);
      // Save the email locally so we can use it to complete the sign-in on the same device if needed
      window.localStorage.setItem('emailForSignIn', student.email);
      alert(`Magic login link sent to ${student.email}`);
    } catch (error: any) {
      console.error('Error sending magic link:', error);
      alert('Failed to send magic link: ' + error.message);
    } finally {
      setIsSendingMagic(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-600 dark:text-slate-400 hover:text-blue-600 mb-6 transition-all"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span className="font-bold">Student settings</span>
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-teal-500 mb-6">{formData.name || 'Student'}</h2>
            
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                />
                {suggestions.length > 0 && (
                  <div className="mt-2 text-xs text-slate-500">
                    <span className="italic font-medium">Suggestion: </span>
                    {suggestions.map((s, idx) => (
                      <button 
                        key={s} 
                        onClick={() => setFormData({ ...formData, username: s })}
                        className="text-teal-600 hover:underline mr-2"
                      >
                        {s}{idx < suggestions.length - 1 ? ',' : ''}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Birth Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Month and year of birth (MM / YYYY)*</label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={formData.birthMonth}
                      onChange={(e) => setFormData({ ...formData, birthMonth: parseInt(e.target.value) })}
                      className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                      placeholder="MM"
                    />
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.birthYear}
                      onChange={(e) => setFormData({ ...formData, birthYear: parseInt(e.target.value) })}
                      className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                      placeholder="YYYY"
                    />
                  </div>
                </div>
              </div>

              {/* School */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Type to connect your child's school</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="Type to connect your child's school"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Year Group */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Year group</label>
                <select
                  value={formData.yearGroup}
                  onChange={(e) => setFormData({ ...formData, yearGroup: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all appearance-none"
                >
                  {['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'GCSE'].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-bold text-slate-900 dark:text-white mr-2">Recommender</span>
                    <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                  </div>
                  <button 
                    onClick={() => setFormData({ ...formData, recommenderEnabled: !formData.recommenderEnabled })}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData.recommenderEnabled ? 'bg-teal-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.recommenderEnabled ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-bold text-slate-900 dark:text-white mr-2">Self assign</span>
                    <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                  </div>
                  <button 
                    onClick={() => setFormData({ ...formData, selfAssignEnabled: !formData.selfAssignEnabled })}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData.selfAssignEnabled ? 'bg-teal-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.selfAssignEnabled ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-6 pt-4 text-sm font-bold text-teal-600">
                <button 
                  onClick={handleChangePassword}
                  disabled={isSendingReset}
                  className="hover:underline flex items-center disabled:opacity-50"
                >
                  {isSendingReset && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
                  Change password
                </button>
                <button 
                  onClick={handleSendMagicLink}
                  disabled={isSendingMagic}
                  className="hover:underline flex items-center disabled:opacity-50"
                >
                  {isSendingMagic && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
                  Send a magic login link
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-8 bg-slate-50 dark:bg-slate-700/50 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;
