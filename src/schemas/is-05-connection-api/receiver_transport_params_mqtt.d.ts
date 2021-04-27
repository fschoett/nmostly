/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Describes external Receiver transport parameters defined in other AMWA specifications. The constraints in this schema are minimum constraints, but may be further constrained at the constraints endpoint.
 *
 * This interface was referenced by `ReceiverInput`'s JSON-Schema definition
 * via the `patternProperty` "^ext_[a-zA-Z0-9_]+$".
 */
export type ExternalReceiverTransportParameters = string | boolean | null | number;

/**
 * Describes MQTT Receiver transport parameters. The constraints in this schema are minimum constraints, but may be further constrained at the constraints endpoint. MQTT Receivers must support all parameters in this schema.
 */
export interface ReceiverInput {
  /**
   * Hostname or IP hosting the MQTT broker. If the parameter is set to auto the Receiver should establish for itself which broker it should use, based on a discovery mechanism or its own internal configuration. A null value indicates that the Receiver has not yet been configured.
   */
  source_host?: ({
    [k: string]: unknown;
  } | null) &
    (
      | (({
          [k: string]: unknown;
        } | null) &
          string)
      | (({
          [k: string]: unknown;
        } | null) &
          null)
    );
  /**
   * Source port for MQTT traffic. If the parameter is set to auto the Receiver should establish for itself which broker it should use, based on a discovery mechanism or its own internal configuration.
   */
  source_port?: number | string;
  /**
   * Indication of whether TLS is used for communication with the broker. 'mqtt' indicates operation without TLS, and 'secure-mqtt' indicates use of TLS. If the parameter is set to auto the Receiver should establish for itself which protocol it should use, based on a discovery mechanism or its own internal configuration.
   */
  broker_protocol?: "auto" | "mqtt" | "secure-mqtt";
  /**
   * Indication of whether authorization is used for communication with the broker. If the parameter is set to auto the Receiver should establish for itself whether authorization should be used, based on a discovery mechanism or its own internal configuration.
   */
  broker_authorization?: "auto" | true | false;
  /**
   * The topic which MQTT messages will be received from via the MQTT broker. A null value indicates that the Receiver has not yet been configured.
   */
  broker_topic?: string | null;
  /**
   * The topic used for MQTT status messages such as MQTT Last Will which are received via the MQTT broker. A null value indicates that the Receiver has not yet been configured, or is not using a connection status topic.
   */
  connection_status_broker_topic?: string | null;
  [k: string]: ExternalReceiverTransportParameters;
}
