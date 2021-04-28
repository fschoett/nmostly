/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Describes a coded audio Flow
 */
export type CodedAudioFlowResource = AudioFlowResource & {
  /**
   * Subclassification of the format using IANA assigned media types
   */
  media_type: string;
  [k: string]: unknown;
};
/**
 * Describes an audio Flow
 */
export type AudioFlowResource = FlowResource & {
  /**
   * Format of the data coming from the Flow as a URN
   */
  format: "urn:x-nmos:format:audio";
  /**
   * Number of audio samples per second for this Flow
   */
  sample_rate: {
    /**
     * Numerator
     */
    numerator: number;
    /**
     * Denominator
     */
    denominator?: number;
    [k: string]: unknown;
  };
  [k: string]: unknown;
};
/**
 * Describes a Flow
 */
export type FlowResource = BaseResource & {
  /**
   * Number of Grains per second for this Flow. Must be an integer division of, or equal to the Grain rate specified by the parent Source. Grain rate matches the frame rate for video (see NMOS Content Model). Specified for periodic Flows only.
   */
  grain_rate?: {
    /**
     * Numerator
     */
    numerator: number;
    /**
     * Denominator
     */
    denominator?: number;
    [k: string]: unknown;
  };
  /**
   * Globally unique identifier for the Source which initially created the Flow. This attribute is used to ensure referential integrity by registry implementations (v1.0 only).
   */
  source_id: string;
  /**
   * Globally unique identifier for the Device which initially created the Flow. This attribute is used to ensure referential integrity by registry implementations (v1.1 onwards).
   */
  device_id: string;
  /**
   * Array of UUIDs representing the Flow IDs of Grains which came together to generate this Flow (may change over the lifetime of this Flow)
   */
  parents: string[];
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
