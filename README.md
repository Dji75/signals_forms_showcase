# Angular v21 Signal Forms - Projet de Démonstration ⚡

Ce projet d'application de démonstration met en lumière le tout nouveau système **Signal Forms** (introduit de manière expérimentale dans **Angular v21** sous `@angular/forms/signals`).

Ce système représente un changement de paradigme majeur dans la gestion de formulaires avec Angular, en unifiant les modèles de données avec le cycle de vie réactif des **Signals**.

## 🛠️ Concepts Clés de Signal Forms Démontrés

Contrairement aux formulaires réactifs traditionnels (`FormGroup`, `FormControl`), **Signal Forms** utilise un signal writable comme source unique de vérité. Ce projet démontre l'ensemble des concepts :

1. **Source de vérité unique (`signal`) :** Le formulaire observe et écrit directement dans un signal d'état de votre composant.
2. **Arbre de champs (`FieldTree`) :** Généré via `form(modelSignal, schemaFn)`, il permet de naviguer à travers les champs de manière fortement typée.
3. **Directive `[formField]` :** Liaison bidirectionnelle automatique sans boilerplate, gérant nativement les attributs `disabled`, `readonly` et `required`.
4. **Schémas de validation décentralisés :** Définition de validateurs chaînés avec messages personnalisés au sein de la fonction schéma.
5. **Gestion de disponibilité dynamique :** Utilisation de règles `hidden()`, `disabled()` et `readonly()` réactives aux changements d'autres champs.
6. **Schémas pour tableaux de données (`applyEach()`) :** Validation de listes dynamiques d'objets avec suivi par identité (`track field`).
7. **Directive `[formRoot]` & cycle de vie de soumission :** Automatisation du passage à l'état `touched` sur soumission, gestion des loaders et de la réinitialisation `f().reset()`.

---

## 📂 Organisation des Formulaires de Démo

Le projet est structuré sous forme de tableau de bord moderne avec une navigation latérale distribuant 5 formulaires distincts :

### 1. 🔑 Connexion Simple (`/login`)
* **Concepts :** Liaison de modèle plat, validateurs standards (`required`, `email`, `minLength`) avec messages d'erreurs traduits.
* **Bonus :** Calcul réactif en temps réel de la force du mot de passe via un signal `computed()`.

### 2. 🛡️ Profil & Disponibilité (`/profile`)
* **Concepts :** Modèle de données imbriqué (objet `address` parent et enfants), état en lecture seule (`readonly()`), visibilité conditionnelle (`hidden()`) et blocage conditionnel (`disabled()`).
* **Cas pratique :** L'adresse de secours est masquée par défaut (les validateurs n'interviennent pas). Cocher la case l'affiche, ce qui active instantanément ses validateurs requis et impacte la validité globale du formulaire.

### 3. 📋 Tableaux de Champs (`/skills-array`)
* **Concepts :** Gestion de listes dynamiques d'objets dans le formulaire via `applyEach()`.
* **Cas pratique :** Ajout et suppression dynamiques de compétences dans le profil d'un développeur. Démonstration de la persistance de l'état d'interaction (`touched`, `dirty`) de chaque carte grâce au suivi par identité dans le bloc `&#64;for`.

### 4. 🚀 Soumission FormRoot (`/submission`)
* **Concepts :** Liaison du formulaire à la directive native `[formRoot]`.
* **Cas pratique :** Simulation d'une requête HTTP asynchrone (2 secondes) avec affichage d'un spinner de chargement et verrouillage du bouton. Réinitialisation complète des données et de l'historique d'interaction via `f().reset(INITIAL_STATE)`.

### 5. 🎟️ Calculs Réactifs - Réservation (`/booking-derived`)
* **Concepts :** Cross-field validation (validation croisée) via `validate()` avec le contexte `valueOf()`.
* **Cas pratique :** Un formulaire de billetterie où la quantité maximale autorisée est limitée à 4 si le billet sélectionné est "VIP". Calcul instantané du prix de base, de la réduction (code promo `REDUC20`, `OFFRE50`, `GRATUIT`) et du prix total net via des signaux dérivés `computed()`.

---

## 🚀 Démarrage Rapide

### Prérequis
* **Node.js** v24.14.1+ (ou v18+)
* **Angular CLI** v21.1.3+ (installé globalement)

### Installation et Lancement
1. Placez-vous dans le dossier du projet :
   ```bash
   cd signals_forms_showcase
   ```
2. Lancez le serveur de développement :
   ```bash
   ng serve
   ```
3. Ouvrez votre navigateur sur [http://localhost:4200/](http://localhost:4200/).

### Tests
Pour lancer la suite de tests unitaires (Vitest est configuré par défaut dans ce projet v21) :
```bash
ng test
```

---

*Ce projet de démonstration a été spécialement conçu pour illustrer l'implémentation de formulaires performants, idiomatiques et sans Zone.js dans des applications Angular modernes.*
