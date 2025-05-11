import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const canvas = document.getElementById("renderCanvas");
        canvas.focus();
        
        const game = new Game(canvas);
        await game.initialize();
    } catch (error) {
        console.error("Erreur lors de l'initialisation du jeu:", error);
    }
});