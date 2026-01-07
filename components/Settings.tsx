import React, { useState } from 'react';
import { UserProfile, ContentPillar } from '../types';
import { Button, Input, TextArea, CheckboxCard } from './UI';
import { X, User, Calendar, BookOpen, Plus, Trash2 } from 'lucide-react';

interface SettingsProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (profile: UserProfile) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Settings: React.FC<SettingsProps> = ({ userProfile, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'dna' | 'schedule' | 'context'>('dna');
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [newPillarName, setNewPillarName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdate(profile);
    onClose();
  };

  const toggleDay = (index: number) => {
    setProfile(prev => ({
      ...prev,
      postingDays: prev.postingDays.includes(index)
        ? prev.postingDays.filter(d => d !== index).sort()
        : [...prev.postingDays, index].sort()
    }));
  };

  const addPillar = () => {
    if (newPillarName.trim() && !profile.contentPillars.some(p => p.name === newPillarName.trim())) {
      setProfile(prev => ({
        ...prev,
        contentPillars: [...prev.contentPillars, { name: newPillarName.trim(), description: '' }]
      }));
      setNewPillarName('');
    }
  };

  const updatePillar = (index: number, field: 'name' | 'description', value: string) => {
    const newPillars = [...profile.contentPillars];
    newPillars[index] = { ...newPillars[index], [field]: value };
    setProfile(prev => ({ ...prev, contentPillars: newPillars }));
  };

  const removePillar = (index: number) => {
    setProfile(prev => ({
      ...prev,
      contentPillars: prev.contentPillars.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-4xl h-[85vh] shadow-2xl rounded-xl border border-zinc-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100">
          <h2 className="text-2xl font-light text-black">Configuration</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-64 bg-zinc-50 border-r border-zinc-100 p-6 space-y-2">
            <button 
              onClick={() => setActiveTab('dna')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'dna' ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-200/50 hover:text-black'}`}
            >
              <User size={16} /> Identity & DNA
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'schedule' ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-200/50 hover:text-black'}`}
            >
              <Calendar size={16} /> Schedule & Formats
            </button>
            <button 
              onClick={() => setActiveTab('context')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'context' ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-200/50 hover:text-black'}`}
            >
              <BookOpen size={16} /> Context & Info
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            
            {activeTab === 'dna' && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-black">Basic Info</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Name</label>
                      <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Platform</label>
                      <div className="py-3 text-zinc-500 border-b border-zinc-200">{profile.platform}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-black">Channel DNA</h3>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Persona & Voice</label>
                    <TextArea 
                      rows={4} 
                      value={profile.persona} 
                      onChange={e => setProfile({...profile, persona: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Visual Style</label>
                    <TextArea 
                      rows={4} 
                      value={profile.visualStyle} 
                      onChange={e => setProfile({...profile, visualStyle: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-black">Posting Schedule</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {DAYS.map((day, i) => (
                      <CheckboxCard 
                        key={day} 
                        label={day} 
                        checked={profile.postingDays.includes(i)} 
                        onChange={() => toggleDay(i)} 
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-black">Content Pillars</h3>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add new format..." 
                      value={newPillarName} 
                      onChange={e => setNewPillarName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addPillar()}
                    />
                    <Button onClick={addPillar} className="w-12 px-0"><Plus size={20}/></Button>
                  </div>
                  <div className="space-y-3 mt-4">
                    {profile.contentPillars.map((pillar, i) => (
                      <div key={i} className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 group">
                        <div className="flex justify-between items-start mb-2">
                          <input 
                            className="bg-transparent font-medium text-black focus:outline-none focus:underline"
                            value={pillar.name}
                            onChange={(e) => updatePillar(i, 'name', e.target.value)}
                          />
                          <button onClick={() => removePillar(i)} className="text-zinc-400 hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <textarea 
                          className="w-full bg-transparent text-sm text-zinc-600 resize-none focus:outline-none placeholder:text-zinc-300"
                          placeholder="Description of this format..."
                          value={pillar.description}
                          onChange={(e) => updatePillar(i, 'description', e.target.value)}
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'context' && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-black">Additional Context</h3>
                  <p className="text-sm text-zinc-500">
                    Anything you add here will be kept in the AI's memory. Use this for ongoing series, sponsor obligations, life updates, or temporary focus areas.
                  </p>
                </div>
                <TextArea 
                  className="min-h-[300px]"
                  placeholder="e.g. 
- Ongoing Series: 'Zero to Hero' (Episode 4 is next)
- Sponsor: NordVPN (Needs a mention next Tuesday)
- Life Update: Traveling to Japan next week, content should reflect that."
                  value={profile.additionalInfo || ''}
                  onChange={e => setProfile({...profile, additionalInfo: e.target.value})}
                />
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-100 p-6 flex justify-end bg-white">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>

      </div>
    </div>
  );
};