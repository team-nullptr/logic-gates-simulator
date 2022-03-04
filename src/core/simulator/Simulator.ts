import { Circuit, SerializedCircuit } from './Circuit';
import { BaseGate, isBaseGate } from './elements/BaseGate';
import { v4 as uuid } from 'uuid';
import { ElementFactory } from './elements/ElementFactory';
import { CustomGate, SerializedCustomGate } from './elements/CustomGate';
import { Gate } from './elements/Gate';
import { Port, PortType } from './elements/Port';
import { UserError } from './elements/util/UserError';

export interface ConnectRequest {
  emitterId: string;
  receiverId: string;
  from: number;
  to: number;
}

export interface SerializedSimulator {
  circuit: SerializedCircuit;
  createdGates: [string, SerializedCustomGate][];
}

interface PortsCountResult {
  inputs: number;
  outputs: number;
}

export class Simulator {
  readonly createdGates = new Map<string, SerializedCustomGate>();
  readonly subscribers = new Set<() => void>();

  meta:
    | { mode: 'GATE_EDIT'; editedGate: SerializedCustomGate; circuit: Circuit; projectCircuit: SerializedCircuit }
    | { mode: 'PROJECT_EDIT'; circuit: Circuit } = {
    mode: 'PROJECT_EDIT',
    circuit: new Circuit()
  };

  get circuit(): Circuit {
    return this.meta.circuit;
  }

  set circuit(circuit: Circuit) {
    this.meta.circuit = circuit;
  }

  /**
   * Deserializes serialized simulator from json object.
   */
  static deserialize({ circuit, createdGates }: SerializedSimulator): Simulator {
    const simulator = new Simulator();
    createdGates.forEach(([id, gate]) => simulator.createdGates.set(id, gate));
    simulator.circuit = Circuit.deserialize(circuit, simulator.createdGates);
    return simulator;
  }

  subscribe(listener: () => void): void {
    this.subscribers.add(listener);
  }

  unsubscribe(listener: () => void): void {
    this.subscribers.delete(listener);
  }

  createGate(name: string, color: string): void {
    if (this.meta.mode === 'GATE_EDIT') throw new UserError('Cannot create a new gate while editing another one');

    const serialized = this.circuit.serialize();
    if (serialized.inputs.length === 0 || serialized.outputs.length === 0)
      throw new UserError('Gate must have at least one input and output');

    const type = uuid();

    let dependencies = new Set<string>();
    ([...this.circuit.gates.values()].filter((it) => !(it instanceof BaseGate)) as CustomGate[]).forEach((it) => {
      console.log(it.dependencies, it.type);
      dependencies = new Set<string>([...dependencies, ...it.dependencies, it.type]);
    });

    this.createdGates.set(type, {
      type,
      name,
      color,
      circuit: serialized,
      dependencies: [...dependencies]
    });

    this.circuit = new Circuit();
    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
  }

  editCreatedGate(type: string): void {
    const gate = this.createdGates.get(type);
    if (!gate) return;

    const circuit = Circuit.deserialize(gate.circuit, this.createdGates);
    circuit.simulate();

    this.meta = {
      mode: 'GATE_EDIT',
      editedGate: gate,
      circuit: circuit,
      projectCircuit: this.meta.circuit.serialize()
    };
  }

  renameCreatedGate(type: string, name: string): void {
    const gate = this.createdGates.get(type);
    if (!gate) return;

    gate.name = name;
    this.createdGates.set(type, gate);

    if (this.meta.mode === 'GATE_EDIT' && this.meta.editedGate.type === type) this.meta.editedGate = gate;
    this.notify();
  }

