import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Simulator } from "./core/simulator/Simulator";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    localStorage.setItem(
      "nor",
      JSON.stringify({
        inputs: [
          {
            id: "1",
            connections: [
              {
                from: 0,
                to: 0,
                receiverId: "3",
              },
            ],
          },
          {
            id: "2",
            connections: [
              {
                from: 0,
                to: 1,
                receiverId: "3",
              },
            ],
          },
        ],
        gates: [
          {
            id: "3",
            element: "or",
            connections: [
              {
                from: 0,
                to: 0,
                receiverId: "4",
              },
            ],
          },
          {
            id: "4",
            element: "not",
            connections: [
              {
                from: 0,
                to: 0,
                receiverId: "5",
              },
            ],
          },
        ],
        outputs: [
          {
            id: "5",
          },
        ],
      })
    );

    localStorage.setItem(
      "giga-nor",
      JSON.stringify({
        inputs: [
          {
            id: "1",
            connections: [
              {
                from: 0,
                to: 0,
                receiverId: "4",
              },
            ],
          },
          {
            id: "2",
            connections: [
              {
                from: 0,
                to: 1,
                receiverId: "4",
              },
            ],
          },
          {
            id: "3",
            connections: [
              {
                from: 0,
                to: 0,
                receiverId: "5",
              },
            ],
          },
        ],
        gates: [
          {
            id: "4",
            element: "nor",
            connections: [
              {
                from: 0,
                to: 1,
                receiverId: "5",
              },
            ],
          },
          {
            id: "5",
            element: "nor",
            connections: [
              {
                from: 0,
                to: 0,
                receiverId: "6",
              },
            ],
          },
        ],
        outputs: [
          {
            id: "6",
          },
        ],
      })
    );

    const simulator = new Simulator();

    const a = simulator.add("input");
    simulator.toggle(a);

    const b = simulator.add("input");
    const c = simulator.add("input");

    const d = simulator.add("giga-nor");
    const e = simulator.add("output");

    simulator.connect({ emitterId: a, receiverId: d, from: 0, to: 0 });
    simulator.connect({ emitterId: b, receiverId: d, from: 0, to: 1 });
    simulator.connect({ emitterId: c, receiverId: d, from: 0, to: 2 });
    simulator.connect({ emitterId: d, receiverId: e, from: 0, to: 0 });

    console.log(simulator.circuit);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
