import axios from "axios";

import { API_URL } from "../config/api";

const AUTH_API_URL = `${API_URL}/auth`;

/* ========================= */
/* REGISTER */
/* ========================= */

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${AUTH_API_URL}/register`,
    userData
  );

  return response.data;
};

/* ========================= */
/* LOGIN */
/* ========================= */

export const loginUser = async (userData) => {
  const response = await axios.post(
    `${AUTH_API_URL}/login`,
    userData
  );

  return response.data;
};

/* ========================= */
/* AUTH HEADER */
/* ========================= */

export const getAuthHeader = () => {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};
/* ========================= */
/* SETTINGS / PROFILE */
/* ========================= */

export const updateUserProfile = async (
  profileData
) => {
  const response = await axios.patch(
    `${AUTH_API_URL}/profile`,
    profileData,
    getAuthHeader()
  );

  return response.data;
};

export const changeUserPassword = async (
  passwordData
) => {
  const response = await axios.patch(
    `${AUTH_API_URL}/password`,
    passwordData,
    getAuthHeader()
  );

  return response.data;
};

export const deleteUserAccount = async (
  credentials
) => {
  const response = await axios.delete(
    `${AUTH_API_URL}/account`,
    {
      ...getAuthHeader(),
      data: credentials,
    }
  );

  return response.data;
};
