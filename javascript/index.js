(function() {
  
  document.addEventListener('DOMContentLoaded', () => {
    
    // ==== Variable declaration ====
    const INPUTS = document.querySelectorAll('input');
    const USERNAME_INPUT = document.getElementById('username-input');
    const CLEAR_INPUT_VALUE_BUTTON = document.getElementById('clear-user-input');
    const PASSWORD_INPUT = document.getElementById('password-input');
    const TOGGLE_PASSWORD_TYPE_BUTTON = document.getElementById('toggle-password-visibility');
    const ERROR_USER_ICON = document.getElementById('error-username-icon');
    const ERROR_PASSWORD_ICON = document.getElementById('error-password-icon');
    const ERROR_USERNAME = document.getElementById('error-username');
    const ERROR_PASSWORD = document.getElementById('error-password');
    const LOGIN_FORM = document.getElementById('login-form');
    const FORM_ERROR_MESSAGE = document.getElementById('form-error-message');
    
    // ==== Utility functions ====
    function toggleClass(element, className, condition) {
      if (condition) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    }
    
    function replaceClass(element, oldClass, newClass) {
      element.classList.replace(oldClass, newClass);
    }
    
    // ==== Function declaration ====
    // This function adds class to an input
    function addClassListToInput() {
      const INPUT_HAS_VALUE = this.value.trim() !== '';
      toggleClass(this, 'has-value', INPUT_HAS_VALUE);
    }
    
    // This function shows icon
    function showIcon(inputElement, iconElement, errorIcon) {
      const INPUT_HAS_VALUE = inputElement.value.trim() !== '';
      toggleClass(iconElement, 'show-button', INPUT_HAS_VALUE);
      if (!INPUT_HAS_VALUE) return;
      replaceClass(errorIcon, 'show-error-icon', 'hide-error-icon');
    }
    
    // This function clears input value
    function clearInputValue(inputElement) {
      if (inputElement) {
        inputElement.value = '';
        inputElement.focus();
        toggleClass(inputElement, 'has-value', false);
      }
    }
    
    // This function changes input type
    function changeInputType(inputElement, defaultType, inputType) {
      const EYE_SLASH_ICON = document.getElementById('eye-slash-icon');
      const EYE_ICON = document.getElementById('eye-icon');
      const isTextType = inputElement.type !== inputType;
      
      inputElement.type = isTextType ? inputType : defaultType;
      replaceClass(EYE_SLASH_ICON, isTextType ? 'show-icon' : 'hide-icon', isTextType ? 'hide-icon' : 'show-icon');
      replaceClass(EYE_ICON, isTextType ? 'hide-icon' : 'show-icon', isTextType ? 'show-icon' : 'hide-icon');
    }
    
    // This function checks the input value
    function checkInput(inputElement, errorElement, iconElement, errorMessage) {
      const IS_INPUT_EMPTY = inputElement.value.trim() === '';
      toggleClass(inputElement, 'invalid', IS_INPUT_EMPTY);
      toggleClass(errorElement, 'show-error', IS_INPUT_EMPTY);
      errorElement.textContent = IS_INPUT_EMPTY ? errorMessage : '';
      replaceClass(iconElement, IS_INPUT_EMPTY ? 'hide-error-icon' : 'show-error-icon', IS_INPUT_EMPTY ? 'show-error-icon' : 'hide-error-icon');
      return !IS_INPUT_EMPTY;
    }
    
    // This function validates the form
    function validateForm() {
      replaceClass(FORM_ERROR_MESSAGE, 'show-error-message', 'hide-error-message');
      
      const IS_USER_VALID = checkInput(USERNAME_INPUT, ERROR_USERNAME, ERROR_USER_ICON, 'Please enter your username.');
      const IS_PASSWORD_VALID = checkInput(PASSWORD_INPUT, ERROR_PASSWORD, ERROR_PASSWORD_ICON, 'Please enter the password.');
      
      return IS_USER_VALID && IS_PASSWORD_VALID;
    }
    
    // ==== Initializing and add event listener ====
    // Adding class to an input
    INPUTS.forEach(function(input) {
      addClassListToInput.call(input);
      input.addEventListener('input', addClassListToInput);
    });
    
    // Username input
    USERNAME_INPUT.addEventListener('input', () => {
      showIcon(USERNAME_INPUT, CLEAR_INPUT_VALUE_BUTTON, ERROR_USER_ICON);
    });
    
    USERNAME_INPUT.addEventListener('blur', () => {
      if (USERNAME_INPUT.value === '') {
        toggleClass(CLEAR_INPUT_VALUE_BUTTON, 'show-button', false);
      }
      checkInput(USERNAME_INPUT, ERROR_USERNAME, ERROR_USER_ICON, 'Please enter your username.');
    });
    
    CLEAR_INPUT_VALUE_BUTTON.addEventListener('click', (event) => {
      event.preventDefault();
      clearInputValue(USERNAME_INPUT);
    });
    
    // Password input
    PASSWORD_INPUT.addEventListener('focus', () => {
      toggleClass(TOGGLE_PASSWORD_TYPE_BUTTON, 'show-button', true);
      replaceClass(ERROR_PASSWORD_ICON, 'show-error-icon', 'hide-error-icon');
    });
    
    PASSWORD_INPUT.addEventListener('blur', () => {
      if (PASSWORD_INPUT.value === '') {
        toggleClass(TOGGLE_PASSWORD_TYPE_BUTTON, 'show-button', false);
      }
      checkInput(PASSWORD_INPUT, ERROR_PASSWORD, ERROR_PASSWORD_ICON, 'Please enter the password.');
    });
    
    TOGGLE_PASSWORD_TYPE_BUTTON.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
    
    TOGGLE_PASSWORD_TYPE_BUTTON.addEventListener('click', (event) => {
      event.preventDefault();
      changeInputType(PASSWORD_INPUT, 'password', 'text');
    });
    
    // Login form
    LOGIN_FORM.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const IS_FORM_VALID = validateForm();
      
      if (IS_FORM_VALID) {
        const isUserValid = USERNAME_INPUT.value.trim() === 'jeyvee2002' && PASSWORD_INPUT.value.trim() === 'test123';
        
        if (isUserValid) {
          window.location.href = 'https://www.facebook.com';
        } else {
          FORM_ERROR_MESSAGE.innerHTML = 'Incorrect username and password. Please check your details and try again or <a href="#">contact ICT Support</a>.';
          replaceClass(FORM_ERROR_MESSAGE, 'hide-error-message', 'show-error-message');
        }
      }
    });
  });
  
  
})();