# 🌱 Le Jeu du Haricot Magique

Un jeu web 3D inspiré du célèbre **SpeedX 3D**, réalisé avec **Babylon.js**. Dans ce jeu, le joueur contrôle un personnage qui court sur un haricot magique géant tout en évitant ses épines.

---

## 👥 Membres

- [Martin BARAS](https://github.com/LywenBG)
- [Alexis BARAS](https://github.com/Askenet)
- [Maëlla BOUACIDA](https://github.com/maellabcd)
- [Valentin CARPENTIER](https://github.com/Frosperino)

---

## 🎮 Description

Dans *Le Jeu du Haricot Magique*, vous incarnez un personnage qui tente de courir le plus loin possible sur un haricot géant suspendu dans les airs. Le but : **éviter les épines** et battre votre propre record de distance !

### ✨ Fonctionnalités

- 🌍 Environnement 3D généré procéduralement à l’infini  
- 🏅 Système de score avec sauvegarde automatique des records  
- 🕹️ Contrôles simples et intuitifs (gauche/droite)  
- 📈 Difficulté progressive (plus rapide, plus d’obstacles)  
- 🎵 Effets sonores et musique d’ambiance  

---

## 🕹️ Comment jouer

### 🎛️ Contrôles

- ⬅️ ou **Q** : Tourner à gauche  
- ➡️ ou **D** : Tourner à droite  
- ⎋ (Échap) : Mettre le jeu en pause  
- **Espace** ou **Entrée** : Reprendre le jeu ou redémarrer après un *game over*  
- **I** : Afficher l'inspecteur Babylon.js (mode développeur)

---

## 🛠️ Technologies utilisées

- 🔷 **Babylon.js** : Moteur de rendu 3D WebGL  
- 💻 **JavaScript (ES6+)** : Logique du jeu  
- 🌐 **HTML5/CSS3** : Structure et style de la page  
- 💾 **LocalStorage** : Sauvegarde locale des scores  

---

## 🗂️ Structure du projet

```
/
├── index.html               # Page principale du jeu
├── style.css                # Styles CSS
├── js/                      # Scripts JavaScript
│   ├── main.js              # Point d'entrée
│   ├── game.js              # Classe principale du jeu
│   ├── config.js            # Configuration et paramètres
│   ├── beanManager.js       # Gestion du haricot et des obstacles
│   └── playerController.js  # Contrôle du joueur
├── assets/                  # Ressources 3D
│   ├── bean.glb             # Modèle 3D du haricot
│   ├── trump.glb            # Modèle 3D du personnage
│   └── favicon-32x32.png    # Icône du jeu
└── audio/                   # Ressources audio
    ├── trump-funny-remix.mp3 # Musique de fond
    └── game-over.mp3        # Son de fin de partie
```

---

## 🚀 Installation et lancement

1. Clonez ou téléchargez ce dépôt  
2. Ouvrez le fichier `index.html` dans un navigateur moderne

💡 Pour une expérience optimale, utilisez un serveur local :

```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

---

## 🙌 Crédits

- Développé avec [Babylon.js](https://www.babylonjs.com/)  
- Modèles 3D et sons créés spécifiquement pour ce projet  
- Haricot généré via [Meshy AI](https://www.meshy.ai/)  
- Modèle Trump depuis [Sketchfab](https://sketchfab.com/)  
- Animation via [Mixamo](https://www.mixamo.com/)  

---

## 📄 Licence

Ce projet est disponible sous licence libre pour une utilisation éducative. 🌱

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/tcwhlYLU)
