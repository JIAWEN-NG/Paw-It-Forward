<template>
  <div class="meet-our-team">
    <h2>Meet The <span>Team.</span></h2>
    <div class="row team-members">
      <div
        v-for="member in teamMembers"
        :key="member.name"
        class="col-lg-4 col-md-6 col-12 mb-4"
      >
        <div class="team-member">
          <div class="profile-pic">
            <img :src="member.photo" :alt="member.name" />
          </div>
          <h3>{{ member.name }}</h3>
          <p>{{ member.role }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teamMembers: [
        { name: "Afsana", role: "Chief Meow-nager", photo: "path/to/steve-photo.jpg" },
        { name: "Darius", role: "Head of Zoomies Department", photo: "path/to/alden-photo.jpg" },
        { name: "Dessy", role: "Head of Purr-sonnel", photo: "path/to/kaley-photo.jpg" },
        { name: "Jia Wen", role: "Head of Purr-duct Development", photo: "path/to/phil-photo.jpg" },
        { name: "Jovi", role: "Chief Barketing Officer", photo: "path/to/phil-photo.jpg" },
        { name: "Thahmina", role: "Director of Puppy Eyes", photo: "path/to/tony-photo.jpg" },
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
  margin-bottom: 2rem;

}

h2 span {
  font-weight: bold;
}

.team-member {
  text-align: center;
}

.profile-pic {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border-radius: 30%;
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
