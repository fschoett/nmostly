# NMOStly

NMOStly is a typescript implementations of the most parts of the AMWA IS-04 and IS-05 specifications.
See [Networked Media Open Specifiactions](https://specs.amwa.tv/nmos/)

## Why?
As part of my masters-thesis at the TH-Cologne, I started developing a TypeScript library for interfacing with NMOS devices.
In contrast to the rather complex implementation by SONY ([nmos-cpp](https://github.com/sony/nmos-cpp))
an nmos node can be started in only 10 lines of javascript:


```javascript
import Nmostly from "nmostly";

const nodeApi = new Nmostly( {
    ifaceName : "eth0",
    ipv4      : "192.168.178.123",
    macAddr   : "00-00-00-00-00-00",
    port      : 5500
});

nodeApi.addReceiverAudio();
nodeApi.addAudioSource();

nodeApi.startServer();
```

This small snippet will start a Test Node with one audio receiver and one audio source.
The methods of the nodeApi accept many options to overwrite the defaults set by nmostly

# Installation
Simply run 
```bash
npm i nmostly
```
in your terminal.

# Warning
NMOStly has been developed by me and is heavily un-tested.. So please be careful when using it in a production environment.
At the current state of the project it is not recommended!

NMOStly is mainly intended for small, quick and ugly prototyping work!

# Usage

# Third Party Software
NMOStly uses the following open source projects:

- [axios](https://github.com/axios/axios)
- [express.js](https://github.com/types/express)
- [multicast-dns](https://github.com/mafintosh/multicast-dns)
- [TypeScript](https://github.com/microsoft/TypeScript)
- [uuid](https://github.com/uuidjs/uuid)

# License

GNU General Publlic License v3.0. See [./LICENSE](./LICENSE)