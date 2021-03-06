/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Transport-specific parameters. If this parameter is included in a client request it must include the same number of array elements (or 'legs') as specified in the constraints. If no changes are required to a specific leg it must be included as an empty object ({}).
 */
export type SenderTransportParameters =
  | SenderOutput[]
  | {
      [k: string]: unknown;
    }[]
  | SenderOutput1[]
  | SenderOutput2[];
/**
 * Describes external Sender transport parameters defined in other AMWA specifications. The constraints in this schema are minimum constraints, but may be further constrained at the constraints endpoint.
 *
 * This interface was referenced by `SenderOutput`'s JSON-Schema definition
 * via the `patternProperty` "^ext_[a-zA-Z0-9_]+$".
 *
 * This interface was referenced by `SenderOutput1`'s JSON-Schema definition
 * via the `patternProperty` "^ext_[a-zA-Z0-9_]+$".
 *
 * This interface was referenced by `SenderOutput2`'s JSON-Schema definition
 * via the `patternProperty` "^ext_[a-zA-Z0-9_]+$".
 */
export type ExternalSenderTransportParameters = string | boolean | null | number;
/**
 * Describes a bulk sender update resource
 */
export type BulkSenderResource = {
  /**
   * ID of the target sender to apply parameters to
   */
  id: string;
  params: SenderResource;
}[];

/**
 * Describes a sender
 */
export interface SenderResource {
  /**
   * ID of the target Receiver of this Sender. This will be null if the sender is operating in multicast mode, or has not been assigned a receiver in unicast mode, or is sending to a non-NMOS receiver in unicast mode.
   */
  receiver_id?: string | null;
  /**
   * Master on/off control for sender
   */
  master_enable?: boolean;
  activation?: ActivationResource;
  transport_params?: SenderTransportParameters;
}
/**
 * Parameters concerned with activation of the transport parameters
 */
export interface ActivationResource {
  /**
   * Mode of activation: immediate (on message receipt), scheduled_absolute (when internal clock >= requested_time), scheduled_relative (when internal clock >= time of message receipt + requested_time), or null (no activation scheduled)
   */
  mode: ("activate_immediate" | "activate_scheduled_absolute" | "activate_scheduled_relative") | null;
  /**
   * String formatted TAI timestamp (<seconds>:<nanoseconds>) indicating time (absolute or relative) for activation. Should be null or not present if 'mode' is null.
   */
  requested_time?: string | null;
}
/**
 * Describes RTP Sender transport parameters. The constraints in this schema are minimum constraints, but may be further constrained at the constraints endpoint. As a minimum all senders must support `source_ip`, `destination_ip`, `source_port`, `rtp_enabled` and `destination_port`. Senders supporting FEC and/or RTCP must support parameters prefixed with `fec` and `rtcp` respectively.
 */
export interface SenderOutput {
  /**
   * IP address from which RTP packets will be sent (IP address of interface bound to this output). The sender should provide an enum in the constraints endpoint, which should contain the available interface addresses. If the parameter is set to auto the sender should establish for itself which interface it should use, based on routing rules or its own internal configuration.
   */
  source_ip?: (
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }
  ) &
    string;
  /**
   * IP address to which RTP packets will be sent. If auto is set the sender should select a multicast address to send to itself. For example it may implement MADCAP (RFC 2730), ZMAAP, or be allocated address by some other system responsible for co-ordination multicast address use.
   */
  destination_ip?: (
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }
  ) &
    string;
  /**
   * source port for RTP packets (auto = 5004 by default)
   */
  source_port?: number | string;
  /**
   * destination port for RTP packets (auto = 5004 by default)
   */
  destination_port?: number | string;
  /**
   * FEC on/off
   */
  fec_enabled?: boolean;
  /**
   * May be used if NAT is being used at the destination (auto = destination_ip by default)
   */
  fec_destination_ip?: (
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }
  ) &
    string;
  /**
   * forward error correction mode to apply
   */
  fec_type?: "XOR" | "Reed-Solomon";
  /**
   * forward error correction mode to apply
   */
  fec_mode?: "1D" | "2D";
  /**
   * width of block over which FEC is calculated in packets
   */
  fec_block_width?: number;
  /**
   * height of block over which FEC is calculated in packets
   */
  fec_block_height?: number;
  /**
   * destination port for RTP Column FEC packets (auto = RTP destination_port + 2 by default)
   */
  fec1D_destination_port?: number | string;
  /**
   * destination port for RTP Row FEC packets (auto = RTP destination_port + 4 by default)
   */
  fec2D_destination_port?: number | string;
  /**
   * source port for RTP FEC packets (auto = RTP source_port + 2 by default)
   */
  fec1D_source_port?: number | string;
  /**
   * source port for RTP FEC packets (auto = RTP source_port + 4 by default)
   */
  fec2D_source_port?: number | string;
  /**
   * rtcp on/off
   */
  rtcp_enabled?: boolean;
  /**
   * IP address to which RTCP packets will be sent (auto = same as RTP destination_ip by default)
   */
  rtcp_destination_ip?: (
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }
  ) &
    string;
  /**
   * destination port for RTCP packets (auto = RTP destination_port + 1 by default)
   */
  rtcp_destination_port?: number | string;
  /**
   * source port for RTCP packets (auto = RTP source_port + 1 by default)
   */
  rtcp_source_port?: number | string;
  /**
   * RTP transmission active/inactive
   */
  rtp_enabled?: boolean;
  [k: string]: ExternalSenderTransportParameters;
}
/**
 * Describes WebSocket Sender transport parameters. The constraints in this schema are minimum constraints, but may be further constrained at the constraints endpoint. WebSocket Senders must support all parameters in this schema.
 */
