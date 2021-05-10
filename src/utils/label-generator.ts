export enum ResourceType {
    node = "node",
    device = "device",
    sender = "sender",
    source = "source",
    receiver = "receiver",
    flow = "flow",
    generic = "generic"
}


let resourceCount = {
    generic: 0,
    node: 0,
    device: 0,
    sender: 0,
    source: 0,
    receiver: 0,
    flow: 0
}

// Generate a default nmostly resource label
export function generateLabel(resourceType: ResourceType) {
    if( !resourceType ) resourceType = ResourceType.generic;

    return `nmostly-${resourceType}-${resourceCount[resourceType]++}`
}