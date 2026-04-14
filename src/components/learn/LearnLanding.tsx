import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Users, BookOpen, BarChart3, Smartphone, Laptop, ArrowRight } from 'lucide-react';

interface LearnLandingProps {
  onGetStarted: () => void;
}

const LearnLanding: React.FC<LearnLandingProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6"
              >
                Help your child learn at home the <span className="text-blue-600">smart way</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-600 dark:text-slate-400 mb-8"
              >
                National Curriculum aligned English, Maths and Science activities for Year 1 to GCSE.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button 
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center"
                >
                  Get started for free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <div className="flex items-center text-slate-500 dark:text-slate-400 px-4">
                  Full subscription from £15/month
                </div>
              </motion.div>
            </div>
            <div className="lg:w-1/2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-blue-600/10 rounded-3xl blur-2xl"></div>
                <img 
                  src="https://picsum.photos/seed/learning/800/600" 
                  alt="Learning at home" 
                  className="relative rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">Easy as 1-2-3</h2>
            <p className="text-slate-600 dark:text-slate-400">Have fun learning at home on our desktop website or on-the-go with our app</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Create accounts</h3>
              <p className="text-slate-600 dark:text-slate-400">Create parent and student accounts to manage learning journeys together.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Start learning</h3>
              <p className="text-slate-600 dark:text-slate-400">We’ll automatically assign topics to your child based on their year and adapt their progression.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Measure progress</h3>
              <p className="text-slate-600 dark:text-slate-400">See your child progress, gain confidence and measure results through your parent dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 lg:p-12 border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">National Curriculum Aligned</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Our worksheets and resources are automatically marked, covering Year 1 to GCSE across English, Maths and Science.
                </p>
                <ul className="space-y-4">
                  {[
                    "Automatically marked worksheets",
                    "Adaptive learning paths",
                    "Progress tracking & reporting",
                    "Reward systems to boost motivation"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center text-slate-700 dark:text-slate-300">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                <div className="bg-blue-500 p-6 rounded-2xl text-white text-center">
                  <div className="text-2xl font-bold mb-1">Maths</div>
                  <div className="text-sm opacity-80">250+ Topics</div>
                </div>
                <div className="bg-orange-500 p-6 rounded-2xl text-white text-center">
                  <div className="text-2xl font-bold mb-1">English</div>
                  <div className="text-sm opacity-80">200+ Topics</div>
                </div>
                <div className="bg-purple-600 p-6 rounded-2xl text-white text-center">
                  <div className="text-2xl font-bold mb-1">Science</div>
                  <div className="text-sm opacity-80">150+ Topics</div>
                </div>
                <div className="bg-pink-500 p-6 rounded-2xl text-white text-center">
                  <div className="text-2xl font-bold mb-1">11+</div>
                  <div className="text-sm opacity-80">Exam Prep</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearnLanding;
