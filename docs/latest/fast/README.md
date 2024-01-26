---
description: Wallarm's (FAST) is a purpose-built tool that identifies vulnerabilities in web applications by generating and executing automated security tests.
---

[link-agreements]:      agreements.md

#   Wallarm FAST Overview

Wallarm's Framework for API Security Testing (FAST) is a purpose-built tool that allows you to reveal vulnerabilities in web applications by generating and executing security tests in an automatic way. SQL injections and XSS are examples of such vulnerabilities.

A FAST node, which redirects HTTP and HTTPS requests to the target application, is a core component of the solution. It intercepts requests to the target application and constructs a security test set by modifying the original requests. This is possible due to the incorporation of fuzzing techniques and a vulnerabilities knowledge base directly into the FAST node. The node can obtain queries from a wide range of sources. For example, an existing automated test set could serve as the query source for FAST.

A testing policy defines the parameters of the security test generation process. Such policies are created using Wallarm Cloud, another component of the solution. The cloud provides the user with an interface for creating test policies, managing the test execution process and observing the testing results.

After getting the security test set ready, the FAST node will execute the test set by sending the requests to the target application and will give a conclusion regarding the existence of certain vulnerabilities. 

Given the automatization capabilities combined with the built-in vulnerabilities knowledge base, FAST is a suitable tool for DevOps, security experts, software developers and QA engineers. With FAST, it is possible to use the security experts' deep knowledge to construct security testing policies, while giving developers with no expertise in the security field a way to automate security test generation and execution. Therefore, both groups of team members could effectively communicate in an asynchronous way with each other. The FAST architecture allows integrating security test generation and execution processes into the existing CI/CD process, so that the overall quality of software being developed can be increased.

--8<-- "../include/fast/cloud-note-readme.md"

!!! info "Text formatting conventions"
    This guides contain a variety of text strings and commands that need to be entered or run to get the desired result. For your convenience, all of them are formatted according to the text formatting conventions. To see the conventions, proceed to this [link][link-agreements].

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/Me4o4v7dPyM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>