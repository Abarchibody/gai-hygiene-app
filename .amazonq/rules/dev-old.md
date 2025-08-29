---
project:
  title: "Application mobile de rappel d’hygiène au Complexe Scolaire GAI"
  description: >
    Une application mobile éducative visant à renforcer les pratiques d’hygiène
    chez les élèves du Complexe Scolaire GAI grâce à des rappels programmés,
    des notifications automatiques et une journalisation des activités.
  context:
    domain: "Éducation et hygiène scolaire"
    location: "Complexe Scolaire GAI, Limete, Kinshasa (RDC)"
    institution_status: "Établissement éducatif privé à but non lucratif géré par la Congrégation"
    mission:
      - "Former des élèves équilibrés et instruits"
      - "Transmettre des valeurs morales et humaines"
      - "Favoriser la santé et la discipline à travers l’hygiène"
  objectives:
    global: "Concevoir et réaliser une application mobile automatisant les rappels d’hygiène"
    specific:
      - "Analyser les besoins en matière de sensibilisation et de suivi des pratiques d’hygiène"
      - "Concevoir un système structuré pour gérer et envoyer des rappels"
      - "Développer une application mobile avec notifications régulières"
      - "Mettre en place une base de données centralisée"
      - "Tester et valider l’application"
  problematique: >
    Le suivi de l’hygiène est encore basé sur des rappels oraux et affiches, sans outil moderne
    ni suivi individualisé. Les élèves oublient facilement et il n’existe aucune traçabilité.
  hypothesis: >
    La mise en place d’une application mobile constitue une solution adéquate
    pour automatiser les rappels et améliorer les bonnes pratiques d’hygiène.

documents_utilises:
  - name: "Fiche de rappel"
    role: "Enregistrer les rappels d’hygiène"
    attributes:
      - {code: "IdRap", designation: "Identifiant rappel", type: "AN", size: 10, identifiant: true}
      - {code: "TitreRap", designation: "Intitulé du rappel", type: "AN", size: 30}
      - {code: "DescRap", designation: "Description du rappel", type: "AN", size: 100}
      - {code: "DateRap", designation: "Date prévue", type: "Date"}
      - {code: "HeureRap", designation: "Heure prévue", type: "Heure"}
      - {code: "ResponsableRap", designation: "Élève/Parent/Enseignant", type: "AN", size: 30}
  - name: "Programmation"
    role: "Planifier des activités ou événements d’hygiène"
    attributes:
      - {code: "IdProg", designation: "Identifiant programmation", type: "AN", size: 10, identifiant: true}
      - {code: "TitreProg", designation: "Intitulé activité", type: "AN", size: 50}
      - {code: "TypeActProg", designation: "Type activité", type: "AN", size: 20}
      - {code: "DateDebProg", designation: "Date de début", type: "Date"}
      - {code: "HeureDebProg", designation: "Heure de début", type: "Heure"}
      - {code: "DateFinProg", designation: "Date de fin", type: "Date"}
      - {code: "HeureFinProg", designation: "Heure de fin", type: "Heure"}
      - {code: "RespProg", designation: "Responsable activité", type: "AN", size: 30}
  - name: "Notification"
    role: "Informer automatiquement les utilisateurs"
    attributes:
      - {code: "IdNotif", designation: "Identifiant notification", type: "AN", size: 10, identifiant: true}
      - {code: "ContenuNotif", designation: "Message notification", type: "AN", size: 200}
      - {code: "TypeNotif", designation: "Type (alerte, rappel...)", type: "AN", size: 20}
      - {code: "DestNotif", designation: "Destinataire", type: "AN", size: 30}
      - {code: "StatutNotif", designation: "Statut (envoyé, lu...)", type: "AN", size: 20}
  - name: "Journal d’événements"
    role: "Tracer l’historique des notifications"
    attributes:
      - {code: "IdEvt", designation: "Identifiant événement", type: "AN", size: 10, identifiant: true}
      - {code: "ContenuEvt", designation: "Description", type: "AN", size: 50}
      - {code: "StatutEvt", designation: "Statut (succès/échec)", type: "AN", size: 20}
      - {code: "DateEvt", designation: "Date", type: "Date"}
      - {code: "HeureEvt", designation: "Heure", type: "Heure"}

dependances_fonctionnelles:
  - "IdRap -> {TitreRap, DescRap, DateRap, HeureRap, ResponsableRap}"
  - "IdProg -> {TitreProg, TypeActProg, DateDebProg, HeureDebProg, DateFinProg, HeureFinProg, RespProg}"
  - "IdNotif -> {ContenuNotif, TypeNotif, DestNotif, StatutNotif}"
  - "IdEvt -> {ContenuEvt, StatutEvt, DateEvt, HeureEvt, IdNotif}"
  - "DestNotif -> {TypeUtilisateur (Élève, Parent, Enseignant)}"

regles_de_gestion:
  - "Un utilisateur (élève/parent/enseignant) peut créer une ou plusieurs fiches de rappel."
  - "Une programmation est définie par l’école et peut générer plusieurs rappels."
  - "Une fiche ou programmation peut générer une ou plusieurs notifications."
  - "Chaque notification doit être enregistrée dans un journal d’événements."
  - "Une notification est destinée à un ou plusieurs utilisateurs."
  - "Chaque activité de programmation est suivie par un responsable désigné."

objets:
  - "Élève"
  - "Parent"
  - "Enseignant"
  - "Fiche de rappel"
  - "Programmation"
  - "Notification"
  - "Journal d’événements"

relations:
  - "Parent ⇄ Élève : un parent peut être responsable de plusieurs élèves"
  - "Classe ⇄ Élève : un élève appartient à une classe"
  - "Enseignant ⇄ Classe : un enseignant encadre une ou plusieurs classes"
  - "Enseignant ⇄ Programmation : un enseignant crée plusieurs programmations"
  - "Programmation ⇄ Fiche de rappel : une programmation génère des fiches"
  - "Fiche de rappel ⇄ Élève : un rappel peut concerner plusieurs élèves"
  - "Fiche de rappel ⇄ Parent : un parent peut recevoir plusieurs rappels"
  - "Fiche de rappel ⇄ Enseignant : un enseignant peut créer un rappel direct"
  - "Fiche de rappel ⇄ Notification : un rappel déclenche des notifications"
  - "Notification ⇄ Utilisateur : notifications envoyées aux destinataires"
  - "Notification ⇄ Journal d’événements : une notification est tracée dans le journal"
