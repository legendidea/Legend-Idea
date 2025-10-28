
import React, { useState, useEffect } from 'react';
import { Idea, User, Comment, Notification, FeedActivity, ActivityType } from './types';
import { MOCK_IDEAS, MOCK_USERS, MOCK_ACTIVITIES } from './constants';
import Header from './components/Header';
import IdeaCard from './components/IdeaCard';
import IdeaDetail from './components/IdeaDetail';
import IdeaForm from './components/IdeaForm';
import UserProfile from './components/UserProfile';
import Feed from './components/Feed';
import { PlusIcon, SearchIcon } from './components/icons';

const UPVOTES_STORAGE_KEY = 'legendIdeaUpvotes';

// Load initial ideas, merging upvotes from localStorage if they exist
const loadInitialIdeas = (): Idea[] => {
  try {
    const storedUpvotesJSON = localStorage.getItem(UPVOTES_STORAGE_KEY);
    if (storedUpvotesJSON) {
      const storedUpvotes: { [key: string]: number } = JSON.parse(storedUpvotesJSON);
      return MOCK_IDEAS.map(idea => ({
        ...idea,
        upvotes: storedUpvotes[idea.id] ?? idea.upvotes,
      }));
    }
  } catch (error) {
    console.error("Failed to parse upvotes from localStorage", error);
  }
  return MOCK_IDEAS;
};


