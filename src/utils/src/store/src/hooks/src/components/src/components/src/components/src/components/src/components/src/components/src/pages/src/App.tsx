import CalculatorPage from "./pages/CalculatorPage";
import { Toaster } from "react-hot-toast";

/**
 * App
 *
 * The very top component of the application.
 * It renders the calculator page and a toast notification system
 * that shows messages (copy, future features, etc.)
 */
export default function App() {
  return (
    <>
      <CalculatorPage />
      <Toaster position="bottom-right" />
    </>
  );
}
