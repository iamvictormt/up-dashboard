import api from '@/services/api';

export interface CreateCommentData {
  userId: string;
  postId: string;
  content: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  postId: string;
  author: {
    id: string;
    name: string;
    profileImage?: string;
  };
  isMine?: boolean;
}

export async function fetchCommentsByPost(postId: string): Promise<Comment[]> {
  const response = await api.get(`comments/post/${postId}`);
  return response.data;
}

export async function createComment(data: CreateCommentData): Promise<Comment> {
  const response = await api.post('comments/', data);
  return response.data;
}

export async function updateComment(commentId: string, UpdateCommentData: UpdateCommentData): Promise<Comment> {
  const response = await api.patch(`comments/${commentId}`, UpdateCommentData);
  return response.data;
}

export async function deleteComment(commentId: string): Promise<void> {
  await api.delete(`comments/${commentId}`);
  return Promise.resolve();
}
