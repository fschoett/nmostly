# NMOStly

NMOStly is a typescript implementations of the most parts of the AMWA IS-04 and IS-05 specifications.
See [Networked Media Open Specifiactions](https://specs.amwa.tv/nmos/)

## Why?
As part of my masters-thesis i started developing a TypeScript library for interfacing with NMOS devices.
In contrast to the rather complex implementation by SONY ([nmos-cpp](https://github.com/sony/nmos-cpp))
an nmos node can be started in only 10 lines of javascript:


```javascript
import Nmostly from "nmostly";

const nodeApi = new Nmostly( {
    ifaceName : "eth0",
    ipv4      : "192.168.178.41",
    macAddr   : "74-D4-35-BB-25-1C",
    port      : 5500
});

nodeApi.addReceiverAudio();
nodeApi.addAudioSource();

nodeApi.startServer();
```

This small snippet will start a Test Node with one audio receiver and one audio source.
The methods of the nodeApi accept many options to overwrite the defaults set by nmostly


# License