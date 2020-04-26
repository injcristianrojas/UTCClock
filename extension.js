'use strict';

const St = imports.gi.St;
const Main = imports.ui.main;
const GnomeDesktop = imports.gi.GnomeDesktop;
const Lang = imports.lang;
const Shell = imports.gi.Shell;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

let text, button, label;
let clock, clock_signal_id;
let settings;

const format_with_seconds = new Intl.DateTimeFormat('default', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false});
const format_without_seconds = new Intl.DateTimeFormat('default', {hour: 'numeric', minute: 'numeric', hour12: false});
let seconds_displayed_format = format_without_seconds;

function init() {
    settings = Convenience.getSettings();
    settings.connect('changed::show-seconds', Lang.bind(this, setSecondsDisplayed));
    
    clock = new GnomeDesktop.WallClock();
    button = new St.Bin({
        style_class: 'panel-button',
        reactive: true,
        can_focus: false,
        x_fill: true,
        y_fill: false,
        y_align: St.Align.MIDDLE,
        track_hover: true
    });
    label = new St.Label({
        text: '00:00 UTC',
        opacity: 200
    });

    button.set_child(label);
}

function enable() {
    log(`enabling ${Me.metadata.name} version ${Me.metadata.version}`);
    update_time();
    clock_signal_id = clock.connect('notify::clock', Lang.bind(this, this.update_time));
    Main.panel._centerBox.insert_child_at_index(button, 1);
    log(`${Me.metadata.name} enabled.`);
}

function disable() {
    log(`disabling ${Me.metadata.name} version ${Me.metadata.version}`);
    Main.panel._centerBox.remove_child(button);
    clock.disconnect(clock_signal_id);
    log(`${Me.metadata.name} disabled.`);
}

function update_time() {
    var now = new Date();
    now.setHours(now.getUTCHours());
    now.setMinutes(now.getUTCMinutes());
    label.set_text(seconds_displayed_format.format(now) + ' UTC');
}

function setSecondsDisplayed(displayed) {
    let secondsDisplayed = settings.get_boolean('show-seconds');
    seconds_displayed_format = secondsDisplayed ? format_with_seconds : format_without_seconds;
    update_time();
}