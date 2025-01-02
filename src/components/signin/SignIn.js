import React, { useState } from "react";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";

import "./SignIn.css";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const googleProvider = new GoogleAuthProvider();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Error state
  const [success, setSuccess] = useState(false); // Success state
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async () => {
    setError(null); // Clear errors
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

        // Check if the user's email is verified
        if (!user.emailVerified) {
        setError("Your email is not verified. Please check your inbox and verify your email before logging in.");
        await auth.signOut(); // Log the user out immediately
        return;
        }

      console.log("Logged in user:", userCredential.user);
      navigate("/navigation"); // Navigate to the navigation after login
    } catch (error) {
      console.error("Login error:", error.message);
      setError("Login failed. Please check your credentials.");
    }
  };

  // Google Login
  const logInWithGoogle = async () => {
    setError(null); // Clear errors
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google user logged in:", result.user);
      navigate("/navigation"); // Navigate to the navigation
    } catch (error) {
      console.error("Error with Google sign-in:", error.message);
      setError("Google sign-in failed. Try again.");
    }
  };

  // Handle Sign-Up
  const handleSignUp = async () => {
    setError(null); // Clear previous errors
    setSuccess(false); // Reset success state
  
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
  
    try {
      // Create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Send a verification email
      await sendEmailVerification(user);
      console.log("Verification email sent!");
  
      // Show success message prompting user to verify email
      setSuccess("Sign-up successful! Please verify your email before logging in.");
    } catch (err) {
      // Handle sign-up errors
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email is already in use.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/weak-password":
          setError("Password is too weak.");
          break;
        default:
          setError("An error occurred. Please try again.");
      }
      console.error("Sign-up error:", err.message);
    }
  };
  

  return (
    <div className="signin-container">
      <h2>Sign In / Sign Up</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Log In</button>
      <button onClick={logInWithGoogle}>Log In With Google</button>
      <button onClick={handleSignUp}>Sign Up</button>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
}

export default SignIn;
