CREATE DATABASE IF NOT EXISTS gai_hygiene;
USE gai_hygiene;

-- Table Utilisateurs
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telephone VARCHAR(20),
    type_utilisateur ENUM('Élève', 'Parent', 'Enseignant') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Classes
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_classe VARCHAR(30) NOT NULL,
    niveau VARCHAR(20),
    enseignant_id INT,
    FOREIGN KEY (enseignant_id) REFERENCES utilisateurs(id)
);

-- Table Élèves (relation avec utilisateurs)
CREATE TABLE eleves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT,
    classe_id INT,
    parent_id INT,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (classe_id) REFERENCES classes(id),
    FOREIGN KEY (parent_id) REFERENCES utilisateurs(id)
);

-- Table Fiche de rappel
CREATE TABLE fiches_rappel (
    IdRap VARCHAR(10) PRIMARY KEY,
    TitreRap VARCHAR(30) NOT NULL,
    DescRap VARCHAR(100),
    DateRap DATE NOT NULL,
    HeureRap TIME NOT NULL,
    ResponsableRap VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Programmation
CREATE TABLE programmations (
    IdProg VARCHAR(10) PRIMARY KEY,
    TitreProg VARCHAR(50) NOT NULL,
    TypeActProg VARCHAR(20),
    DateDebProg DATE NOT NULL,
    HeureDebProg TIME NOT NULL,
    DateFinProg DATE,
    HeureFinProg TIME,
    RespProg VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Notifications
CREATE TABLE notifications (
    IdNotif VARCHAR(10) PRIMARY KEY,
    ContenuNotif VARCHAR(200) NOT NULL,
    TypeNotif VARCHAR(20),
    DestNotif VARCHAR(30),
    StatutNotif VARCHAR(20) DEFAULT 'envoyé',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Journal d'événements
CREATE TABLE journal_evenements (
    IdEvt VARCHAR(10) PRIMARY KEY,
    ContenuEvt VARCHAR(50),
    StatutEvt VARCHAR(20),
    DateEvt DATE NOT NULL,
    HeureEvt TIME NOT NULL,
    IdNotif VARCHAR(10),
    FOREIGN KEY (IdNotif) REFERENCES notifications(IdNotif)
);

-- Données de test
INSERT INTO utilisateurs (nom, prenom, email, type_utilisateur) VALUES
('Mukendi', 'Jean', 'jean.mukendi@gai.cd', 'Enseignant'),
('Kabongo', 'Marie', 'marie.kabongo@gai.cd', 'Parent'),
('Tshiala', 'Pierre', 'pierre.tshiala@gai.cd', 'Élève');