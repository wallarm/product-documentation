# Notifications <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Notifications** is the feed of notable events: a new application brought under coverage, new
packages found, CVEs found or resolved, personal data detected in traffic, a scanner going offline. Some entries link to
the page where you follow up.

The sidebar item shows how many are unread.

<a id="layout"></a>
## What is on the screen

- **Type tabs** — **All**, **Apps**, **CVE**, **PII**.
- Filters — time: **48 hours**, **7 days**, **30 days**, **All history**; severity: **All
  severity**, **High only**; read state: **All**, **Unread only**; grouping: **Grouped** (similar
  entries combined) or **Individual**.
- A summary line: **N unread** (or **All read**) and how many of them are high or
  critical.
- **Mark all read** — marks all of your notifications as read,
  not only the ones in the current view.
- **Notify for** — **CVEs** (on by default), **Scan offline** (on), **PII** (off). Choose which
  kinds of entry count towards the unread number on the sidebar. Entries you switch off still
  appear in the feed, already marked as read. These settings are yours alone and save immediately.

An entry marks itself as read once it has been on screen for about a second and a half.

Each entry shows a title, the application and how long ago. Typical titles:

- *N PII events in &lt;app&gt; (email, ssn, …)*
- *New app discovered: &lt;app&gt; (N packages)*
- *N new CVEs found in &lt;app&gt;*
- *N CVEs resolved in &lt;app&gt;*
- *Scanner offline — N apps without coverage*

Expand an entry for details:

| Entry | Details and action |
|---|---|
| Personal data | The data types detected. **Traffic** opens the sessions where it was seen. |
| New CVEs | The vulnerabilities per package, with severity. Click a CVE id to open it in Supply Chain; **Supply Chain** opens the application's risk analysis. |
| New app | The packages found in its first scan. |
| Scanner offline | The applications without coverage, and **Check scanner pod health and pull secret status.** |
| CVEs resolved | The vulnerabilities per package that no longer appear. The same links as New CVEs; a resolved CVE that the application no longer has is reported as such on Supply Chain. |

### When this page is empty

A new workspace has no notifications. The first one usually appears when the scanner completes its
first scan of an application (**New app discovered**). See [Getting started](getting-started.md).

<a id="how-to-use-it"></a>
## How to use it

### Catch up
1. Set the time filter, for example **7 days**, and **Unread only**.
2. Use the type tabs to read one category at a time.
3. Click **Mark all read** when done.

### Follow up on an entry
Expand it. For personal data, click **Traffic**; for new CVEs, click a CVE id or **Supply Chain**.
Every link opens its page with the entry's application already selected.

<a id="navigation-out"></a>
## Where to go next

| From | You land in |
|---|---|
| Personal-data entry → **Traffic** | [Traffic](user-tracks.md), for that application |
| New-CVE entry → **Supply Chain** | [Supply Chain](supply-chain.md), at that application's risk analysis |
| New-CVE entry → a CVE id | [Supply Chain](supply-chain.md), that application, with the vulnerability's details open |

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Protect** → **Notifications** (with the unread count).
