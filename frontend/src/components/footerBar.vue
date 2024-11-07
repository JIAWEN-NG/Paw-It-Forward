<!-- <template>
    <footer class="footer">
      <div class="container">
        <span class="text-muted">© 2024 Paw-It-Forward. All rights reserved.</span>
        <ul class="footer-links">
          <li><router-link to="/meetus">Meet The Team</router-link></li>
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
   -->

   <template>
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <!-- Company Info and Copyright -->
          <div class="footer-info">
            <span class="text-muted">© 2024 Paw-It-Forward. All rights reserved.</span>
            <ul class="footer-links">
              <li><router-link to="/meetus">Meet The Team</router-link></li>
              <li><router-link to="/contact">Contact Us</router-link></li>
              <li><router-link to="/privacy-policy">Privacy Policy</router-link></li>
              <li><router-link to="/terms-of-service">Terms of Service</router-link></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="contact-info">
            <p>Email: <a href="mailto:support@pawitforward.com">support@pawitforward.com</a></p>
            <p>Phone: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
          </div>
        </div>
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
  * {
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
  }
  .footer {
    background-color: white;
    padding: 1rem 0;
    width: 100%;
    text-align: center;
    font-size: 0.7rem;
  }
  
  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .footer-info {
    text-align: center;
  }
  
  .text-muted {
    color: #666;
  }
  
  .footer-links {
    list-style: none;
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 0.5rem 0;
    padding: 0;
  }
  
  .footer-links li {
    margin: 0 10px;
  }
  
  .footer-links a {
    text-decoration: none;
    color: #666;
  }
  
  .footer-links a:hover {
    text-decoration: underline;
  }

  .contact-info {
    font-size: 0.7rem;
    color: #666;
    gap:1rem;
  }
  
  .contact-info a {
    color: #666;
    text-decoration: none;
  }
  
  .contact-info a:hover {
    text-decoration: underline;
  }
  
  /* Responsive design */
  @media (min-width: 768px) {
    .footer-content {
      flex-direction: row;
      justify-content: space-between;
    }
  
    .footer-info,
    .contact-info {
      text-align: left;
    }
  }
  </style>
  