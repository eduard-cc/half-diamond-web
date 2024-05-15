import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/theme-provider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-12 w-12"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
