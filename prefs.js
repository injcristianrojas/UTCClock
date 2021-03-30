'use strict';

const { GObject, Gtk, Gio } = imports.gi;
const Lang = imports.lang;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const log_this = Convenience.log_this;

const isGnome40 = Convenience.isGnome40;

const UTCClockSettingsBox = GObject.registerClass(
    class UTCClockSettingsBox extends Gtk.ScrolledWindow {

        _set_enabled() {
            if (this._seconds_settings.get_boolean('clock-show-seconds')) {
                this._settings.bind('show-seconds', this._builder.get_object('widget1'), 'active', Gio.SettingsBindFlags.DEFAULT);
                this._builder.get_object('image1').icon_name = null;
            } else {
                this._settings.set_boolean('show-seconds', false);
                this._builder.get_object('widget1').set_sensitive(false);
                this._builder.get_object('image1').icon_name = 'dialog-warning-symbolic';
                this._builder.get_object('image1').set_tooltip_text('Disabled. Go to GNOME Tweaks and enable Seconds in the "Top Bar" section to enable.');
            }
        }
        
        _init(params) {
            super._init(params);
            log_this('Opening preferences...');
    
            this._settings = Convenience.getSettings();
            this._seconds_settings = Convenience.getSettings('org.gnome.desktop.interface');
    
            this._builder = new Gtk.Builder();
            this._builder.set_translation_domain('gettext-domain');
            this._builder.add_from_file(Me.path + (isGnome40 ? '/prefs40.ui' : '/prefs.ui'));
    
            if (isGnome40)
                this.set_child(this._builder.get_object('main_prefs'));
            else
                this.add(this._builder.get_object('main_prefs'));
            
            this._signal = this._seconds_settings.connect('changed::clock-show-seconds', Lang.bind(this, this._set_enabled))
            this._set_enabled();
    
            this._settings.bind('time-text', this._builder.get_object('widget2'), 'active-id', Gio.SettingsBindFlags.DEFAULT);
            this._settings.bind('show-date', this._builder.get_object('widget3'), 'active', Gio.SettingsBindFlags.DEFAULT);
            this._settings.bind('light-opacity', this._builder.get_object('widget4'), 'active', Gio.SettingsBindFlags.DEFAULT);
        }
    }
);

function init() {
    ExtensionUtils.initTranslations('gnome-shell-extensions-extensions');
}

function buildPrefsWidget() {
    let box = new UTCClockSettingsBox();
    if (!isGnome40)
        box.show_all();
    return box;
}