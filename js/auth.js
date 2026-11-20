function getToken() {
    return localStorage.getItem('token');
}

function getUsuarioNome() {
    return localStorage.getItem('usuarioNome');
}

function getUsuarioRole() {
    return localStorage.getItem('usuarioRole');
}

function estaAutenticado() {
    return Boolean(getToken());
}

function protegerPagina() {
    if (!estaAutenticado()) {
        window.location.href = 'login.html';
    }
}

function protegerAdmin() {
    protegerPagina();

    if (getUsuarioRole() !== 'ADMIN') {
        window.location.href = 'dashboard.html';
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioNome');
    localStorage.removeItem('usuarioRole');

    window.location.href = 'login.html';
}

async function apiFetch(caminho, opcoes = {}) {
    const token = getToken();

    if (!token) {
        logout();
        return;
    }

    const headers = {
        ...opcoes.headers,
        Authorization: `Bearer ${token}`
    };

    if (opcoes.body && !(opcoes.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(
        `${API_URL}${caminho}`,
        {
            ...opcoes,
            headers
        }
    );

    if (response.status === 401) {
        logout();
        return response;
    }

    return response;
}