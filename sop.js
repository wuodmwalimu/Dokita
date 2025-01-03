// Select elements
const loginFormContainer = document.getElementById("loginFormContainer");
const signupFormContainer = document.getElementById("signupFormContainer");
const showLoginButton = document.getElementById("showLogin");
const showSignupButton = document.getElementById("showSignup");
const switchToSignupLink = document.getElementById("switchToSignup");
const switchToLoginLink = document.getElementById("switchToLogin");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// Switch to Login Form
function showLoginForm() {
  signupFormContainer.style.display = "none";
  loginFormContainer.style.display = "block";
}

// Switch to Signup Form
function showSignupForm() {
  loginFormContainer.style.display = "none";
  signupFormContainer.style.display = "block";
}

// Event Listeners for Form Toggles
showLoginButton.addEventListener("click", showLoginForm);
showSignupButton.addEventListener("click", showSignupForm);
switchToSignupLink.addEventListener("click", (e) => {
  e.preventDefault();
  showSignupForm();
});
switchToLoginLink.addEventListener("click", (e) => {
  e.preventDefault();
  showLoginForm();
});

// Save User Data to Local Storage
function saveUserData(username, email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.push({ username, email, password });
  localStorage.setItem("users", JSON.stringify(users));
}

// Validate Login
function validateLogin(usernameOrEmail, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  return users.find(
    (user) =>
      (user.username === usernameOrEmail || user.email === usernameOrEmail) &&
      user.password === password
  );
}

// Handle Signup Form Submission
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  saveUserData(username, email, password);
  alert("Signup successful! Please log in.");
  showLoginForm();
});

// Handle Login Form Submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const usernameOrEmail = document.getElementById("loginUserOrEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (validateLogin(usernameOrEmail, password)) {
    alert("Login successful! Redirecting...");
    window.location.href = "karibu.html";
  } else {
    alert("Invalid username/email or password. Please try again.");
  }
});
