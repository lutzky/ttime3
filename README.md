# ttime3 [![Build Status](https://travis-ci.org/lutzky/ttime3.svg?branch=master)](https://travis-ci.org/lutzky/ttime3)

TTime3 is a web app intended to help Technion students build a timetable. Report bugs at https://github.com/lutzky/ttime3/issues. Developer instructions are at [CONTRIBUTING.md](CONTRIBUTING.md).

Usage:

1. Add courses from the Catalog
1. Select filters in Settings
1. Under Schedules, click Generate Schedules

## Data source

The catalog data comes from a [hosted REPY parser](https://repy-176217.appspot.com/). You can see there that the Technion updates this file every couple of days, and we keep a version history. By default, ttime loads the *latest* version. To view an older version, in the Settings tab, modify the catalog URL to point at the desired JSON file.

The maintainers of ttime do not control nor verify the REPY data - it's downloaded directly from the Technion. We're looking into other potential data sources as well, see #12.

## History

TTime3 is rewritten from [TTime](http://github.com/lutzky/ttime), or ttime1. TTime1 was written circa 2008 by Haggai Jacobson, Boaz Goldstein and Ohad Lutzky, using Ruby-GTK, primarily for Linux (which the authors used) but released also for Windows. Releasing for Windows was a manual effort performed once (by Boaz) and was hard to reproduce. Releasing for Debian/Ubuntu was easier, but also required manual work to keep compatibility with the latest distribution updates, and didn't support other distributions. There was an attempt to [rewrite it in Java](https://github.com/lutzky/ttime/tree/java), hoping to hand off ownership to a Technion software lab (where Java is a more prominent language) and to break compatibility less often. However, this was abandoned, as over time the concept of "installing a desktop app locally just to try it" fell out of fashion, and doing things within the browser became more feasible. Web workers could be used to perform the more CPU-intensive bits of ttime (schedule generation), and it became feasible to make a fully hosted web-based version of ttime, meaning the users wouldn't have to install or update anything other than a browser to use it.

TTime1, in turn, was a reboot of UDonkey-mono, an attempt to get [UDonkey](http://www.udonkey.com) to run on Linux - this was thought to be a good idea because Mono could, theoretically, run .Net binaries with minimal modification; this wasn't the case with UDonkey, unfortunately, and a full rewrite proved to be much more performant and also quite popular.

UDonkey, in turn, is a rewrite of Marprog for Windows, which is presumably an updated version of Marprog for DOS. The reason ttime came to be was that marprog (both versions) were annoying or impossible to run on Linux.
