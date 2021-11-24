import { Navigation } from "./features/navigation/Navigation";
import { GitMerge, Plus } from "react-feather";
import "./common/styles/index.css";
import { Sidebar } from "./features/sidebar/Sidebar";

export const App = () => {
  return (
    <div>
      <Navigation
        title={"My first circuit"}
        onHomeClicked={() => console.log("home clicked")}
        actions={[
          {
            icon: Plus,
            text: "Create gate",
            onClick: () => console.log("create gate clicked"),
          },
          { icon: GitMerge, onClick: () => console.log("cleanup clicked") },
        ]}
      />
      <main style={{ position: "absolute", width: "100%", height: "100%" }}>
        <Sidebar />
      </main>
    </div>
  );
};
