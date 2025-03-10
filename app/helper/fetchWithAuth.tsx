export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    console.log("Token being sent:", token);

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    console.log("Headers:", headers); // Debugging

    return fetch(url, { ...options, headers });
};
