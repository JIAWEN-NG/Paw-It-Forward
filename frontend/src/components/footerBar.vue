<template>
    <footer class="footer">
      <div class="container">
        <span class="text-muted">© 2024 Paw-It-Forward. All rights reserved.</span>
        <ul class="footer-links">
          <li><router-link to="/meetus">Meet Our Team</router-link></li>
        </ul>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'FooterBar',
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  *{
      box-sizing: border-box;
      font-family: 'Montserrat', sans-serif;
  }
  .footer {
    background-color: white;
    padding: 1.5rem 0;
    /* position: absolute; */
    /* bottom: 0; */
    width: 100%;
    text-align: center;
  }
  
  .footer-links {
    list-style: none;
    display: inline-flex;
    margin: 0;
    padding: 0;
  }
  
  .footer-links li {
    margin: 0 15px;
  }
  
  .footer-links a {
    text-decoration: none;
    color: #666;
  }
  
  .footer-links a:hover {
    text-decoration: underline;
  }
  </style>
  