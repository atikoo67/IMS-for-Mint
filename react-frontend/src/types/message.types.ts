// Messaging types based on SRS
export interface Message {
  message_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  recipient_id: string;
  recipient_name: string;
  assignment_id: string;
  body: string;
  sent_at: string;
  is_read: boolean;
}

export interface MessageThread {
  assignment_id: string;
  student_id: string;
  student_name: string;
  supervisor_id: string;
  supervisor_name: string;
  messages: Message[];
  unread_count: number;
  last_message_at?: string;
}

export interface SendMessageData {
  recipient_id: string;
  assignment_id: string;
  body: string;
}
