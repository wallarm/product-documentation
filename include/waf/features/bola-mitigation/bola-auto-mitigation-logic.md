Once BOLA protection is enabled, Wallarm:

1. Identifies API endpoints that are most likely to be the target of BOLA attacks, e.g. those with [variability in path parameters][variability-in-endpoints-docs]: `domain.com/path1/path2/path3/{variative_path4}`.

    !!! info "This stage takes a period of time"
        Identification of vulnerable API endpoints takes a period of time required for deep observation of discovered API structure and incoming traffic trends.
    
    Only API endpoints explored by the **API Discovery** module are protected against the BOLA attacks in the automated way. Protected endpoints are [highlighted with the corresponding icon][bola-protection-for-endpoints-docs].
1. Protects vulnerable API endpoints against BOLA attacks. The default protection logic is the following:

    * Requests to a vulnerable endpoint exceeding the 50 requests threshold from the same IP per 30 sec are considered BOLA attacks.
    * Only register BOLA attacks in the event list when the threshold of requests from the same IP is reached. Wallarm does not block BOLA attacks. Requests will keep going to your applications.

        The corresponding reaction in the autoprotection template is **Monitoring**.
1. Reacts to [changes in API structure][changes-in-api-structure-docs] by protecting new vulnerable endpoints and deleting triggers for removed endpoints.
