import { Suspense } from "react";
import MyFruits from "./MyFruits.jsx";

function App() {
  return (
    <div>
      <h1>Suspense Demo</h1>

      <Suspense fallback={<h3>Loading fruits...</h3>}>
        <MyFruits />
      </Suspense>
    </div>
  );
}

export default App;
