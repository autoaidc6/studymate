import React, { useState } from 'react';
import { Check, Shield, Zap, Star, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface PricingProps {
  onBack: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onBack }) => {
  const [isYearly, setIsYearly] = useState(false);

  const tiers = [
    {
      name: "Free",
      price: "£0",
      description: "Perfect for casual revision and getting started.",
      features: [
        "Core Curriculum Guides",
        "Interactive Flashcards",
        "Mobile Optimized Access",
        "Ad-supported (Guest users)",
        "Ad-free for registered users"
      ],
      cta: "Get Started",
      highlight: false,
      badge: "Freemium"
    },
    {
      name: "Pro",
      price: isYearly ? "£4.99" : "£9.99",
      period: "/mo",
      description: "The ultimate AI tutor for serious exam preparation.",
      features: [
        "Everything in Free",
        "Unlimited AI Tutor Chats",
        "AI Exam Practice Generator",
        "Mark Scheme Analysis",
        "100% Ad-free experience",
        "3-Day Pro Trial (Reverse Trial)"
      ],
      cta: "Upgrade to Pro",
      highlight: true,
      badge: "Most Popular",
      savings: isYearly ? "Save 50% yearly" : null
    },
    {
      name: "Season Pass",
      price: "£39.99",
      period: "/6 mo",
      description: "Intensive support for the May/June exam window.",
      features: [
        "Everything in Pro",
        "6 Months Full Access",
        "Priority AI Processing",
        "Exam Sprint Resources",
        "One-time payment"
      ],
      cta: "Get Season Pass",
      highlight: false,
      badge: "Exam Sprint"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium"
        >
          <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
          Back to Dashboard
        </button>

        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400"
          >
            Start free. Upgrade when ready.
          </motion.p>

          <div className="mt-10 flex justify-center items-center space-x-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 bg-slate-200 dark:bg-slate-700 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className={`w-5 h-5 bg-white dark:bg-blue-500 rounded-full shadow-sm transform transition-transform ${isYearly ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Yearly</span>
            <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
              Save 50%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
              className={`relative flex flex-col p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border ${
                tier.highlight 
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50 scale-105 z-10' 
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {tier.badge && (
                <div className={`absolute top-0 right-8 transform -translate-y-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  tier.highlight ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {tier.badge}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{tier.price}</span>
                  {tier.period && <span className="text-slate-500 ml-1">{tier.period}</span>}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {tier.description}
                </p>
                {tier.savings && (
                  <p className="mt-2 text-green-600 dark:text-green-400 text-xs font-bold">
                    {tier.savings}
                  </p>
                )}
              </div>

              <ul className="flex-grow space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                tier.highlight
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}>
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-24">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Compare Plans</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-6 px-4 text-slate-500 dark:text-slate-400 font-medium">Feature</th>
                  <th className="py-6 px-4 text-slate-900 dark:text-white font-bold">Free</th>
                  <th className="py-6 px-4 text-blue-600 dark:text-blue-400 font-bold">Pro</th>
                  <th className="py-6 px-4 text-slate-900 dark:text-white font-bold">Season Pass</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">Core Curriculum Guides</td>
                  <td className="py-4 px-4"><Check className="w-5 h-5 text-green-500" /></td>
                  <td className="py-4 px-4"><Check className="w-5 h-5 text-green-500" /></td>
                  <td className="py-4 px-4"><Check className="w-5 h-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">Interactive Flashcards</td>
                  <td className="py-4 px-4"><Check className="w-5 h-5 text-green-500" /></td>
                  <td className="py-4 px-4"><Check className="w-5 h-5 text-green-500" /></td>
                  <td className="py-4 px-4"><Check className="w-5 h-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">AI Tutor Chats</td>
                  <td className="py-4 px-4 text-slate-400">Limited</td>
                  <td className="py-4 px-4 text-blue-600 font-bold">Unlimited</td>
                  <td className="py-4 px-4 text-blue-600 font-bold">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">Exam Practice Generator</td>
                  <td className="py-4 px-4 text-slate-400">—</td>
                  <td className="py-4 px-4"><Check className="w-5 h-5 text-green-500" /></td>
                  <td className="py-4 px-4"><Check className="w-5 h-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">Mark Scheme Analysis</td>
                  <td className="py-4 px-4 text-slate-400">—</td>
                  <td className="py-4 px-4"><Check className="w-5 h-5 text-green-500" /></td>
                  <td className="py-4 px-4"><Check className="w-5 h-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">Ad-Free Experience</td>
                  <td className="py-4 px-4 text-slate-400">Registered only</td>
                  <td className="py-4 px-4 text-blue-600 font-bold">Always</td>
                  <td className="py-4 px-4 text-blue-600 font-bold">Always</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">Priority Processing</td>
                  <td className="py-4 px-4 text-slate-400">—</td>
                  <td className="py-4 px-4 text-slate-400">—</td>
                  <td className="py-4 px-4"><Check className="w-5 h-5 text-green-500" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-20 max-w-3xl mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-8 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center space-x-4 mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Commitment to Safety</h3>
            </div>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              <p>
                <strong>UK Age Appropriate Design Code:</strong> We strictly comply with the Children's Code. For users identified as minors, personalized advertising is disabled by default.
              </p>
              <p>
                <strong>The Study Vibe:</strong> We believe in a distraction-free environment. Once you create a free account, all AdSense banners are removed to help you focus on your revision.
              </p>
              <p>
                <strong>Reverse Trial:</strong> New users automatically start with 3 days of Pro features. If you choose not to subscribe, you'll simply downgrade to the free version—no hidden charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
