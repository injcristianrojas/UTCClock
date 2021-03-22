all: clean build

PLUGIN_LOCATION = ~/.local/share/gnome-shell/extensions/utcclock@injcristianrojas.github.com

compile-schemas:
	glib-compile-schemas schemas/

build: compile-schemas
	zip utcclock.zip extension.js LICENSE metadata.json prefs.js prefs.ui prefs40.ui convenience.js schemas/*

install: compile-schemas
	mkdir -p $(PLUGIN_LOCATION)
	cp -R extension.js LICENSE metadata.json prefs.js prefs.ui prefs40.ui convenience.js schemas/ $(PLUGIN_LOCATION)
	echo 'Plugin installed. Restart GNOME Shell.'

uninstall:
	rm -rf $(PLUGIN_LOCATION)

reinstall: uninstall install

clean:
	rm -f *.zip