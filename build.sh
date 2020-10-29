#!/usr/bin/env bash

glib-compile-schemas schemas/
zip utcclock.zip extension.js LICENSE metadata.json prefs.js prefs_window.js convenience.js schemas/*
cp -R extension.js LICENSE metadata.json prefs.js prefs_window.js convenience.js schemas/* ~/.local/share/gnome-shell/extensions/utcclock@injcristianrojas.github.com
