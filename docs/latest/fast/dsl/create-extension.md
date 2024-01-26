[link-points]:          points/intro.md
[link-detect]:          detect/phase-detect.md
[link-collect]:         phase-collect.md
[link-match]:           phase-match.md
[link-modify]:          phase-modify.md
[link-send]:            phase-send.md
[link-generate]:        phase-generate.md
[link-extensions]:      using-extension.md
[link-ext-logic]:       logic.md
[link-vuln-list]:       ../vuln-list.md

[img-vulns]:            ../../images/fast/dsl/en/create-extension/vulnerabilities.png
[img-vuln-details]:     ../../images/fast/dsl/en/create-extension/vuln_details.png

[anchor-meta-info]:     #structure-of-the-meta-info-section

# The Creation of FAST Extensions

!!! info "Request elements description syntax"
    When creating a FAST extension, you need to understand the structure of the HTTP request sent to the application and that of the HTTP response received from the application in order to correctly describe the request elements that you need to work with using the points. 

    To see detailed information, proceed to this [link][link-points].

The FAST extensions are created by describing all of the sections that are required for the extension to operate in the corresponding YAML file. Extensions of a different type use their own set of sections ([detailed information about the extension types][link-ext-logic]).

##  The Sections in Use

### Modifying Extension

This type of extension makes use of the following sections:
* The obligatory sections:
    * `meta-info`—contains information about the vulnerability that is to be discovered by the extension. The structure of this section is described [below][anchor-meta-info].
    * `detect`—contains a description of the obligatory Detect phase. To see detailed information about this phase and the structure of the corresponding section, proceed to this [link][link-detect].
* The optional sections (may be absent):
    * `collect`—contains a description of the optional Collect phase. To see detailed information about this phase and the structure of the corresponding section, proceed to this [link][link-collect].
    * `match`—contains a description of the optional Match phase. To see detailed information about this phase and the structure of the corresponding section, proceed to this [link][link-match].
    * `modify`—contains a description of the optional Modify phase. To see detailed information about this phase and the structure of the corresponding section, proceed to this [link][link-modify].
    * `generate`—contains a description of the optional Generate phase. To see detailed information about this phase and the structure of the corresponding section, proceed to this [link][link-generate].


### Nonmodifying Extension

This type of extension makes use of the following obligatory sections:
* `meta-info`—contains information about the vulnerability that is to be discovered by the extension. The structure of this section is described [below][anchor-meta-info].
* `send`—contains predefined test requests to be sent to a host that is listed in a baseline request. To see detailed information about this phase and the structure of the corresponding section, proceed to this [link][link-send].
* `detect`—contains a description of the obligatory Detect phase. To see detailed information about this phase and the structure of the corresponding section, proceed to this [link][link-detect].


##  Structure of the `meta-info` Section

The informational `meta-info` section has the following structure:

```
meta-info:
  - title:
  - type:
  - threat:
  - description:
```

* `title` — an optional title string that describes a vulnerability. The specified value will be shown in the list of the detected vulnerabilities on the Wallarm web interface in the “Title” column. It can be used to identify either the vulnerability or the certain extension that detected the vulnerability.

    ??? info "Example"
        `title: "Example vulnerability"`

* `type` — an obligatory parameter that describes the type of vulnerability that the extension is trying to exploit. The specified value will be shown in the “Type” column of the list of detected vulnerabilities on the Wallarm web interface. The parameter can The parameter can take one of the values which are described [here][link-vuln-list].
   
    ??? info "Example"
        `type: sqli`    

* `threat` — optional parameter that defines the vulnerability threat level. The specified value will be graphically displayed in the list of the detected vulnerabilities on the Wallarm web interface in the “Risk” column. The parameter can be assigned an integer value in a range from 1 to 100. The larger the value, the higher the threat level of the vulnerability. 

    ??? info "Example"
        `threat: 20`
    
    ![The list of the vulnerabilities found][img-vulns]

* `description` — optional string parameter that contains the description of the vulnerability that the extension detects. This information will be shown in the detailed description of the vulnerability.
    
    ??? info "Example"
        `description: "A demonstrational vulnerability"`    
    
    ![Detailed description of the vulnerability on the Wallarm web interface][img-vuln-details]

!!! info "Plugging in FAST extensions"
    To plug an extension to FAST, you need to mount the directory containing the extension's YAML file to the FAST node Docker container. To see detailed information about the mounting procedure, navigate to this [link][link-extensions].