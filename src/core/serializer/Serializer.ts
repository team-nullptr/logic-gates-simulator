interface Serializable<S, O = undefined> {
  // Serializes the instance
  serialize(): S;

  // Deserializes serialized object
  deserialize(serialized: S, options: O): void;
}
