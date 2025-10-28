import React from 'react';
import { FeedActivity, Idea, User, ActivityType } from '../types';
import { LightbulbIcon, ChevronUpIcon, ChatBubbleLeftRightIcon, UsersIcon } from './icons';

interface FeedItemProps {
  activity: FeedActivity;
  onSelectIdea: (idea: Idea) => void;
  onViewProfile: (user: User) => void;
}

const ActivityIcon: React.FC<{ type: ActivityType }> = ({ type }) => {
  const commonIconClasses = "w-5 h-5 text-white";
  const commonWrapperClasses = "w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0";
  
  switch (type) {
    case ActivityType.NEW_IDEA:
      return <div className={`${commonWrapperClasses} bg-green-500`}><LightbulbIcon className={commonIconClasses} /></div>;
    case ActivityType.UPVOTE:
      return <div className={`${commonWrapperClasses} bg-blue-500`}><ChevronUpIcon className={commonIconClasses} /></div>;
    case ActivityType.COMMENT:
      return <div className={`${commonWrapperClasses} bg-purple-500`}><ChatBubbleLeftRightIcon className={commonIconClasses} /></div>;
    case ActivityType.FOLLOW:
      return <div className={`${commonWrapperClasses} bg-pink-500`}><UsersIcon className={commonIconClasses} /></div>;
    default:
      return null;
  }
};

const UserLink: React.FC<{user: User; onViewProfile: (user: User) => void;}> = ({ user, onViewProfile }) => (
  <button onClick={() => onViewProfile(user)} className="font-bold text-brand-dark hover:underline">{user.name}</button>
);

const IdeaLink: React.FC<{idea: Idea; onSelectIdea: (idea: Idea) => void;}> = ({ idea, onSelectIdea }) => (
  <button onClick={() => onSelectIdea(idea)} className="font-bold text-brand-primary hover:underline">{idea.title}</button>
);

const FeedItem: React.FC<FeedItemProps> = ({ activity, onSelectIdea, onViewProfile }) => {

  const renderContent = () => {
    switch (activity.type) {
      case ActivityType.NEW_IDEA:
        return (
          <p className="text-brand-gray">
            <UserLink user={activity.user} onViewProfile={onViewProfile} /> submitted a new idea: <IdeaLink idea={activity.idea!} onSelectIdea={onSelectIdea} />
          </p>
        );
      case ActivityType.UPVOTE:
        return (
          <p className="text-brand-gray">
            <UserLink user={activity.user} onViewProfile={onViewProfile} /> upvoted the idea: <IdeaLink idea={activity.idea!} onSelectIdea={onSelectIdea} />
          </p>
        );
      case ActivityType.COMMENT:
        return (
          <div>
            <p className="text-brand-gray mb-2">
              <UserLink user={activity.user} onViewProfile={onViewProfile} /> commented on: <IdeaLink idea={activity.idea!} onSelectIdea={onSelectIdea} />
            </p>
            <blockquote className="border-l-4 border-gray-200 pl-4 text-sm text-gray-600 italic">
              "{activity.commentText}"
            </blockquote>
          </div>
        );
      case ActivityType.FOLLOW:
        return (
           <p className="text-brand-gray">
            <UserLink user={activity.user} onViewProfile={onViewProfile} /> started following <UserLink user={activity.followedUser!} onViewProfile={onViewProfile} />
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-start gap-4 transition-shadow hover:shadow-lg">
      <ActivityIcon type={activity.type} />
      <div className="flex-grow">
        {renderContent()}
        <p className="text-xs text-gray-400 mt-2">{activity.timestamp}</p>
      </div>
    </div>
  );
};

export default FeedItem;
