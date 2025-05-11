# Le Jeu du Haricot Magique

Un jeu web 3D inspiré du célèbre jeu du temple ("Temple Run") réalisé avec Babylon.js. Dans ce jeu, le joueur contrôle un personnage qui court sur un haricot géant tout en évitant des obstacles.

![Capture d'écran du jeu](assets/favicon-32x32.png)

## Description

Dans "Le Jeu du Haricot Magique", vous incarnez un personnage qui doit courir le plus loin possible sur un haricot magique géant. Votre objectif est de parcourir la plus grande distance possible sans heurter les épines qui bordent le haricot.

Le jeu présente les caractéristiques suivantes :
- Environnement 3D généré procéduralement à l'infini
- Système de score avec sauvegarde des records
- Contrôles intuitifs (gauche/droite)
- Difficulté progressive avec augmentation de la vitesse et du nombre d'obstacles
- Effets sonores et musique d'ambiance

## Comment jouer

### Contrôles
- **Flèche Gauche** ou **Q** : Tourner à gauche
- **Flèche Droite** ou **D** : Tourner à droite
- **Échap** : Mettre le jeu en pause
- **Espace** ou **Entrée** : Reprendre le jeu ou redémarrer après un game over
- **I** : Afficher l'inspecteur Babylon.js (mode développeur)

## Technologies utilisées

- **Babylon.js** : Moteur de rendu 3D WebGL
- **JavaScript (ES6+)** : Logique du jeu
- **HTML5/CSS3** : Structure et style
- **LocalStorage** : Sauvegarde des records

## Structure du projet

```
/
├── index.html        # Page principale du jeu
├── style.css         # Styles CSS
├── js/               # Scripts JavaScript
│   ├── main.js       # Point d'entrée
│   ├── game.js       # Classe principale du jeu
│   ├── config.js     # Configuration et paramètres
│   ├── beanManager.js # Gestion du haricot et obstacles
│   └── playerController.js # Contrôle du joueur
├── assets/           # Ressources 3D
│   ├── bean.glb      # Modèle 3D du haricot
│   ├── trump.glb     # Modèle 3D du personnage
│   └── favicon-32x32.png # Icône du jeu
└── audio/            # Ressources audio
    ├── trump-funny-remix.mp3 # Musique de fond
    └── game-over.mp3 # Son de fin de partie
```

## Installation et lancement

1. Clonez ou téléchargez ce dépôt
2. Ouvrez le fichier `index.html` dans votre navigateur web moderne
   - Pour une expérience optimale, utilisez un serveur web local

Vous pouvez également utiliser un serveur local simple avec Python :
```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

## Crédits

- Développé avec [Babylon.js](https://www.babylonjs.com/)
- Modèles 3D et assets audio créés spécifiquement pour ce projet
- Modèle Haricot généré avec meshyAI
- Modèle Trump récupéré depuis sketchfab
- Animation pour le modèle Trump récupéré depuis mixamo

## Licence

Ce projet est disponible sous licence libre pour une utilisation éducative. 

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/tcwhlYLU)