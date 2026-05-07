// Supervisor - Messages Page (FR-MSG-001 to FR-MSG-005)
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, Card, Button, Textarea, EmptyState } from '../../components/common';
import { MessageThread, Message } from '../../types';
import { messageService } from '../../services';
import { formatDateTime } from '../../utils/format';

export default function SupervisorMessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    setIsLoading(true);
    try {
      const data = await messageService.getMyThreads();
      setThreads(data);
    } catch (error) {
      console.error('Failed to load threads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedThread || !newMessage.trim()) return;

    setIsSending(true);
    try {
      await messageService.sendMessage({
        recipient_id: selectedThread.student_id,
        assignment_id: selectedThread.assignment_id,
        body: newMessage,
      });
      setNewMessage('');
      // Reload thread
      const updatedThread = await messageService.getConversationThread(
        selectedThread.assignment_id
      );
      setSelectedThread(updatedThread);
      loadThreads();
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Thread List */}
          <Card title="Conversations" className="md:col-span-1">
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : threads.length === 0 ? (
              <EmptyState title="No conversations" description="No messages yet." />
            ) : (
              <div className="space-y-2">
                {threads.map((thread) => (
                  <button
                    key={thread.assignment_id}
                    onClick={() => setSelectedThread(thread)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedThread?.assignment_id === thread.assignment_id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900">{thread.student_name}</h3>
                      {thread.unread_count > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {thread.unread_count}
                        </span>
                      )}
                    </div>
                    {thread.last_message_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(thread.last_message_at)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Message Thread */}
          <Card title={selectedThread?.student_name || 'Select a conversation'} className="md:col-span-2">
            {selectedThread ? (
              <div className="space-y-4">
                {/* Messages */}
                <div className="h-96 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
                  {selectedThread.messages.map((message) => (
                    <div
                      key={message.message_id}
                      className={`flex ${
                        message.sender_role === 'supervisor' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender_role === 'supervisor'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.body}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender_role === 'supervisor'
                              ? 'text-blue-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {formatDateTime(message.sent_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Send Message */}
                <div className="space-y-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={3}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSendMessage}
                    isLoading={isSending}
                    disabled={!newMessage.trim()}
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No conversation selected"
                description="Select a student from the list to start messaging."
              />
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