  updateCreatedGate(): void {
    if (this.meta.mode !== 'GATE_EDIT') return;

    if (this.meta.circuit.inputs.size === 0 || this.meta.circuit.outputs.size === 0)
      throw new UserError('Gate must have at least one input and output');

    this.meta.editedGate.circuit = this.meta.circuit.serialize();
    this.createdGates.set(this.meta.editedGate.type, this.meta.editedGate);

    const result = this.countEditedGatePorts();
    this.removeInvalidConnections(this.meta.editedGate.type, result);

    this.meta = {
      mode: 'PROJECT_EDIT',
      circuit: Circuit.deserialize(this.meta.projectCircuit, this.createdGates)
    };

    this.circuit.simulate();
    this.notify();
  }

  private countEditedGatePorts(): PortsCountResult {
    if (this.meta.mode !== 'GATE_EDIT') throw new Error('Validate can be used only while editing a custom gate');

    let inputs = 0;
    let outputs = 0;
    this.meta.circuit.inputs.forEach(({ connectors }) => (inputs += connectors));
    this.meta.circuit.outputs.forEach(({ connectors }) => (outputs += connectors));

    return { inputs, outputs };
  }

  private removeInvalidConnections(type: string, { inputs, outputs }: PortsCountResult) {
    for (const gate of this.createdGates.values()) {
      const circuit = Circuit.deserialize(gate.circuit, this.createdGates);

      [...circuit.inputs.values(), ...circuit.gates.values()].forEach((it) => {
        it.connections = it.connections.filter(({ receiverId, to, from }) => {
          const receiver = circuit.find(receiverId);
          return !(!receiver || (receiver.type === type && to >= inputs) || (it.type === type && from >= outputs));
        });
      });

      gate.circuit = circuit.serialize();
    }

    let projectCircuit = this.circuit;
    if (this.meta.mode === 'GATE_EDIT')
      projectCircuit = Circuit.deserialize(this.meta.projectCircuit, this.createdGates);

    [...projectCircuit.inputs.values(), ...projectCircuit.gates.values()].forEach((it) => {
      it.connections = it.connections.filter(({ receiverId, from, to }) => {
        const receiver = projectCircuit.find(receiverId);
        return !(!receiver || (receiver.type === type && to >= inputs) || (it.type === type && from >= outputs));
      });
    });

    if (this.meta.mode === 'GATE_EDIT') this.meta.projectCircuit = projectCircuit.serialize();
  }

  cancelCreatedGateUpdate(): void {
    if (this.meta.mode !== 'GATE_EDIT') return;

    this.meta = {
      mode: 'PROJECT_EDIT',
      circuit: Circuit.deserialize(this.meta.projectCircuit, this.createdGates)
    };

    this.circuit.simulate();
  }

  removeCreatedGate(type: string): void {
    if(this.meta.mode === 'GATE_EDIT' && this.meta.editedGate.type === type) 
      throw new UserError('Cannot delete currently edited gate')
    

    const usages = new Set<string>();

    for (const gate of this.createdGates.values()) {
      gate.circuit.gates.forEach((it) => {
        if (it.type === type) usages.add(gate.name);
      });
    }

    if (this.meta.mode === 'GATE_EDIT')
      this.meta.projectCircuit.gates.forEach((it) => {
        if (it.type === type) usages.add('[project]');
      });

    this.circuit.gates.forEach((it) => {
      if (it.type === type) usages.add('[editor]');
    });

    console.log(usages);

    if (usages.size > 0)
      throw new UserError(`Cannot delete the gate because it is used in: ${[...usages.values()].join(', ')}`);
    this.createdGates.delete(type);
    this.notify();
  }

  addGate(type: string): BaseGate | CustomGate | undefined {
    const id = uuid();
    let gate: BaseGate | CustomGate;

    if (isBaseGate(type)) gate = ElementFactory.createBaseGate(id, type);
    else gate = ElementFactory.createCustomGate(id, type, this.createdGates);

    if (
      gate instanceof CustomGate &&
      this.meta.mode === 'GATE_EDIT' &&
      (this.meta.editedGate.type === type || gate.dependencies.has(this.meta.editedGate.type))
    )
      throw new UserError('You cannot use gates that depend on currently edited gate');

    this.circuit.gates.set(id, gate);
    if (this.meta.mode === 'PROJECT_EDIT') this.notify();

    return gate;
  }

