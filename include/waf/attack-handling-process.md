To detect and handle attacks, Wallarm uses the following process:

1. Checks [IP lists][ip-lists-link] and [Session lists][ip-sessions-link] to understand whether to process the request at all. Denylist blocks the request and allowlist allows it - both without further analysis.
1. Determines the request format and [parse][parsing-requests-link] every request part to apply [basic detectors][basic-detectors-link].
1. Determines the endpoint the request is addressed to apply [custom rules][custom-rules-link]/[mitigation controls][mc-link] and [specific module settings][specific module settings-link] and understand the [filtration mode][filtration-mode-link].
1. Makes a decision whether the request is a part of attack or not based on basic detectors, custom rules and specific module settings.
1. Handles request in accordance with decision and filtration mode.

![Attack handling process - diagram][attack-handling-process-img]

Note that rules, mitigation controls, settings and filtration mode can be inherited from the parent endpoint or [application][applications-link]. More specific has priority.