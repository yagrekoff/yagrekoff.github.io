document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Проверка логина и пароля (здесь можно заменить на реальные данные)
        if (username === '1' && password === '1') {
            // Сохраняем информацию о входе в Local Storage
            localStorage.setItem('isLoggedIn', 'true');

            // Переходим на главную страницу сайта
            window.location.href = 'index.html';
        } else {
            alert('Неверный логин или пароль!');
        }
    });
});