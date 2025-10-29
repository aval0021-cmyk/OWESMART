import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    
    // Fetch notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    // Click outside to close
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notifications?limit=10', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.patch(
        'http://localhost:5000/api/notifications/read-all',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'payment_reminder': return 'text-yellow-400';
      case 'milestone': return 'text-green-400';
      case 'achievement': return 'text-purple-400';
      case 'level_up': return 'text-blue-400';
      case 'streak': return 'text-orange-400';
      case 'debt_paid': return 'text-teal-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-700 text-white px-3 py-1.5 rounded-lg hover:bg-slate-600 relative"
        style={{fontSize: '15px'}}
      >
        Notifications
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-slate-800 rounded-lg shadow-2xl border border-slate-700 z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-white font-semibold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    if (!notification.read) markAsRead(notification.id);
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl;
                    }
                  }}
                  className={`p-4 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-slate-700/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`text-2xl flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                      {notification.icon || '📢'}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-white font-medium text-sm leading-tight">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-1 leading-snug">
                        {notification.message}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        {getTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-700 text-center">
              <button
                onClick={() => {
                  window.location.href = '/notifications';
                  setIsOpen(false);
                }}
                className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
