/**
 * Mock API for user suggestions
 * This would be replaced with actual API calls in a production environment
 */

interface UserSuggestion {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

// Mock function to simulate fetching user suggestions from an API
export async function fetchUserSuggestions(): Promise<UserSuggestion[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return mock data
  return [
    {
      id: 'user1',
      name: 'Ana Silva',
      role: 'Designer',
      avatar: '/placeholder.svg?height=40&width=40&text=AS',
    },
    {
      id: 'user2',
      name: 'Carlos Mendes',
      role: 'Desenvolvedor',
      avatar: '/placeholder.svg?height=40&width=40&text=CM',
    },
    {
      id: 'user3',
      name: 'Mariana Costa',
      role: 'Marketing',
      avatar: '/placeholder.svg?height=40&width=40&text=MC',
    },
  ];
}

// Function to follow a user
export async function followUser(userId: string): Promise<{ success: boolean }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real implementation, this would make an API call to follow the user
  console.log(`Following user with ID: ${userId}`);

  return { success: true };
}

// Function to unfollow a user
export async function unfollowUser(userId: string): Promise<{ success: boolean }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real implementation, this would make an API call to unfollow the user
  console.log(`Unfollowing user with ID: ${userId}`);

  return { success: true };
}
