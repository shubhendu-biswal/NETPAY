document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Auth Check
function checkAuth() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    const guestNav = document.getElementById('guest-nav');
    const userNav = document.getElementById('user-nav');
    const userNameEl = document.getElementById('user-name');
    const userInitialEl = document.getElementById('user-initial');
    const userAvatarImg = document.getElementById('user-avatar-img');

    if (token && userStr) {
        // User is logged in
        if (guestNav) guestNav.style.display = 'none';
        if (userNav) userNav.style.display = 'flex';

        try {
            const user = JSON.parse(userStr);
            if (userNameEl) userNameEl.textContent = user.name || "User";

            if (user.profileImage && userAvatarImg) {
                userAvatarImg.src = user.profileImage;
                userAvatarImg.style.display = 'block';
                if (userInitialEl) userInitialEl.style.display = 'none';
            } else if (userInitialEl && user.name) {
                userInitialEl.textContent = user.name.charAt(0).toUpperCase();
                if (userAvatarImg) userAvatarImg.style.display = 'none';
                userInitialEl.style.display = 'block';
            }
        } catch (e) {
            console.error("Error parsing user data", e);
        }
    } else {
        // User is guest
        if (guestNav) guestNav.style.display = 'block';
        if (userNav) userNav.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
}
