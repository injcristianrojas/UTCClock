'use strict';

const St = imports.gi.St;
const Main = imports.ui.main;
const GnomeDesktop = imports.gi.GnomeDesktop;
const Lang = imports.lang;
const Shell = imports.gi.Shell;
const Util = imports.misc.util;
const Config = imports.misc.config;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

let text, button, label;
let clock, clock_signal_id;
let settings;

const format_with_seconds = new Intl.DateTimeFormat(
    'default',
    {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    }
);
const format_without_seconds = new Intl.DateTimeFormat(
    'default',
    {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    }
);
let seconds_displayed_format = format_without_seconds;
let shellMinorVersion = parseInt(Config.PACKAGE_VERSION.split('.')[1]);
let time_text = 'UTC';

function init() {
    settings = Convenience.getSettings();

    clock = new GnomeDesktop.WallClock();
    button = new St.Bin({
        style_class: 'panel-button',
        reactive: true,
        can_focus: false,
        x_fill: true,
        y_fill: false,
        y_align: shellMinorVersion < 36 ? St.Align.MIDDLE : St.Align.END,
        track_hover: true
    });

    label = new St.Label({
        text: '00:00 ' + time_text,
        opacity: 200
    });
    
    button.set_child(label);
}

function enable() {
    log_this(`enabling...`);

    settings.connect('changed::show-seconds', Lang.bind(this, setSecondsDisplayed));
    settings.connect('changed::time-text', Lang.bind(this, setTimeText));

    button.connect('button-press-event', showMenu);
    setSecondsDisplayed();
    setTimeText();

    update_time();
    clock_signal_id = clock.connect('notify::clock', Lang.bind(this, this.update_time));
    Main.panel._centerBox.insert_child_at_index(button, 1);
    log_this(`enabled.`);
}

function disable() {
    log_this(`disabling...`);

    settings.disconnect('changed::show-seconds');
    settings.disconnect('changed::time-text');
    button.disconnect('button-press-event');

    Main.panel._centerBox.remove_child(button);
    clock.disconnect(clock_signal_id);
    log_this(`disabled.`);
}

function update_time() {
    var now = new Date();
    now.setHours(now.getUTCHours());
    now.setMinutes(now.getUTCMinutes());
    label.set_text(seconds_displayed_format.format(now) + ' ' + time_text);
}

function setSecondsDisplayed() {
    let secondsDisplayed = settings.get_boolean('show-seconds');
    seconds_displayed_format = secondsDisplayed ? format_with_seconds : format_without_seconds;
    update_time();
}

function setTimeText() {
    let text = settings.get_string('time-text');
    time_text = text;
    update_time();
}

function showMenu() {
    Util.spawn([
        "gnome-shell-extension-prefs",
        Me.uuid
    ]);
}

function log_this(string) {
    log(`[${Me.metadata.name}-${Me.metadata.version}] ${string}`)
}