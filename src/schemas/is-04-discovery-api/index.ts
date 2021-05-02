export { ErrorResponse } from "./generated/error"


//#region resources

// Here are all schemas used to descripe all resources
// that can be found in an nmos system
export { BaseResource } from "./generated/resource_core"

// Nodes
export { NodeResource } from "./generated/node"
export { CollectionOfNodes } from "./generated/nodes"

// Devices
export { DeviceResource } from "./generated/device"
export { CollectionOfDevices } from "./generated/devices"

// Senders
export { SenderResource } from "./generated/sender"
export { CollectionOfSenders } from "./generated/senders"

// Receivers
export {
    ReceiverResource,
    VideoReceiverResource,
    AudioReceiverResource,
    DataReceiverResource,
    MuxReceiverResource
} from "./generated/receiver"
export { CollectionOfReceivers } from "./generated/receivers"

// Sources
export {
    SourceResource,
    SourceResource1,
    AudioSourceResource,
    DataSourceResource,
    GenericSourceResource,
    SourceResource1 as SharedSourceResource
} from "./generated/source"
export { CollectionOfSources } from "./generated/sources"

// Flows
export {
    FlowResource,
    FlowResource1,
    RawVideoFlowResource,
    CodedVideoFlowResource,
    RawAudioFlowResource,
    CodedAudioFlowResource,
    GenericDataFlowResource,
    SDIAncillaryFlowResource,
    JSONBasedFlowResource,
    MuxFlowResource
} from "./generated/flow"
export { CollectionOfFlows } from "./generated/flows"

// Clocks
export { ClockWithNoExternalReference } from "./generated/clock_internal"
export { PTPClock } from "./generated/clock_ptp"

//#endregion resources



//#region apis

// All API-related schemas

// Node API
export { NodeAPIBaseResource } from "./generated/nodeapi-base";
export { ReceiverTargetResource, EmptyObjectSchema } from "./generated/nodeapi-receiver-target"

// Query API
export { QueryAPIBaseResource } from "./generated/queryapi-base"
export { Subscription } from "./generated/queryapi-subscription-response"
export { CollectionOfSubscriptions } from "./generated/queryapi-subscriptions-response"
export { SubscriptionCreation } from "./generated/queryapi-subscriptions-post-request"

// Registration API
export { RegistrationAPIBaseResource } from "./generated/registrationapi-base"
export { ResourceRegistration } from "./generated/registrationapi-resource-post-request"
export { RegisteredResource } from "./generated/registrationapi-resource-response"
export { HeartbeatResponse } from "./generated/registrationapi-health-response"

//#endregion apis
