import { Navigation } from "./features/navigation/Navigation";
import { GitMerge, Plus } from "react-feather";
import "./common/styles/index.css";

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
    </div>
  );
};
