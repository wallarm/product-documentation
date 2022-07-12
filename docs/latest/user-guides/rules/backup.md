# Custom ruleset backup and restore

To protect yourself from accidentally misconfigured or deleted rules, you can backup your current custom ruleset. There are two options: 

* Automatic backup creation after each [custom ruleset build](compiling.md).
* Manual backup creation at any time. Your subscription defines the number of available backup slots.

You can:

* Access current backups: in the **Rules** section, click **Backups**.
* Create new backup manually: in the **Backups** window, click **Create backup**.
* Load from existing backup: click **Load** for the required backup.

    * When loading from backup, your current rule configuration is deleted and replaced with the configuration from the backup.
    * You cannot create or modify rules until load from backup is complete.

* Rename backup and/or change its description. The ruleset itself does not change.
* Delete backup.
