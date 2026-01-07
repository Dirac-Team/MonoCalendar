import React, { useEffect, useState } from 'react';
import { UserProfile, DayPlan } from '../types';
import { generateWeeklyPlan } from '../services/geminiService';
import { Button } from './UI';
import { Plus, RefreshCcw, Loader2, CheckCircle2 } from 'lucide-react';
import { DayPlanner } from './DayPlanner';

interface CalendarViewProps {
  userProfile: UserProfile;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ userProfile }) => {
  const [plans, setPlans] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);

  // Helper to generate empty week structure if API fails or initial state
  const getWeekDates = (start = new Date()) => {
    const dates = [];
    // Adjust to find previous Sunday
    const day = start.getDay();
    const diff = start.getDate() - day; 
    const sunday = new Date(start);
    sunday.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const loadPlans = async () => {
    setLoading(true);
    try {
      // Check local storage first for persisted plans
      const stored = localStorage.getItem('mono_plans');
      if (stored) {
        setPlans(JSON.parse(stored));
      } else {
        await generateNewWeek();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateNewWeek = async () => {
    setLoading(true);
    const startOfWeek = getWeekDates()[0];
    try {
      const response = await generateWeeklyPlan(userProfile, startOfWeek);
      
      const newPlans: DayPlan[] = getWeekDates().map((date, index) => {
        const aiPlan = response.plans.find(p => p.dayOffset === index);
        return {
          date: date.toISOString(),
          theme: aiPlan ? aiPlan.theme : "Rest Day",
          description: aiPlan ? aiPlan.description : "No content scheduled for today.",
          isPosted: false
        };
      });

      setPlans(newPlans);
      localStorage.setItem('mono_plans', JSON.stringify(newPlans));
    } catch (error) {
      console.error("Failed to generate", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdatePlan = (updated: DayPlan) => {
    const newPlans = plans.map(p => p.date === updated.date ? updated : p);
    setPlans(newPlans);
    localStorage.setItem('mono_plans', JSON.stringify(newPlans));
    setSelectedDay(updated); // Update the modal view too
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-12 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-zinc-500 text-sm font-medium uppercase tracking-widest mb-1">{userProfile.name}</h2>
            <h1 className="text-4xl font-light text-black">Content Schedule</h1>
          </div>
          <div className="flex gap-3">
             <Button variant="secondary" onClick={generateNewWeek} disabled={loading} className="text-sm">
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <RefreshCcw className="w-4 h-4" />}
                Regenerate Week
             </Button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const date = new Date(plan.date);
            const isToday = new Date().toDateString() === date.toDateString();
            const isActiveDay = userProfile.postingDays.includes(date.getDay());

            return (
              <div 
                key={plan.date} 
                className={`
                  group relative flex flex-col justify-between min-h-[280px] p-6 border transition-all duration-300
                  ${isActiveDay ? 'bg-white border-zinc-200 hover:border-black hover:shadow-lg' : 'bg-zinc-100/50 border-transparent opacity-80'}
                  ${isToday ? 'ring-1 ring-black ring-offset-2' : ''}
                `}
              >
                {/* Date Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-2xl font-light text-black">
                      {date.getDate()}
                    </span>
                  </div>
                  {plan.isPosted && <CheckCircle2 className="text-black w-5 h-5" />}
                </div>

                {/* Content */}
                <div className="flex-1">
                  {isActiveDay ? (
                    <>
                      <h3 className="text-lg font-medium leading-tight mb-3 line-clamp-3">{plan.theme}</h3>
                      <p className="text-sm text-zinc-500 line-clamp-3">{plan.description}</p>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                       <span className="text-zinc-300 text-sm font-medium uppercase tracking-widest">Rest Day</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-6 mt-4 border-t border-zinc-100 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setSelectedDay(plan)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-zinc-600 transition-colors"
                  >
                    {isActiveDay ? 'Plan Content' : 'Edit'} <Plus size={14} />
                  </button>
                </div>
                
                {/* Mobile visible action trigger */}
                <button 
                    onClick={() => setSelectedDay(plan)}
                    className="absolute inset-0 w-full h-full md:hidden"
                />
              </div>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <DayPlanner 
          dayPlan={selectedDay} 
          userProfile={userProfile} 
          onClose={() => setSelectedDay(null)} 
          onUpdatePlan={handleUpdatePlan}
        />
      )}
    </div>
  );
};
