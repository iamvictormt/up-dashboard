import api from '@/services/api';
import { CreateLike } from '@/types/like';
import type { CreatePost, Post, PostStats } from '@/types/post';

// Function to fetch posts by community ID
export async function fetchPostsByCommunity(communityId: string): Promise<Post[]> {
  const response = await api.get(`posts/community/${communityId}`);
  return response.data || [];
}

export async function fetchMyPostsStats(): Promise<PostStats> {
  const response = await api.get(`posts/my-posts-stats`);
  return response.data || [];
}

export async function fetchMyPosts(): Promise<Post[]> {
  const response = await api.get(`posts/my-posts`);
  return response.data || [];
}

// Function to create a new post
export async function createPost(post: CreatePost): Promise<Post> {
  const newPost: CreatePost = {
    ...post,
  };

  const response = await api.post('posts', newPost);

  return response.data;
}

// Function to like a post
export async function likePost(createLike: CreateLike): Promise<string> {
  const response = await api.post(`likes`, createLike);
  return response.data.id;
}

// Function to unlike a post
export async function unlikePost(likeId: string): Promise<void> {
  await api.delete(`likes/${likeId}`);
  return Promise.resolve();
}

// Function to update a post
export async function updatePost(
  postId: string,
  data: { title?: string; content?: string; hashtags?: string[]; attachedImage?: string | null }
): Promise<Post> {
  const response = await api.patch(`posts/${postId}`, data);

  if (!response.data) {
    throw new Error(`Post with ID ${postId} not found`);
  }

  return response.data;
}

// Function to delete a post
export async function deletePost(postId: string): Promise<void> {
  await api.delete(`posts/${postId}`);
  return Promise.resolve();
}
