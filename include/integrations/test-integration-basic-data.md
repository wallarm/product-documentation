Integration testing allows checking configuration correctness, availability of the Wallarm Cloud, and the notification format. To test the integration, you can use the button **Test integration** when creating or editing the integration.

The integration is tested as follows:

* Test notifications with the prefix `[Test message]` are sent to the selected system.
* Test notifications cover the following events (each in a single record):

    * New user in the company account
    * Newly discovered IP in the company scope
    * New trigger in the company account
    * Newly discovered security vulnerability
* Test notifications include test data.
