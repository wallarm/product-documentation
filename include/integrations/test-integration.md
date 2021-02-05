Integration testing allows checking configuration correctness, availability of the Wallarm Cloud, and the notification format. To test the integration, you can use the button **Test integration** when creating or editing the integration.

The integration is tested as follows:

* Test notifications with the prefix `[Test Message]` are sent to the selected system.
* Test integrations are sent for all events available for the selected system. If the integration card includes 3 event types, the system will receive 3 test notifications.

    If the integration card includes the event type **System related**, an appropriate test notification includes details on the newly added user.
* Test notifications include test data.
