/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Describes an audio Receiver
 */
export type AudioReceiverResource = ReceiverResource & {
  /**
   * Type of Flow accepted by the Receiver as a URN
   */
  format: "urn:x-nmos:format:audio";
  /**
   * Capabilities
   */
  caps: {
    /**
     * Subclassification of the formats accepted using IANA assigned media types
     */
    media_types?: [
      (
        | ("audio/L24" | "audio/L20" | "audio/L16" | "audio/L8")
        | {
            [k: string]: unknown;
          }
      ) &
        string,
      ...((
        | ("audio/L24" | "audio/L20" | "audio/L16" | "audio/L8")
        | {
            [k: string]: unknown;
          }
      ) &
        string)[]
    ];
    [k: string]: unknown;
  };
  [k: string]: unknown;
};
/**
 * Describes a receiver
 */
export type ReceiverResource = BaseResource & {
  /**
   * Device ID which this Receiver forms part of. This attribute is used to ensure referential integrity by registry implementations.
   */
  device_id: string;
  /**
   * Transport type accepted by the Receiver in URN format
   */
  transport: {
    [k: string]: unknown;
  } & string;
  /**
   * Binding of Receiver ingress ports to interfaces on the parent Node.
   */
  interface_bindings: string[];
  /**
   * Object containing the 'sender_id' currently subscribed to.
   */
  subscription: {
    /**
     * UUID of the Sender that this Receiver is currently subscribed to
     */
    sender_id: string | null;
    /**
     * Receiver is enabled and configured with a Sender's connection parameters
     */
    active: boolean;
    [k: string]: unknown;
  };
  [k: string]: unknown;
};

/**
 * Describes the foundations of all NMOS resources
 */
export interface BaseResource {
  /**
   * Globally unique identifier for the resource
   */
  id: string;
  /**
   * String formatted TAI timestamp (<seconds>:<nanoseconds>) indicating precisely when an attribute of the resource last changed
   */
  version: string;
  /**
   * Freeform string label for the resource
   */
  label: string;
  /**
   * Detailed description of the resource
   */
  description: string;
  /**
   * Key value set of freeform string tags to aid in filtering resources. Values should be represented as an array of strings. Can be empty.
   */
  tags: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "".
     */
    [k: string]: string[];
  };
  [k: string]: unknown;
}
