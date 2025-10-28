
import React from 'react';
import { Challenge } from '../types';
import { TrophyIcon } from './icons';

interface ChallengeCardProps {
  challenge: Challenge;
  onSelect: (challenge: Challenge) => void;
}

const calculateDaysRemaining = (endDate: string): number => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onSelect }) => {
  const daysRemaining = calculateDaysRemaining(challenge.endDate);

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group animate-fade-in"
      onClick={() => onSelect(challenge)}
    >
      <div className="relative h-40">
        <img src={challenge.imageUrl} alt={challenge.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
          {daysRemaining} days left
        </div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white tracking-tight">{challenge.title}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="text-brand-gray text-sm mb-4 h-16">{challenge.prompt}</p>
        <div className="flex items-center gap-2 text-brand-secondary font-semibold">
          <TrophyIcon className="w-5 h-5" />
          <span>Prize: {challenge.prize}</span>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
