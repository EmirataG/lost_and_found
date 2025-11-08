export type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type Post = {
  id: number;
  user_id: string;
  title: string;
  description: string;
  when: string;
  where: string;
  resolved: boolean;
  type: string;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
};

export type Photo = {
  post_id: number;
  url: string;
};

export type Suggestion = {
  id: string;
  content: string;
  created_at: string;
};

export type PostType = "lost" | "found";
