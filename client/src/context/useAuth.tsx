import { deleteLogOutAPI } from "@/api/auth/deleteLogOutAPI";
import { getValidateUserAPI } from "@/api/auth/getValidateUserAPI";
import { postLogInAPI } from "@/api/auth/postLogInAPI";
import { postSignUpAPI } from "@/api/auth/postSignUpAPI";
import { LoadingIndicator } from "@/components";
import { useFetch } from "@/hooks";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface AuthContextType {
  currentUser: { id: string; email: string } | null;
  logIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  refreshUser: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  logIn: async () => {},
  signUp: async () => {},
  logOut: async () => {},
  refreshUser: () => {},
});

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const {
    data: currentUser,
    isLoading,
    mutate: reloadCurrentUser,
  } = useFetch("/auth/me", getValidateUserAPI);

  const refreshUser = useCallback((): void => {
    reloadCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logIn: AuthContextType["logIn"] = useCallback(
    async (email, password) => {
      try {
        await postLogInAPI({ email, password });
        await refreshUser();
      } catch (error) {
        throw error;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const signUp: AuthContextType["signUp"] = useCallback(
    async (email, password) => {
      try {
        await postSignUpAPI({ email, password });
        await refreshUser();
      } catch (error) {
        throw error;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const logOut = useCallback(async (): Promise<void> => {
    try {
      await deleteLogOutAPI();
      await refreshUser();
    } catch (error) {
      throw error;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const values = useMemo(
    () => ({
      currentUser: currentUser || null,
      refreshUser,
      signUp,
      logIn,
      logOut,
    }),
    [currentUser, refreshUser, signUp, logIn, logOut]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <LoadingIndicator />
      </div>
    );
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthContext.Provider");
  }
  return context;
};
