export type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  when: string;
  where: string;
  resolved: boolean;
  type: string;
  created_at: string;
};

export type PostData = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  photos: string[];
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

export type PostInfo = {
  id: string;
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
  post_id: string;
  url: string;
};

export type PostType = "lost" | "found";

export type PostFilter = "all" | "unresolved" | "resolved";
