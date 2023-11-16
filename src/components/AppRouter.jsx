import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { publicRoutes, privateRoutes } from "../router/routes";
import { useContext } from "react";
import { AuthContext } from "../contexx";
import Loader from "./UI/loader/Loader";

const AppRouter = () => {
  const { isAuth, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      {isAuth
        ? privateRoutes.map((route) => (
            <Route
              key={route.path}
              element={<route.component />}
              path={route.path}
              caseSensitive={route.caseSensitive}
            />
          ))
        : publicRoutes.map((route) => (
            <Route
              key={route.path}
              element={<route.component />}
              path={route.path}
              caseSensitive={route.caseSensitive}
            />
          ))}
      <Route
        path="*"
        element={<Navigate to={isAuth ? "/posts" : "/login"} />}
      />{" "}
      {/* Використання Navigate всередині Route */}
    </Routes>
  );
};
export default AppRouter;
