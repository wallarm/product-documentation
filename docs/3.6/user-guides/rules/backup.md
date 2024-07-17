# Custom ruleset backup and restore

To protect yourself from accidentally misconfigured or deleted rules, you can backup your current custom ruleset.

There are the following rule backup options: 

* Automatic backup creation after each [custom ruleset build](compiling.md). The number of automatic backups is limited to 7: for each day when you change the rules several times, only the last backup is kept.
* Manual backup creation at any time. The number of manual backups is limited to 5 by default. If you need more, contact the [Wallarm technical support](mailto:support@wallarm.com) team.

You can:

* Access current backups: in the **Rules** section, click **Backups**.
* Create a new backup manually: in the **Backups** window, click **Create backup**.
* Set name and description for the manual backup and edit them at any moment.

    !!! info "Naming for automatic backups"
        The automatic backups are named by the system and cannot be renamed.

* Load from existing backup: click **Load** for the required backup. When loading from the backup, your current rule configuration is deleted and replaced with the configuration from the backup.
* Delete backup.

    ![Rules - Creating backup](../../images/user-guides/rules/rules-create-backup.png)

!!! warning "Rule modification restrictions"
    You cannot create or modify rules until creating backup or load from backup is complete.