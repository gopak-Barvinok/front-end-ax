import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import "./App.css";
import Header from "./components/header";
import Dashboard from "./components/dashboard";
import TransactionHistory from "./components/transactionHistory";
import Footer from "./components/footer";
import { Providers } from "./Providers";

function App() {
  return (
    <Providers>
      <div className="main">
        <Header />
        <Dashboard />
        {/* <TransactionHistory /> */}
        <Footer />
      </div>
      <ToastContainer />
    </Providers>
  );
}

export default App;
