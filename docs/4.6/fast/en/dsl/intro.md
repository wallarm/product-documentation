[link-yaml]:            https://yaml.org/spec/1.2/spec.html
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-points]:          points/intro.md

# FAST DSL Overview

FAST provides users with a domain-specific language (DSL) for describing extensions. Now you can create custom extensions to detect vulnerabilities in your application without having any specific programming skills. The mechanism of extensions allows you to apply additional custom logic for processing baseline requests and searching vulnerabilities in the target application.

FAST extensions allow for generating security tests that are constructed either by modifying the selected parameters in a baseline request or by using a predefined payload. The generated security tests are then sent to the target application. The application's response to these tests is used to reach a conclusion about the presence or absence of vulnerabilities in the target application (FAST extensions also define the method of detecting vulnerabilities). 

The extensions are described using YAML. We assume that you are familiar with YAML syntax and YAML file structure. To see detailed information, proceed to this [link][link-yaml].

The logic of the extensions may include elements described with regular expressions. FAST expressions only support Ruby language regular expression syntax. It is assumed that you are familiar with the Ruby regular expression syntax. To see detailed information, proceed to this [link][link-ruby-regexp].

--8<-- "../include/fast/cloud-note.md"

  !!! info "Request element description syntax"
      When creating a FAST extension, you need to understand the structure of the HTTP request sent to the application and that of the HTTP response received from the application in order to correctly describe the request elements that you need to work with using the points. 

      To see detailed information, proceed to this [link][link-points].