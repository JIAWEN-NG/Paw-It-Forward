<template>
    <div>
        <div class="container-xs" v-if="isXsScreen">
            <div class="sign-in-xs d-flex flex-column justify-content-center" v-if="!showForgotPassword && !isRegisterActive">
                <form @submit.prevent="login">
                    <h1 class="mb-3 text-center">Welcome Back!</h1>
                    <div class="form-group">
                        <input type="email" class="form-control details" placeholder="Email" v-model="email" required>
                    </div>
                    <div class="form-group position-relative">
                        <input type="password" class="form-control details" placeholder="Password" v-model="password" required>
                    </div>                        
                    <div class="form-check d-flex align-items-center me-2" style="font-size: 13px;">
                        <input type="checkbox" id="rememberMeXs" class="form-check-input" v-model="rememberMe">
                        <label class="form-check-label mx-1" for="rememberMeXs">Remember Me</label>
                    </div>
                    <button type="submit" class="btn mb-3">Sign In</button>
                    <div class="d-flex justify-content-between align-items-center">
                        <a href="#" @click.prevent="toggleForgotPassword" class="forgot-password-link" style="text-decoration: none;">Forgot your password?</a>
                    </div>  
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <a href="#" @click.prevent="toggleAuth" class="" style="text-decoration: underline;">Don't have an account yet?</a>
                    </div>  
                </form>
            </div>

            <div class="forgot-pw-xs" v-if="showForgotPassword">
                <form @submit.prevent="sendPasswordResetEmail">
                    <h1 class="text-center mb-3">Forgot Password?</h1>
                    <div class="form-group">
                        <input type="email" class="form-control details" placeholder="Enter your email" v-model="resetEmail" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 mb-3">Send Reset Email</button>
                    <a href="#" @click.prevent="toggleForgotPassword" class="d-block mt-3 text-center" style="text-decoration: underline;">Back to Sign In</a>
                </form>
            </div>

            <div class="sign-up-xs d-flex flex-column justify-content-center" v-if="isRegisterActive && !showPhotoSubmission">
                <form @submit.prevent="register">
                    <h1 class="mb-3 text-center">Create an Account</h1>
                    <div class="form-group">
                        <input type="text" class="form-control details" placeholder="Name" v-model="name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" class="form-control details" placeholder="Email" v-model="email" required>
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control details" placeholder="Password" v-model="password" required>
                    </div>
                    <button type="submit" class="btn">Sign Up</button>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <a href="#" @click.prevent="toggleAuth" class="" style="text-decoration: underline;">Already have an account?</a>
                    </div>  
                </form>
            </div>
            
        </div>

    <div v-else class="container" :class="{ active: isRegisterActive }">
        <div class="form-container sign-in d-lg-block flex-column justify-content-center" v-if="!isRegisterActive && !showForgotPassword">
            <form @submit.prevent="login">
                <h1 class="mb-3 text-center">Welcome Back!</h1>
                <div class="form-group">
                    <input type="email" class="form-control details" placeholder="Email" v-model="email" required>
                </div>
                <div class="form-group position-relative">
                    <input type="password" class="form-control details" placeholder="Password" v-model="password" required>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="form-check d-flex align-items-center me-2" style="font-size: 12px; ">
                        <input type="checkbox" id="rememberMe" class="form-check-input" v-model="rememberMe">
                        <label class="form-check-label mx-1" for="rememberMe">Remember Me</label>
                    </div>
                    <a href="#" @click.prevent="toggleForgotPassword" class="forgot-password-link" style="text-decoration: underline;">Forgot your password?</a>
                </div>  
                <button type="submit" class="btn mb-3">Sign In</button>
                
                <div class="my-3 text-center d-flex justify-content-center">
                    <hr style="width:50%;">
                    <div class="divider">or</div>
                    <hr style="width:50%">
                </div>
                <div class="social-icons d-flex justify-content-center mt-3">
                    <a href="#" class="d-flex align-items-center" @click.prevent="signInWithGoogle">
                        <img :src="googleImageUrl" alt="google" class="me-2"/> Sign In with Google
                    </a>
                </div>
            </form>
        </div>

        <div class="form-container forgot-pw d-flex flex-column justify-content-center" v-if="showForgotPassword">
                <form @submit.prevent="sendPasswordResetEmail">
                <h1 class="text-center mb-3">Forgot Password?</h1>
                <div class="form-group">
                    <input type="email" class="form-control details" placeholder="Enter your email" v-model="resetEmail" required>
                </div>
                <button type="submit" class="btn btn-primary w-100 mb-3">Send Reset Email</button>
                <a style="text-decoration: underline;" href="#" @click.prevent="toggleForgotPassword" class="d-block mt-3 text-center">Back to Sign In</a>
            </form>
        </div>

        <div class="form-container sign-up" v-if="isRegisterActive && !showPhotoSubmission">
            <form @submit.prevent="register">
                <h1 class="mb-3 text-center">Create an Account</h1>
                <div class="form-group">
                    <input type="text" class="form-control details" placeholder="Name" v-model="name" required>
                </div>
                <div class="form-group">
                    <input type="email" class="form-control details" placeholder="Email" v-model="email" required>
                </div>
                <div class="form-group">
                    <input type="password" class="form-control details" placeholder="Password" v-model="password" required>
                </div>
                <button type="submit" class="btn">Sign Up</button>

                <div class="my-4 text-center d-flex justify-content-center">
                    <hr style="width:50%;">
                    <div class="divider">or</div>
                    <hr style="width:50%">
                </div>
                <div class="social-icons d-flex justify-content-center">
                    <a href="#" class="d-flex align-items-center" @click.prevent="signInWithGoogle">
                        <img :src="googleImageUrl" alt="google" class="me-2"/> Sign Up with Google
                    </a>
                </div>
            </form>
        </div>

        <div class="toggle-container">
            <div class="toggle">
                <div class="toggle-panel toggle-left" v-if="isRegisterActive">
                    <h1>Have an Account?</h1>
                    <p>Log back in and keep making a difference! </p>
                    <button id="login" class="otherbtn"  @click="toggleAuth">Sign In</button>
                </div>
                <div class="toggle-panel toggle-right" v-if="!isRegisterActive">
                    <h1>New to Paw-it-Forward?</h1>
                    <p>Create an account today and start making a difference for pets in need!</p>
                    <button id="register" class="otherbtn" @click="toggleAuth">Sign Up</button>
                </div>
            </div>
        </div>
    </div>
