const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const signIn = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const register = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/user/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};
export const googleSignIn = () => {
  window.location.href = `${API_BASE_URL}/api/auth/google`;
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const fetchCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/user/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};

export const updateUserProfile = async (formData) => {
  const requestBody = {
    phone: formData.phone || "",
    address: formData.address || "",
  };

  const response = await fetch(`${API_BASE_URL}/api/user/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error updating profile");
  }

  return response.json();
};

export const checkProfileCompletion = async () => {
  const response = await fetch(`${API_BASE_URL}/api/user/check-profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Profile completion check failed");
  }

  const data = await response.json();
  return data.isProfileComplete; 
};
