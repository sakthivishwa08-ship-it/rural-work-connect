import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  MoreVertical,
  ShieldAlert,
  UserX,
  ArrowLeft,
  CheckCheck,
  User,
} from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

interface MessagingPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialConversationId?: string;
}

export const MessagingPage: React.FC<MessagingPageProps> = ({
  onNavigate,
  initialConversationId,
}) => {
  const {
    currentUser,
    conversations,
    messages,
    sendMessage,
    blockUser,
    blockedUserIds,
  } = useApp();
  const { t } = useI18n();

  const [activeConvId, setActiveConvId] = useState<string>(
    initialConversationId || (conversations[0]?.id ?? '')
  );
  const [inputText, setInputText] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  const convMessages = messages.filter((m) => m.conversationId === activeConvId);

  const isOtherUserBlocked = activeConversation
    ? blockedUserIds.includes(activeConversation.otherUserId)
    : false;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    await sendMessage(activeConvId, inputText.trim());
    setInputText('');
  };

  const handleBlock = () => {
    if (!activeConversation) return;
    if (window.confirm(`Block ${activeConversation.otherUserName}? You will no longer receive messages.`)) {
      blockUser(activeConversation.otherUserId);
      setShowOptions(false);
    }
  };

  const handleReport = () => {
    if (!activeConversation) return;
    setShowOptions(false);
    onNavigate('safety', {
      reportedUserId: activeConversation.otherUserId,
      reportedUserName: activeConversation.otherUserName,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-md overflow-hidden flex flex-col md:flex-row h-[78vh] min-h-[500px]">
        {/* Left: Conversation List */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col ${
          activeConvId ? 'hidden md:flex' : 'flex'
        }`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between">
            <h2 className="font-extrabold text-base text-gray-900">
              {t.nav.messages} ({conversations.length})
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500">
                No active conversations yet. Messages appear when applying or booking.
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                    activeConvId === conv.id
                      ? 'bg-brand-50/70'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={conv.otherUserAvatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop&crop=face'}
                    alt={conv.otherUserName}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-brand-500/10 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                        {conv.otherUserName}
                      </span>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">
                        {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 truncate mb-1">
                      {conv.lastMessage}
                    </p>

                    {conv.jobTitle && (
                      <span className="text-[10px] text-brand-700 bg-brand-50 px-2 py-0.5 rounded font-medium inline-block truncate max-w-full">
                        {conv.jobTitle}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        <div className={`flex-1 flex flex-col bg-gray-50/30 ${
          !activeConvId ? 'hidden md:flex' : 'flex'
        }`}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConvId('')}
                    className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <img
                    src={activeConversation.otherUserAvatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop&crop=face'}
                    alt={activeConversation.otherUserName}
                    className="w-10 h-10 rounded-2xl object-cover"
                  />

                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-tight">
                      {activeConversation.otherUserName}
                    </h3>
                    <span className="text-[11px] text-gray-400">
                      {activeConversation.otherUserRole} • Worksite Discussion
                    </span>
                  </div>
                </div>

                {/* More / Abuse Reporting dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {showOptions && (
                    <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl p-1.5 z-50 text-xs">
                      <button
                        onClick={handleReport}
                        className="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        <span>Report Harassment / Scam</span>
                      </button>
                      <button
                        onClick={handleBlock}
                        className="w-full text-left px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 font-semibold flex items-center gap-2"
                      >
                        <UserX className="h-4 w-4" />
                        <span>Block User</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {convMessages.map((msg) => {
                  const isMine = currentUser && msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[78%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm shadow-xs leading-relaxed ${
                          isMine
                            ? 'bg-brand-600 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <div
                          className={`mt-1 text-[10px] text-right ${
                            isMine ? 'text-brand-100' : 'text-gray-400'
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Bar */}
              {isOtherUserBlocked ? (
                <div className="p-4 bg-gray-100 text-center text-xs text-gray-500 font-semibold">
                  This user is blocked. You cannot send messages.
                </div>
              ) : (
                <form
                  onSubmit={handleSend}
                  className="p-3 sm:p-4 bg-white border-t border-gray-200 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message about work time, transport, or tools..."
                    className="flex-1 p-3 rounded-2xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={!inputText.trim()}
                    icon={<Send className="h-4 w-4" />}
                  >
                    Send
                  </Button>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400 text-sm">
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
