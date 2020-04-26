'use strict';

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const UTCClockSettingsWidget = Me.imports.prefs_window.UTCClockSettingsWidget;

function init() {
    log(`initializing ${Me.metadata.name} Preferences`);
}

const UTCClockSettingsBox = new GObject.Class({
    Name: 'UTCClock.Prefs.UTCClockSettingsBox',
    GTypeName: 'UTCClockSettingsBox',
    Extends: Gtk.Box,

    _init: function() {
        this.parent();

        let box_outer = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 60
        });
        this.add(box_outer);

        let widget = new UTCClockSettingsWidget();
        box_outer.pack_start(widget, true, true, 0);
    }

});

function buildPrefsWidget() {
    const box = new UTCClockSettingsBox();
    box.show_all();
    return box;
}