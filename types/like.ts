export interface CreateLike {
  userId: string;
  postId: string;
}

export interface ResponseCreateLike {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}
