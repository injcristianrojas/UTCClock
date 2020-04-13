const St = imports.gi.St;
const Main = imports.ui.main;
const GnomeDesktop = imports.gi.GnomeDesktop;
const Lang = imports.lang;
const Shell = imports.gi.Shell;

let text, button, label;
let clock, clock_signal_id;

let seconds_displayed = false;

function init() {
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
    update_time();
    clock_signal_id = clock.connect('notify::clock', Lang.bind(this, this.update_time));
    Main.panel._centerBox.insert_child_at_index(button, 1);
}

function disable() {
    Main.panel._centerBox.remove_child(button);
    clock.disconnect(clock_signal_id);
}

function update_time() {
    var now = new Date();
    now.setHours(now.getUTCHours());
    now.setMinutes(now.getUTCMinutes());
    var format = new Intl.DateTimeFormat('default', {hour: 'numeric', minute: 'numeric', hour12: false});
    label.set_text(format.format(now) + ' UTC');
}
