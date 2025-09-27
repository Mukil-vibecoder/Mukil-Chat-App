// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔹 Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAw1IGDycN8-Niu5DaWoQnUP-hLvQKdzHI",
  authDomain: "first-chat-app-953a6.firebaseapp.com",
  projectId: "first-chat-app-953a6",
  storageBucket: "first-chat-app-953a6.firebasestorage.app",
  messagingSenderId: "162176868665",
  appId: "1:162176868665:web:8a0095a0ed536ec7a688e8",
  measurementId: "G-K202BVP1C6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------------------- UI Elements ----------------------
const authContainer = document.getElementById("auth-container");
const chatContainer = document.getElementById("chat-container");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const sendBtn = document.getElementById("send");
const messageInput = document.getElementById("messageInput");
const messagesDiv = document.getElementById("messages");
const usernameInput = document.getElementById("username");

// ---------------------- Auth ----------------------

// Signup
signupBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Signup successful! Please login.");
  } catch (error) {
    alert(error.message);
  }
});

// Login
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    authContainer.classList.add("hidden");
    chatContainer.classList.remove("hidden");
    loadMessages();
  } catch (error) {
    alert(error.message);
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  chatContainer.classList.add("hidden");
  authContainer.classList.remove("hidden");
});

// ---------------------- Chat ----------------------

// Send Message
sendBtn.addEventListener("click", async () => {
  if (messageInput.value.trim() === "") return;
  await addDoc(collection(db, "messages"), {
    text: messageInput.value,
    uid: auth.currentUser.uid,
    username: usernameInput.value || "Anonymous",
    timestamp: new Date()
  });
  messageInput.value = "";
});

// Load Messages in Real-Time
function loadMessages() {
  const q = query(collection(db, "messages"), orderBy("timestamp"));
  onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";
    snapshot.forEach((doc) => {
      const msg = doc.data();
      const div = document.createElement("div");
      div.classList.add("message");
      if (msg.uid === auth.currentUser.uid) div.classList.add("self");
      div.textContent = `${msg.username}: ${msg.text}`;
      messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}
