# Wallarm User Acceptance Testing Checklist

This section provides you with a checklist to ensure your Wallarm instance operates correctly.

| Operation                                                                                                                                                        | Expected behavior                   | Check  |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|--------|
| [Wallarm node detects attacks](#wallarm-node-detects-attacks)                                                                     | Attacks are detected                |        |
| [You can log into the Wallarm interface](#you-can-log-into-the-wallarm-interface)                                                 | You can log in                      |        |
| [Wallarm interface shows requests per second](#wallarm-interface-shows-requests-per-second)                                       | You see the requests stats          |        |
| [Wallarm marks requests as false and stops blocking them](#wallarm-marks-requests-as-false-and-stops-blocking-them)               | Wallarm does not block the requests |        |
| [Wallarm detects vulnerabilities and creates security incidents](#wallarm-detects-vulnerabilities-and-creates-security-incidents) | Security incidents are created      |        |
| [Wallarm detects perimeter](#wallarm-detects-perimeter)                                                                                   | Scope is discovered                 |        |
| [IP allowlisting, denylisting, and graylisting work](#ip-allowlisting-denylisting-and-graylisting-work)                                                                                         | IP addresses are blocked            |        |
| [Users can be configured and have proper access rights](#users-can-be-configured-and-have-proper-access-rights)                   | Users can be created and updated    |        |
| [User activity log has records](#user-activity-log-has-records)                                                                   | The log has records                 |        |
| [Reporting works](#reporting-works)                                                                                               | You receive reports                 |        | |


## Wallarm Node Detects Attacks

1. Send a malicious request to your resource:

   ```
   http://<resource_URL>/etc/passwd
   ```

2. Run the following command to check if the attack count increased:

   ```
   curl http://127.0.0.8/wallarm-status
   ```

See also [Checking the filter node operation](installation-check-operation-en.md)

## You Can Log into the Wallarm Interface

1.  Proceed to the link that corresponds to the cloud you are using: 
    *   If you are using the US cloud, proceed to the <https://us1.my.wallarm.com> link.
    *   If you are using the EU cloud, proceed to the <https://my.wallarm.com/> link.
2.  See if you can log in successfully.

See also the [Threat Prevention Dashboard overview](../user-guides/dashboards/threat-prevention.md).

## Wallarm Interface Shows Requests per Second

1. Send a request to your resource:

   ```
   curl http://<resource_URL>
   ```

   Or send several requests with a bash script:

   ```
   for (( i=0 ; $i<10 ; i++ )) ;
   do 
      curl http://<resource_URL> ;
   done
   ```

   This example is for 10 requests.

2. Check if the Wallarm interface shows detected requests per second.

See also the [Threat Prevention Dashboard](../user-guides/dashboards/threat-prevention.md).

## Wallarm Marks Requests as False and Stops Blocking them

1. Expand an attack on the *Attacks* tab. 
2. Select a hit and click *False*.
3. Wait for around 3 minutes.
4. Resend the request and check if Wallarm detects it as an attack and blocks it.

See also [Working with false attacks](../user-guides/events/check-attack#false-positives).

## Wallarm Detects Vulnerabilities and Creates Security Incidents

1. Ensure you have an open vulnerability on your resource.
2. Send a malicious request to exploit the vulnerability.
3. Check if there is an incident detected in the Wallarm interface.

See [Checking Incidents](../user-guides/events/check-incident.md).

## Wallarm Detects Perimeter

1. On the *Scanner* tab, add your resource's domain.
2. Check if Wallarm discovers all resources associated with the added domain.

See also [Working with the scanner](../user-guides/scanner.md).

## IP allowlisting, denylisting, and graylisting work

1. Learn[ core logic of IP lists](../user-guides/ip-lists/overview.md).
2. Add IP addresses to the [allowlist](../user-guides/ip-lists/overview.md), [denylist](../user-guides/ip-lists/overview.md), and [graylist](../user-guides/ip-lists/overview.md).
3. Check that the filtering node correctly processes requests originated from IPs added to the lists.

## Users Can Be Configured and Have Proper Access Rights

1. Ensure you have the *Administrator* role in the Wallarm system.
2. Create, change role, disable, and delete a user as described in [Configuring users](../user-guides/settings/users.md).

See also [Configuring users](../user-guides/settings/users.md).

## User Activity Log Has Records

1. Go to *Settings* –> *Users*.
2. Check that *User Activity Log* has records.

See also [User activity log](../user-guides/settings/audit-log.md).

## Reporting Works

1. On the *Attacks* tab, put in a search query.
2. Click the report button on the right.
3. Put in your email and click the report button again.
5. Check if you receive the report.

See also [Creating a custom report](../user-guides/search-and-filters/custom-report.md).
