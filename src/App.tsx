import { Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import MessageIcon from "@mui/icons-material/Message";
import "./index.css";
import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Channels from "./pages/channels/Channels";
import Messages from "./pages/messages/Messages";
import Logout from "./pages/Logout/Logout";

function App() {
  const isAuthenticated = localStorage.getItem("username");
  const hasChannel = localStorage.getItem("channel");
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                routerProvider={routerBindings}
                resources={[
                  {
                    name: "Channels",
                    list: "/channels",
                  },
                  {
                    name: "Messages",
                    list: "/messages",
                  },
                  {
                    name: "Logout",
                    list: "/logout",
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "23hnqY-Z9sFp4-3qso4H",
                }}
              >
                <Routes>
                  <Route index element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route
                    element={
                      isAuthenticated && (
                        <ThemedLayoutV2
                          Header={() => <Header sticky />}
                          Title={({ collapsed }) => (
                            <>
                              {collapsed ? (
                                <MessageIcon />
                              ) : (
                                <>
                                  <MessageIcon /> IRC ChatApp
                                </>
                              )}
                            </>
                          )}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      )
                    }
                  >
                    <Route path="/channels">
                      <Route
                        index
                        element={isAuthenticated ? <Channels /> : <Login />}
                      />
                    </Route>
                    <Route path="/messages">
                      <Route
                        index
                        element={
                          hasChannel ? (
                            <Messages />
                          ) : (
                            <h1>
                              please Join any Channel to get some messages
                            </h1>
                          )
                        }
                      />
                      {/* <Route
                        path="*"
                        element={
                          isAuthenticated ? (
                            hasChannel ? (
                              <Messages />
                            ) : (
                              <h1>
                                please Join any Channel to get some messages
                              </h1>
                            )
                          ) : (
                            <Login />
                          )
                        }
                      /> */}
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
