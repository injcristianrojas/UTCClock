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

This extension works for GNOME versions from 45 up.

If you need a version that supports GNOME 3.22 to 3.38, switch to the
`legacy` branch. For GNOME 40 to 44, switch to the `gnome_40_44` branch and do a manual install.