import * as alt from 'alt-client';
import * as native from 'natives';
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const config = require("../config.json");
const hook = new Webhook(config.webhook);
const profilbild = config.profilbild;
const webhookname = config.webhookname;

alt.on('keyup', (key) => {
    if(key == 47) {
        if(alt.Player.local.vehicle) {
            let owner = alt.Player.local.vehicle.getStreamSyncedMeta("owner")
            if(owner) {
                if(owner.id == alt.Player.local.id) {
                    toggleVehicleLocks(alt.Player.local.vehicle)
                } else if (config.webhookaktiv = true) {
                    const embed = new MessageBuilder()
                        embed.setTitle('Schlüssel System')
                        embed.setAuthor(config.servername, profilbild)
                        embed.setURL(config.websiteurl)
                        embed.setDescription("Kein Schlüssel gefunden")
                        embed.addField('Spieler', owner, true)
                        embed.addField('Ingame ID', alt.Player.local.id, true)
                        embed.setColor('#00b0f4')
                        embed.setThumbnail(profilbild)
                        embed.setFooter('Schlüssel System by TutoHacks', 'https://cdn.discordapp.com/avatars/595212497821368330/5f34a4702c5cdbe6418aa70e15eaa125.png?size=128')
                        embed.setTimestamp();
                    hook.setUsername(webhookname);
                    hook.setAvatar(profilbild);
                    hook.send(embed);
                    showNotification("", null, "CHAR_CARSITE", 7, "Schlüssel", "Du hast keine Schlüssel gefunden", 1)
                } else if (config.webhookaktiv = false) {
                    showNotification("", null, "CHAR_CARSITE", 7, "Schlüssel", "Du hast keine Schlüssel gefunden", 1)
                }
            } else if (config.webhookaktiv = true) {
                const embed = new MessageBuilder()
                    embed.setTitle('Schlüssel System')
                    embed.setAuthor(config.servername, profilbild)
                    embed.setURL(config.websiteurl)
                    embed.setDescription("Schlüssel gefunden")
                    embed.addField('Spieler', owner, true)
                    embed.addField('Ingame ID', alt.Player.local.id, true)
                    embed.setColor('#00b0f4')
                    embed.setThumbnail(profilbild)
                    embed.setFooter('Schlüssel System by TutoHacks', 'https://cdn.discordapp.com/avatars/595212497821368330/5f34a4702c5cdbe6418aa70e15eaa125.png?size=128')
                    embed.setTimestamp();
                hook.setUsername(webhookname);
                hook.setAvatar(profilbild);
                hook.send(embed);
                alt.emitServer('tim_schluessel:setOwner', alt.Player.local.vehicle)
                showNotification("", null, "CHAR_CARSITE", 7, "Schlüssel", 'Du hast Schlüssel gefunden', 1)
            } else if (config.webhookaktiv = false) {
                alt.emitServer('tim_schluessel:setOwner', alt.Player.local.vehicle)
                showNotification("", null, "CHAR_CARSITE", 7, "Schlüssel", 'Du hast Schlüssel gefunden', 1)
            }
        } else {
            let veh = getClosestVehicle();
            if(veh) {
                let owner = veh.getStreamSyncedMeta("owner")
                if(owner) {
                    if(owner.id == alt.Player.local.id) {
                        toggleVehicleLocks(veh)
                    } else {}
                }
            }
        }
    }
})

function toggleVehicleLocks(veh) {
    alt.emitServer('tim_schluessel:toggleVehicleLocks', veh)
    
}

alt.onServer('tim_schluessel:lockUpdate', (veh, lockstate) => {;
    if (config.webhookaktiv = true) {
        const embed = new MessageBuilder()
            embed.setTitle('Schlüssel System')
            embed.setAuthor(config.servername, profilbild)
            embed.setURL(config.websiteurl)
            embed.setDescription(lockstate == 1 ? 'Fahrzeug aufgeschlossen' : 'Fahrzeug abgeschlossen')
            embed.addField('Spieler', owner, true)
            embed.addField('Ingame ID', alt.Player.local.id, true)
            embed.setColor('#00b0f4')
            embed.setThumbnail(profilbild)
            embed.setFooter('Schlüssel System by TutoHacks', 'https://cdn.discordapp.com/avatars/595212497821368330/5f34a4702c5cdbe6418aa70e15eaa125.png?size=128')
            embed.setTimestamp();
        hook.setUsername(webhookname);
        hook.setAvatar(profilbild);
        hook.send(embed);
    }
    if (config.webhookaktiv = false) {
        showNotification("", null, "CHAR_CARSITE", 7, "Schlüssel", lockstate == 1 ? 'Fahrzeug aufgeschlossen' : 'Fahrzeug abgeschlossen', 1)
    }
    if(lockstate == 1) {
        native.playVehicleDoorCloseSound(veh.scriptID, 0)
    } else {
        native.playVehicleDoorOpenSound(veh.scriptID, 0)
    }
    native.setVehicleLights(veh.scriptID, 1)
    let i = 0;
    let inter = alt.setInterval(() => {
        if(i < 4) {
            native.setVehicleLights(veh.scriptID, 2)
            alt.setTimeout(() => {
                native.setVehicleLights(veh.scriptID, 1)
            }, 200)
        } else {
            alt.clearInterval(inter);
        }
        i++;
    }, 300);
    alt.setTimeout(() => {
        alt.setTimeout(() => {
            native.setVehicleLights(veh.scriptID, 2)
            alt.setTimeout(() => {
                native.setVehicleLights(veh.scriptID, 1)
            }, 500)
        }, 500)
    }, 500)
})

function showNotification(message, backgroundColor = null, notifImage = null, iconType = 0, title = "Title", subtitle = "subtitle", durationMult = 1) {
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringPlayerName(message);
    if (backgroundColor != null)
        native.thefeedSetNextPostBackgroundColor(backgroundColor);
    if (notifImage != null)
        native.endTextCommandThefeedPostMessagetext(notifImage, notifImage, true, iconType, title, subtitle, durationMult);
    return native.endTextCommandThefeedPostMpticker(false, true);
}

function distance(vector1, vector2) {
    return Math.sqrt(
        Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2)
    );
}

function getClosestVehicle(range = 10) {
    let closest = null, lastDist = 999, dist;
    for(let vehicle of alt.Vehicle.all) {
        if(vehicle.scriptID === 0) continue;
        dist = distance(alt.Player.local.pos, vehicle.pos);
        if(dist <= range && dist < lastDist) {
            lastDist = dist;
            closest = vehicle;
        }
    }
    return vehicle;
}