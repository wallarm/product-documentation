Starting from the version 3.6, you can fine-tune the `overlimit_res` attack detection using the rule in Wallarm Console.

Earlier, the [`wallarm_process_time_limit`][nginx-process-time-limit-docs] and [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX directives have been used. The listed directives are considered to be deprecated with the new rule release and will be deleted in future releases.

If the `overlimit_res` attack detection settings are customized via the listed directives, it is recommended to transfer them to the rule as follows:

1. Open Wallarm Console → **Rules** and proceed to the [**Limit request processing time**][overlimit-res-rule-docs] rule setup.
1. Configure the rule as done via the NGINX directives:

    * The rule condition should match the NGINX configuration block with the `wallarm_process_time_limit` and `wallarm_process_time_limit_block` directives specified.
    * The time limit for the node to process a single request (milliseconds): the value of `wallarm_process_time_limit`.
    
        !!! warning "Risk of running out of system memory"
            The high time limit and/or continuation of request processing after the limit is exceeded can trigger memory exhaustion or out-of-time request processing.
    
    * The node will either block or pass the `overlimit_res` attack depending on the [node filtration mode][waf-mode-instr]:

        * In the **monitoring** mode, the node forwards the original request to the application address. The application has the risk to be exploited by the attacks included in both processed and unprocessed request parts.
        * In the **safe blocking** mode, the node blocks the request if it is originated from the [graylisted][graylist-docs] IP address. Otherwise, the node forwards the original request to the application address. The application has the risk to be exploited by the attacks included in both processed and unprocessed request parts.
        * In the **block** mode, the node blocks the request.
1. Delete the `wallarm_process_time_limit` and `wallarm_process_time_limit_block` NGINX directives from the NGINX configuration file.

    If the `overlimit_res` attack detection is fine-tuned using both the directives and the rule, the node will process requests as the rule sets.
