<?php
class ClassModel {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAll($search = null) {
        $sql = "SELECT c.*, u.nom as enseignant_nom, u.prenom as enseignant_prenom,
                       (SELECT COUNT(*) FROM eleves e WHERE e.classe_id = c.id) as nb_eleves
                FROM classes c 
                LEFT JOIN utilisateurs u ON c.enseignant_id = u.id 
                WHERE 1=1";
        $params = [];
        
        if ($search) {
            $sql .= " AND (c.nom_classe LIKE ? OR c.niveau LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        $sql .= " ORDER BY c.niveau, c.nom_classe";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getById($id) {
        $stmt = $this->conn->prepare("
            SELECT c.*, u.nom as enseignant_nom, u.prenom as enseignant_prenom
            FROM classes c 
            LEFT JOIN utilisateurs u ON c.enseignant_id = u.id 
            WHERE c.id = ?
        ");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $sql = "INSERT INTO classes (nom_classe, niveau, enseignant_id) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $data['nom_classe'],
            $data['niveau'],
            $data['enseignant_id'] ?: null
        ]);
    }
    
    public function update($id, $data) {
        $sql = "UPDATE classes SET nom_classe = ?, niveau = ?, enseignant_id = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $data['nom_classe'],
            $data['niveau'],
            $data['enseignant_id'] ?: null,
            $id
        ]);
    }
    
    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM classes WHERE id = ?");
        return $stmt->execute([$id]);
    }
    
    public function getEnseignants() {
        $stmt = $this->conn->prepare("SELECT id, nom, prenom FROM utilisateurs WHERE type_utilisateur = 'Enseignant' ORDER BY nom, prenom");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getEleves($classeId) {
        $stmt = $this->conn->prepare("
            SELECT u.id, u.nom, u.prenom, u.email, u.telephone
            FROM eleves e
            JOIN utilisateurs u ON e.utilisateur_id = u.id
            WHERE e.classe_id = ?
            ORDER BY u.nom, u.prenom
        ");
        $stmt->execute([$classeId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getStats() {
        $stmt = $this->conn->prepare("
            SELECT 
                COUNT(*) as total_classes,
                COUNT(CASE WHEN enseignant_id IS NOT NULL THEN 1 END) as classes_avec_enseignant,
                (SELECT COUNT(*) FROM eleves) as total_eleves
            FROM classes
        ");
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function getElevesDisponibles() {
        $stmt = $this->conn->prepare("
            SELECT u.id, u.nom, u.prenom, u.email
            FROM utilisateurs u
            LEFT JOIN eleves e ON u.id = e.utilisateur_id
            WHERE u.type_utilisateur = 'Élève' AND e.classe_id IS NULL
            ORDER BY u.nom, u.prenom
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function assignerEleve($classeId, $eleveId) {
        $stmt = $this->conn->prepare("
            INSERT INTO eleves (utilisateur_id, classe_id) VALUES (?, ?)
            ON DUPLICATE KEY UPDATE classe_id = VALUES(classe_id)
        ");
        return $stmt->execute([$eleveId, $classeId]);
    }
    
    public function retirerEleve($eleveId) {
        $stmt = $this->conn->prepare("DELETE FROM eleves WHERE utilisateur_id = ?");
        return $stmt->execute([$eleveId]);
    }
}
?>