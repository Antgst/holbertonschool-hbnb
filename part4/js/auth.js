/* Authentication guards, login/logout UI state, and login submission. */

function requireAuthentication() {
  // Redirects anonymous visitors to the index page when access is protected.
  const token = getAuthToken();

  if (!token) {
    window.location.href = "index.html";
    return null;
  }

  return token;
}

function checkAuthentication() {
  // Updates the login link so it acts as login or logout depending on state.
  const token = getAuthToken();
  const loginLink = document.getElementById("login-link");

  APP_STATE.auth = getAuthContext(token);

  if (loginLink) {
    loginLink.style.display = "";

    if (token) {
      loginLink.textContent = t("common.nav.logout");
      loginLink.href = "#";
      loginLink.removeAttribute("aria-current");
      loginLink.onclick = (event) => {
        event.preventDefault();
        clearCookie(TOKEN_COOKIE_NAME);
        window.location.href = "index.html";
      };
    } else {
      loginLink.textContent = t("common.nav.login");
      loginLink.href = "login.html";
      loginLink.onclick = null;
    }
  }

  return token;
}

async function handleLoginSubmit(event) {
  // Submits the login form and stores the returned JWT in a cookie.
  event.preventDefault();

  const loginForm = event.currentTarget;
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const loginMessage = document.getElementById("login-message");
  const submitButton = loginForm.querySelector('button[type="submit"]');

  resetFormMessage(loginMessage);

  if (!email || !password) {
    setFormMessage(loginMessage, t("dynamic.loginMissingFields"), "error");
    return;
  }

  setButtonLoading(submitButton, true, t("dynamic.signingIn"));
  setFormMessage(loginMessage, t("dynamic.checkingCredentials"), "loading");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await parseJsonSafely(response);

    if (response.ok && data.access_token) {
      document.cookie = `${TOKEN_COOKIE_NAME}=${data.access_token}; path=/`;
      setButtonLoading(submitButton, false);
      setFormMessage(loginMessage, t("dynamic.loginSuccess"), "success");

      window.setTimeout(() => {
        window.location.href = "index.html";
      }, 450);

      return;
    }

    setButtonLoading(submitButton, false);
    setFormMessage(
      loginMessage,
      data.error || t("dynamic.invalidCredentials"),
      "error",
    );
  } catch (error) {
    setButtonLoading(submitButton, false);
    setFormMessage(loginMessage, t("dynamic.loginError"), "error");
  }
}
