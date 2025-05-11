import { CONFIG } from './config.js';

export class BeanManager {
    constructor(scene) {
        this.scene = scene;
        this.beanNode = null;
        this.beanClones = [];
        this.beanSegmentLength = CONFIG.SEGMENT_SPACING; // Longueur d'un segment
        this.activeSegments = 2; // On commence avec 2 segments
        this.baseBean = null; // Le modèle original de haricot
        this.thornCount = CONFIG.MIN_THORNS;
        this.segmentIndex = 0 //Segment du joueur
    }

    async createBean() {
        const result = await BABYLON.SceneLoader.ImportMeshAsync(
            "",
            CONFIG.ASSETS_PATH,
            CONFIG.BEAN_MODEL,
            this.scene
        );

        this.baseBean = result.meshes[0];
        this.baseBean.scaling = new BABYLON.Vector3(4, 4, 4);
        
        // IMPORTANT: Rendre le mesh original invisible
        this.baseBean.setEnabled(false);
        
        // Création d'un parent pour tous les segments
        const beanParent = new BABYLON.TransformNode("beanParent", this.scene);
        
        // Création des segments visibles (seulement 2 au départ)
        for (let i = 0; i < this.activeSegments; i++) {
            this.createBeanSegment(i, beanParent);
        }

        return beanParent; // Retourne le parent contenant tous les segments
    }

    createBeanSegment(segmentIndex, parentNode) {
        // Cloner le modèle de base
        const clone = this.baseBean.clone("beanSegment_" + segmentIndex);
        clone.position.y = segmentIndex * this.beanSegmentLength;
        clone.parent = parentNode;
        clone.setEnabled(true); // S'assurer qu'il est visible
        clone.segmentIndex = segmentIndex; // Stocker l'index pour référence
        this.beanClones.push(clone);

        // Création des épines avec distribution aléatoire
        this.generateRandomThorns(clone, segmentIndex);
    }

    // Méthode pour générer des épines aléatoires sur un segment
    generateRandomThorns(segment, segmentIndex) {
        // Éviter de mettre des épines près du point de départ
        const isFirstSegment = segmentIndex === 0;
        
        // Générer les épines avec des distributions aléatoires
        for (let i = 0; i < this.thornCount; i++) {
            let heightPosition = Math.floor(Math.random() * (CONFIG.THORN_SPACING + 1));
            if(isFirstSegment) heightPosition = 10 + Math.floor(Math.random() * 17);
 
            const angle = Math.random() * 361
               
            // Léger offset aléatoire pour l'angle pour éviter une trop grande uniformité
            const angleOffset = (Math.random() - 0.5) * 20;
            
            // Créer l'épine
            this.createThorn(segment, segmentIndex, angleOffset, angle, heightPosition);
        }
    }

    // Méthode pour recycler un segment de haricot
    recycleSegment(segmentToRecycle, newPositionIndex) {
        // Effacer les épines actuelles (qui ont ce segment comme parent)
        const thornsToRemove = [];
        for (let mesh of this.scene.meshes) {
            if (mesh.name.startsWith("thorn_") && mesh.parent === segmentToRecycle) {
                thornsToRemove.push(mesh);
            }
        }
        thornsToRemove.forEach(thorn => thorn.dispose());
        // Repositionner le segment
        segmentToRecycle.position.y = newPositionIndex * this.beanSegmentLength;
        segmentToRecycle.segmentIndex = newPositionIndex; // Mettre à jour l'index stocké

        this.thornCount = Math.min(this.thornCount + CONFIG.THORNS_INCREMENT, CONFIG.MAX_THORNS);
        
        // Générer de nouvelles épines avec des positions aléatoires
        this.generateRandomThorns(segmentToRecycle, newPositionIndex);
    }

    // Vérifie si le joueur a atteint un segment et recycle le segment suivant
    updateBeanSegments() {
        // On garde une référence au segment à recycler
        const segmentToRecycle = this.beanClones[0];
        const newPositionIndex = segmentToRecycle.segmentIndex + this.activeSegments;
        
        // Là on l'enlève et on recycle
        const recycled = this.beanClones.shift();
       
        this.recycleSegment(recycled, newPositionIndex);
        this.beanClones.push(recycled);
        this.segmentIndex++;
    }
            

    createThorn(beanSegment, segmentIndex = 0, angleOffset = 0, angleDegrees = 0, heightPosition) {

        // 1) Paramètres
        const baseRadius = 0;
        const thicknessFactor = 2;      // ← on grossit ici
        const thornLength = 1.3;      // ← un peu plus long
        const offsetSurface = 0.3;
        const segmentHeight = CONFIG.THORN_SPACING;
    
        // 2) Calcul radial
        const angleRad = BABYLON.Tools.ToRadians(angleDegrees + angleOffset);
        const radialDir = new BABYLON.Vector3(
            Math.cos(angleRad), 0, Math.sin(angleRad)
        ).normalize();
    
        // 3) Position du centre pour que la BASE touche exactement
        const centreOffset = baseRadius + offsetSurface + (thornLength / 2);
        const centrePos = radialDir.scale(centreOffset);
    
        // 4) Création du cylindre PLUS GROS
        const thorn = BABYLON.MeshBuilder.CreateCylinder(
            `thorn_${segmentIndex}_${angleDegrees}_${heightPosition}`,
            {
                height: thornLength,
                diameterTop: 0.15 * thicknessFactor,
                diameterBottom: (baseRadius * 2) * thicknessFactor,
                tessellation: 8
            },
            this.scene
        );
        thorn.position = new BABYLON.Vector3(centrePos.x, heightPosition, centrePos.z);
        thorn.parent = beanSegment;
        
        // 5) Orientation perpendiculaire sortante
        const up = new BABYLON.Vector3(0, 1, 0);
        let axis = BABYLON.Vector3.Cross(up, radialDir);
        if (axis.lengthSquared() < 1e-6) axis = new BABYLON.Vector3(1, 0, 0);
        else axis.normalize();
        const dot = BABYLON.Vector3.Dot(up, radialDir);
        const angle = Math.acos(dot);
        thorn.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, angle);
        // flip si nécessaire
        const flip = BABYLON.Quaternion.RotationAxis(axis, Math.PI);
        thorn.rotationQuaternion = flip.multiply(thorn.rotationQuaternion);
    
        // 6) Matériau
        const mat = new BABYLON.StandardMaterial("thornMat", this.scene);
        mat.diffuseColor = new BABYLON.Color3(0.8, 0.1, 0.1);
        mat.specularColor = new BABYLON.Color3(0.5, 0.2, 0.2);
        thorn.material = mat;

        return thorn;
    }
}