export interface SenderOutput1 {
  /**
   * URI hosting the WebSocket server as defined in RFC 6455 Section 3. The sender should provide an enum in the constraints endpoint, which should contain the available interface addresses formatted as connection URIs. If the parameter is set to auto the sender should establish for itself which interface it should use, based on routing rules or its own internal configuration. A null value indicates that the sender has not yet been configured.
   */
  connection_uri?: (
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }
    | null
  ) &
    (
      | ((
          | {
              [k: string]: unknown;
            }
          | {
              [k: string]: unknown;
            }
          | null
        ) &
          string)
      | ((
          | {
              [k: string]: unknown;
            }
          | {
              [k: string]: unknown;
            }
          | null
        ) &
          null)
    );
  /**
   * Indication of whether authorization is required to make a connection. If the parameter is set to auto the Sender should establish for itself whether authorization should be used, based on its own internal configuration.
   */
  connection_authorization?: ("auto" | true | false) | ("auto" | true | false);
  [k: string]: ExternalSenderTransportParameters;
}
/**
 * Describes MQTT Sender transport parameters. The constraints in this schema are minimum constraints, but may be further constrained at the constraints endpoint. MQTT Senders must support all properties in this schema.
 */
export interface SenderOutput2 {
  /**
   * Hostname or IP hosting the MQTT broker. If the parameter is set to auto the Sender should establish for itself which broker it should use, based on a discovery mechanism or its own internal configuration. A null value indicates that the Sender has not yet been configured.
   */
  destination_host?: (
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }
    | null
  ) &
    (
      | ((
          | {
              [k: string]: unknown;
            }
          | {
              [k: string]: unknown;
            }
          | {
              [k: string]: unknown;
            }
          | {
              [k: string]: unknown;
            }
          | null
        ) &
          string)
      | ((
          | {
              [k: string]: unknown;
            }
          | {
              [k: string]: unknown;
            }
          | {
              [k: string]: unknown;
            }
          | {
              [k: string]: unknown;
            }
          | null
        ) &
          null)
    );
  /**
   * Destination port for MQTT traffic. If the parameter is set to auto the Sender should establish for itself which broker it should use, based on a discovery mechanism or its own internal configuration.
   */
  destination_port?: number | string;
  /**
   * Indication of whether TLS is used for communication with the broker. 'mqtt' indicates operation without TLS, and 'secure-mqtt' indicates use of TLS. If the parameter is set to auto the Sender should establish for itself which protocol it should use, based on a discovery mechanism or its own internal configuration.
   */
  broker_protocol?: "auto" | "mqtt" | "secure-mqtt";
  /**
   * Indication of whether authorization is used for communication with the broker. If the parameter is set to auto the Sender should establish for itself whether authorization should be used, based on a discovery mechanism or its own internal configuration.
   */
  broker_authorization?: ("auto" | true | false) | ("auto" | true | false);
  /**
   * The topic which MQTT messages will be sent to on the MQTT broker. A null value indicates that the Sender has not yet been configured.
   */
  broker_topic?: string | null;
  /**
   * The topic which MQTT status messages such as MQTT Last Will are sent to on the MQTT broker. A null value indicates that the Sender has not yet been configured, or is not using a connection status topic.
   */
  connection_status_broker_topic?: string | null;
  [k: string]: ExternalSenderTransportParameters;
}
