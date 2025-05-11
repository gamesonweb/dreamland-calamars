import { CONFIG } from './config.js';

export class PlayerController {
    constructor(scene) {
        this.scene = scene;
        this.keyLeft = false;
        this.keyRight = false;
        this.angle = 0;
        this.playerPositionZ = 0;
        this.playerMesh = null;
        this.animationGroup = null;
        this.initialAngle = 0;
        this.initialPositionZ = 0;
        this.beanManager = null; // Référence au gestionnaire de haricots
        this.speed = CONFIG.MOVEMENT_SPEED; // Vitesse de déplacement
        this.game = null; // Référence à l'instance du jeu
        
        // Système de score
        this.distance = 0;
        this.record = this.loadRecord();
        this.currentScoreElement = null;
        this.recordScoreElement = null;
    }

    // Charger le record depuis le localStorage
    loadRecord() {
        const savedRecord = localStorage.getItem('haricotMagiqueRecord');
        return savedRecord ? parseInt(savedRecord) : 0;
    }

    // Sauvegarder le record dans le localStorage
    saveRecord(value) {
        localStorage.setItem('haricotMagiqueRecord', value.toString());
        this.record = value;
    }

    // Mettre à jour l'affichage du score
    updateScoreDisplay() {
        if (!this.currentScoreElement || !this.recordScoreElement) {
            this.currentScoreElement = document.querySelector('.current-score');
            this.recordScoreElement = document.querySelector('.record-score');
        }

        if (this.currentScoreElement) {
            this.currentScoreElement.textContent = `${Math.floor(this.distance)} m`;
        }

        if (this.recordScoreElement) {
            this.recordScoreElement.textContent = `${this.record} m`;
        }
    }

    // Réinitialiser le score
    resetScore() {
        // Vérifier si on a battu le record avant de réinitialiser
        const currentDistance = Math.floor(this.distance);
        if (currentDistance > this.record) {
            this.saveRecord(currentDistance);
        }
        this.distance = 0;
        this.updateScoreDisplay();
    }

    async setupPlayer(worldNode, beanManager, game) {
        // Stocker les références
        this.beanManager = beanManager;
        this.game = game;

        const playerCameraNode = new BABYLON.TransformNode("playerCameraNode", this.scene);
        
        const result = await BABYLON.SceneLoader.ImportMeshAsync(
            "",
            CONFIG.ASSETS_PATH,
            "trump.glb",
            this.scene
        );
        
        this.playerMesh = result.meshes[0];
        this.playerMesh.rotationQuaternion = null;
        this.playerMesh.rotation = new BABYLON.Vector3(0, 0, 0);
        this.playerMesh.scaling = new BABYLON.Vector3(0.8, 0.8, 0.8);
        this.playerMesh.position = new BABYLON.Vector3(0, CONFIG.BEAN_RADIUS + CONFIG.PLAYER_RADIUS, 0);
        this.playerMesh.parent = playerCameraNode;
        
        
        if (result.animationGroups && result.animationGroups.length > 0) {
            for (let ag of result.animationGroups) {
                if (ag.name.toLowerCase().includes("run")) {
                    this.animationGroup = ag;
                    break;
                }
            }
            
            if (!this.animationGroup && result.animationGroups.length > 0) {
                this.animationGroup = result.animationGroups[0];
            }
            
            if (this.animationGroup) {
                this.animationGroup.start(true);
            }
        }
        
        const camera = new BABYLON.FreeCamera("camera", 
            new BABYLON.Vector3(0, CONFIG.BEAN_RADIUS + CONFIG.CAMERA_HEIGHT, -8), 
            this.scene);
        camera.rotation.x = CONFIG.CAMERA_ANGLE;
        camera.parent = playerCameraNode;

        this.setupControls();
        this.initialAngle = this.angle;
        this.initialPositionZ = this.playerPositionZ;

        // Initialiser l'affichage du score
        this.updateScoreDisplay();

        this.setupRenderLoop(worldNode, playerCameraNode);
        
        return playerCameraNode;
    }

    // Réinitialiser l'état des touches après une pause
    resetKeyStates() {
        this.keyLeft = false;
        this.keyRight = false;
    }