  addPort(type: PortType, connectors = 1): Port {
    const id = uuid();

    let port: Port;
    switch (type) {
      case 'input':
        port = ElementFactory.createPort(id, type, connectors);
        this.circuit.inputs.set(id, port);
        break;
      case 'output':
        port = ElementFactory.createPort(id, type, connectors);
        this.circuit.outputs.set(id, port);
        break;
    }

    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
    return port;
  }

  toggleInput(id: string, index: number): void {
    const input = this.circuit.inputs.get(id);
    if (!input) return;

    input.states[index] = !input.states[index];
    this.circuit.simulate();

    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
  }

  renamePort(id: string, name: string): void {
    const port = this.circuit.inputs.get(id) || this.circuit.outputs.get(id);
    if (!port) throw new Error('Port not found');
    port.name = name;

    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
  }

  movePort(id: string, to: number, side: PortType) {
    const ports = side === 'input' ? this.circuit.inputs : this.circuit.outputs;

    const port = ports.get(id);
    if (!port) return;

    const portsArray = [...ports.values()];
    const index = portsArray.findIndex((it) => it.id === id);
    if (index === -1) return;

    const temp = portsArray[to];
    portsArray[to] = port;
    portsArray[index] = temp;

    ports.clear();
    portsArray.forEach((it) => ports.set(it.id, it));
    this.notify();
  }

  connect({ emitterId, receiverId, from, to }: ConnectRequest): void {
    const emitter = this.circuit.find(emitterId);
    const receiver = this.circuit.find(receiverId);

    if (!emitter || !receiver || (emitter === receiver && (emitter as Gate).inputs.length === 1)) return;

    const isDoubler = [...this.circuit.inputs.values(), ...this.circuit.gates.values()].some((it) =>
      it.connections.some((it) => it.receiverId === receiverId && it.to === to)
    );
    if (isDoubler) throw new UserError('You cannot make multiple connections to the same input');

    emitter.connections.push({ from, to, receiverId });
    this.circuit.simulate();

    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
  }

  /**
   * Removes connection between two elements.
   */
  disconnect({ emitterId, receiverId, from, to }: ConnectRequest): void {
    const emitter = this.circuit.find(emitterId);
    const receiver = this.circuit.find(receiverId);
    if (!emitter || !receiver) return;

    emitter.connections = emitter.connections.filter((connection) => {
      return !(connection.receiverId == receiverId && connection.from == from && connection.to == to);
    });

    if (receiver instanceof Gate) this.circuit.reset(receiver);
    else receiver.states[to] = false;

    this.circuit.simulate();

    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
  }

  removeGate(id: string): void {
    const element = this.circuit.find(id);
    if (!element) return;

    // remove all connections to the element.
    this.circuit.elements.forEach((element) => {
      element.connections = element.connections.filter((connection) => connection.receiverId !== id);
    });

    // remove all element's connections
    element.connections.forEach(({ receiverId, to }) => {
      const receiver = this.circuit.find(receiverId);
      if (!receiver) return;

      if (receiver instanceof Gate) receiver.inputs[to] = false;
      else receiver.states[to] = false;

      this.circuit.update(receiver);
    });

    // remove gate from the circuit.
    [this.circuit.inputs, this.circuit.gates, this.circuit.outputs].forEach((set) => set.delete(id));

    if (this.meta.mode === 'PROJECT_EDIT') this.notify();
  }

  /**
   * Serializes simulator into json object.
   */
  serialize(): SerializedSimulator {
    return {
      circuit: this.meta.mode === 'PROJECT_EDIT' ? this.circuit.serialize() : this.meta.projectCircuit,
      createdGates: [...this.createdGates.entries()]
    };
  }

  private notify(): void {
    this.subscribers.forEach((it) => it());
  }
}
