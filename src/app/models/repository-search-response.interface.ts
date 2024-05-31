import { Repository } from './repository.interface';

export interface RepositorySearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}

  