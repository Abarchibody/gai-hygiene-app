<?php
class User {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAll($type = null, $search = null) {
        $sql = "SELECT * FROM utilisateurs WHERE 1=1";
        $params = [];
        
        if ($type) {
            $sql .= " AND type_utilisateur = ?";
            $params[] = $type;
        }
        
        if ($search) {
            $sql .= " AND (nom LIKE ? OR prenom LIKE ? OR email LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        $sql .= " ORDER BY nom, prenom";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM utilisateurs WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $sql = "INSERT INTO utilisateurs (nom, prenom, email, telephone, type_utilisateur) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $data['nom'],
            $data['prenom'],
            $data['email'],
            $data['telephone'],
            $data['type_utilisateur']
        ]);
    }
    
    public function update($id, $data) {
        $sql = "UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, telephone = ?, type_utilisateur = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $data['nom'],
            $data['prenom'],
            $data['email'],
            $data['telephone'],
            $data['type_utilisateur'],
            $id
        ]);
    }
    
    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM utilisateurs WHERE id = ?");
        return $stmt->execute([$id]);
    }
    
    public function getStats() {
        $stmt = $this->conn->prepare("
            SELECT 
                type_utilisateur,
                COUNT(*) as count
            FROM utilisateurs 
            GROUP BY type_utilisateur
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>