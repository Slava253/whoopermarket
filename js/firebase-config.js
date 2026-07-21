// ========== FIREBASE ==========
const firebaseConfig = {
    apiKey: "AIzaSyBlZ5ZtyTXgtXxSJAx1jOxwhTrzlHRJmo",
    authDomain: "bk-cashier.firebaseapp.com",
    databaseURL: "https://bk-cashier-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bk-cashier",
    storageBucket: "bk-cashier.firebasestorage.app",
    messagingSenderId: "385000840969",
    appId: "1:385000840969:web:1ec8d09176b6551dc0fdd8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
console.log('🔥 Firebase подключен');
