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
 * Describes RTP Receiver transport parameters. The constraints in this schema are minimum constraints, but may be further constrained at the constraints endpoint. Receivers must support at least the `source_ip`, `interface_ip`, `rtp_enabled` and `destination_port` parameters, and must support the `multicast_ip` parameter if they are capable of multicast operation. Receivers supporting FEC and/or RTCP must support parameters prefixed with `fec` and `rtcp` respectively.
 */
export interface ReceiverInput {
  /**
   * Source IP address of RTP packets in unicast mode, source filter for source specific multicast. A null value indicates that the source IP address has not been configured in unicast mode, or the Receiver is in any-source multicast mode.
   */
  source_ip?: ({
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
   * IP multicast group address used in multicast operation only. Should be set to null during unicast operation. A null value indicates the parameter has not been configured, or the receiver is operating in unicast mode.
   */
  multicast_ip?: ({
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
   * IP address of the network interface the receiver should use. The receiver should provide an enum in the constraints endpoint, which should contain the available interface addresses. If set to auto in multicast mode the receiver should determine which interface to use for itself, for example by using the routing tables. The behaviour of auto is undefined in unicast mode, and controllers should supply a specific interface address.
   */
  interface_ip?: {
    [k: string]: unknown;
  } & string;
  /**
   * destination port for RTP packets (auto = 5004 by default)
   */
  destination_port?: number | string;
  /**
   * FEC on/off
   */
  fec_enabled?: boolean;
  /**
   * May be used if NAT is being used at the destination (auto = multicast_ip (multicast mode) or interface_ip (unicast mode) by default)
   */
  fec_destination_ip?: {
    [k: string]: unknown;
  } & string;
  /**
   * forward error correction mode to apply. (auto = highest available number of dimensions by default)
   */
  fec_mode?: "auto" | "1D" | "2D";
  /**
   * destination port for RTP Column FEC packets (auto = RTP destination_port + 2 by default)
   */
  fec1D_destination_port?: number | string;
  /**
   * destination port for RTP Row FEC packets (auto = RTP destination_port + 4 by default)
   */
  fec2D_destination_port?: number | string;
  /**
   * Destination IP address of RTCP packets (auto = multicast_ip (multicast mode) or interface_ip (unicast mode) by default)
   */
  rtcp_destination_ip?: {
    [k: string]: unknown;
  } & string;
  /**
   * RTCP on/off
   */
  rtcp_enabled?: boolean;
  /**
   * destination port for RTCP packets (auto = RTP destination_port + 1 by default)
   */
  rtcp_destination_port?: number | string;
  /**
   * RTP reception active/inactive
   */
  rtp_enabled?: boolean;
  [k: string]: ExternalReceiverTransportParameters;
}
