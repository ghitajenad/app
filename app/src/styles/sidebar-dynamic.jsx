/* Styles pour le sidebar dynamique */
.sidebar-dynamic {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 250px;
    background-color: #fff;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    transition: transform 0.3s ease-in-out, opacity 0.2s ease-in-out;
  }
  
  /* État par défaut du sidebar flottant (caché) */
  .sidebar-dynamic.floating:not(.visible) {
    transform: translateX(-100%);
    opacity: 0;
  }
  
  /* État visible du sidebar */
  .sidebar-dynamic.visible {
    transform: translateX(0);
    opacity: 1;
  }
  
  /* Zone de détection pour le survol */
  .sidebar-hover-area {
    position: fixed;
    top: 0;
    left: 0;
    width: 20px;
    height: 100vh;
    z-index: 999;
  }
  
  /* En-tête du sidebar */
  .sidebar-header {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid #eee;
  }
  
  .sidebar-logo {
    width: 80px;
    height: auto;
    margin-bottom: 10px;
  }
  
  .sidebar-header h3 {
    margin: 0;
    font-size: 1rem;
    color: #333;
    text-align: center;
  }
  
  /* Navigation */
  .sidebar-nav {
    flex: 1;
    padding: 20px 0;
    overflow-y: auto;
  }
  
  .sidebar-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .sidebar-nav li {
    margin-bottom: 5px;
  }
  
  .sidebar-nav a {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    color: #555;
    text-decoration: none;
    transition: background-color 0.2s, color 0.2s;
  }
  
  .sidebar-nav a:hover {
    background-color: #f5f5f5;
    color: #2196f3;
  }
  
  .sidebar-nav a.active {
    background-color: #e3f2fd;
    color: #2196f3;
    font-weight: 500;
    border-left: 3px solid #2196f3;
  }
  
  .sidebar-nav i {
    margin-right: 10px;
    width: 20px;
    text-align: center;
  }
  
  /* Pied de page du sidebar */
  .sidebar-footer {
    padding: 15px 20px;
    border-top: 1px solid #eee;
  }
  
  .logout-button {
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border: none;
    border-radius: 4px;
    color: #d32f2f;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .logout-button:hover {
    background-color: #ffebee;
  }
  
  .logout-button i {
    margin-right: 8px;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .sidebar-dynamic {
      width: 220px;
    }
  
    .sidebar-nav a {
      padding: 10px 15px;
    }
  }
  
  @media (max-width: 576px) {
    .sidebar-dynamic {
      width: 200px;
    }
  
    .sidebar-header {
      padding: 15px;
    }
  
    .sidebar-logo {
      width: 60px;
    }
  
    .sidebar-nav a {
      padding: 8px 15px;
      font-size: 0.9rem;
    }
  }
  