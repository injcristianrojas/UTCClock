"use strict";

const Clutter = imports.gi.Clutter;
const GnomeDesktop = imports.gi.GnomeDesktop;
const GObject = imports.gi.GObject;
const Lang = imports.lang;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const St = imports.gi.St;
const ExtensionUtils = imports.misc.extensionUtils;
const Gio = imports.gi.Gio;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const PopupMenu = imports.ui.popupMenu;

let UTCClock = GObject.registerClass(
    class UTCCLock extends PanelMenu.Button {

        _init() {
            super._init(0, "UTCClock", false);

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

        buildMenu() {
            this.ClockMenuItemSeconds = new PopupMenu.PopupSwitchMenuItem(
                "Show seconds",
                this.settings.get_boolean("show-seconds"),
                { reactive: true }
            );
            this.ClockMenuItemSeconds.connect(
                "toggled",
                Lang.bind(
                    this, function(object, value) {
                        this.settings.set_boolean("show-seconds", value);
                    }
                )
            );
            this.menu.addMenuItem(this.ClockMenuItemSeconds);

            this.ClockMenuItemText = new PopupMenu.PopupSubMenuMenuItem(
                "Time text to show",
                true
            );
            const PopupMenuItemUTC = new PopupMenu.PopupMenuItem("UTC");
            PopupMenuItemUTC.connect('activate', Lang.bind(this, function() {
                this.settings.set_string("time-text", "UTC");
            }));
            this.ClockMenuItemText.menu.addMenuItem(PopupMenuItemUTC);
            const PopupMenuItemGMT = new PopupMenu.PopupMenuItem("GMT");
            PopupMenuItemGMT.connect('activate', Lang.bind(this, function() {
                this.settings.set_string("time-text", "GMT");
            }));
            this.ClockMenuItemText.menu.addMenuItem(PopupMenuItemGMT);
            const PopupMenuItemZ = new PopupMenu.PopupMenuItem("Z");
            PopupMenuItemZ.connect('activate', Lang.bind(this, function() {
                this.settings.set_string("time-text", "Z");
            }));
            this.ClockMenuItemText.menu.addMenuItem(PopupMenuItemZ);
            this.menu.addMenuItem(this.ClockMenuItemText);

            this.ClockMenuItemDate = new PopupMenu.PopupSwitchMenuItem(
                "Show date",
                this.settings.get_boolean("show-date"),
                { reactive: true }
            );
            this.ClockMenuItemDate.connect(
                "toggled",
                Lang.bind(
                    this, function(object, value) {
                        this.settings.set_boolean("show-date", value);
                    }
                )
            );
            this.menu.addMenuItem(this.ClockMenuItemDate);

            this.ClockMenuItemOpacity = new PopupMenu.PopupSwitchMenuItem(
                "Light opacity",
                this.settings.get_boolean("light-opacity"),
                { reactive: true }
            );
            this.ClockMenuItemOpacity.connect(
                "toggled",
                Lang.bind(
                    this, function(object, value) {
                        this.settings.set_boolean("light-opacity", value);
                    }
                )
            );
            this.menu.addMenuItem(this.ClockMenuItemOpacity);
            this.connect(
                "button-press-event",
                Lang.bind(
                    this, function() {
                        log("Holi");
                    }
                )
            );
        }

        enable() {
            this.time_text = "UTC";

            this.format_params = {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }

            this.settings = Convenience.getSettings();

            this.settingsSignals = [];

            this.clock = new GnomeDesktop.WallClock();
            this.clocksignal = this.clock.connect(
                "notify::clock",
                Lang.bind(this, this.updateTime)
            );

            this.setSecondsDisplayed();
            this.settingsSignals[0] = this.settings.connect(
                "changed::show-seconds",
                Lang.bind(this, this.setSecondsDisplayed)
            );

            this.setTimeText();
            this.settingsSignals[1] = this.settings.connect(
                "changed::time-text",
                Lang.bind(this, this.setTimeText)
            );

            this.setDateDisplayed();
            this.settingsSignals[2] = this.settings.connect(
                "changed::show-date",
                Lang.bind(this, this.setDateDisplayed)
            );

            this.setLightOpacity();
            this.settingsSignals[3] = this.settings.connect(
                "changed::light-opacity",
                Lang.bind(this, this.setLightOpacity)
            );

            this.buildMenu();
        }

        disable() {
            // TODO disconnect menu signals
            this.clock.disconnect(this.clocksignal);
            this.settings.disconnect(this.settingsSignals[0]);
            this.settings.disconnect(this.settingsSignals[1]);
            this.settings.disconnect(this.settingsSignals[2]);
            this.settings.disconnect(this.settingsSignals[3]);
        }
    }
);

let utcclock;

function init() {

}

function enable() {
    utcclock = new UTCClock();
    Main.panel._addToPanelBox("utcclock", utcclock, 1, Main.panel._centerBox);
}

function disable() {
    utcclock.disable();
    utcclock.destroy();
}