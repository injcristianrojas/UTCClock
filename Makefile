all: clean build

PLUGIN_LOCATION = ~/.local/share/gnome-shell/extensions/utcclock@injcristianrojas.github.com

compile-schemas:
	glib-compile-schemas schemas/

build: compile-schemas
	zip utcclock.zip extension.js LICENSE metadata.json schemas/*

install: compile-schemas
	mkdir -p $(PLUGIN_LOCATION)
	cp -R extension.js LICENSE metadata.json schemas/ $(PLUGIN_LOCATION)
	echo 'Plugin installed. Restart GNOME Shell.'

uninstall:
	rm -rf $(PLUGIN_LOCATION)

reinstall: uninstall install

wayland_test:
	MUTTER_DEBUG_DUMMY_MODE_SPECS=1200x400 dbus-run-session -- gnome-shell --nested --wayland

clean:
	rm -f *.zip