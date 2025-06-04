export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  hashtags: string[];
  image?: string;

  author: {
    id: string;
    name: string;
    role: string;
    profileImage?: string;
    badge?: string;
  };

  communityId: string;

  comments: number;

  likes: number;
  likeId?: string;
  isLiked?: boolean;
  
  isMine?: boolean;
}

export interface CreatePost {
  title: string;
  content: string;
  authorId: string;
  communityId: string;
  hashtags: string[];
}
