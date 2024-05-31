import { map } from 'rxjs/operators'; 
import { OwnerType } from '../app/models/owner-type.enum'; 
import { Repository } from '../app/models/repository.interface'; 

// Fonction qui filtre les dépôts par type de propriétaire
export const filterByOwnerType = (type: OwnerType) => {
    // Fonction de filtrage pour vérifier si le type de propriétaire correspond
    const filterFn = (repository: Repository) => repository.owner.type === type;

    // Retourne un opérateur map qui applique le filtre sur le tableau de dépôts
    return map((repositories: Repository[]) => {
        return repositories.filter(filterFn);
    });
};
