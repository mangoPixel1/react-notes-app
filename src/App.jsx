import "./App.css";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { UIProvider } from "./contexts/UIContext";
import { NotesProvider } from "./contexts/NotesContext";

// Components
import MainContainer from "./components/MainContainer";

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <NotesProvider>
          <MainContainer />
        </NotesProvider>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
