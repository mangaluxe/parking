"use strict";

/*
Créer la class Véhicule avec les attributs et méthodes comme indiqué ci-dessous.
- Attributs : Marque : string, Modèle : string, Kilométrage : number, Année : number.
- Une méthode display retourne une chaine concaténant les attributs de l’objet.

Créer l’interface HTML comme ci-dessus afin de pouvoir prendre un ticket, puis payer son
parking avec le tarif suivant :

Durée                  | Prix
<= 15 min              |  0.8€
15min < Durée <=30 min | 1.30€
30min < Durée <=45 min | 1.70€
> 45 min               | 6€
*/

class Voiture {
    constructor(marque, modele, kilometrage, annee, immatriculation) {
        this.marque = marque;
        this.modele = modele;
        this.kilometrage = parseInt(kilometrage, 10);
        this.annee = parseInt(annee, 10);
        this.immatriculation = immatriculation;
    }

    display() {
        return `Voiture ${this.marque} ${this.modele} avec ${this.immatriculation} a ${this.kilometrage} km et date de ${this.annee}.`;
    }
}


const voiture1 = new Voiture("Peugeot", "2008", "35000", "2016", "EF-2222-GK"); // Ajout d'une 1re voiture pour test

const form = document.getElementById("form");

const successBox = document.getElementById("successBox");
const alertBox = document.getElementById("alertBox");
const messageBox = document.getElementById("messageBox");

const paymentBtn = document.getElementById("paymentBtn");
const enterBtn = document.getElementById("enterBtn");


/**
 * Récupérer la liste des voitures garées dans le parking (depuis localStorage)
 * @returns {Array} La liste des voitures garées dans le parking
 */
function getVoitureList() {
    const storedVoiture = localStorage.getItem('voitureList');
    return storedVoiture ? JSON.parse(storedVoiture) : [];
}


/**
 * Sauvegarder la liste des voitures dans localStorage
 */
function setVoitureList(voitureList) {
    localStorage.setItem('voitureList', JSON.stringify(voitureList));
}


if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const debut = new Date(); // Enregistre date/heure d'entrée dans le parking
        // console.log(debut); // Exemple: Thu Oct 10 2024 11:33:29 GMT+0200 (heure d’été d’Europe centrale)

        const immatriculation = document.getElementById("licencePlate").value;

        if (!immatriculation) { // Validation du formulaire
            return;
        }

        const voitureList = getVoitureList();
        
        // Vérifier si l'immatriculation existe déjà
        if (voitureList.some(v => v.immatriculation === immatriculation)) {
            alertBox.textContent = `La voiture immatriculée ${immatriculation} est déjà dans le parking !`;
            alertBox.style.display = "block";
            
            setTimeout(function () {
                alertBox.style.display = "none";
            }, 5000);
            
            return;
        }

        const voiture = { immatriculation, debut };
        voitureList.push(voiture); // Ajoute la voiture au tableau
        setVoitureList(voitureList); // Sauvegarde le tableau mis à jour dans le localStorage

        form.reset(); // Réinitialiser le formulaire

        successBox.textContent = `La voiture immatriculée ${immatriculation} vient d'être garée dans le parking !`;
        successBox.style.display = "block";

        setTimeout(function () {
            successBox.style.display = "none";
        }, 5000);

    });
}


/**
 * Afficher prix à payer
 */
function payer() {
    const voitureList = getVoitureList();
    const fin = new Date(); // Enregistre date/heure de sortie du parking
    const immatriculation = document.getElementById("licencePlate").value;

    if (!immatriculation) {
        return;
    }

    const voiture = voitureList.find(v => v.immatriculation === immatriculation); // find() parcourt le tableau et retourne le premier élément qui satisfait la condition donnée

    if (!voiture) {
        alertBox.textContent = "Aucune voiture trouvée";
        alertBox.style.display = "block";

        setTimeout(function () {
            alertBox.style.display = "none";
        }, 5000);

        return;
    }

    const debut = new Date(voiture.debut); // Récupération de date/heure existante
    const dureeMinutes = Math.round((fin - debut) / (1000 * 60));
    let prix;

    if (dureeMinutes <= 15) {
        prix = 0.8;
    }
    else if (dureeMinutes <= 30) {
        prix = 1.3;
    }
    else if (dureeMinutes <= 45) {
        prix = 1.7;
    }
    else {
        prix = 6;
    }

    messageBox.textContent = `Prix à payer pour ${immatriculation}: ${prix.toFixed(2)}€`;
    messageBox.style.display = "block";

    setTimeout(function () {
        messageBox.style.display = "none";
    }, 5000);

    // Supprimer voiture après paiement :
    const index = voitureList.findIndex(v => v.immatriculation === immatriculation);
    voitureList.splice(index, 1);
    setVoitureList(voitureList);
}

if (paymentBtn) {
    paymentBtn.addEventListener("click", payer);
}
