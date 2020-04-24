[link-managing-nodes]:  create-node.md

[img-ticket-nodes]:       ../../images/user-guides/nodes/ticket-nodes.png
[img-table-nodes]:       ../../images/user-guides/nodes/table-nodes.png


# Nodes Overview

You can check existing nodes and edit the nodes list on the *Nodes* tab of the Wallarm interface. 

If you are working with multiple Wallarm products (e.g., WAF and FAST), the information on nodes will be displayed in tabs, which correspond to each of the products. You can navigate between the nodes of the products by clicking these tabs.

## Tickets Nodes Display

If you have less than 10 nodes, the information on them will be displayed in tickets.

![!Tickets nodes display][img-ticket-nodes]

### Filter Nodes

Each ticket in the *WAF nodes* tab contains the following information:
* The name that was given to the node upon creation.
* The node's universally unique identifier (only for nodes that are not installed on the cloud).
* The number of active nodes and the total number of nodes connected with a single token (only for nodes that are installed on the cloud).
* The node's creation date.
* Last synchronization date or time.
* The average number of requests per second received by the node in one minute.
* The *Copy token* link. Upon pressing this link, the node token is copied to the clipboard (only for nodes that are installed on the cloud).

If the node was installed on the cloud, the cloud icon will be shown next to the node's name.

### FAST Nodes

Each ticket in the *FAST nodes* tab contains the following information:
* The name that was given to the node upon creation.
* The node's creation date.
* The *Copy token* link. Upon pressing this link, the node token is copied to the clipboard.

If the node was installed on the cloud, the cloud icon will be shown next to the node's name.

## Table Nodes Display

If you have 10 or more nodes, the information on them will be displayed in tables.

![!Table nodes display][img-table-nodes]

### Filter Nodes

The *WAF nodes* table displays information in the following columns:

* *Hostname*: the name that was given to the node upon creation.
  * The number of active nodes is displayed in small-sized grey font, if multiple nodes were grouped into one entry in the table.
* *RPS*: the average number of requests per second received by the node in one minute.
* *Requests this month*: the number of requests received by the node in the current month.
* *IP*: the node's IP address.
* *Node UUID*: the universally unique identifier of the node (only for nodes that are not installed on the cloud).
* *Synced*: the last synchronization date or time.
* *Installed*: the node's creation date.
* *Actions*: the menu button containing possible operations for the node.

If the node was installed on the cloud, the cloud icon will be shown next to the node's name.

### FAST Nodes

The *FAST nodes* table displays information in the following columns:

* *Hostname*: the name that was given to the node upon creation.
* *Token*: the token that was generated for the node.
* *IP*: the node's IP address.
* *Installed*: the node's creation date.
* *Actions*: the menu button containing possible operations for the node.

If the node was installed on the cloud, the cloud icon will be shown next to the node's name.

!!! info "See also"
    [Creating and managing nodes][link-managing-nodes]
