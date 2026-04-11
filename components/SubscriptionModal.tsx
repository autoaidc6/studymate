import React from 'react';
import { Check, Shield, Zap, Star, X } from 'lucide-react';
import { User } from '../firebase';

interface SubscriptionModalProps {
  user: User | null;
  onClose: () => void;
  onUpgrade: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ user, onClose, onUpgrade }) => {
  // In a real app, we'd fetch the actual subscription status from Firestore
  const isPro = false; 

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative p-8 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>

          <div className="inline-flex p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl mb-6">
            <Zap className="w-10 h-10 text-blue-600" />
          </div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Subscription</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Manage your plan and explore premium benefits.
          </p>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 mb-8 text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Plan</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isPro ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
                {isPro ? 'Pro Member' : 'Free Tier'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                Core Curriculum Guides
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                Interactive Flashcards
              </div>
              {!isPro && (
                <div className="flex items-center text-sm text-slate-400">
                  <Star className="w-4 h-4 mr-3" />
                  Unlimited AI Tutor (Pro)
                </div>
              )}
            </div>
          </div>

          {!isPro ? (
            <button 
              onClick={onUpgrade}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all transform hover:scale-[1.02]"
            >
              Upgrade to Pro
            </button>
          ) : (
            <button className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
              Manage Billing
            </button>
          )}
          
          <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
            Secure payments via Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
