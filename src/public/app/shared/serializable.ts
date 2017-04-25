export interface Serializable<T> {
    deserialize(input: object): T;
}