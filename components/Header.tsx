import React, { useState, useEffect, useRef } from 'react';
import { LightbulbIcon, VerifiedIcon, BellIcon } from './icons';
import { User, Notification } from '../types';

interface HeaderProps {
    currentUser: User;
    onProfileClick: () => void;
    onMarkNotificationsAsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onProfileClick, onMarkNotificationsAsRead }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = currentUser.notifications?.filter(n => !n.read).length ?? 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBellClick = () => {
    setIsNotificationsOpen(prev => !prev);
    if (!isNotificationsOpen && unreadCount > 0) {
      // Mark as read when opening the dropdown
      onMarkNotificationsAsRead();
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <LightbulbIcon className="h-8 w-8 text-brand-primary" />
            <span className="ml-3 text-2xl font-bold text-brand-dark tracking-tighter">Legend Idea</span>
          </div>
          <div className="flex items-center gap-4">
            {!currentUser.isPremium && (
              <button className="bg-gradient-to-r from-amber-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                Go Premium
              </button>
            )}

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button onClick={handleBellClick} className="relative p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-full focus:outline-none">
                  <BellIcon className="h-6 w-6" />
                  {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                          {unreadCount}
                      </span>
                  )}
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-sm origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20 animate-fade-in">
                    <div className="py-1">
                        <div className="px-4 py-2 text-sm font-semibold text-gray-900 border-b">Notifications</div>
                        {(currentUser.notifications && currentUser.notifications.length > 0) ? (
                            <div className="max-h-80 overflow-y-auto">
                                {currentUser.notifications.map(notification => (
                                    <div key={notification.id} className="block px-4 py-3 text-sm text-gray-700 border-b last:border-b-0 hover:bg-gray-100">
                                        <p>{notification.text}</p>
                                        <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="px-4 py-4 text-sm text-gray-500">You have no notifications.</p>
                        )}
                    </div>
                </div>
            )}
            </div>
            
            <button onClick={onProfileClick} aria-label={`View profile for ${currentUser.name}`} className="relative">
                 <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="h-10 w-10 rounded-full cursor-pointer border-2 border-transparent hover:border-brand-primary transition-colors"
                />
                {currentUser.isPremium && (
                    <VerifiedIcon className="absolute bottom-0 -right-1 w-5 h-5 text-brand-primary bg-white rounded-full" title="Premium Member" />
                )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;