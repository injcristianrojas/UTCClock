'use strict';

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;

function init() {
    log(`initializing ${Me.metadata.name} Preferences`);
}

const UTCClockSettings = new GObject.Class({
    Name: 'UTCClockSettings',
    Extends: Gtk.Grid,

    _init: function (params) {
        this.parent(params);
        this.margin = 24;
        this.spacing = 30;
        this.row_spacing = 10;
        this._settings = Convenience.getSettings();

        // Seconds
        let label2 = new Gtk.Label({
            label: "Show seconds",
            hexpand: true,
            halign: Gtk.Align.START
        });
        let widget2 = new Gtk.Switch();
        this._settings.bind('show-seconds', widget2, 'active', Gio.SettingsBindFlags.DEFAULT)
        this.attach(label2, 0, 2, 1, 1);
        this.attach(widget2, 1, 2, 1, 1);
    }
})


function buildPrefsWidget() {
    const widget = new UTCClockSettings();
    widget.show_all();

    return widget;
}