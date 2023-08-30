import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import RouterRender from "./routes/routerRender";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import Loader from "./components/Loader/Loader";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchInterval: 30_000,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<Loader/>}>
            <RouterRender />
          </Suspense>
        </QueryClientProvider>
        <ToastContainer position="top-center" />
      </PersistGate>
    </Provider>
  );
}

export default App;
