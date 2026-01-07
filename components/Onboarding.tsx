import React, { useState } from 'react';
import { UserProfile, ContentPillar } from '../types';
import { Button, Input, TextArea, CheckboxCard } from './UI';
import { ArrowRight, Sparkles, User, Building2, Youtube, Instagram, Plus, X } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [brandType, setBrandType] = useState<'Personal' | 'Company' | null>(null);
  const [platform, setPlatform] = useState<'YouTube' | 'Instagram' | null>(null);
  const [name, setName] = useState('');
  
  // Step 6 Fields
  const [persona, setPersona] = useState('');
  const [visualStyle, setVisualStyle] = useState('');

  // Step 5 Fields
  const [pillars, setPillars] = useState<ContentPillar[]>([]);
  const [currentPillarName, setCurrentPillarName] = useState('');
  const [editingPillarIndex, setEditingPillarIndex] = useState<number | null>(null);
  const [editingPillarDesc, setEditingPillarDesc] = useState('');

  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const toggleDay = (index: number) => {
    setSelectedDays(prev => 
      prev.includes(index) ? prev.filter(d => d !== index) : [...prev, index]
    );
  };

  const addPillar = () => {
    if (currentPillarName.trim() && !pillars.some(p => p.name === currentPillarName.trim())) {
      setPillars([...pillars, { name: currentPillarName.trim(), description: '' }]);
      setCurrentPillarName('');
    }
  };

  const removePillar = (index: number) => {
    setPillars(pillars.filter((_, i) => i !== index));
    if (editingPillarIndex === index) {
      setEditingPillarIndex(null);
    }
  };

  const openPillarEdit = (index: number) => {
    setEditingPillarIndex(index);
    setEditingPillarDesc(pillars[index].description);
  };

  const savePillarEdit = () => {
    if (editingPillarIndex !== null) {
      const newPillars = [...pillars];
      newPillars[editingPillarIndex].description = editingPillarDesc;
      setPillars(newPillars);
      setEditingPillarIndex(null);
    }
  };

  const handleNext = () => {
    if (step === 1 && brandType) setStep(2);
    else if (step === 2 && platform) setStep(3);
    else if (step === 3 && name.trim()) setStep(4);
    else if (step === 4 && selectedDays.length > 0) setStep(5);
    else if (step === 5 && pillars.length > 0) setStep(6);
    else if (step === 6 && persona.trim() && visualStyle.trim()) {
      onComplete({
        name,
        brandType: brandType!,
        platform: platform!,
        postingDays: selectedDays.sort(),
        contentPillars: pillars,
        persona,
        visualStyle,
        additionalInfo: '', // Initialize empty
        isOnboarded: true
      });
    }
  };

  const SelectionCard: React.FC<{
    icon: React.ElementType;
    label: string;
    selected: boolean;
    onClick: () => void;
  }> = ({ icon: Icon, label, selected, onClick }) => (
    <div 
      onClick={onClick}
      className={`
        cursor-pointer p-6 border rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-4 w-full h-40
        ${selected ? 'bg-black text-white border-black ring-2 ring-black ring-offset-2' : 'bg-white text-zinc-500 border-zinc-200 hover:border-black hover:text-black'}
      `}
    >
      <Icon size={32} strokeWidth={1.5} />
      <span className="font-medium text-lg tracking-wide">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 max-w-2xl mx-auto animate-fade-in relative">
      
      {/* Progress Indicator */}
      <div className="flex gap-2 mb-12">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className={`h-1 w-8 rounded-full transition-colors duration-300 ${i <= step ? 'bg-black' : 'bg-zinc-200'}`} />
        ))}
      </div>

      <div className="w-full space-y-8">
        
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-light tracking-tight text-black">
              First things first. <br/> What are you <span className="font-serif italic font-medium">building</span>?
            </h1>
            <div className="grid grid-cols-2 gap-4">
              <SelectionCard 
                icon={User} 
                label="Personal Brand" 
                selected={brandType === 'Personal'} 
                onClick={() => setBrandType('Personal')} 
              />
              <SelectionCard 
                icon={Building2} 
                label="Company" 
                selected={brandType === 'Company'} 
                onClick={() => setBrandType('Company')} 
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-light tracking-tight text-black">
              Choose your stage.
            </h1>
            <div className="grid grid-cols-2 gap-4">
              <SelectionCard 
                icon={Youtube} 
                label="YouTube" 
                selected={platform === 'YouTube'} 
                onClick={() => setPlatform('YouTube')} 
              />
              <SelectionCard 
                icon={Instagram} 
                label="Instagram" 
                selected={platform === 'Instagram'} 
                onClick={() => setPlatform('Instagram')} 
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl font-light tracking-tight text-black">
              Identity. <br/> What should we call {brandType === 'Company' ? 'it' : 'you'}?
            </h1>
            <p className="text-zinc-500 text-lg">
              {brandType === 'Company' ? 'Company or Brand Name' : 'Your Name or Handle'}
            </p>
            <Input 
              placeholder="Enter name..." 
              value={name} 
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-light text-black">Consistency.</h1>
            <p className="text-zinc-500 text-lg">Which days will you dedicate to posting on {platform}?</p>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
              {DAYS.map((day, i) => (
                <CheckboxCard 
                  key={day} 
                  label={day} 
                  checked={selectedDays.includes(i)} 
                  onChange={() => toggleDay(i)} 
                />
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-fade-in relative">
            <h1 className="text-3xl font-light text-black">Programming.</h1>
            <p className="text-zinc-500 text-lg">Add your content formats. Click a tag to add execution details.</p>
            
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Input 
                    placeholder="Type a format (e.g. Tutorials)..." 
                    value={currentPillarName} 
                    onChange={e => setCurrentPillarName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addPillar()}
                    autoFocus={!editingPillarIndex}
                />
              </div>
              <button 
                onClick={addPillar}
                disabled={!currentPillarName.trim()}
                className="bg-black text-white w-14 flex items-center justify-center rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="flex flex-wrap gap-3 min-h-[40px]">
                {pillars.map((p, i) => (
                    <div 
                      key={i} 
                      onClick={() => openPillarEdit(i)}
                      className={`
                        group flex items-center gap-2 pl-4 pr-2 py-2 border rounded-lg shadow-sm animate-fade-in cursor-pointer transition-all
                        ${p.description ? 'bg-zinc-50 border-zinc-300' : 'bg-white border-zinc-200'}
                        hover:border-black
                      `}
                    >
                        <div className="flex flex-col">
                            <span className="font-medium text-sm text-zinc-800">{p.name}</span>
                            {p.description && <span className="text-[10px] text-zinc-500 truncate max-w-[100px]">{p.description}</span>}
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); removePillar(i); }}
                            className="p-1 hover:bg-zinc-200 rounded-md text-zinc-400 hover:text-red-500 transition-colors ml-2"
                        >
                            <X size={14}/>
                        </button>
                    </div>
                ))}
                {pillars.length === 0 && (
                    <div className="w-full py-4 text-center border-2 border-dashed border-zinc-100 rounded-lg text-zinc-400 text-sm">
                        Add a format above, then click it to add details.
                    </div>
                )}
            </div>

            {/* Suggestions */}
            <div className="pt-4">
                 <p className="text-xs text-zinc-400 uppercase tracking-wider mb-3">Suggestions</p>
                 <div className="flex flex-wrap gap-2">
                    {["Educational", "Vlogs", "Skits", "Industry News", "Q&A", "Motivation"].map(ex => {
                        const isAdded = pillars.some(p => p.name === ex);
                        return (
                            <button 
                                key={ex}
                                onClick={() => !isAdded && setPillars([...pillars, { name: ex, description: '' }])}
                                disabled={isAdded}
                                className={`
                                    px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                                    ${isAdded ? 'bg-zinc-100 text-zinc-400 border-zinc-100 cursor-default' : 'bg-white text-zinc-600 border-zinc-200 hover:border-black hover:text-black'}
                                `}
                            >
                                {isAdded ? ex : `+ ${ex}`}
                            </button>
                        );
                    })}
                 </div>
            </div>

            {/* Pillar Edit Overlay */}
            {editingPillarIndex !== null && (
               <div className="absolute inset-x-0 -bottom-4 bg-white border border-zinc-200 shadow-xl rounded-xl p-6 z-20 animate-in slide-in-from-bottom-2 fade-in duration-200">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-medium text-black">Edit "{pillars[editingPillarIndex].name}"</h3>
                     <button onClick={() => setEditingPillarIndex(null)} className="text-zinc-400 hover:text-black">
                        <X size={18} />
                     </button>
                  </div>
                  <p className="text-xs text-zinc-500 mb-2">How do you execute this format? (Style, Length, Vibe)</p>
                  <TextArea 
                     value={editingPillarDesc}
                     onChange={(e) => setEditingPillarDesc(e.target.value)}
                     placeholder="e.g. High energy, fast cuts, 60 seconds max. Always start with a question."
                     className="min-h-[100px] mb-4 text-sm"
                     autoFocus
                  />
                  <div className="flex justify-end">
                     <Button onClick={savePillarEdit} className="py-2 text-sm">Save Details</Button>
                  </div>
               </div>
            )}
            
            {/* Backdrop for edit overlay */}
            {editingPillarIndex !== null && (
               <div className="fixed inset-0 z-10" onClick={() => setEditingPillarIndex(null)} />
            )}
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-light text-black">Channel DNA.</h1>
            <p className="text-zinc-500 text-lg">Define the soul of your channel.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Personality & Voice</label>
                <TextArea 
                  rows={4}
                  placeholder={`Who are you on camera? e.g. Authoritative yet humble, high energy, sarcastic...`} 
                  value={persona} 
                  onChange={e => setPersona(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Visual Identity & Color Grading</label>
                <TextArea 
                  rows={3}
                  placeholder={`e.g. Dark moody aesthetic, teal & orange grading, handheld camera, minimal text overlays...`} 
                  value={visualStyle} 
                  onChange={e => setVisualStyle(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-8 flex justify-end">
          <Button onClick={handleNext} disabled={
            (step === 1 && !brandType) ||
            (step === 2 && !platform) ||
            (step === 3 && !name) || 
            (step === 4 && selectedDays.length === 0) || 
            (step === 5 && pillars.length === 0) ||
            (step === 6 && (!persona || !visualStyle))
          }>
            {step === 6 ? (
              <>
                <Sparkles className="w-4 h-4" /> Generate Strategy
              </>
            ) : (
              <>
                Next <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};