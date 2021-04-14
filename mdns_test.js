const mdnsService = require( "./dist/services/mdns-service");

let service = new mdnsService.MdnsService();
service.findRegistry();
service.findRegistry();