</div>

    <AuthModal
    v-if="showModal"
    :show="showModal"
    :title="modalTitle"
    :message="modalMessage"
    @close="showModal = false"
    />
    
    <PhotoSubmissionModal
        v-if="showPhotoSubmission"
        :show="showPhotoSubmission"
        @close="showPhotoSubmission = false"
        @photo-submitted="handlePhotoSubmission"
        :image-preview="imagePreview"
    />

  </template>
  
  <script>
  import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';
  import { auth, db } from '../main';  // Firebase initialization
  import { doc, setDoc } from 'firebase/firestore'; // Firestore methods
  import AuthModal from './AuthModal.vue';
  import PhotoSubmissionModal from './PhotoSubmissionModal.vue';

  export default {
    components:{
        AuthModal,
        PhotoSubmissionModal,
    },
    data() {
      return {
        name: '',
        email: sessionStorage.getItem('email') || '', // Load email from sessionStorage if available
        password: '',
        resetEmail: '', // For password reset
        showForgotPassword: false, // Toggle for forgot password section
        isRegisterActive: false,
        rememberMe: false,
        googleImageUrl:null,
        defaultProfileImageUrl: "https://firebasestorage.googleapis.com/v0/b/purrfessorpaws-40ca2.appspot.com/o/Profilephotos%2Fdefault-profile.png?alt=media&token=80695fdf-4059-4d7f-ad33-ed9c05386469",
        showPhotoSubmission: false,
        photoFile: null,
        imagePreview: '',
        showModal: false,
        modalTitle: '',
        modalMessage: '',
        isXsScreen: window.innerWidth < 768, 

      };
    },
    methods: {
        toggleAuth() {
            this.isRegisterActive = !this.isRegisterActive;
        },
        async register() {
            const persistenceType = this.rememberMe ? browserLocalPersistence : browserSessionPersistence;
            
            try {
            // Set persistence before registering the user
            await setPersistence(auth, persistenceType);

            // Once persistence is set, create a new user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
            const user = userCredential.user;

            // Store user data in Firestore
            await setDoc(doc(db, 'Users', user.uid), {
            name: this.name,
            email: this.email,
            isVerified: false,  // Will update when the user verifies their email
            isPhotoVerified: false,
            petDescription: this.petDescription || '', // Store any pet description if provided
            role: 'user', // Default role is 'user'; can be changed to 'admin' if needed
            profileImage: this.defaultProfileImageUrl,
            rejectionReason: "",
            });

            // Send verification email
            await sendEmailVerification(user);
            console.log('Verification email sent');
            this.modalTitle = 'Success';
            this.modalMessage = 'Account created! A verification email has been sent to your inbox.';
            this.showModal = true;

            this.email = '';
            this.password = '';
            this.name = '';
            this.showPhotoSubmission = true;
            


        } catch (error) {
            console.error('Error during registration:', error.message);
            this.modalTitle = 'Error';
            this.modalMessage = `Error creating account: ${error.message}`;
            this.showModal = true;
        }
        },

        login() {
            const persistenceType = this.rememberMe ? browserLocalPersistence : browserSessionPersistence;

            // Set the persistence based on whether "Remember Me" is checked
            setPersistence(auth, persistenceType)
            .then(() => {
            // Once persistence is set, proceed with the email sign-in
            return signInWithEmailAndPassword(auth, this.email, this.password);
            })

            .then((userCredential) => {
                console.log('Logged in:', userCredential.user);
                if (this.rememberMe) {
                    sessionStorage.setItem('email', this.email); // Save email to sessionStorage
            }
            this.email = ''; // Clear the email input
            this.password = ''; // Clear the password input
            // Redirect the user to the landing page
            this.$router.push('/about');  // Redirect to landing page

            })
            .catch((error) => {
                console.error('Error logging in:', error.message);
                this.modalTitle = 'Login Failed';
                this.modalMessage = 'Email and/or Password is incorrect';
                this.showModal = true;
            });
        },
        sendPasswordResetEmail() {
        sendPasswordResetEmail(auth, this.resetEmail)
            .then(() => {
                this.modalTitle = 'Success';
                this.modalMessage = 'Password reset link sent! Check your email.';
                this.showModal = true;
                this.resetEmail = ''; // Clear the email field
                this.showForgotPassword = false; // Hide the forgot password section
            })
            .catch((error) => {
            console.error('Error sending password reset email:', error.message);
            this.modalTitle = 'Error';
            this.modalMessage = `Error: ${error.message}`;
            this.showModal = true;
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
        },
        async fetchImage(fileName) {
        try {
            
            const response = await fetch(`${this.$api_url}/images?fileName=${fileName}`);
            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error(`Failed to fetch image ${fileName}:`, error);
            return null;
        }
    },
        handlePhotoSubmission(success) {
        if (success) {            
            this.modalTitle = 'Success';
            this.modalMessage = 'Photo submitted for verification!';
            this.showModal = true;
            this.showPhotoSubmission = false;

        } else {
            this.modalTitle = 'Error';
            this.modalMessage = 'There was an error submitting the photo. Please try again.';
            this.showModal = true;
        }
    },
    checkScreenSize() {
            this.isXsScreen = window.innerWidth < 576;
        }
    },
      async mounted() {
    // Fetch each image by its filename
    this.googleImageUrl = await this.fetchImage('about/google.png');
    window.addEventListener('resize', this.checkScreenSize);

    // this.defaultProfileImageUrl = await this.fetchImage('Profilephotos/default-profile.png');
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.checkScreenSize);
    },
    watch: {
        isXsScreen(newVal) {
            console.log('Screen size updated, isXsScreen:', newVal);
        }
    },
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

    
h1{
    font-weight: 700;
    font-size: 30px;
}
.container{
    background-color: #fff;
    position: relative;
    overflow: hidden;
    max-width: 100%;
    min-height: 480px;
    height:calc(100vh - 80px);

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
}

.container button, .container-xs button{
    background-color: #ffaa00;
    color: #fff;
    font-size: 13px;
    padding: 10px 45px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: 10px;
    cursor: pointer;
}

.container button.otherbtn{
    background-color: transparent;
    border-color: #fff;
}

.container form{
    background-color: #fff;
    display: flex;
    flex-direction: column;
    padding: 100px 20vh;
    height: calc(100vh - 80px);
    justify-content: center;
}

.container .details, .container-xs .details{
    background-color: #eee;
    border: none;
    margin: 8px 0;
    padding: 10px 15px;
    font-size: 13px;
    border-radius: 8px;
}

.form-container{
    transition: all 0.6s ease-in-out;
    height: 100%;
}


.sign-in, .forgot-pw{
    left: 0;
    width: 50%;
    z-index: 2;
}

.container.active .sign-in{
    transform: translateX(100%);
}

.sign-up, .photo-submission{
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
    text-align: center;
}


.container.active .sign-up, .container.active .photo-submission{
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


img{
    width: auto;
    height: 20px;
}

.social-icons a{
    border: 1px solid #ccc;
    border-radius: 10px;
    justify-content: center;
    margin: 0 3px;
    width: 100%;
    height: 40px;
    padding:20px;
}

.toggle-container{
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: all 0.6s ease-in-out;
    border-radius: 150px 0 0 150px;
    z-index: 1000;
}

.container.active .toggle-container{
    transform: translateX(-100%);
    border-radius: 0 150px 150px 0;
}

.toggle{
    background-color: #512da8;
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

.photo-submission {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}


.image-upload-box {
  width: 100%;
  height: 200px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.image-preview {
  max-width: 100%;
  max-height: 100%;
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: #6c757d; /* Adjust color if necessary */
    font-size: 14px; /* Adjust font size if needed */
    margin: -3%; /* Adjust margin for spacing */
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd; /* Line color */
    margin: 0 10px; /* Space between the line and the text */
}

.container-xs {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 20px;
    background: linear-gradient(103deg, rgba(252, 238, 213, 0.6) 6.43%, rgba(252, 238, 213, 0.6) 78.33%, rgba(255, 231, 186, 0.6) 104.24%);
}

.sign-in-xs form, .forgot-pw-xs form, .sign-up-xs form {
    width: 100%;
    max-width: 400px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.sign-in-xs .form-group {
    margin-bottom: 15px;
}

.sign-in-xs button, .sign-up-xs button  {
    background-color: #ffaa00;
    color: #fff;
    width: 100%;
    border: none;
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
}

.sign-in-xs button:hover {
    background-color: #e69900;
}

.form-check .form-check-input {
    float: left;
    margin-left:0;
}

  </style>
  
