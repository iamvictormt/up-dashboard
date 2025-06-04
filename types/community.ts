interface Community {
  id: string;
  name: string;
  description?: string;
  postsCount: number;
  imageUrl?: string;
  color: string;
  icon: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  hashtags: string[];
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    name: string;
    role: string;
    profileImage?: string;
    level?: string;
  };
  community: {
    id: string;
    name: string;
    color?: string;
  };
  likes: number;
  comments: number;
  likeId?: string;
  isLiked: boolean;
  imageUrl?: string;
}

interface Comment {
  id?: string;
  userId: string;
  postId: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  isMine?: boolean;
  author?: {
    id?: string;
    name?: string;
    role?: string;
    profileImage?: string;
  };
}
