
import React from 'react';
import { CollaboratorMatch, User } from '../types';
import { SparklesIcon } from './icons';

interface CollaboratorCardProps {
  match: CollaboratorMatch;
  user: User;
  onViewProfile: (user: User) => void;
}

const CollaboratorCard: React.FC<CollaboratorCardProps> = ({ match, user, onViewProfile }) => {

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Connection request sent to ${match.name}!`);
  };
  
  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewProfile(user);
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-indigo-200 shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-3">
          <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full mr-4 border-2 border-brand-secondary" />
          <div>
            <h4 className="font-bold text-brand-dark">{match.name}</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {match.skills.slice(0, 2).map(skill => (
                <span key={skill} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md">{skill}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-start text-sm text-brand-gray mb-4">
          <SparklesIcon className="w-5 h-5 text-brand-accent mr-2 flex-shrink-0 mt-0.5" />
          <p><span className="font-semibold">Reason:</span> {match.reason}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleViewProfile}
          className="flex-1 bg-white border border-brand-primary text-brand-primary font-semibold py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors text-sm"
        >
          View Profile
        </button>
        <button
          onClick={handleConnect}
          className="flex-1 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-brand-primary/90 transition-all text-sm"
        >
          Connect
        </button>
      </div>
    </div>
  );
};

export default CollaboratorCard;
