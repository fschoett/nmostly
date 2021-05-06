/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Describes a response to a bulk activation request
 */
export type BulkActivationResponse = {
  /**
   * ID of a device to be activated
   */
  id: string;
  /**
   * HTTP status code that would have resulted from an individual activation on this device
   */
  code: number;
  /**
   * Human readable message which is suitable for user interface display, and helpful to the user. Only included if 'code' indicates an error state
   */
  error?: string;
  /**
   * Debug information which may assist a programmer working with the API. Only included if 'code' indicates an error state
   */
  debug?: null | string;
  [k: string]: unknown;
}[];
