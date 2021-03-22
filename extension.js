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

const log_this = Convenience.log_this;
const version_data = Convenience.version_data;
const isGnome40 = Convenience.isGnome40;

let text, button, label;
let clock, clock_signal_id;
let settings;

let signals = [];

let shellMinorVersion36 = parseInt(version_data[1]) < 36;

let format_params = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
}
let time_text = 'UTC';

function init() {
    settings = Convenience.getSettings();

    clock = new GnomeDesktop.WallClock();
    button = new St.Bin({
        style_class: 'panel-button',
        reactive: true,
        can_focus: false,
        x_expand: true,
        y_expand: false,
        y_align: shellMinorVersion36 ? St.Align.MIDDLE : St.Align.END,
        track_hover: true
    });

    label = new St.Label({
        opacity: 200
    });
    
    button.set_child(label);
    log_this(Config.PACKAGE_VERSION);
}

function enable() {
    log_this(`enabling...`);

    signals[0] = settings.connect('changed::show-seconds', Lang.bind(this, setSecondsDisplayed));
    signals[1] = settings.connect('changed::time-text', Lang.bind(this, setTimeText));
    signals[2] = settings.connect('changed::show-date', Lang.bind(this, setDateDisplayed));
    signals[3] = settings.connect('changed::light-opacity', Lang.bind(this, setLightOpacity));

    signals[4] = button.connect('button-press-event', showMenu);
    setSecondsDisplayed();
    setTimeText();
    setDateDisplayed();
    setLightOpacity();

    update_time();
    signals[5] = clock.connect('notify::clock', Lang.bind(this, this.update_time));
    Main.panel._centerBox.insert_child_at_index(button, 1);
    log_this(`enabled.`);
}

function disable() {
    log_this(`disabling...`);

    settings.disconnect(signals[0]);
    settings.disconnect(signals[1]);
    settings.disconnect(signals[2]);
    settings.disconnect(signals[3]);
    button.disconnect(signals[4]);

    Main.panel._centerBox.remove_child(button);
    clock.disconnect(signals[5]);
    log_this(`disabled.`);
}

function update_time() {
    var now = new Date();
    var utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    label.set_text(new Intl.DateTimeFormat('default', format_params).format(utc) + ' ' + time_text);
}

function setSecondsDisplayed() {
    let secondsDisplayed = settings.get_boolean('show-seconds');
    if (secondsDisplayed) {
        format_params['second'] = '2-digit';
    } else {
        delete format_params['second'];
    }
    update_time();
}

function setTimeText() {
    time_text = settings.get_string('time-text');
    update_time();
}

function setDateDisplayed() {
    let dateDisplayed = settings.get_boolean('show-date');
    if (dateDisplayed) {
        format_params['weekday'] = 'short';
        format_params['month'] = 'short';
        format_params['day'] = 'numeric';
    } else {
        delete format_params['weekday'];
        delete format_params['month'];
        delete format_params['day'];
    }
    update_time();
}

function setLightOpacity() {
    label.opacity = settings.get_boolean('light-opacity') ? 255 : 200;
    update_time();
}

function showMenu() {
    Util.spawn([
        "gnome-shell-extension-prefs",
        Me.uuid
    ]);
}
