# UTCClock

## Intro

I just wanted to see UTC time on my GNOME Shell desktop,
[just as mibus did](https://github.com/mibus/MultiClock).

## Install

### Automatic

Go to https://extensions.gnome.org/extension/1183/utcclock/ and turn on the
extension.

### Manual

```
git clone https://github.com/injcristianrojas/UTCClock.git
cd UTCClock
make install
```

Depending if you have Wayland or not, you may have to log out and then log back
in.

This method is good if you don't want to wait for GNOME Extensions approval.

## Support

This extension works for GNOME versions from 40 up. Support for earlier
versions has been dropped because of changes in GNOME's Javascript engine
(besides, [previous versions of GNOME are not supported since August 2021](https://github.com/giuspen/cherrytree/issues/1779)). 

If you need a version that supports GNOME 3.22 to 3.38, switch to the
[legacy](https://github.com/injcristianrojas/UTCClock/tree/legacy) branch 
and do a manual install.