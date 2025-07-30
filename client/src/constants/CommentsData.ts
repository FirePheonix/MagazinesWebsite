import { Comment } from '@/constants/CommentTypes';

// Map of comments by post ID
export const commentsByPostId: { [key: number]: Comment[] } = {
  // Comments for blog post ID 1
  1: [
    {
      id: 1,
      author: "Ananya Singh",
      authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      content: "This article perfectly captures the innovative spirit at IIIT Sonepat! As a recent graduate, I can attest to how the student-led innovation hubs shaped my approach to problem-solving.",
      date: "2023-10-16T08:32:00Z",
      likes: 12,
      replies: [
        {
          id: 101,
          author: "Dr. Rajiv Kumar",
          authorImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
          content: "Thank you for your kind words, Ananya! It's always rewarding to hear from graduates who benefited from our programs.",
          date: "2023-10-16T10:15:00Z",
          likes: 5
        }
      ]
    },
    {
      id: 2,
      author: "Vikram Mehta",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      content: "The Technology Innovation Hub sounds fascinating! I'd love to know more about specific projects that came out of it in the past year.",
      date: "2023-10-17T14:22:00Z",
      likes: 8,
      replies: []
    }
  ],
  
  // Comments for blog post ID 2
  2: [
    {
      id: 3,
      author: "Priya Patel",
      authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      content: "The insights in this article are incredibly useful for students planning their academic journey. I wish I had this information when I was starting out!",
      date: "2023-11-05T09:45:00Z",
      likes: 15,
      replies: [
        {
          id: 102,
          author: "Rohan Sharma",
          authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
          content: "Completely agree. The mentorship aspect mentioned here is particularly important for first-year students.",
          date: "2023-11-05T11:30:00Z",
          likes: 7
        }
      ]
    }
  ],
  
  // Comments for blog post ID 3
  3: [
    {
      id: 4,
      author: "Arjun Nair",
      authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      content: "The campus events calendar is packed with exciting opportunities! Looking forward to the upcoming tech festival.",
      date: "2023-12-10T16:20:00Z",
      likes: 10,
      replies: []
    }
  ],
  
  // Add more comments for other post IDs as needed
  4: [
    {
      id: 5,
      author: "Meera Kapoor",
      authorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      content: "The research opportunities mentioned in this article are impressive. I'm glad to see such focus on interdisciplinary collaboration.",
      date: "2024-01-15T13:40:00Z",
      likes: 7,
      replies: []
    }
  ],
  
  5: [
    {
      id: 6,
      author: "Aditya Singh",
      authorImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      content: "As an alumnus, I can confirm that the alumni network is indeed very supportive. The mentorship program has been a game-changer for many students.",
      date: "2024-02-20T09:15:00Z",
      likes: 14,
      replies: [
        {
          id: 103,
          author: "Neha Gupta",
          authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
          content: "I'm a current student benefiting from the alumni mentorship program. It's been invaluable for my career planning.",
          date: "2024-02-20T11:22:00Z",
          likes: 6
        }
      ]
    }
  ]
};

// Function to get comments for a specific post
export const getCommentsByPostId = (postId: number): Comment[] => {
  return commentsByPostId[postId] || [];
};