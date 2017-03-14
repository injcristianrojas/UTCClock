
const St = imports.gi.St;
const Main = imports.ui.main;

let text, button;

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    let label = new St.Label({text: '00:00 UTC', opacity: 200});

    button.set_child(label);
}

function enable() {
    Main.panel._centerBox.insert_child_at_index(button, 1);
}

function disable() {
    Main.panel._centerBox.remove_child(button);
}
