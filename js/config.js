export const CONFIG = {
    // Paramètres du jeu
    BEAN_RADIUS: 3,
    PLAYER_RADIUS: 0.5,
    CAMERA_HEIGHT: 8,
    CAMERA_ANGLE: Math.PI / 6,
    ROTATION_SPEED: 0.02,
    MOVEMENT_SPEED: 0.20,
    MAX_MOVEMENT_SPEED: 0.70,
    SPEED_INCREMENT: 0.05,
    BEAN_SEGMENTS: 2,     // Nombre initial de segments (maintenant 2)
    SEGMENT_SPACING: 105, // Distance entre chaque segment
   
    // Couleurs
    BACKGROUND_COLOR: new BABYLON.Color3(0.5, 0.7, 1.0),
    THORN_COLOR: new BABYLON.Color3(0.8, 0.2, 0.2),
   
    // Chemins des assets
    ASSETS_PATH: "./assets/",
    AUDIO_PATH: "./audio/",
    BEAN_MODEL: "bean.glb",

    THORN_SPACING: 26,
    MIN_THORNS: 10,
    MAX_THORNS: 50,
    THORNS_INCREMENT: 10,
};