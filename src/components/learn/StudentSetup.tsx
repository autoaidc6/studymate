import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteField } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'motion/react';
import { Mail, Lock, User, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { UserProfile } from '../../../types';

interface StudentSetupProps {
  onComplete: () => void;
}

const StudentSetup: React.FC<StudentSetupProps> = ({ onComplete }) => {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentDoc, setStudentDoc] = useState<UserProfile | null>(null);
  const [step, setStep] = useState<'token' | 'account' | 'success'>('token');

  useEffect(() => {
    // Check for token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    }
  }, []);

  const validateToken = async (tokenToValidate: string) => {
    if (!tokenToValidate) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'users'), where('setupToken', '==', tokenToValidate));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setError('Invalid or expired setup token. Please ask your parent for a new link.');
      } else {
        const docData = snapshot.docs[0].data() as UserProfile;
        setStudentDoc(docData);
        setStep('account');
      }
    } catch (err: any) {
      setError('Error validating token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!studentDoc) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Create Firebase Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // 2. Update the existing Firestore document
      // We need to find the doc again to get its ID
      if (!token) {
        setError('Token is missing.');
        setLoading(false);
        return;
      }
      const q = query(collection(db, 'users'), where('setupToken', '==', token));
      const snapshot = await getDocs(q);
      const docId = snapshot.docs[0].id;

      await updateDoc(doc(db, 'users', docId), {
        uid: newUser.uid,
        email: email,
        setupToken: deleteField(),
        updatedAt: new Date().toISOString()
      });

      setStep('success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-blue-600">StudyMate</div>
          <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Student Setup</div>
        </div>

        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-200 dark:border-slate-700">
          {step === 'token' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">Enter Setup Token</h2>
                <p className="text-sm text-slate-500 text-center mb-6">Enter the token your parent shared with you.</p>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono uppercase tracking-widest"
                  placeholder="TOKEN123"
                />
              </div>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
              <button
                onClick={() => validateToken(token)}
                disabled={loading || !token}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Continue'}
              </button>
            </div>
          )}

          {step === 'account' && studentDoc && (
            <form onSubmit={handleSetup} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome, {studentDoc.name}!</h2>
                <p className="text-sm text-slate-500">Create your login details to start learning.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Create Password</label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Finish Setup'}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Setup Complete!</h2>
                <p className="text-slate-500">Your account is ready. You can now log in and start learning.</p>
              </div>
              <button
                onClick={onComplete}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSetup;
