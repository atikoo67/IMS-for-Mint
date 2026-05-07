// Messaging service for Students and Supervisors
import { apiService } from './api.service';
import { Message, MessageThread, SendMessageData } from '../types';

class MessageService {
  // Send message (FR-MSG-001, FR-MSG-002)
  async sendMessage(data: SendMessageData): Promise<Message> {
    const response = await apiService.post<Message>('/messages', data);
    return response.data;
  }

  // Get conversation thread (FR-MSG-002)
  async getConversationThread(assignmentId: string): Promise<MessageThread> {
    const response = await apiService.get<MessageThread>(`/messages/thread/${assignmentId}`);
    return response.data;
  }

  // Get all conversation threads for current user
  async getMyThreads(): Promise<MessageThread[]> {
    const response = await apiService.get<MessageThread[]>('/messages/threads');
    return response.data;
  }

  // Mark message as read
  async markAsRead(messageId: string): Promise<void> {
    await apiService.patch(`/messages/${messageId}/read`);
  }

  // Mark all messages in thread as read
  async markThreadAsRead(assignmentId: string): Promise<void> {
    await apiService.patch(`/messages/thread/${assignmentId}/read`);
  }

  // Supervisor: Send broadcast message (FR-MSG-004)
  async sendBroadcast(message: string): Promise<void> {
    await apiService.post('/messages/broadcast', { message });
  }

  // Admin: Get all threads for oversight (FR-MSG-005)
  async getAllThreads(): Promise<MessageThread[]> {
    const response = await apiService.get<MessageThread[]>('/messages/admin/threads');
    return response.data;
  }

  // Admin: View specific thread
  async viewThreadAsAdmin(assignmentId: string): Promise<MessageThread> {
    const response = await apiService.get<MessageThread>(`/messages/admin/thread/${assignmentId}`);
    return response.data;
  }
}

export const messageService = new MessageService();
