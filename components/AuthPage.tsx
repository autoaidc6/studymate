import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  FileUp, 
  CheckCircle, 
  BookOpen, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Mail
} from 'lucide-react';
import { signInWithPopup, googleProvider, auth } from '../firebase';

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onBack(); // Go back after successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const floatingIcons = [
    { icon: <ArrowUpRight className="w-6 h-6" />, label: "Progress", color: "bg-pink-500", delay: 0 },
    { icon: <FileUp className="w-6 h-6" />, label: "Upload", color: "bg-blue-500", delay: 1 },
    { icon: <CheckCircle className="w-6 h-6" />, label: "Quiz", color: "bg-orange-500", delay: 2 },
    { icon: <BookOpen className="w-6 h-6" />, label: "Flashcards", color: "bg-emerald-500", delay: 3 },
    { icon: <Sparkles className="w-6 h-6" />, label: "Prime Notes", color: "bg-purple-500", delay: 4 },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left Side: Auth Form */}
      <div className="w-full lg:w-1/2 p-6 sm:p-12 flex flex-col justify-center relative z-10">
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </button>

        <div className="max-w-md w-full mx-auto bg-[#1e293b] rounded-3xl p-8 shadow-2xl border border-slate-800">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-blue-500 p-2 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.669 0 3.218-.51 4.5-1.385A7.962 7.962 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385A7.962 7.962 0 015.5 4c-1.105 0-2.138.17-3 .482V15.5a.5.5 0 01-.5.5H1a.5.5 0 01-.5-.5V4.804zM14.5 15c-1.38 0-2.653-.433-3.682-1.222a.5.5 0 00-.636 0C9.153 14.567 7.88 15 6.5 15c-1.105 0-2.138-.17-3-.482V5.482c.862-.312 1.895-.482 3-.482 1.38 0 2.653.433 3.682 1.222a.5.5 0 00.636 0C11.847 5.433 13.12 5 14.5 5c1.105 0 2.138.17 3 .482v9.036c-.862.312-1.895.482-3 .482z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">StudyMate</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Get started studying smarter</h2>
          <p className="text-slate-400 text-sm mb-8">Create an account and get started in under 1 minute</p>

          {/* Tabs */}
          <div className="flex p-1 bg-[#0f172a] rounded-xl mb-8">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'login' ? 'bg-[#1e293b] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'signup' ? 'bg-[#1e293b] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Create Account
            </button>
          </div>

          {/* Google Button */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all shadow-lg mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full border-t border-slate-700"></div>
            <span className="absolute px-4 bg-[#1e293b] text-[10px] font-bold text-slate-500 tracking-widest uppercase">Or continue with email</span>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="My******"
                  className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="mt-2 text-[10px] text-slate-500">Minimum 6 characters, 1 uppercase and 1 number</p>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm password</label>
                <input 
                  type="password" 
                  placeholder="Repeat password"
                  className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-700 bg-[#0f172a] text-blue-600 focus:ring-blue-500 focus:ring-offset-[#1e293b]" />
                  <span className="text-xs text-slate-400 leading-relaxed">
                    I accept the <a href="#" className="text-blue-500 hover:underline">Terms & Conditions</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                  </span>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-700 bg-[#0f172a] text-blue-600 focus:ring-blue-500 focus:ring-offset-[#1e293b]" />
                  <span className="text-xs text-slate-400 leading-relaxed">
                    Receive updates and offers from StudyMate. <span className="block text-[10px] text-slate-500">You can unsubscribe anytime in settings.</span>
                  </span>
                </label>
              </div>
            )}

            <button 
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4"
            >
              {mode === 'signup' ? 'Create Account' : 'Log In'}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-slate-500">
            By creating an account you accept our <a href="#" className="text-slate-400 hover:underline">Terms</a> and <a href="#" className="text-slate-400 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Right Side: Visuals */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] relative items-center justify-center overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-700"></div>

        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
          {/* Central Logo */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-20 bg-blue-600 p-8 rounded-[40px] shadow-2xl shadow-blue-600/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.669 0 3.218-.51 4.5-1.385A7.962 7.962 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385A7.962 7.962 0 015.5 4c-1.105 0-2.138.17-3 .482V15.5a.5.5 0 01-.5.5H1a.5.5 0 01-.5-.5V4.804zM14.5 15c-1.38 0-2.653-.433-3.682-1.222a.5.5 0 00-.636 0C9.153 14.567 7.88 15 6.5 15c-1.105 0-2.138-.17-3-.482V5.482c.862-.312 1.895-.482 3-.482 1.38 0 2.653.433 3.682 1.222a.5.5 0 00.636 0C11.847 5.433 13.12 5 14.5 5c1.105 0 2.138.17 3 .482v9.036c-.862.312-1.895.482-3 .482z" />
            </svg>
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-2xl font-bold text-white whitespace-nowrap">StudyMate</div>
          </motion.div>

          {/* Orbiting Icons */}
          {floatingIcons.map((item, i) => {
            const angle = (i * 360) / floatingIcons.length;
            const radius = 180;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: 1, 
                  x: x, 
                  y: y,
                  transition: { delay: 0.5 + i * 0.1 }
                }}
                className="absolute z-10 flex flex-col items-center"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    transition: { duration: 4, repeat: Infinity, delay: item.delay }
                  }}
                  className={`${item.color} p-4 rounded-2xl text-white shadow-xl`}
                >
                  {item.icon}
                </motion.div>
                <div className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-[#0f172a] px-2 py-1 rounded-md border border-slate-800">
                  {item.label}
                </div>
              </motion.div>
            );
          })}

          {/* Orbit Rings */}
          <div className="absolute w-[360px] h-[360px] border border-slate-800 rounded-full"></div>
          <div className="absolute w-[460px] h-[460px] border border-slate-800/50 rounded-full"></div>

          {/* Bottom Text */}
          <div className="absolute -bottom-32 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Upload → Learn → Pass</h3>
            <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Used by 1,300+ students</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
