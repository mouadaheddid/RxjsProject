# RxjsPoc

## Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre système :

Node.js : Version 20 ou plus :

    node -v 
   
npm : 10.2.4 ou plus :

    npm -v
  
Angular CLI : 18.0.2 ou plus :

    ng --version
  
## Dépendances

    npm install

## Débogage de l'Erreur 

 Assurez-vous que l'Angular CLI est correctement installé. Vous pouvez le réinstaller en utilisant :

    npm uninstall -g @angular/cli
    npm cache clean --force
    npm install -g @angular/cli

 Si ça ne marche pas :

  Réinstaller les dépendances du projet :

    rm -rf node_modules
    npm install

 Sinon : 

    npm install --save-dev @angular-devkit/build-angular

## Exécution de l'Application

Démarrer le serveur de développement :

    ng build 
    ng serve 

Cette commande démarre l'application sur `http://localhost:4200/ `  par défaut. 
