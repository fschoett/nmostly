import { IAppService } from "../../services/i-app-service";
import { Receiver } from "../Receiver/Receiver";
import { Sender } from "../Sender/Sender";
import { Source } from "../Source/Source";
import { DeviceConfig } from "./DeviceConfig";

export class Device {

    private _id: string;
    private _version: string;
    private _label: string;
    private _node_id: string;
    private _senders: string[];
    private _receivers: string[];

    private receiverList: Receiver[];
    private senderList: Sender[];
    private sourceList: Source[];

    constructor(
        private appService: IAppService,
        private config: DeviceConfig,
        node_id: string
    ) {
        this._id = appService.utilsService.generateUuid();
        this._version = appService.utilsService.generateVersion();
        this._label = config.label;
        this._node_id = node_id;
        this._senders = [];
        this._receivers = [];
    }

    public get id() { return this._id }
    public get version() { return this._version }
    public get label() { return this._label }
    public get node_id() { return this._node_id }
    public get senders() { return this._senders }
    public get receivers() { return this._receivers }
}