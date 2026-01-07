import React from 'react';
import { DayPlan, UserProfile } from '../types';
import { ChatInterface } from './ChatInterface';
import { X, Calendar as CalendarIcon, Edit3 } from 'lucide-react';

interface DayPlannerProps {
  dayPlan: DayPlan;
  userProfile: UserProfile;
  onClose: () => void;
  onUpdatePlan: (updatedPlan: DayPlan) => void;
}

export const DayPlanner: React.FC<DayPlannerProps> = ({ dayPlan, userProfile, onClose, onUpdatePlan }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-5xl h-[90vh] shadow-2xl overflow-hidden flex flex-col md:flex-row rounded-xl border border-zinc-200">
        
        {/* Left Side: Context & Overview */}
        <div className="w-full md:w-1/3 bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-200 p-8 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <CalendarIcon size={16} />
                <span className="text-sm font-medium tracking-wide">{new Date(dayPlan.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              {dayPlan.pillar && (
                <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {dayPlan.pillar}
                </span>
              )}
            </div>
            {/* Mobile close button */}
            <button onClick={onClose} className="md:hidden p-2 hover:bg-zinc-200 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="mb-8">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Core Theme</label>
            <h2 className="text-3xl font-light text-black leading-tight">{dayPlan.theme}</h2>
          </div>

          <div className="mb-8">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Strategy Note</label>
            <p className="text-zinc-600 leading-relaxed text-sm">
              {dayPlan.description}
            </p>
          </div>

          <div className="mt-auto pt-8 border-t border-zinc-200">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Quick Actions</label>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => onUpdatePlan({ ...dayPlan, isPosted: !dayPlan.isPosted })}
                className={`w-full py-2 px-4 text-sm font-medium border transition-colors flex items-center justify-center gap-2 rounded-md
                  ${dayPlan.isPosted ? 'bg-black text-white border-black' : 'bg-white text-zinc-600 border-zinc-200 hover:border-black'}
                `}
              >
                {dayPlan.isPosted ? 'Mark as Pending' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: AI Assistant */}
        <div className="flex-1 flex flex-col relative">
          <div className="absolute top-4 right-4 z-10 hidden md:block">
            <button onClick={onClose} className="p-2 bg-white/50 hover:bg-zinc-100 rounded-full transition-colors border border-zinc-100">
              <X size={20} />
            </button>
          </div>
          <ChatInterface dayPlan={dayPlan} userProfile={userProfile} />
        </div>

      </div>
    </div>
  );
};