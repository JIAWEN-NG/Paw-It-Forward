<template>
  <div v-if="visible" class="success-alert">
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'SuccessAlert',
  props: {
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 3000 // Default duration is 3000ms
    }
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    show() {
      this.visible = true;
      setTimeout(() => {
        this.visible = false;
      }, this.duration);
    }
  }
};
</script>

<style scoped>
.success-alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #d4edda; /* Bootstrap success color */
  color: #155724; /* Bootstrap success text color */
  padding: 10px 20px;
  border: 1px solid #c3e6cb; /* Bootstrap border color */
  border-radius: 4px;
  z-index: 1000; /* Ensure it's on top */
  transition: opacity 0.5s ease;
}
</style>
