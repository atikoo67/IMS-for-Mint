// Student - Messages Page (FR-MSG-001 to FR-MSG-003)
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, Card, Button, Textarea, EmptyState } from '../../components/common';
import { MessageThread } from '../../types';
import { messageService, assignmentService } from '../../services';
import { formatDateTime } from '../../utils/format';

export default function StudentMessagesPage() {
  const [thread, setThread] = useState<MessageThread | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const assignment = await assignmentService.getMyAssignment();
      if (assignment) {
        const threadData = await messageService.getConversationThread(assignment.assignment_id);
        setThread(threadData);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!thread || !newMessage.trim()) return;

    setIsSending(true);
    try {
      await messageService.sendMessage({
        recipient_id: thread.supervisor_id,
        assignment_id: thread.assignment_id,
        body: newMessage,
      });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages with Supervisor</h1>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading messages..." />
        ) : !thread ? (
          <EmptyState
            title="No conversation yet"
            description="You don't have an active internship assignment yet."
          />
        ) : (
          <Card title={`Conversation with ${thread.supervisor_name}`}>
            <div className="space-y-4">
              {/* Messages */}
              <div className="h-96 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
                {thread.messages.length === 0 ? (
                  <EmptyState
                    title="No messages yet"
                    description="Start the conversation by sending a message to your supervisor."
                  />
                ) : (
                  thread.messages.map((message) => (
                    <div
                      key={message.message_id}
                      className={`flex ${
                        message.sender_role === 'student' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender_role === 'student'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.body}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender_role === 'student' ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {formatDateTime(message.sent_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Send Message */}
              <div className="space-y-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message to your supervisor..."
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
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
