<template>
    <div class="meet-our-team">
      <h2>Meet the <span>team.</span></h2>
      <div class="team-members">
        <div
          v-for="member in teamMembers"
          :key="member.name"
          class="team-member"
        >
          <div class="profile-pic">
            <img :src="member.photo" :alt="member.name" />
          </div>
          <h3>{{ member.name }}</h3>
          <p>{{ member.role }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        teamMembers: [
          {
            name: "Steve Ambuul",
            role: "Chief Revenue Officer",
            photo: "path/to/steve-photo.jpg",
          },
          {
            name: "Alden Dale",
            role: "Director of Solutions",
            photo: "path/to/alden-photo.jpg",
          },
          {
            name: "Kaley Deneen",
            role: "Director of Strategy & Service, EMEA",
            photo: "path/to/kaley-photo.jpg",
          },
          {
            name: "Phil Dupertuis",
            role: "Director of Client Services, NA",
            photo: "path/to/phil-photo.jpg",
          },
          {
            name: "Tony Eades",
            role: "Chief Evangelist",
            photo: "path/to/tony-photo.jpg",
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .meet-our-team {
    padding: 50px;
    background: linear-gradient(103deg, rgba(252, 238, 213, 0.6) 6.43%, rgba(252, 238, 213, 0.6) 78.33%, rgba(255, 231, 186, 0.6) 104.24%);
    margin-top: 80px;
    text-align: center;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  h2 span {
    font-weight: bold;
  }
  
  .team-members {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  .team-member {
    text-align: center;
    max-width: 150px;
  }
  
  .profile-pic {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  .profile-pic img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  h3 {
    font-size: 1.1rem;
    margin: 0.5rem 0 0;
  }
  
  p {
    font-size: 0.9rem;
    color: gray;
    margin: 0;
  }
  </style>
  