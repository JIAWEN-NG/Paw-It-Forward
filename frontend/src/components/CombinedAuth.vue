<template>
    <div class="container" :class="{ active: isRegisterActive }">
        <div class="form-container sign-in" v-if="!isRegisterActive">
            <form @submit.prevent="login">
                <h1>Sign In</h1>
                <div class="social-icons">
                    <a href="#" class="icon" @click="signInWithGoogle">
                        <img :src="require('@/assets/google-icon.png')" alt="Google" />
                    </a>
                </div>
                <span>----- or Sign in with Email -----</span>
                <div>
                    <input type="email" placeholder="Email" v-model="email" required>
                </div>
                <div>
                    <input type="password" placeholder="Password" v-model="password" required>
                </div>
                <div class="remember-me">
                    <input type="checkbox" id="rememberMe" v-model="rememberMe">
                        <label for="rememberMe">Remember&nbsp;Me</label>
                </div>
                <a href="#" @click.prevent="toggleForgotPassword">Forgot your password?</a>
                <button type="submit">Sign In</button>
            </form>

            <div class="forgot-pw" v-if="showForgotPassword">
                <h2>Forgot Password?</h2>
                <form @submit.prevent="sendPasswordResetEmail"> <!-- Ensure you have this method -->
                    <input type="email" placeholder="Enter your email" v-model="resetEmail" required>
                    <button type="submit">Send Reset Email</button>
                </form>
            </div>
        </div>
      
        <div class="form-container sign-up" v-if="isRegisterActive">
            <form @submit.prevent="register">
                <h1>Create Account</h1>
                <div class="social-icons">
                    <a href="#" class="icon" @click="signInWithGoogle">
                        <img :src="require('@/assets/google-icon.png')" alt="Google" />
                    </a>
                </div>
                <span>----- or Register with Email -----</span>
                <div>
                    <input type="text" placeholder="Name" v-model="name" required>
                </div>
                <div>
                    <input type="email" placeholder="Email" v-model="email" required>
                </div>
                <div>
                    <input type="password" placeholder="Password" v-model="password" required>
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
      
        <div class="toggle-container">
            <div class="toggle">
                <div class="toggle-panel toggle-left" v-if="isRegisterActive">
                    <h1>Have an Account?</h1>
                    <p>Log back in and keep making a difference! </p>
                    <button id="login" class="hidden"  @click="toggleAuth">Sign In</button>
                </div>
                <div class="toggle-panel toggle-right" v-if="!isRegisterActive">
                    <h1>New to Paw-it-Forward?</h1>
                    <p>Create an account today and start making a difference for pets in need!</p>
                    <button id="register" class="hidden" @click="toggleAuth">Sign Up</button>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
  import { auth } from '../main';  // Firebase initialization

  
  export default {
    data() {
      return {
        name: '',
        email: sessionStorage.getItem('email') || '', // Load email from sessionStorage if available
        password: '',
        resetEmail: '', // For password reset
        showForgotPassword: false, // Toggle for forgot password section
        isRegisterActive: false,
        rememberMe: false
      };
    },
    methods: {
        toggleAuth() {
            this.isRegisterActive = !this.isRegisterActive;
        },
        async register() {
            try {
            const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
            const user = userCredential.user;

            // Send verification email
            await sendEmailVerification(user);
            console.log('Verification email sent');

            alert('Account created! A verification email has been sent to your inbox.');
        } catch (error) {
            console.error('Error during registration:', error.message);
            alert('Error creating account: ' + error.message);
        }
        },
        login() {
            signInWithEmailAndPassword(auth, this.email, this.password)
            .then((userCredential) => {
                console.log('Logged in:', userCredential.user);
                if (this.rememberMe) {
                    sessionStorage.setItem('email', this.email); // Save email to sessionStorage
            }
            })
            .catch((error) => {
                console.error('Error logging in:', error.message);
            });
        },
        sendPasswordResetEmail() {
        sendPasswordResetEmail(auth, this.resetEmail)
            .then(() => {
            alert('Password reset link sent! Check your email.');
            this.resetEmail = ''; // Clear the email field
            this.showForgotPassword = false; // Hide the forgot password section
            })
            .catch((error) => {
            console.error('Error sending password reset email:', error.message);
            alert('Error: ' + error.message); // Notify the user of the error
            });
        },
        toggleForgotPassword() {
        this.showForgotPassword = !this.showForgotPassword; // Toggle visibility
        this.resetEmail = '';
        },
        signInWithGoogle() {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
            .then((result) => {
                console.log('Google Sign-In Success:', result);
                if (this.rememberMe) {
                sessionStorage.setItem('email', result.user.email); // Save Google email to sessionStorage
            }
            })
            .catch((error) => {
                console.error('Google Sign-In Error:', error.message);
            });
      }
    }
  };
  </script>
  
  <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
}
/* 
template{
    background-color: #c9d6ff;
    background: linear-gradient(to right, #e2e2e2, #c9d6ff);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
} */

.container{
    background-color: #fff;
    position: relative;
    overflow: hidden;
    max-width: 100%;
    min-height: 480px;
    height: 100vh;

}

.container p{
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    margin: 20px 0;
}

.container span{
    font-size: 12px;
}

.container a{
    color: #333;
    font-size: 13px;
    text-decoration: none;
    margin: 15px 0 10px;
}

.container button{
    background-color: #ffaa00;
    color: #fff;
    font-size: 12px;
    padding: 10px 45px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: 10px;
    cursor: pointer;
}

.container button.hidden{
    background-color: transparent;
    border-color: #fff;
}

.container form{
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    height: 100%;
}

.container input{
    background-color: #eee;
    border: none;
    margin: 8px 0;
    padding: 10px 15px;
    font-size: 13px;
    border-radius: 8px;
    width: 100%;
    outline: none;
}

.form-container{
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
}


.sign-in{
    left: 0;
    width: 50%;
    z-index: 2;
}

.container.active .sign-in{
    transform: translateX(100%);
}

.sign-up{
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
    text-align: center;
}

.container.active .sign-up{
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: move 0.6s;
}

@keyframes move{
    0%, 49.99%{
        opacity: 0;
        z-index: 1;
    }
    50%, 100%{
        opacity: 1;
        z-index: 5;
    }
}

.social-icons{
    margin: 20px 0;
}

img{
    width: 20px;
    height: 20px;
}

.social-icons a{
    border: 1px solid #ccc;
    border-radius: 20%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 3px;
    width: 40px;
    height: 40px;
}

.toggle-container{
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: all 0.6s ease-in-out;
    border-radius: 150px 0 0 100px;
    z-index: 1000;
}

.container.active .toggle-container{
    transform: translateX(-100%);
    border-radius: 0 150px 100px 0;
}

.toggle{
    background-color: #512da8;
    height: 100%;
    background: linear-gradient(to right, #fec862, #faac97);
    color: #fff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
}

.container.active .toggle{
    transform: translateX(50%);
}

.toggle-panel{
    position: absolute;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 30px;
    text-align: center;
    top: 0;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
}

.toggle-left{
    transform: translateX(-200%);
}

.container.active .toggle-left{
    transform: translateX(0);
}

.toggle-right{
    right: 0;
    transform: translateX(0);
}

.container.active .toggle-right{
    transform: translateX(200%);
}

.remember-me {
  display: flex;
  align-items: center;
  /* margin:5px 0; */
  font-size: 12px;
}

.remember-me input {
  margin-right:8px;
}

  </style>
  