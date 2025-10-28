import React from 'react';
import { FeedActivity, Idea, User } from '../types';
import FeedItem from './FeedItem';

interface FeedProps {
  activities: FeedActivity[];
  onSelectIdea: (idea: Idea) => void;
  onViewProfile: (user: User) => void;
}

const Feed: React.FC<FeedProps> = ({ activities, onSelectIdea, onViewProfile }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-xl shadow-md animate-fade-in max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-dark">Your Feed is Empty</h2>
        <p className="text-brand-gray mt-2">Follow users to see their activity here. Start by exploring ideas!</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {activities.map(activity => (
        <FeedItem 
          key={activity.id} 
          activity={activity} 
          onSelectIdea={onSelectIdea}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
};

export default Feed;
