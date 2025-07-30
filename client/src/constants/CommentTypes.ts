export interface Reply {
    id: number;
    author: string;
    authorImage: string;
    content: string;
    date: string;
    likes: number;
  }
  
  export interface Comment {
    id: number;
    author: string;
    authorImage: string;
    content: string;
    date: string;
    likes: number;
    replies: Reply[];
  }