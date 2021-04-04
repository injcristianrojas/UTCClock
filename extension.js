"use strict";

const Clutter = imports.gi.Clutter;
const GnomeDesktop = imports.gi.GnomeDesktop;
const GObject = imports.gi.GObject;
const Lang = imports.lang;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const St = imports.gi.St;

let format_params = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
}

let time_text = "UTC";

let UTCClock = GObject.registerClass(
    class UTCCLock extends PanelMenu.Button {

        _init() {
            super._init(0, 'UTCClock', false);

            // Label
            this._timeText = new St.Label({
                y_align: Clutter.ActorAlign.CENTER,
                text: "..."
            });

            let topBox = new St.BoxLayout();
            topBox.add_actor(this._timeText);
            this.add_actor(topBox);

            this.enable();
        }

        update_time() {
            let now = new Date();
            let utc = new Date(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds()
            );
            this._timeText.set_text(
                new Intl.DateTimeFormat(
                    "default", format_params
                ).format(utc) + " " + time_text
            );
        }

        enable() {
            this.signals = [];
            this.clock = new GnomeDesktop.WallClock();
            this.signals[0] = this.clock.connect(
                "notify::clock",
                Lang.bind(this, this.update_time)
            );
            
        }

        disable() {
            this.clock.disconnect(this.signals[0]);
        }


    }
);

let utcclock;

function init() {

}

function enable() {
    utcclock = new UTCClock();
    Main.panel._addToPanelBox('utcclock', utcclock, 1, Main.panel._centerBox);
}

function disable() {
    utcclock.disable();
    utcclock.destroy();
}