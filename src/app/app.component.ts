/* L'application utilise  RxJS et de ses opérateurs pour gérer efficacement les flux de données asynchrones .
  En intégrant les observables et les opérateurs RxJS, nous gérons de manière transparente le flux de données, 
  permettant des interactions fluides . L'utilisation des opérateurs RxJS nous permet de transformer, 
  filtrer et combiner les flux de données facilement, améliorant ainsi les performances et la réactivité de l'application. 
*/

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable, Subject, of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  catchError
} from 'rxjs/operators';
// interfaces
import { RepositorySearchResponse } from '../app/models/repository-search-response.interface';
import { Organization } from '../app/models/organization.interface';
import { Repository } from '../app/models/repository.interface';
import { OwnerType } from '../app/models/owner-type.enum';

const GITHUB_URL = 'https://api.github.com/search/repositories?';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnInit {

  queries$ = new Subject<string>();
  selectedRepository$ = new Subject<Repository | undefined>();
  repositories$: Observable<Repository[]> | undefined;
  organizations$: Observable<Organization[]> | undefined;
  errorMessage: string | null = null;  // Propriété pour stocker les messages d'erreur

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Pipeline RxJS pour les requêtes de recherche
    this.repositories$ = this.queries$.pipe(
      map((query: string) => query ? query.trim() : ''), // Trim des requêtes
      filter(Boolean), // Filtrer les requêtes vides
      debounceTime(500), // Ajouter un délai pour limiter les appels API
      distinctUntilChanged(), // Éviter les appels pour les mêmes requêtes consécutives
      switchMap((query: string) => this.fetchRepositories(query)), // Faire la requête API
      catchError(error => {
        console.error('Erreur lors de la récupération des dépôts:', error);
        this.errorMessage = 'Impossible de récupérer les dépôts. Veuillez réessayer plus tard.';
        return of([]); // Retourner un tableau vide en cas d'erreur
      })
    );

    // Pipeline RxJS pour les organisations
    this.organizations$ = this.selectedRepository$.pipe(
      map((repository) => {
        if (repository) {
          console.log(`URL des organisations du propriétaire sélectionné: ${repository.owner.organizations_url}`);
          return repository.owner.organizations_url;
        }
        return false;
      }), // Obtenir l'URL des organisations
      switchMap((url: string | false) => {
        if (url) {
          console.log(`Récupération des organisations depuis: ${url}`);
          return this.fetchUserOrganizations(url); 
        } else {
          console.log('Aucune URL d\'organisations trouvée');
          return of([]); 
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des organisations:', error);
        console.error('Erreur lors de la récupération des organisations:', error);
        return of([]); 
      })
    );
  }
    
  // Méthode pour traiter les changements de texte dans le champ de recherche
  onTextChange(query: string) {
    this.errorMessage = null;  // Réinitialiser le message d'erreur sur une nouvelle requête
    this.queries$.next(query);
  }

  // Méthode pour traiter les événements de survol de la souris sur les dépôts
  onRepositoryMouseEvent(repository: Repository | undefined) {
    this.selectedRepository$.next(repository);
  }
  // Méthode pour récupérer les dépôts correspondant à une requête donnée
  private fetchRepositories(query: string): Observable<Repository[]> {
    const params = { q: query };

    return this.http
      .get<RepositorySearchResponse>(GITHUB_URL, { params })
      .pipe(
        map((response: RepositorySearchResponse) => response.items) // Mapper la réponse API aux items de repository
      );
  }

  // Méthode pour récupérer les organisations à partir d'une URL donnée
  private fetchUserOrganizations(url: string): Observable<Organization[]> {
    return this.http.get<Organization[]>(url).pipe(
      catchError((error: any) => {
        console.error('Erreur lors de la récupération des organisations:', error);
        return throwError(error);
      })
    );
  }
}
