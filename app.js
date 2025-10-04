const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const profileButton = document.getElementById('profile-button');
const mobileProfileButton = document.getElementById('mobile-profile-button');

const authModal = document.getElementById('auth-modal');
const modalContent = document.getElementById('modal-content');
const closeModalButton = document.getElementById('close-modal-button');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');

const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

const loginGoogleBtn = document.getElementById('login-google-btn');
const loginFacebookBtn = document.getElementById('login-facebook-btn');
const signupGoogleBtn = document.getElementById('signup-google-btn');
const signupFacebookBtn = document.getElementById('signup-facebook-btn');

const AUTH_STORAGE_KEY = 'sikkimMonasteriesAuthUser';
let authenticatedUser = null;

const getStoredUser = () => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.warn('Failed to parse stored user', error);
    return null;
  }
};

const deriveInitials = (user) => {
  const nameSource = (user.name && user.name.trim()) || '';
  if (nameSource) {
    const parts = nameSource.split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  const emailSource = (user.email && user.email.trim()) || '';
  if (emailSource) {
    return emailSource.charAt(0).toUpperCase();
  }

  return 'U';
};

const updateProfileUI = (user) => {
  if (profileButton) {
    if (user) {
      const initials = deriveInitials(user);
      const displayName = user.name || user.email || 'Explorer';
      profileButton.innerHTML = `<span class="flex items-center gap-2"><span class="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-300 text-gray-900 font-bold">${initials}</span><span class="text-gray-800 font-semibold">${displayName}</span></span>`;
      profileButton.className = 'px-4 py-2 font-semibold rounded-lg transition bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 cursor-default';
      profileButton.disabled = true;
      profileButton.setAttribute('aria-disabled', 'true');
    } else {
      profileButton.innerHTML = 'Login';
      profileButton.className = 'px-4 py-2 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition cursor-pointer';
      profileButton.disabled = false;
      profileButton.removeAttribute('aria-disabled');
    }
  }

  if (mobileProfileButton) {
    if (user) {
      const displayName = user.name || user.email || 'Explorer';
      mobileProfileButton.textContent = `Logged in as ${displayName}`;
      mobileProfileButton.className = 'w-full mt-4 bg-white text-gray-800 font-semibold py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-default';
      mobileProfileButton.disabled = true;
      mobileProfileButton.setAttribute('aria-disabled', 'true');
    } else {
      mobileProfileButton.textContent = 'Login';
      mobileProfileButton.className = 'w-full mt-4 bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition cursor-pointer';
      mobileProfileButton.disabled = false;
      mobileProfileButton.removeAttribute('aria-disabled');
    }
  }
};

const persistUser = (user) => {
  authenticatedUser = user;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  updateProfileUI(user);
};

const showModal = () => {
  if (authenticatedUser) {
    return;
  }

  authModal.classList.remove('hidden');
  setTimeout(() => {
    modalContent.classList.remove('scale-95', 'opacity-0');
  }, 10);
};

const hideModal = () => {
  modalContent.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    authModal.classList.add('hidden');
  }, 300);
};

const openAuthFlow = () => {
  if (authenticatedUser) {
    return;
  }

  showModal();
};

if (mobileMenuButton) {
  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

if (profileButton) {
  profileButton.addEventListener('click', openAuthFlow);
}

if (mobileProfileButton) {
  mobileProfileButton.addEventListener('click', () => {
    if (authenticatedUser) {
      return;
    }

    mobileMenu.classList.add('hidden');
    showModal();
  });
}

const mobileMenuLinks = mobileMenu.getElementsByTagName('a');
for (let i = 0; i < mobileMenuLinks.length; i++) {
  mobileMenuLinks[i].addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });
}

closeModalButton.addEventListener('click', hideModal);
authModal.addEventListener('click', (event) => {
  if (event.target === authModal) {
    hideModal();
  }
});

const handleAuthSuccess = (data) => {
  const userData = {
    name: data.name ? data.name.trim() : '',
    email: data.email ? data.email.trim() : '',
    provider: data.provider || ''
  };

  persistUser(userData);
  hideModal();
};

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const emailValue = document.getElementById('login-email').value.trim();
  if (!emailValue) {
    return;
  }

  handleAuthSuccess({ email: emailValue });
});

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const nameValue = document.getElementById('signup-name').value.trim();
  const emailValue = document.getElementById('signup-email').value.trim();
  if (!nameValue || !emailValue) {
    return;
  }

  handleAuthSuccess({ name: nameValue, email: emailValue });
});

loginGoogleBtn.addEventListener('click', () => {
  handleAuthSuccess({ name: 'Google Explorer', provider: 'google' });
});

loginFacebookBtn.addEventListener('click', () => {
  handleAuthSuccess({ name: 'Facebook Explorer', provider: 'facebook' });
});

signupGoogleBtn.addEventListener('click', () => {
  handleAuthSuccess({ name: 'Google Explorer', provider: 'google' });
});

signupFacebookBtn.addEventListener('click', () => {
  handleAuthSuccess({ name: 'Facebook Explorer', provider: 'facebook' });
});

loginTab.addEventListener('click', () => {
  loginTab.classList.add('text-purple-600', 'border-purple-600');
  loginTab.classList.remove('text-gray-500');
  signupTab.classList.add('text-gray-500');
  signupTab.classList.remove('text-purple-600', 'border-purple-600');

  modalTitle.innerText = 'Welcome Back';
  modalSubtitle.innerText = 'Sign in to continue your journey.';

  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
});

signupTab.addEventListener('click', () => {
  signupTab.classList.add('text-purple-600', 'border-purple-600');
  signupTab.classList.remove('text-gray-500');
  loginTab.classList.add('text-gray-500');
  loginTab.classList.remove('text-purple-600', 'border-purple-600');

  modalTitle.innerText = 'Create an Account';
  modalSubtitle.innerText = 'Join us to discover sacred heritage.';

  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
});

window.addEventListener('DOMContentLoaded', () => {
  authenticatedUser = getStoredUser();
  updateProfileUI(authenticatedUser);

  if (!authenticatedUser) {
    setTimeout(showModal, 500);
  }
});
