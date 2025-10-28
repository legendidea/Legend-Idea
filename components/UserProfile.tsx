import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { ArrowLeftIcon, BriefcaseIcon, HeartIcon, LinkIcon, CameraIcon, VerifiedIcon, EnvelopeIcon } from './icons';

interface UserProfileProps {
  user: User;
  currentUser: User;
  onBack: () => void;
  onUpdateUser: (updatedUser: User) => void;
  onFollowToggle: (userId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, currentUser, onBack, onUpdateUser, onFollowToggle }) => {
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(user.bio);
  const [editedSkills, setEditedSkills] = useState(user.skills.join(', '));
  const [editedInterests, setEditedInterests] = useState(user.interests.join(', '));
  const [editedPortfolioUrl, setEditedPortfolioUrl] = useState(user.portfolioUrl ?? '');

  const isCurrentUser = user.id === currentUser.id;
  const isFollowing = currentUser.following.includes(user.id);

  // Reset form state when the user prop changes (e.g., navigating between profiles)
  useEffect(() => {
    setIsEditing(false); // Always exit edit mode when user changes
    setEditedBio(user.bio);
    setEditedSkills(user.skills.join(', '));
    setEditedInterests(user.interests.join(', '));
    setEditedPortfolioUrl(user.portfolioUrl ?? '');
  }, [user]);

  const handleAvatarClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = () => {
    const updatedUser: User = {
      ...user,
      bio: editedBio.trim(),
      skills: editedSkills.split(',').map(s => s.trim()).filter(Boolean),
      interests: editedInterests.split(',').map(i => i.trim()).filter(Boolean),
      portfolioUrl: editedPortfolioUrl.trim() || undefined,
      // In a real app, you would handle avatar upload here and get a new URL
      // For this demo, we're not persisting the avatar change beyond the alert.
    };
    onUpdateUser(updatedUser);
    setIsEditing(false);
    
    if (newAvatar) {
      // In a real app, you would upload the file and update the user's data.
      alert(`Avatar updated! (In a real app, this would be saved to a server.)`);
      setNewAvatar(null);
    }
  };

  const handleCancel = () => {
    // Reset fields to original state and exit edit mode
    setEditedBio(user.bio);
    setEditedSkills(user.skills.join(', '));
    setEditedInterests(user.interests.join(', '));
    setEditedPortfolioUrl(user.portfolioUrl ?? '');
    setNewAvatar(null);
    setIsEditing(false);
  };

  const handleMessageClick = () => {
    alert(`Private message feature is coming soon! You tried to message ${user.name}.`);
  };

  const handleSignOut = () => {
    alert('You have been signed out!');
  };


  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
       <button onClick={onBack} className="flex items-center gap-2 text-brand-primary font-semibold mb-6 hover:underline">
        <ArrowLeftIcon className="w-5 h-5"/>
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
        <div className="absolute top-6 right-6 z-10 flex gap-2">
          {!isCurrentUser && (
            <>
              <button 
                  onClick={handleMessageClick}
                  className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-brand-primary/90 transition-all text-sm flex items-center gap-2"
              >
                  <EnvelopeIcon className="w-4 h-4" />
                  Message
              </button>
              <button 
                  onClick={() => onFollowToggle(user.id)} 
                  className={`font-semibold py-2 px-4 rounded-lg transition-colors text-sm ${isFollowing ? 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100' : 'bg-brand-secondary text-white hover:bg-brand-secondary/90'}`}
              >
                  {isFollowing ? 'Following' : 'Follow'}
              </button>
            </>
          )}
          {isCurrentUser && !isEditing && (
              <div className="flex items-center gap-2">
                <button onClick={() => setIsEditing(true)} className="bg-white border border-brand-primary text-brand-primary font-semibold py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors text-sm">
                    Edit Profile
                </button>
                <button onClick={handleSignOut} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                    Sign Out
                </button>
              </div>
          )}
           {isCurrentUser && isEditing && (
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-300 transition-all text-sm"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSaveChanges}
                    className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-brand-primary/90 transition-all text-sm"
                >
                    Save
                </button>
            </div>
          )}
        </div>
        <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                <div className="relative group flex-shrink-0">
                    <img 
                        src={newAvatar || user.avatarUrl} 
                        alt={user.name} 
                        className="w-32 h-32 rounded-full border-4 border-brand-secondary shadow-lg object-cover"
                    />
                     <button
                        onClick={handleAvatarClick}
                        className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white transition-opacity ${isEditing ? 'opacity-0 group-hover:opacity-100 cursor-pointer' : 'opacity-0'}`}
                        aria-label="Change profile picture"
                        disabled={!isEditing}
                    >
                        <CameraIcon className="w-8 h-8" />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                    />
                </div>
                <div className="mt-4 md:mt-0 md:ml-8 w-full">
                    <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                      <h1 className="text-4xl font-extrabold text-brand-dark">{user.name}</h1>
                      {user.isPremium && (
                          <VerifiedIcon className="w-7 h-7 text-brand-primary mt-1" title="Premium Member" />
                      )}
                    </div>
                    <span className="inline-block bg-brand-accent/20 text-brand-accent font-semibold px-3 py-1 rounded-full text-sm mt-2">{user.role}</span>
                    
                    <div className="mt-4 flex items-center justify-center md:justify-start gap-6 text-brand-gray">
                        <div>
                            <span className="font-bold text-xl text-brand-dark">{user.followers?.length ?? 0}</span>
                            <span className="text-sm ml-1">Followers</span>
                        </div>
                        <div>
                            <span className="font-bold text-xl text-brand-dark">{user.following?.length ?? 0}</span>
                            <span className="text-sm ml-1">Following</span>
                        </div>
                    </div>

                    {isEditing && newAvatar && (
                      <p className="mt-2 text-sm text-green-700 bg-green-100 p-2 rounded-md border border-green-200">
                        New avatar selected. Save changes to apply.
                      </p>
                    )}

                    {isEditing ? (
                        <div className="mt-4">
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                                id="bio"
                                value={editedBio}
                                onChange={(e) => setEditedBio(e.target.value)}
                                rows={4}
                                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                    ) : (
                        <p className="mt-4 text-brand-gray text-lg">{user.bio}</p>
                    )}
                    {isEditing ? (
                        <div className="mt-4">
                            <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">Portfolio URL</label>
                             <input
                                type="url"
                                id="portfolio"
                                value={editedPortfolioUrl}
                                onChange={(e) => setEditedPortfolioUrl(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                                placeholder="https://your-portfolio.com"
                            />
                        </div>
                    ) : (
                        user.portfolioUrl && (
                        <a 
                            href={user.portfolioUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-brand-primary font-semibold mt-4 hover:underline"
                        >
                            <LinkIcon className="w-5 h-5" />
                            View Portfolio
                        </a>
                        )
                    )}
                </div>
            </div>
        </div>
        
        <div className="px-8 py-6 bg-gray-50 border-t grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-bold text-brand-dark flex items-center mb-4">
                    <BriefcaseIcon className="w-6 h-6 mr-2 text-brand-primary"/>
                    Skills
                </h2>
                 {isEditing ? (
                    <input
                        type="text"
                        value={editedSkills}
                        onChange={(e) => setEditedSkills(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="e.g., React, Figma, UI/UX Design"
                    />
                 ) : (
                    <div className="flex flex-wrap gap-2">
                        {user.skills.map(skill => (
                            <span key={skill} className="bg-indigo-100 text-brand-primary text-sm font-semibold px-3 py-1 rounded-full">{skill}</span>
                        ))}
                    </div>
                 )}
            </div>
             <div>
                <h2 className="text-xl font-bold text-brand-dark flex items-center mb-4">
                    <HeartIcon className="w-6 h-6 mr-2 text-brand-accent"/>
                    Interests
                </h2>
                {isEditing ? (
                     <input
                        type="text"
                        value={editedInterests}
                        onChange={(e) => setEditedInterests(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="e.g., Sustainability, Mobile Apps"
                    />
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {user.interests.map(interest => (
                            <span key={interest} className="bg-pink-100 text-brand-accent text-sm font-semibold px-3 py-1 rounded-full">{interest}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;