const App: React.FC = () => {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>(loadInitialIdeas);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'explore' | 'feed'>('explore');
  
  // Manage users in state to allow for updates
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [activities, setActivities] = useState<FeedActivity[]>(MOCK_ACTIVITIES);


  const handleSelectIdea = (idea: Idea) => {
    setSelectedIdea(idea);
    setIsCreating(false);
    setViewingProfile(null);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedIdea(null);
  };

  const handleShowForm = () => {
    setSelectedIdea(null);
    setIsCreating(true);
    setViewingProfile(null);
    window.scrollTo(0, 0);
  };
  
  const handleHideForm = () => {
    setIsCreating(false);
  };

  const handleViewProfile = () => {
    setSelectedIdea(null);
    setIsCreating(false);
    setViewingProfile(currentUser);
    window.scrollTo(0, 0);
  };

  const handleViewCollaboratorProfile = (user: User) => {
    setViewingProfile(user);
    // Don't clear selectedIdea, so the "Back" button can return to it
    window.scrollTo(0, 0);
  };

  const handleBackFromProfile = () => {
    setViewingProfile(null);
  };

  const handleAddNewIdea = (newIdea: Idea) => {
    setIdeas([newIdea, ...ideas]);
    setIsCreating(false);
    
    // Add to feed
    const newActivity: FeedActivity = {
      id: `act-${Date.now()}`,
      type: ActivityType.NEW_IDEA,
      user: newIdea.author,
      idea: newIdea,
      timestamp: 'Just now',
    };
    setActivities([newActivity, ...activities]);
  };
  
  const handleUpvoteIdea = (ideaId: string) => {
    let newUpvoteCount = 0;
    const updatedIdeas = ideas.map(idea => {
      if (idea.id === ideaId) {
        newUpvoteCount = idea.upvotes + 1;
        return { ...idea, upvotes: newUpvoteCount };
      }
      return idea;
    });
    setIdeas(updatedIdeas);

    if (selectedIdea && selectedIdea.id === ideaId) {
      setSelectedIdea({
        ...selectedIdea,
        upvotes: selectedIdea.upvotes + 1,
      });
    }

    // Add to feed
    const upvotedIdea = updatedIdeas.find(i => i.id === ideaId);
    if (upvotedIdea) {
      const newActivity: FeedActivity = {
        id: `act-${Date.now()}`,
        type: ActivityType.UPVOTE,
        user: currentUser,
        idea: upvotedIdea,
        timestamp: 'Just now',
      };
      setActivities([newActivity, ...activities]);
    }
    
    // Persist to localStorage
    try {
      const storedUpvotesJSON = localStorage.getItem(UPVOTES_STORAGE_KEY);
      const storedUpvotes = storedUpvotesJSON ? JSON.parse(storedUpvotesJSON) : {};
      storedUpvotes[ideaId] = newUpvoteCount;
      localStorage.setItem(UPVOTES_STORAGE_KEY, JSON.stringify(storedUpvotes));
    } catch (error) {
       console.error("Failed to save upvotes to localStorage", error);
    }
  };

  const handleAddNewComment = (ideaId: string, commentText: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: currentUser,
      text: commentText,
      timestamp: 'Just now',
    };

    const updatedIdeas = ideas.map(idea => {
      if (idea.id === ideaId) {
        return { ...idea, comments: [...idea.comments, newComment] };
      }
      return idea;
    });

    setIdeas(updatedIdeas);

    if (selectedIdea && selectedIdea.id === ideaId) {
      setSelectedIdea(prevIdea => ({
        ...prevIdea!,
        comments: [...prevIdea!.comments, newComment],
      }));
    }

    // Add to feed
    const commentedIdea = updatedIdeas.find(i => i.id === ideaId);
    if (commentedIdea) {
      const newActivity: FeedActivity = {
        id: `act-${Date.now()}`,
        type: ActivityType.COMMENT,
        user: currentUser,
        idea: commentedIdea,
        commentText: commentText,
        timestamp: 'Just now',
      };
      setActivities([newActivity, ...activities]);
    }
  };

  const handlePromoteIdea = (ideaId: string) => {
    const updatedIdeas = ideas.map(idea => {
      if (idea.id === ideaId) {
        // In a real app, this might be more complex (e.g., can't un-promote)
        return { ...idea, isPromoted: !idea.isPromoted };
      }
      return idea;
    });
    setIdeas(updatedIdeas);

    if (selectedIdea && selectedIdea.id === ideaId) {
      setSelectedIdea(prev => ({
        ...prev!,
        isPromoted: !prev!.isPromoted,
      }));
    }
    alert(`Idea promotion status toggled!`);
  };

  const handleUpdateUser = (updatedUser: User) => {
    const updatedUsers = users.map(u => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedUsers);

    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    if (viewingProfile && viewingProfile.id === updatedUser.id) {
      setViewingProfile(updatedUser);
    }
    alert('Profile updated successfully!');
  };

  const handleFollowToggle = (userIdToToggle: string) => {
    const isFollowing = currentUser.following.includes(userIdToToggle);

    // Update currentUser's following list
    const updatedCurrentUser = {
      ...currentUser,
      following: isFollowing
        ? currentUser.following.filter(id => id !== userIdToToggle)
        : [...currentUser.following, userIdToToggle],
    };

    // Update all users, including the target user's followers list and notifications
    const updatedUsers = users.map(u => {
      // Update the current user in the main list
      if (u.id === currentUser.id) {
        return updatedCurrentUser;
      }
      
      // Update the followed/unfollowed user
      if (u.id === userIdToToggle) {
        const updatedFollowers = isFollowing
          ? u.followers.filter(id => id !== currentUser.id)
          : [...u.followers, currentUser.id];

        let userWithUpdatedFollowers = { ...u, followers: updatedFollowers };

        // Add notification only when following, not unfollowing
        if (!isFollowing) {
          const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            text: `${currentUser.name} started following you.`,
            timestamp: 'Just now',
            read: false,
          };
          userWithUpdatedFollowers.notifications = [newNotification, ...userWithUpdatedFollowers.notifications];
          
          // Add to feed
          const followedUser = users.find(user => user.id === userIdToToggle);
          if (followedUser) {
            const newActivity: FeedActivity = {
              id: `act-${Date.now()}`,
              type: ActivityType.FOLLOW,
              user: currentUser,
              followedUser: followedUser,
              timestamp: 'Just now',
            };
            setActivities(prevActivities => [newActivity, ...prevActivities]);
          }
        }
        
        return userWithUpdatedFollowers;
      }
      
      return u;
    });

    setCurrentUser(updatedCurrentUser);
    setUsers(updatedUsers);
  };

  const handleMarkNotificationsAsRead = () => {
    const updatedCurrentUser = {
      ...currentUser,
      notifications: currentUser.notifications.map(n => ({ ...n, read: true })),
    };
    setCurrentUser(updatedCurrentUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedCurrentUser : u));
  };


  const renderContent = () => {
    if (viewingProfile) {
        return <UserProfile 
            user={viewingProfile} 
            currentUser={currentUser}
            onBack={handleBackFromProfile}
            onUpdateUser={handleUpdateUser}
            onFollowToggle={handleFollowToggle}
        />;
    }

    if (selectedIdea) {
      return <IdeaDetail 
                idea={selectedIdea} 
                currentUser={currentUser}
                users={users}
                onBack={handleBack} 
                onUpvote={handleUpvoteIdea} 
                onAddComment={handleAddNewComment}
                onViewCollaboratorProfile={handleViewCollaboratorProfile}
                onPromoteIdea={handlePromoteIdea}
              />;
    }

    if (isCreating) {
      return <IdeaForm onSubmit={handleAddNewIdea} onCancel={handleHideForm} currentUser={currentUser} />;
    }
    
    const filteredIdeas = ideas.filter(idea => {
      const matchesSearch =
        searchQuery === '' ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
    
    const feedActivities = activities.filter(
      act => currentUser.following.includes(act.user.id) || act.user.id === currentUser.id
    );

    const commonTabStyles = "px-6 py-3 font-semibold rounded-t-lg transition-colors focus:outline-none";
    const activeTabStyles = "border-b-4 border-brand-primary text-brand-primary";
    const inactiveTabStyles = "text-brand-gray hover:text-brand-primary";

    return (
      <div>
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-2">
                Where Ideas Ignite
            </h1>
            <p className="text-lg text-brand-gray max-w-2xl mx-auto">
                Explore, collaborate, and bring the next big idea to life.
            </p>
        </div>

        {/* View Toggle */}
        <div className="mb-8 flex justify-center border-b border-gray-200">
          <button onClick={() => setCurrentView('explore')} className={`${commonTabStyles} ${currentView === 'explore' ? activeTabStyles : inactiveTabStyles}`}>
            Explore
          </button>
          <button onClick={() => setCurrentView('feed')} className={`${commonTabStyles} ${currentView === 'feed' ? activeTabStyles : inactiveTabStyles}`}>
            My Feed
          </button>
        </div>

        {currentView === 'explore' ? (
           <div>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
              <div className="relative w-full md:w-1/2 lg:w-1/3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      type="text"
                      placeholder="Search by title or tag..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors"
                  />
              </div>
              <button 
                 onClick={handleShowForm}
                 className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center w-full md:w-auto justify-center"
              >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Submit an Idea
              </button>
            </div>

            {filteredIdeas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredIdeas.map(idea => (
                    <IdeaCard key={idea.id} idea={idea} onSelectIdea={handleSelectIdea} onUpvote={handleUpvoteIdea} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 bg-white rounded-xl shadow-md animate-fade-in">
                <h2 className="text-2xl font-bold text-brand-dark">
                    No Matching Ideas Found
                </h2>
                <p className="text-brand-gray mt-2">
                  Try adjusting your search query, or submit a new idea!
                </p>
              </div>
            )}
          </div>
        ) : (
           <Feed 
              activities={feedActivities}
              onSelectIdea={handleSelectIdea}
              onViewProfile={handleViewCollaboratorProfile}
           />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-light font-sans">
      <Header currentUser={currentUser} onProfileClick={handleViewProfile} onMarkNotificationsAsRead={handleMarkNotificationsAsRead} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      <footer className="text-center py-8 mt-12 border-t">
        <p className="text-brand-gray">&copy; 2025 Legend Idea. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
