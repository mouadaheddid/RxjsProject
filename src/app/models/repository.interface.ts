export interface RepositoryOwner {
  login: string;
  id: number;
  avatar_url: string;
  url: string;
  organizations_url: string;
  type: string;
 
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: RepositoryOwner; 
  description: string;
}
