When there are several triggers with identical conditions and some of them have nesting level URI, requests to lower nesting level URI will be counted only in the trigger with the filter by the lower nesting level URI.

!!! info "Trigger's condition"
    Trigger's condition defines a situation when a trigger should be applied. For example: **Brute force**, **Forced browsing**, **BOLA**. It is selected at the fist step of a new trigger creation.

Triggers without URI filter are considered to be the higher nesting level.

**Example:**

* The first trigger with some condition has no filter by the URI (requests to any application or its part are counted by this trigger).
* The second trigger with the same condition has the filter by the URI `example.com/api`.

Requests to `example.com/api` are counted only by the second trigger with the filter by `example.com/api`.