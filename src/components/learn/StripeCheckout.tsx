import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, ShieldCheck, Zap } from 'lucide-react';

const stripePromise = loadStripe('pk_test_placeholder'); // Replace with real key

interface StripeCheckoutProps {
  plan: 'individual' | 'family';
  price: number;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ plan, price }) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    // In a real app, you'd call your backend to create a Checkout Session
    // const response = await fetch('/api/create-checkout-session', { method: 'POST' });
    // const session = await response.json();
    // const stripe = await stripePromise;
    // await stripe?.redirectToCheckout({ sessionId: session.id });
    
    alert('In a production environment, this would redirect to Stripe Checkout.');
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl max-w-md mx-auto">
      <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6 mx-auto">
        <Zap className="h-8 w-8 text-blue-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">Upgrade to {plan === 'individual' ? 'Individual' : 'Family'}</h2>
      <p className="text-slate-500 text-center mb-8">Unlock unlimited activities and advanced AI recommendations.</p>
      
      <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-2xl mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-600 dark:text-slate-400">Monthly subscription</span>
          <span className="font-bold text-slate-900 dark:text-white">£{price}</span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-600">
          <span className="font-bold text-slate-900 dark:text-white">Total due today</span>
          <span className="text-2xl font-bold text-blue-600">£{price}</span>
        </div>
      </div>

      <button 
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center mb-6"
      >
        <CreditCard className="h-5 w-5 mr-2" />
        {loading ? 'Processing...' : 'Pay with Card'}
      </button>

      <div className="flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
        <ShieldCheck className="h-4 w-4 mr-1 text-green-500" />
        Secure payment powered by Stripe
      </div>
    </div>
  );
};

export default StripeCheckout;
