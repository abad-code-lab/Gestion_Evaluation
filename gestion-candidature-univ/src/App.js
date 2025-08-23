import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { SidebarProvider } from "./composant/context/SidebarContext";
import { useUser } from "./composant/context/UserContext";
import Home from './pages/Home';

import { getUserRoutes } from "./routes/routesConfig";
import { SearchProvider } from "./composant/context/SearchContext";

function App() {
  const { user } = useUser();
// Get combined routes and layout

const { routes: combinedRoutes, layout: Layout } = getUserRoutes(user);
  return (
    <SidebarProvider>
    <SearchProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        {Layout ? (
          <Layout>
            <Routes>
              {combinedRoutes.map((route, index) => (
                <Route 
                  key={index} 
                  path={route.path} 
                  element={route.element} 
                />
              ))}
              {/* <Route path="*" element={<Page404 />} /> */}
            </Routes>
          </Layout>
        ) : (
          <Routes>
            {combinedRoutes.map((route, index) => (
              <Route 
                key={index} 
                path={route.path} 
                element={route.element} 
              />
            ))}
            {/* <Route path="*" element={<Page404 />} /> */}
          </Routes>
        )}
      </BrowserRouter>
    </SearchProvider>
  </SidebarProvider>
);
}


export default App;
