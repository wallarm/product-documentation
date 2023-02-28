[link-cwe-about]:       https://cwe.mitre.org/about/index.html

[img-scanner-settings]:    ../../images/user-guides/scanner/configure-scanner.png
[img-scanner-modules]:      ../../images/user-guides/scanner/modules-overview.png
[img-filter-modules]:       ../../images/user-guides/scanner/filter-modules.png


# Configuring Scanner Modules <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Click the *Configure* link under the scanner toggle to configure the scanner.

![!Scanner settings][img-scanner-settings]

## Configuring the Vulnerabilities Detection List

The scanner consists of multiple modules each responsible for detecting a certain type of vulnerability. The full modules list is specified in the “Configure Scanner” menu.

![!Configuring scanner modules][img-scanner-modules]

### Filtering Modules by Tag

You can filter modules by their tags, which are grouped by type:
*   The vulnerability type—tags for different vulnerability types, such as Remote Code Execution, Path Traversal, or Cross‑Site Scripting.
*   The vulnerable technology—tags for different technologies and software, that if used may cause a vulnerability detection. 
*   The presence of the vulnerability in the Common Vulnerabilities and Exposures (CVE) database—such vulnerabilities contain the `CVE` tag.

To filter the scanner modules by tag, perform the following actions:
1.  Click the *Filter by tag* field.
2.  In the drop-down list that appears the tags are grouped by their type. Select the desired tags by clicking them. 

    You can remove a tag from the filtering field by clicking the tick next to the tag name.
    
!!! info "Filtering by multiple tags"
    If the filtering field contains multiple tags, the result will consist of only those modules that are marked with all of the specified tags.

After you filter the modules by tag, the Wallarm interface displays the total number of the modules that correspond with the specified tags and the number of the filtered modules that correspond with each of the vulnerability classes in the [Common Weakness Enumeration (CWE)][link-cwe-about].

Now you can disable all of the filtered modules at once by clicking the toggle next to the *Modules found* label.

You can also disable all of the filtered modules that correspond with a certain vulnerability class by clicking the necessary toggle.

![!Filtering scanner modules by tags][img-filter-modules]

###  Disabling and Enabling All Modules

You can disable or enable all of the modules at once by clicking the *All modules* toggle that is available when no tags are selected in the filtering field.

### Disabling and Enabling All Modules Detecting Certain Classes of Vulnerabilities

In the left column, all of the modules are grouped in accordance with the [CWE][link-cwe-about]. You can disable and enable all modules that detect vulnerabilities of a certain class by clicking the corresponding toggle.

### Disabling and Enabling Individual Modules

 In the right column, all of the modules are filtered according to the filtering field. Here you can individually enable and disable modules.
 
### Disabling and Enabling Vulnerability Rechecking

During the active vulnerability check, the scanner restarts tests to check whether the previously detected vulnerabilities are still present.

If a previously detected vulnerability is not found after the recheck, the scanner marks it as resolved.

You can disable or enable vulnerability rechecking using the *Recheck vulnerabilities* toggle.

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/qJ1evgbDMLA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->
