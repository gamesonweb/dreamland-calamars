import { CONFIG } from './config.js';
import { BeanManager } from './beanManager.js';
import { PlayerController } from './playerController.js';

export class Game {
    constructor(canvas) {
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = this.createScene();
        this.worldNode = null;
        this.beanManager = null;
        this.backgroundMusic = null;
        this.isGameOver = false;
        this.playerController = null;
        this.canvas = canvas;
    }

    createScene() {
        const scene = new BABYLON.Scene(this.engine);
        scene.clearColor = CONFIG.BACKGROUND_COLOR;
        return scene;
    }

    async initialize() {
        // Création de la structure du monde
        this.worldNode = new BABYLON.TransformNode("worldNode", this.scene);
       
        // Initialisation des managers
        this.beanManager = new BeanManager(this.scene);
        this.playerController = new PlayerController(this.scene);
       
        // Création du haricot
        const beanNode = new BABYLON.TransformNode("beanNode", this.scene);
        beanNode.rotation.x = Math.PI / 2;
        beanNode.parent = this.worldNode;
       
        const baseBean = await this.beanManager.createBean();
        baseBean.parent = beanNode;
       
        // Configuration du joueur (passage du beanManager en paramètre)
        await this.playerController.setupPlayer(this.worldNode, this.beanManager, this);
        await this.initializeAudio();
        
        // Configuration de l'éclairage
        this.setupLights();
        
        // Configuration du menu game over
        this.setupGameOverMenu();
       
        this.run();
    }

    // INITIALISATION DE LA MUSIQUE EN ATTENTE DE CLIC (LES NAVIGATEURS ONT UNE SECURIT)
    async initializeAudio() {
        // Vérifier si c'est un appareil mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Ne pas initialiser la musique sur mobile
        if (isMobile) return;
        
        // Créer une nouvelle instance de l'audio
        this.backgroundMusic = new Audio("./audio/trump-funny-remix.mp3");
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;

        // Jouer la musique au premier clic n'importe où sur la page
        const playOnFirstInteraction = () => {
            // S'assurer que la musique n'est pas déjà en cours de lecture
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
            }
            this.playBackgroundMusic();
            document.removeEventListener('click', playOnFirstInteraction);
            document.removeEventListener('keydown', playOnFirstInteraction);
        };
        
        document.addEventListener('click', playOnFirstInteraction);
        document.addEventListener('keydown', playOnFirstInteraction);
    }

    playBackgroundMusic() {
        // Ne pas jouer la musique sur mobile
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return;

        if (this.backgroundMusic && this.backgroundMusic.paused) {
            // S'assurer que la musique est bien arrêtée avant de la relancer
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            
            const playPromise = this.backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("Impossible de lancer la musique:", error);
                });
            }
        }
    }

    pauseBackgroundMusic() {
        // Ne pas gérer la musique sur mobile
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return;

        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }

    setupGameOverMenu() {
        const gameOverMenu = document.getElementById('gameOverMenu');
        const restartBtn = document.getElementById('restartBtn');

        // Gestionnaire de clic sur le bouton Recommencer
        restartBtn.addEventListener('click', () => {
            this.restartGame();
        });
        
        // Gestionnaire d'appui sur Espace ou Entrée pour recommencer
        document.addEventListener('keydown', (event) => {
            if ((event.code === 'Space' || event.code === 'Enter') && this.isGameOver) {
                this.restartGame();
            }
        });
    }

    showGameOver(distance, record, isNewRecord) {
        if (this.isGameOver) return;

        this.isGameOver = true;
        this.engine.stopRenderLoop();
        this.pauseBackgroundMusic();
        
        // Mettre à jour l'affichage du score final
        const finalScoreElement = document.querySelector('.final-score');
        const finalRecordElement = document.querySelector('.final-record');
        const newRecordElement = document.querySelector('.new-record');
        
        if (finalScoreElement) finalScoreElement.textContent = `${Math.floor(distance)} m`;
        if (finalRecordElement) finalRecordElement.textContent = `${record} m`;
        
        // Afficher le message de nouveau record si applicable
        if (isNewRecord && newRecordElement) {
            newRecordElement.classList.remove('hidden');
        }
        
        // Afficher le menu game over
        const gameOverMenu = document.getElementById('gameOverMenu');
        gameOverMenu.classList.remove('hidden');
    }

    async restartGame() {
        // Masquer le menu game over
        const gameOverMenu = document.getElementById('gameOverMenu');
        gameOverMenu.classList.add('hidden');
        
        // Masquer le message de nouveau record
        const newRecordElement = document.querySelector('.new-record');
        if (newRecordElement) newRecordElement.classList.add('hidden');
        
        // Réinitialiser les états
        this.isGameOver = false;
        
        // Arrêter complètement et libérer la musique actuelle
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            
            // Créer une nouvelle instance de l'audio
            this.backgroundMusic = new Audio("./audio/trump-funny-remix.mp3");
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = 0.3;
        }
        
        // Créer une nouvelle scène
        this.scene.dispose();
        this.scene = this.createScene();
        
        // Réinitialiser toute la configuration
        await this.initialize();
        
        // Activer l'invincibilité temporaire après le redémarrage
        if (this.playerController) {
            this.playerController.activateInvincibility(1500); // 1.5 secondes d'invincibilité
        }
        
        // Focus sur le canvas
        if (this.canvas) {
            this.canvas.focus();
        }
    }

    setupLights() {
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0), this.scene);
        light.intensity = 0.999;
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
        light.groundColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    }

    run() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }
}