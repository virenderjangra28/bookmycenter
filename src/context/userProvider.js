"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import UserContext from "./userContext";

const SESSION_KEY = "sessionData";

const readCachedUser = () => {
  if (typeof window === "undefined") return undefined;

  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return undefined;

  try {
    const tempUser = JSON.parse(atob(sessionData));
    return tempUser?.user ? { ...tempUser.user } : undefined;
  } catch (parseError) {
    console.error("Error parsing session data:", parseError);
    localStorage.removeItem(SESSION_KEY);
    return undefined;
  }
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const validating = useRef(false);

  const clearUserState = useCallback(() => {
    setUser(undefined);
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const validateSession = useCallback(async () => {
    if (typeof window === "undefined") return;

    const cachedUser = readCachedUser();
    if (!cachedUser) {
      clearUserState();
      return;
    }

    if (validating.current) return;

    validating.current = true;
    try {
      const response = await fetch("/api/admin/users/me", {
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        const freshUser = data.data || data.result;
        if (freshUser) {
          setUser({ ...freshUser });
        }
        return;
      }

      clearUserState();
    } catch (err) {
      void err;
    } finally {
      validating.current = false;
    }
  }, [clearUserState]);

  useEffect(() => {
    const cachedUser = readCachedUser();
    if (cachedUser) {
      setUser(cachedUser);
    }

    validateSession();
  }, [validateSession]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === SESSION_KEY && !event.newValue) {
        clearUserState();
      }
    };
    const onFocus = () => validateSession();

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [clearUserState, validateSession]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch("/api/admin/users/logout", { credentials: "include" });
    } catch (err) {
      void err;
    } finally {
      clearUserState();
    }
  };

  const validateToken = () => {
    const cachedUser = readCachedUser();
    if (!cachedUser) {
      clearUserState();
      return false;
    }
    return true;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        validateToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
