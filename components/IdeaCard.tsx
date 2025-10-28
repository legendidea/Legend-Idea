
import React from 'react';
import { Idea } from '../types';
import { StarIcon, ChevronUpIcon, MegaphoneIcon } from './icons';

interface IdeaCardProps {
  idea: Idea;
  onSelectIdea: (idea: Idea) => void;
  onUpvote: (ideaId: string) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onSelectIdea, onUpvote }) => {
  
  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's onSelectIdea from firing
    onUpvote(idea.id);
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group animate-fade-in ${idea.isPromoted ? 'border-2 border-brand-secondary' : ''}`}
      onClick={() => onSelectIdea(idea)}
    >
      <div className="relative h-48">
        <img src={idea.imageUrl} alt={idea.title} className="w-full h-full object-cover" />
        {idea.isPromoted && (
            <div className="absolute top-2 right-2 bg-brand-secondary text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <MegaphoneIcon className="w-4 h-4"/>
                PROMOTED
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white tracking-tight">{idea.title}</h3>
          <p className="text-sm text-gray-200">{idea.category}</p>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-brand-gray text-sm mb-4 flex-grow">{idea.description.substring(0, 140)}...</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {idea.tags.map(tag => (
            <span key={tag} className="bg-indigo-100 text-brand-primary text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      <div className="px-5 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={handleUpvoteClick} className="flex items-center gap-1 text-brand-gray hover:text-green-600 transition-colors rounded-md p-1 -m-1">
            <ChevronUpIcon className="w-5 h-5 text-green-500" />
            <span className="font-bold text-sm">{idea.upvotes}</span>
          </button>
          <div className="flex items-center gap-1 text-brand-gray">
            <StarIcon className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-sm">{idea.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center -space-x-2">
            <img src={idea.author.avatarUrl} alt={idea.author.name} className="w-8 h-8 rounded-full border-2 border-white object-cover"/>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;