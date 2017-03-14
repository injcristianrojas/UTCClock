
const St = imports.gi.St;
const Main = imports.ui.main;
const GnomeDesktop = imports.gi.GnomeDesktop;
const Lang = imports.lang;

let text, button, label;
let counter = 0;

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    label = new St.Label({text: '00:00 UTC', opacity: 200});

    button.set_child(label);
}

function enable() {
    Main.panel._centerBox.insert_child_at_index(button, 1);
    clock_this();
}

function disable() {
    Main.panel._centerBox.remove_child(button);
}

function clock_this() {
    let clock = new GnomeDesktop.WallClock();
    let clock_signal_id = clock.connect('notify::clock', Lang.bind(this, this.update_time));
}

function update_time() {
    counter++;
    label.set_text('' + counter);
}
