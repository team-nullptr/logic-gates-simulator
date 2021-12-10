import { GitMerge, Home, Plus } from "react-feather";
import { Navigation } from "../features/navigation/Navigation";

export const renderNavigation = (path: string) => {
  switch (path) {
    case "/":
      return <ProjectNavigation />;
    case "/edit":
      return <EditNavigation />;
  }
};

const ProjectNavigation = () => (
  <Navigation
    title={"Projects"}
    left={[]}
    right={[
      {
        icon: Plus,
        text: "New project",
        onClick: () => console.log("new project clicked")
      }
    ]}
  />
);

const EditNavigation = () => (
  <Navigation
    title={"My first circuit"}
    left={[{ icon: Home, onClick: () => console.log("home clicked") }]}
    right={[
      {
        icon: Plus,
        text: "Create gate",
        onClick: () => console.log("create gate clicked")
      },
      {
        icon: GitMerge,
        onClick: () => console.log("cleanup clicked")
      }
    ]}
  />
);
