### Custom ruleset building

Adding a new rule/mitigation control, deleting or changing existing ones in the Wallarm Console → **Security Controls** →  **Rules** or **Mitigation Controls** launch a custom ruleset build. During the building process, rules and controls are optimized and compiled into a format adopted for the filtering node. The process of building a custom ruleset typically takes from a few seconds for a small number of rules to up to an hour for complex rule trees.

### Uploading to filtering node

Custom ruleset build is uploaded to the filtering node during the filtering node and Wallarm Cloud synchronization. By default, synchronization of the filtering node and Wallarm Cloud is launched every 2‑4 minutes. [More details on the filtering node and Wallarm Cloud synchronization configuration →](../../admin-en/configure-cloud-node-synchronization-en.md)

The status of uploading a custom ruleset to the filtering node is logged to the `/opt/wallarm/var/log/wallarm/wcli-out.log` file.

All Wallarm nodes connected to the same Wallarm account receive the same set of default and custom rules for traffic filtering. You still can apply different rules for different applications by using proper application IDs or unique HTTP request parameters like headers, query string parameters, etc.

### Backup and restore

To protect yourself from accidentally misconfigured or deleted rules, you can backup your current custom ruleset.

There are the following rule backup options: 

* Automatic backup creation after each [custom ruleset build](#custom-ruleset-building). The number of automatic backups is limited to 7: for each day when you change the rules several times, only the last backup is kept.
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
    You cannot create or modify rules or mitigation controls until creating backup or load from backup is complete.
