'use strict';

const Clutter = imports.gi.Clutter;
const ExtensionUtils = imports.misc.extensionUtils;
const GnomeDesktop = imports.gi.GnomeDesktop;
const GObject = imports.gi.GObject;
const Main = imports.ui.main;
const Me = ExtensionUtils.getCurrentExtension();
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;
const getSettings = ExtensionUtils.getSettings;

let UTCClock = GObject.registerClass(
    class UTCCLock extends PanelMenu.Button {

        _init() {
            super._init(0, 'UTCClock', false);

            // Label
            this.timeText = new St.Label({
                y_align: Clutter.ActorAlign.CENTER,
                text: '...'
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
                    'default', this.format_params
                ).format(utc) + ' ' + this.time_text
            );
        }

        setSecondsDisplayed() {
            let secondsDisplayed = this.settings.get_boolean('show-seconds');
            if (secondsDisplayed) {
                this.format_params['second'] = '2-digit';
            } else {
                delete this.format_params['second'];
            }
            this.updateTime();
        }

        setTimeText() {
            this.time_text = this.settings.get_string('time-text');
            this.updateTime();
        }

        setDateDisplayed() {
            let dateDisplayed = this.settings.get_boolean('show-date');
            if (dateDisplayed) {
                this.format_params['weekday'] = 'short';
                this.format_params['month'] = 'short';
                this.format_params['day'] = 'numeric';
            } else {
                delete this.format_params['weekday'];
                delete this.format_params['month'];
                delete this.format_params['day'];
            }
            this.updateTime();
        }

        setLightOpacity() {
            this.timeText.opacity =
                this.settings.get_boolean('light-opacity') ? 200 : 255;
            this.updateTime();
        }

        buildMenu() {
            this.ClockMenuItemSeconds = new PopupMenu.PopupSwitchMenuItem(
                'Show seconds',
                this.settings.get_boolean('show-seconds'),
                { reactive: true }
            );
            this.menuSignal1 = this.ClockMenuItemSeconds.connect('toggled', (_object, value) => {
                this.settings.set_boolean('show-seconds', value);
            });
            this.menu.addMenuItem(this.ClockMenuItemSeconds);

            this.ClockMenuItemText = new PopupMenu.PopupSubMenuMenuItem(
                'Time text to show'
            );
            this.PopupMenuItemUTC = new PopupMenu.PopupMenuItem('UTC');
            this.menuSignal2 = this.PopupMenuItemUTC.connect('activate', () => {
                this.settings.set_string('time-text', 'UTC');
            });
            this.ClockMenuItemText.menu.addMenuItem(this.PopupMenuItemUTC);
            this.PopupMenuItemGMT = new PopupMenu.PopupMenuItem('GMT');
            this.menuSignal3 = this.PopupMenuItemGMT.connect('activate', () => {
                this.settings.set_string('time-text', 'GMT');
            });
            this.ClockMenuItemText.menu.addMenuItem(this.PopupMenuItemGMT);
            this.PopupMenuItemZ = new PopupMenu.PopupMenuItem('Z');
            this.menuSignal4 = this.PopupMenuItemZ.connect('activate', () => {
                this.settings.set_string('time-text', 'Z');
            });
            this.ClockMenuItemText.menu.addMenuItem(this.PopupMenuItemZ);
            this.menu.addMenuItem(this.ClockMenuItemText);

            this.ClockMenuItemDate = new PopupMenu.PopupSwitchMenuItem(
                'Show date',
                this.settings.get_boolean('show-date'),
                { reactive: true }
            );
            this.menuSignal5 = this.ClockMenuItemDate.connect('toggled', (_object, value) => {
                this.settings.set_boolean('show-date', value);
            });
            this.menu.addMenuItem(this.ClockMenuItemDate);

            this.ClockMenuItemOpacity = new PopupMenu.PopupSwitchMenuItem(
                'Light opacity',
                this.settings.get_boolean('light-opacity'),
                { reactive: true }
            );
            this.menuSignal6 = this.ClockMenuItemOpacity.connect('toggled', (_object, value) => {
                this.settings.set_boolean('light-opacity', value);
            });
            this.menu.addMenuItem(this.ClockMenuItemOpacity);
            this.menuSignal7 = this.connect('button-press-event', () => {
                if (this.gnomeSecondsSettings.get_boolean('clock-show-seconds'))
                    this.ClockMenuItemSeconds.set_reactive(true);
                else {
                    this.ClockMenuItemSeconds._switch.state = false;
                    this.ClockMenuItemSeconds.set_reactive(false);
                }
            });
        }

        enable() {
            this.time_text = 'UTC';

            this.format_params = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }

            /*
            12-hour:

            this.format_params = {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }
            */
            
            this.settings = getSettings();
            this.gnomeSecondsSettings = getSettings(
                'org.gnome.desktop.interface'
            );

            this.gnomeSecondsSignal =  this.gnomeSecondsSettings.connect('changed::clock-show-seconds', () => {
                if (!this.gnomeSecondsSettings.get_boolean('clock-show-seconds')) {
                    this.settings.set_boolean('show-seconds', false);
                    this.setSecondsDisplayed();
                }
            });

            this.settingsSignals = [];

            this.clock = new GnomeDesktop.WallClock();
            this.clockSignal = this.clock.connect(
                'notify::clock',
                this.updateTime.bind(this)
            );

            if (!this.gnomeSecondsSettings.get_boolean('clock-show-seconds'))
                this.settings.set_boolean('show-seconds', false);
            this.setSecondsDisplayed();
            this.settingsSignals[0] = this.settings.connect(
                'changed::show-seconds',
                this.setSecondsDisplayed.bind(this)
            );

            this.setTimeText();
            this.settingsSignals[1] = this.settings.connect(
                'changed::time-text',
                this.setTimeText.bind(this)
            );

            this.setDateDisplayed();
            this.settingsSignals[2] = this.settings.connect(
                'changed::show-date',
                this.setDateDisplayed.bind(this)
            );

            this.setLightOpacity();
            this.settingsSignals[3] = this.settings.connect(
                'changed::light-opacity',
                this.setLightOpacity.bind(this)
            );

            this.buildMenu();
            this.log_this('Enabled.');
        }

        disable() {
            this.clock.disconnect(this.clockSignal);
            this.gnomeSecondsSettings.disconnect(this.gnomeSecondsSignal);
            this.settings.disconnect(this.settingsSignals[0]);
            this.settings.disconnect(this.settingsSignals[1]);
            this.settings.disconnect(this.settingsSignals[2]);
            this.settings.disconnect(this.settingsSignals[3]);
            this.ClockMenuItemSeconds.disconnect(this.menuSignal1);
            this.PopupMenuItemUTC.disconnect(this.menuSignal2);
            this.PopupMenuItemGMT.disconnect(this.menuSignal3);
            this.PopupMenuItemZ.disconnect(this.menuSignal4);
            this.ClockMenuItemDate.disconnect(this.menuSignal5);
            this.ClockMenuItemOpacity.disconnect(this.menuSignal6);
            this.disconnect(this.menuSignal7);
            this.log_this('Disabled.');
        }

        log_this(string) {
            log(`[${Me.metadata.name}-${Me.metadata.version}] ${string}`);
        }
    }
);

let utcclock;

function init() {
    // Intentional
}

function enable() {
    utcclock = new UTCClock();
    Main.panel._addToPanelBox('utcclock', utcclock, 1, Main.panel._centerBox);
}

function disable() {
    utcclock.disable();
    utcclock.destroy();
    utcclock = null;
}