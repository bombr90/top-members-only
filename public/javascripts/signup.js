// Signup.js

//ensure confirm and password input fields match and customize styling
const confirmPassword = () => {
  const password = document.querySelector('input[name=password]');
  const confirm = document.querySelector("input[name=confirm]");
  if(confirm.value === password.value) {
    confirm.setCustomValidity('');
    !confirm.classList.contains("valid") ? confirm.classList.add("valid") : "";
    confirm.classList.contains('invalid') ? confirm.classList.remove('invalid') : ''
  } else {
    confirm.setCustomValidity("Passwords do not match");
    !confirm.classList.contains("invalid") ? confirm.classList.add("invalid") : "";
    confirm.classList.contains("valid") ? confirm.classList.remove("valid") : "";
  }
}