    setupControls() {
        this.scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key.toLowerCase()) {
                        case 'q':
                        case 'arrowleft':
                            this.keyLeft = true;
                            break;
                        case 'd':
                        case 'arrowright':
                            this.keyRight = true;
                            break;
                        case 'escape':
                            if (this.game) {
                                if (this.game.isPaused) {
                                    this.game.resumeGame();
                                } else {
                                    this.game.pauseGame();
                                }
                            }
                            break;
                        case 'i':
                            this.scene.debugLayer.show();
                            break;
                    }
                    break;
                case BABYLON.KeyboardEventTypes.KEYUP:
                    switch (kbInfo.event.key.toLowerCase()) {
                        case 'q':
                        case 'arrowleft':
                            this.keyLeft = false;
                            break;
                        case 'd':
                        case 'arrowright':
                            this.keyRight = false;
                            break;
                    }
                    break;
            }
        });
    }

    setupRenderLoop(worldNode, playerCameraNode) {
        // Calculer la position Z en termes de segments
        const getSegmentPosition = (posZ) => {
            if (this.beanManager) {
                return Math.floor(posZ / this.beanManager.beanSegmentLength);
            }
            return 0;
        };
        
        this.scene.onBeforeRenderObservable.add(() => {
            // Ne pas mettre à jour si le jeu est en pause ou game over
            if (this.game && (this.game.isPaused || this.game.isGameOver)) return;

            // Gestion du mouvement de rotation
            if (this.keyLeft) this.angle -= CONFIG.ROTATION_SPEED;
            else if (this.keyRight) this.angle += CONFIG.ROTATION_SPEED;

            worldNode.rotation.z = this.angle;
            playerCameraNode.rotation.z = -this.angle;
            
            // Avancer le joueur
            this.playerPositionZ += this.speed;
            playerCameraNode.position.z = this.playerPositionZ;
            
            // Mettre à jour la distance parcourue
            this.distance = this.playerPositionZ;
            this.updateScoreDisplay();
            
            // Gestion des segments de haricot infini - seulement quand on change de segment
            if (this.playerPositionZ > this.beanManager.beanSegmentLength * (this.beanManager.segmentIndex + 1) + 10) {
                this.beanManager.updateBeanSegments();
                this.speed = Math.min(this.speed + CONFIG.SPEED_INCREMENT, CONFIG.MAX_MOVEMENT_SPEED);
            }
            
            // Détection de collision avec les épines
            for (let mesh of this.scene.meshes) {
                if (!mesh.name.startsWith("thorn_")) continue;
                // false = bounding box, true = test précis si tu as besoin
                if (mesh.intersectsMesh(this.playerMesh, true)) {
                    // Gérer la collision
                    this.handleThornCollision();
                    break;
                }
            }
        });
    }
    
    // Méthode pour gérer la collision avec une épine
    handleThornCollision() {
        // Ne rien faire si le joueur est au début du jeu (problème de collision, il n'y a pas d'épines au début)
        if(this.playerPositionZ <= 0.50) return;
        
        // Vérifier si on a battu le record
        const currentDistance = Math.floor(this.distance);
        const isNewRecord = currentDistance > this.record;
        
        if (isNewRecord) {
            this.saveRecord(currentDistance);
        }
        
        // Jouer un son de collision/game over si disponible
        this.playGameOverSound();
        
        // Afficher l'écran de game over
        if (this.game) {
            this.game.showGameOver(currentDistance, this.record, isNewRecord);
        }
    }
    
    // Jouer un son quand on perd
    playGameOverSound() {
        try {
            // Stocker la référence au son dans une variable statique de la classe
            if (!PlayerController.gameOverSound) {
                PlayerController.gameOverSound = new Audio("./audio/game-over.mp3");
                PlayerController.gameOverSound.volume = 0.5;
            } else {
                // Réinitialiser le son s'il est déjà créé
                PlayerController.gameOverSound.pause();
                PlayerController.gameOverSound.currentTime = 0;
            }
            
            // Jouer le son
            PlayerController.gameOverSound.play().catch(error => {
                console.warn("Impossible de jouer le son de game over:", error);
            });
        } catch (error) {
            console.warn("Erreur lors de la lecture du son:", error);
        }
    }
}