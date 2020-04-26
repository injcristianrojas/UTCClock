'use strict';

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Lang = imports.lang;

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
        this._settings = Convenience.getSettings();

        // Seconds
        let label1 = new Gtk.Label({label: "Show seconds", xalign: 0});
        let widget1 = new Gtk.Switch({halign: Gtk.Align.END});
        this._settings.bind('show-seconds', widget1, 'active', Gio.SettingsBindFlags.DEFAULT);
        
        // Text
        let label2 = new Gtk.Label({label: "Time text to show", xalign: 0});
        let widget2 = new Gtk.ComboBoxText();
        widget2.append('UTC', _("UTC"));
        widget2.append('GMT', _("GMT"));
        widget2.append('Z', _("Z"));
        this._settings.bind('time-text', widget2, 'active-id', Gio.SettingsBindFlags.DEFAULT);
        
        this.margin = 20;
        this.row_spacing = 10;
        this.column_spacing = 10;
        this.attach(label1, 0, 1, 1, 1);
        this.attach(widget1, 1, 1, 1, 1);
        this.attach(label2, 0, 2, 1, 1);
        this.attach(widget2, 1, 2, 1, 1);
    }
})


function buildPrefsWidget() {
    const widget = new UTCClockSettings();
    widget.show_all();
    return widget;
}