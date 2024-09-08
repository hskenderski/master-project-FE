// authFetch.js
export const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('NoTokenError');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers: headers
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
    }

    return response.json(); // Връща JSON данни директно
};

export const logout = () => {
    localStorage.removeItem('token');
};
