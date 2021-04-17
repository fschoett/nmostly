import { Constraint } from "./constraint"


export class ConstraintRtp {
    multicast_ip: Constraint;
    destination_ip: Constraint;
    destination_port: Constraint;
    source_ip: Constraint;
    interface_ip: Constraint;
    source_port: Constraint;
    fec_enabled: Constraint;
    fec_destination_ip: Constraint;
    fec_mode: Constraint;
    fec_type: Constraint;
    fec_block_width: Constraint;
    fec_block_height: Constraint;
    fec1D_destination_port: Constraint;
    fec2D_destination_port: Constraint;
    fec1D_source_port: Constraint;
    fec2D_source_port: Constraint;
    rtcp_enabled: Constraint;
    rtcp_destination_ip: Constraint;
    rtcp_destination_port: Constraint;
    rtcp_source_port: Constraint;
    rtp_enabled: Constraint;

    constructor(){
        this.multicast_ip=new Constraint();
        this.destination_ip=new Constraint();
        this.destination_port=new Constraint();
        this.source_ip=new Constraint();
        this.interface_ip=new Constraint();
        this.source_port=new Constraint();
        this.fec_enabled=new Constraint();
        this.fec_destination_ip=new Constraint();
        this.fec_mode=new Constraint();
        this.fec_type=new Constraint();
        this.fec_block_width=new Constraint();
        this.fec_block_height=new Constraint();
        this.fec1D_destination_port=new Constraint();
        this.fec2D_destination_port=new Constraint();
        this.fec1D_source_port=new Constraint();
        this.fec2D_source_port=new Constraint();
        this.rtcp_enabled=new Constraint();
        this.rtcp_destination_ip=new Constraint();
        this.rtcp_destination_port=new Constraint();
        this.rtcp_source_port=new Constraint();
        this.rtp_enabled=new Constraint();
    }

    public getModel() {
        return {
            multicast_ip: this.multicast_ip,
            destination_ip: this.destination_ip,
            destination_port: this.destination_port,
            source_ip: this.source_ip,
            interface_ip: this.interface_ip,
            source_port: this.source_port,
            fec_enabled: this.fec_enabled,
            fec_destination_ip: this.fec_destination_ip,
            fec_mode: this.fec_mode,
            fec_type: this.fec_type,
            fec_block_width: this.fec_block_width,
            fec_block_height: this.fec_block_height,
            fec1D_destination_port: this.fec1D_destination_port,
            fec2D_destination_port: this.fec2D_destination_port,
            fec1D_source_port: this.fec1D_source_port,
            fec2D_source_port: this.fec2D_source_port,
            rtcp_enabled: this.rtcp_enabled,
            rtcp_destination_ip: this.rtcp_destination_ip,
            rtcp_destination_port: this.rtcp_destination_port,
            rtcp_source_port: this.rtcp_source_port,
            rtp_enabled: this.rtp_enabled,
        }
    }
}