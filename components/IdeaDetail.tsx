
import React, { useState } from 'react';
import { Idea, User, CollaboratorMatch } from '../types';
import { findCollaborators } from '../services/geminiService';
import CollaboratorCard from './CollaboratorCard';
import { StarIcon, ChevronUpIcon, UsersIcon, SparklesIcon, ArrowLeftIcon, ChatBubbleLeftRightIcon, EyeIcon, CursorArrowRaysIcon, GlobeAltIcon, MegaphoneIcon } from './icons';

interface IdeaDetailProps {
  idea: Idea;
  currentUser: User;
  users: User[];
  onBack: () => void;
  onUpvote: (ideaId: string) => void;
  onAddComment: (ideaId: string, commentText: string) => void;
  onViewCollaboratorProfile: (user: User) => void;
  onPromoteIdea: (ideaId: string) => void;
}

const IdeaDetail: React.FC<IdeaDetailProps> = ({ idea, currentUser, users, onBack, onUpvote, onAddComment, onViewCollaboratorProfile, onPromoteIdea }) => {
  const [collaborators, setCollaborators] = useState<CollaboratorMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleFindCollaborators = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const matches = await findCollaborators(idea, users);
      setCollaborators(matches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(idea.id, newComment.trim());
      setNewComment('');
    }
  };

  const handlePromoteClick = () => {
    if (!currentUser.isPremium) {
      alert('This is a premium feature! Upgrade your account to promote your ideas.');
      return;
    }
    onPromoteIdea(idea.id);
  };

  const getTopLocation = (geo: { [countryCode: string]: number }): string => {
    if (!geo || Object.keys(geo).length === 0) return 'N/A';
    
    const topCountryCode = Object.keys(geo).reduce((a, b) => geo[a] > geo[b] ? a : b);
    
    const countryNames: { [key: string]: string } = {
      'US': 'United States', 'DE': 'Germany', 'IN': 'India', 'GB': 'United Kingdom',
      'CA': 'Canada', 'KR': 'South Korea', 'JP': 'Japan', 'BR': 'Brazil',
      'NL': 'Netherlands', 'SE': 'Sweden',
    };
    
    return countryNames[topCountryCode] || topCountryCode;
  };

  const topLocation = getTopLocation(idea.analytics.geo);
  const interactions = idea.upvotes + idea.comments.length;

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-brand-primary font-semibold mb-6 hover:underline">
        <ArrowLeftIcon className="w-5 h-5"/>
        Back to all ideas
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-64 w-full object-cover md:h-full md:w-64" src={idea.imageUrl} alt={idea.title} />
          </div>
          <div className="p-8 flex-grow">
            <div className="uppercase tracking-wide text-sm text-brand-primary font-semibold">{idea.category}</div>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="block mt-1 text-3xl leading-tight font-extrabold text-brand-dark">{idea.title}</h1>
              {idea.isPromoted && (
                <span className="flex items-center gap-1.5 bg-brand-secondary/20 text-brand-secondary font-semibold px-3 py-1 rounded-full text-sm mt-2 animate-fade-in">
                    <MegaphoneIcon className="w-5 h-5"/>
                    Promoted
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center">
              <img src={idea.author.avatarUrl} alt={idea.author.name} className="w-8 h-8 rounded-full mr-2" />
              <span className="text-brand-gray">{idea.author.name}</span>
            </div>
            <p className="mt-4 text-brand-gray">{idea.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {idea.tags.map(tag => (
                <span key={tag} className="bg-indigo-100 text-brand-primary text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t flex flex-wrap items-center justify-between gap-4">
           <div className="flex items-center gap-6">
              <button onClick={() => onUpvote(idea.id)} className="flex items-center gap-2 text-brand-gray hover:text-green-600 transition-colors rounded-md p-1 -m-1">
                <ChevronUpIcon className="w-6 h-6 text-green-500" />
                <span className="font-bold text-lg">{idea.upvotes}</span>
              </button>
              <div className="flex items-center gap-2 text-brand-gray">
                <StarIcon className="w-6 h-6 text-yellow-400" />
                <span className="font-bold text-lg">{idea.rating.toFixed(1)}</span>
              </div>
               <div className="flex items-center gap-2 text-brand-gray">
                <UsersIcon className="w-6 h-6 text-blue-500" />
                <span className="font-bold text-lg">{idea.comments.length} Comments</span>
              </div>
            </div>
            {!idea.isPromoted && idea.author.id === currentUser.id && (
              <button 
                  onClick={handlePromoteClick}
                  className="bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-brand-secondary/90 transition-all flex items-center gap-2"
              >
                  <MegaphoneIcon className="w-5 h-5"/>
                  Promote Idea
              </button>
            )}
        </div>
      </div>

       <div className="mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-brand-dark mb-6">Idea Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {/* Views */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <EyeIcon className="w-10 h-10 mx-auto text-indigo-500 mb-3" />
              <div className="text-3xl font-bold text-brand-dark">{idea.analytics.views.toLocaleString()}</div>
              <div className="text-sm font-semibold text-brand-gray">Total Views</div>
            </div>
            {/* Interactions */}
            <div className="bg-pink-50 p-6 rounded-lg">
              <CursorArrowRaysIcon className="w-10 h-10 mx-auto text-pink-500 mb-3" />
              <div className="text-3xl font-bold text-brand-dark">{interactions.toLocaleString()}</div>
              <div className="text-sm font-semibold text-brand-gray">Community Interactions</div>
            </div>
            {/* Top Location */}
            <div className="bg-green-50 p-6 rounded-lg">
              <GlobeAltIcon className="w-10 h-10 mx-auto text-green-500 mb-3" />
              <div className="text-3xl font-bold text-brand-dark">{topLocation}</div>
              <div className="text-sm font-semibold text-brand-gray">Top Location</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-brand-dark mb-2 flex items-center">
            <SparklesIcon className="w-7 h-7 text-brand-accent mr-2"/>
            Find Collaborators
          </h2>
          <p className="text-brand-gray mb-6">Use AI to find the perfect collaborators from our community to bring this idea to life.</p>
          
          <button
            onClick={handleFindCollaborators}
            disabled={isLoading}
            className="w-full md:w-auto bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Match with AI'
            )}
          </button>

          {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}

          {collaborators.length > 0 && (
            <div className="mt-8 animate-slide-up">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Top Matches:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaborators.map(match => {
                  const user = users.find(u => u.name === match.name);
                  if (!user) return null;
                  return <CollaboratorCard key={match.name} match={match} user={user} onViewProfile={onViewCollaboratorProfile} />
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Comments Section */}
       <div className="mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center">
            <ChatBubbleLeftRightIcon className="w-7 h-7 text-brand-secondary mr-3"/>
            Community Discussion ({idea.comments.length})
          </h2>

          {/* Comment Form */}
          <div className="mb-8">
            <form onSubmit={handleCommentSubmit} className="flex items-start gap-4">
              <img src={currentUser.avatarUrl} alt="Your avatar" className="w-10 h-10 rounded-full" />
              <div className="flex-grow">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts, feedback, or questions..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  className="mt-2 bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-brand-primary/90 transition-all transform hover:scale-105 disabled:opacity-50"
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {idea.comments.length > 0 ? (
              idea.comments.slice().reverse().map(comment => ( // show newest first
                <div key={comment.id} className="flex items-start gap-4 animate-fade-in">
                  <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-10 h-10 rounded-full mt-1" />
                  <div className="flex-grow bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-brand-dark">{comment.user.name}</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-brand-gray">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-brand-gray py-4">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail;
