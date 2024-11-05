<template>
    <nav class="navbar navbar-expand-lg fixed-top">
        <div class="container">
            <a class="navbar-brand me-auto" href="#">
                <img :src="pawlogoImageUrl" alt="pawlogo" class="paw-logo" v-if="pawlogoImageUrl" />
            </a>

            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Paw-It-Forward</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <ul class="navbar-nav justify-content-center flex-grow-1 pe-3">
                        <li class="nav-item">
                            <router-link to="/about" active-class="active-link" class="nav-link mx-lg-2">About Us</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/fundraising" active-class="active-link" class="nav-link mx-lg-2">Donate</router-link>

                        </li>
                        <li class="nav-item">
                            <router-link to="/marketplace" active-class="active-link" class="nav-link mx-lg-2">Marketplace</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/testimonials" active-class="active-link" class="nav-link mx-lg-2">Testimonials</router-link>
                        </li>
                        <li v-if="isUserLoggedIn" class="nav-item">
                            <router-link to="/managepost" active-class="active-link" class="nav-link mx-lg-2">Manage Posts</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <router-link to="/chat" class="chat-button">
                <img
                    :src="isHovered ? chatInvertImageUrl : chat3ImageUrl"
                    alt="chat"
                    class="chat-logo"
                    @mouseover="isHovered = true"
                    @mouseleave="isHovered = false"
                    style="margin: 10px"
                    />
            </router-link>
            <!-- Profile or Sign In Button -->
            <li v-if="isUserLoggedIn" class="profile-container nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img :src="userProfilePicUrl" alt="profilepic" class="profile-pic" />
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                    <router-link to="/profile" class="dropdown-item">Edit Profile</router-link>
                    </li>
                    <li v-if="isAdmin">
                    <router-link to="/manage-users" class="dropdown-item">Manage Users</router-link>
                    </li>
                    <li>
                    <button @click="handleSignOut" class="dropdown-item">Sign Out</button>
                    </li>
                </ul>
            </li>
            <router-link v-else to="/login" class="btn btn-outline-warning">Sign In</router-link>

            <button class="navbar-toggler " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
    </nav>
</template>


<script>
import { signOut } from 'firebase/auth';
import { auth, db } from '../main';
import { authState } from '../store/auth.js';
import { doc, getDoc } from 'firebase/firestore';

export default {
  name: "navBar",
  data() {
    return {
        isHovered: false,
        pawlogoImageUrl: null,
        chatInvertImageUrl: null, 
        chat3ImageUrl: null,
        userRole: null,
    };
  },
  methods: {
    async fetchImage(fileName) {
      try {
        const response = await fetch(`http://localhost:8000/api/images?fileName=${fileName}`);
        const data = await response.json();
        console.log("fetching");
        return data.url; // Return the URL from the API response
      } catch (error) {
        console.error(`Failed to fetch image ${fileName}:`, error);
        return null;
      }
    },
  async handleSignOut() {
    try {
      await signOut(auth); // This will trigger the onAuthStateChanged listener in auth.js
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  },

  async loadUserProfilePic() {
  const currentUser = this.$auth.currentUser;
  console.log("Attempting to load profile picture for user:", currentUser?.uid);
  if (currentUser) {
    try {
      const userDocRef = doc(db, "Users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      console.log("Fetched user document:", userDoc.exists() ? userDoc.data() : "No document found");

      if (userDoc.exists()) {
        authState.userProfilePicUrl = userDoc.data().profileImage;
        this.userRole = userDoc.data().role;
        console.log(this.userRole);
        console.log("Profile picture URL set to:", authState.userProfilePicUrl);
      } else {
        console.log("No user document found for UID:", currentUser.uid);
      }
    } catch (error) {
      console.error("Error fetching user profile image:", error);
    }
  } else {
    console.log("No authenticated user found");
  }
}


  },
  async mounted() {
    console.log("Navbar component mounted");

    this.pawlogoImageUrl = await this.fetchImage('about/paw-logo.png');
    this.chat3ImageUrl = await this.fetchImage('about/chat3.png');
    this.chatInvertImageUrl = await this.fetchImage('about/chatinvert.png');

    if (this.isUserLoggedIn) {
    console.log("User logged in, loading profile picture...");
    await this.loadUserProfilePic();
    console.log("Profile picture loaded:", this.userProfilePicUrl);
  }

  },
  computed: {
    isUserLoggedIn() {
      return authState.isUserLoggedIn;
    },
    userProfilePicUrl() {
      return authState.userProfilePicUrl;
    },
    isAdmin() {
      return this.userRole === "admin"; // Check if the user is an admin
    },
  },
  watch: {
    isUserLoggedIn(newVal) {
      if (newVal) {
        console.log("User just logged in, attempting to load profile picture...");
        this.loadUserProfilePic();
      }
    },
  }

};
</script>


<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.paw-logo{
    height: 55px;
    width:70px;
}

.navbar{
    background-color: white;
    height: 80px;
    padding: 0.5rem;
    font-weight: bold;
    text-align: center
}
.btn{
    border-width: 2px !important; 
    font-weight:500 !important; 
    border-color: #fcae1e !important; 
    color: #fcae1e !important;
    margin-right: 10px;
}
.btn:hover{
    color:white !important;
    background-color: #fcae1e !important;
}

.chat-logo {
    width: 50px;
    height: auto;
    transition: opacity 0.3s ease, transform 0.3s ease;
    border-radius: 7px;
}

.navbar-toggler {
    border: none;
    font-size: 1.25rem;
}

.navbar-toggler:focus, .btn-close:focus {
    box-shadow: none;
    outline: none;
}

.nav-link {
    color: #666777;
    font-weight: 500;
    position: relative;
}

.nav-link:hover, .nav-link.active-link {
    color: black;
}

@media (min-width:991px) {
    .nav-link::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 2px;
        background-color:#fcae1e;
        visibility: hidden;
        transition: 0.3s ease-in-out;
    }

    .nav-link:hover::before{
        width: 100%;
        visibility: visible;
    }

    .nav-link.active-link::before {
    content: "";
    width: 100%;
    visibility: visible;
  }
}

a.router-link.active{
    border-bottom: 2px solid #fcae1e;
}

/* Profile Picture Styling */
.profile-container {
  position: relative;
  margin-right: 10px;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border:2px solid #fcae1e;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.profile-pic:hover {
  transform: scale(1.05);
}

.dropdown{
    list-style-type: none;
}

.dropdown-menu{
    position:auto;
}
</style>
