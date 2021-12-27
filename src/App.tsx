import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Simulator } from './core/simulator/simulator';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    localStorage.setItem(
      'nor',
      JSON.stringify({
        inputs: [
          {
            id: '1',
            connections: [
              {
                from: 0,
                to: 0,
                receiverId: '3'
              }
            ]
          },
          {
            id: '2',
            connections: [
              {
                from: 0,
                to: 1,
                receiverId: '3'
              }
            ]
          }
        ],
        gates: [
          {
            id: '3',
            element: 'or',
            connections: [
              {
                from: 0,
                to: 0,
                receiverId: '4'
              }
            ]
          },
          {
            id: '4',
            element: 'not',
            connections: [
              {
                from: 0,
                to: 0,
                receiverId: '5'
              }
            ]
          }
        ],
        outputs: [
          {
            id: '5'
          }
        ]
      })
    );

    const simulator = new Simulator();

    const a = simulator.add('input');
    simulator.circuit.inputs.get(a)!.states[0] = true;
    const b = simulator.add('input');
    const c = simulator.add('nor');
    const d = simulator.add('nor');

    try {
      simulator.connect({ emitterId: a, receiverId: c, from: 0, to: 1 });
      simulator.connect({ emitterId: b, receiverId: d, from: 0, to: 0 });
      simulator.connect({ emitterId: c, receiverId: d, from: 0, to: 1 });
      simulator.connect({ emitterId: d, receiverId: c, from: 0, to: 0 });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }

    console.log(simulator.circuit);

    console.log('====');

    const simulator2 = new Simulator();

    const aa = simulator2.add('input');
    simulator2.circuit.inputs.get(aa)!.states[0] = true;
    const bb = simulator2.add('and');
    const cc = simulator2.add('not');

    try {
      simulator2.connect({ emitterId: bb, receiverId: cc, from: 0, to: 0 });
      simulator2.connect({ emitterId: cc, receiverId: bb, from: 0, to: 1 });
      simulator2.connect({ emitterId: aa, receiverId: bb, from: 0, to: 0 });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }

    console.log(simulator2.circuit);
  });

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>Hello Vite + React!</p>
        <p>
          <button type='button' onClick={() => setCount(count => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
          {' | '}
          <a
            className='App-link'
            href='https://vitejs.dev/guide/features.html'
            target='_blank'
            rel='noopener noreferrer'
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
