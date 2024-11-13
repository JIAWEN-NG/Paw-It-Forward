
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
          <div class="profile-pic-container">
            <div class="profile-pic flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <img :src="member.photo" :alt="member.name" />
                </div>
                <div class="flip-card-back">
                  <p style="font-weight: bold; font-size: 1.3rem;">{{ member.name }}</p>
                  <p>{{ member.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import dessyPhoto from '@/assets/dessy.png';
import sanaPhoto from '@/assets/sana.png';
import joviPhoto from '@/assets/jovi.png';
import thahPhoto from '@/assets/thah.jpg';
import wenzPhoto from '@/assets/wenz.jpg';
import DariusPhoto from '@/assets/darius.png';

export default {
  data() {
    return {
      teamMembers: [
        { name: "Afsana", role: "Chief Meow-nager", photo: sanaPhoto },
        { name: "Darius", role: "Treat Procurement Specialist", photo: DariusPhoto },
        { name: "Dessy", role: "Head of Purr-sonnel", photo: dessyPhoto },
        { name: "Jia Wen", role: "Head of Purr-duct Development", photo: wenzPhoto },
        { name: "Jovi", role: "Chief Barketing Officer", photo: joviPhoto },
        { name: "Thahmina", role: "Director of Puppy Eyes", photo: thahPhoto },
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
  width: 300px;
  height: 350px;
  margin: 0 auto;
  border-radius: 20%;
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
  color: black;
  margin: 0;
}
.profile-pic-container {
  perspective: 1000px; /* Adds 3D perspective */
}

.flip-card {
  width: 300px;
  height: 350px;
  position: relative;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20%; /* Matches the border radius of the container */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.flip-card-front {
  z-index: 2;
}

.flip-card-back {
  transform: rotateY(180deg);
  background: rgba(255, 231, 186, 0.6); /* Customize the background as needed */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}


</style>
