import * as alt from 'alt-server';

alt.onClient('tim_schluessel:setOwner', (player, vehicle) => {
    if(!vehicle.hasStreamSyncedMeta("owner")) {
        vehicle.setStreamSyncedMeta("owner", player)
    }
})

alt.onClient('tim_schluessel:toggleVehicleLocks', (player, vehicle) => {
    if(vehicle.lockState == 1) {
        vehicle.lockState = 2
        alt.emitClient(player, 'tim_schluessel:lockUpdate', vehicle, vehicle.lockState)
    } else {
        vehicle.lockState = 1
        alt.emitClient(player, 'tim_schluessel:lockUpdate', vehicle, vehicle.lockState)
    }
})