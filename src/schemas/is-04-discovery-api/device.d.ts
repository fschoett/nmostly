/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Describes a Device
 */
export type DeviceResource = BaseResource & {
  /**
   * Device type URN
   */
  type: string;

  /**
   * Globally unique identifier for the Node which initially created the Device. This attribute is used to ensure referential integrity by registry implementations.
   */
  node_id: string;
  /**
   * UUIDs of Senders attached to the Device (deprecated)
   */
  senders: string[];
  /**
   * UUIDs of Receivers attached to the Device (deprecated)
   */
  receivers: string[];
  /**
   * Control endpoints exposed for the Device
   */
  controls: {
    /**
     * URL to reach a control endpoint, whether http or otherwise
     */
    href: string;
    /**
     * URN identifying the control format
     */
    type: string;
    /**
     * This endpoint requires authorization
     */
    authorization?: boolean;
    [k: string]: unknown;
  }[];
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
