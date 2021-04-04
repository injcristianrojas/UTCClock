"use strict";

const Clutter = imports.gi.Clutter;
const GnomeDesktop = imports.gi.GnomeDesktop;
const GObject = imports.gi.GObject;
const Lang = imports.lang;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const St = imports.gi.St;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const version_data = Convenience.version_data;
const modernGNOME = parseInt(version_data[1]) >= 32;

let UTCClock = GObject.registerClass(
    class UTCCLock extends PanelMenu.Button {

        _init() {
            super._init(0, 'UTCClock', false);

            // Label
            this.timeText = new St.Label({
                y_align: Clutter.ActorAlign.CENTER,
                text: "..."
            });

            let topBox = new St.BoxLayout();
            topBox.add_actor(this.timeText);
            this.add_actor(topBox);

            this.enable();
        }

        updateTime() {
            let now = new Date();
            let utc = new Date(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds()
            );
            this.timeText.set_text(
                new Intl.DateTimeFormat(
                    "default", this.format_params
                ).format(utc) + " " + this.time_text
            );
        }

        setSecondsDisplayed() {
            let secondsDisplayed = this.settings.get_boolean("show-seconds");
            if (secondsDisplayed) {
                this.format_params["second"] = "2-digit";
            } else {
                delete this.format_params["second"];
            }
            this.updateTime();
        }

        setTimeText() {
            this.time_text = this.settings.get_string("time-text");
            this.updateTime();
        }

        setDateDisplayed() {
            let dateDisplayed = this.settings.get_boolean("show-date");
            if (dateDisplayed) {
                this.format_params["weekday"] = "short";
                this.format_params["month"] = "short";
                this.format_params["day"] = "numeric";
            } else {
                delete this.format_params["weekday"];
                delete this.format_params["month"];
                delete this.format_params["day"];
            }
            this.updateTime();
        }

        setLightOpacity() {
            this.timeText.opacity =
                this.settings.get_boolean("light-opacity") ? 255 : 200;
            this.updateTime();
        }

        enable() {
            this.time_text = "UTC";

            this.format_params = {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }

            this.settings = Convenience.getSettings();

            this.signals = [];

            this.clock = new GnomeDesktop.WallClock();
            this.signals[0] = this.clock.connect(
                "notify::clock",
                Lang.bind(this, this.updateTime)
            );

            this.setSecondsDisplayed();
            this.signals[1] = this.settings.connect(
                "changed::show-seconds",
                Lang.bind(this, this.setSecondsDisplayed)
            );

            this.setTimeText();
            this.signals[2] = this.settings.connect(
                "changed::time-text",
                Lang.bind(this, this.setTimeText)
            );

            this.setDateDisplayed();
            this.signals[3] = this.settings.connect(
                "changed::show-date",
                Lang.bind(this, this.setDateDisplayed)
            );

            this.setLightOpacity();
            this.signals[4] = this.settings.connect(
                "changed::light-opacity",
                Lang.bind(this, this.setLightOpacity)
            );

        }

        disable() {
            this.clock.disconnect(this.signals[0]);
            this.settings.disconnect(this.signals[1]);
            this.settings.disconnect(this.signals[2]);
            this.settings.disconnect(this.signals[3]);
            this.settings.disconnect(this.signals[4]);
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