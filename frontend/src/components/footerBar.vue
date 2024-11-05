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
  
          <!-- Social Media Links -->
          <!-- <div class="social-media">
            <a href="https://www.facebook.com" target="_blank" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.twitter.com" target="_blank" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="https://www.linkedin.com" target="_blank" aria-label="LinkedIn">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div> -->
  
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
    padding: 1.5rem 0;
    width: 100%;
    text-align: center;
  }
  
  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
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
  
  .social-media {
    display: flex;
    gap: 1rem;
  }
  
  .social-media a {
    color: #666;
    font-size: 1.2rem;
  }
  
  .social-media a:hover {
    color: #000;
  }
  
  .contact-info {
    font-size: 0.9rem;
    color: #666;
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
    .social-media,
    .contact-info {
      text-align: left;
    }
  }
  </style>
  