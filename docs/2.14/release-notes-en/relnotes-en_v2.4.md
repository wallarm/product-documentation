# Wallarm Node — Version 2.4

## Changes Highlights

* Support of the `view state` format – a technique used by ASP.NET to persist changes to the state of a Web Form across postbacks. Now Wallarm can parse the unencrypted `view state` data, which allows for more flexible with .NET-applications by tuning blocking rules more precisely and thus providing more security for .NET-applications.

* Integrated the libdetection library. [libdetection](https://github.com/wallarm/libdetection) is a Wallarm-developed open‑source product that you can use to develop your own parsers to protect from injection attacks. This approach provides greater flexibility when compared to the traditional attack detection mechanisms based on regular expressions. libdetection allows non-signature based detection.

* New [LOM](../glossary-en.md#lom) format that reduces memory consumption for the filtering rules storage.

* Parsers' management for parameters. Now when describing the structure you can set required parser parameters, set the blacklist mode that allows all parsers except for the prohibited ones, and set the whitelist mode that allows all parsers excepted for the listed ones. The new structure provides stricter control.

    You can also set a required parser for a particular parameter. If the parser cannot process the set parameter, Wallarm will consider the parameter invalid.

* Improved brute-force attack detection algorithm.

* Improved NGINX-Wallarm memory consumption. The module improved by up to 30%.

!!! warning "Memory consumption on the first use"
    After updating the filter node to version 2.4 but before downloading the new LOM, the NGINX-Wallarm module memory consumption will exceed the regular levels.
    The memory consumption will go significantly down after downloading the new LOM.