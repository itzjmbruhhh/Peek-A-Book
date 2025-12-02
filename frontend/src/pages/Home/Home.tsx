import { useTheme } from "../../hooks/useTheme";

function Home() {
  const { theme, toggle } = useTheme();
  return (
    <div>
      Home
      <button onClick={toggle}>
        {theme === "light" ? "Switch to dark" : "Switch to light"}
      </button>      
    </div>
  );
}

export default Home;
