# Recommendations on Configuring the Filter Node for Separated Environments

## Initial WAF Protection Deployment Process

If you perform the initial rollout of WAF protection for environments it is recommended to use the following approach (you are welcome to adjust it as needed):

1. Learn about available WAF node deployment options [here](../../supported-platforms.md).
2. Learn about available options to separately manage the WAF node configuration for your environments if necessary. You can find this information [here](how-waf-in-separated-environments-works.md#relevant-wallarm-features).
3. Deploy WAF nodes in your non-production environments with the filtering mode set to `monitoring`.
4. Learn about how to operate, scale and monitor the WAF solution; confirm the stability of the new network component.
5. Deploy WAF nodes in your production environment with the filtering mode set to `monitoring`.
6. Implement proper configuration management and monitoring processes for the new WAF component.
7. Keep the traffic flowing via the WAF nodes in all your environments, including testing and production, for 7-14 days to give the WAF cloud-based backend some time to learn about your application.
8. Enable the `blocking` filtering mode in all your non-production environments and using automated or manual tests confirm that the protected application is working as expected.
9. Enable the `blocking` filtering mode in the production environment and using available methods confirm that the application is working as expected.

!!! info
    To set up the filtering mode, please use these [instructions](../../configure-wallarm-mode.md).

## Gradual Rollout of New WAF Changes

From time to time changes might be needed in your existing Wallarm WAF infrastructure. Depending on your organization's change management policy you might be required to test all potentially risky changes in a non-production environment, and only after that apply the changes in your production environment.

The following approaches are recommended to test and gradually change the configuration of different Wallarm WAF components and features:
* [Low-level configuration of Wallarm WAF filtering nodes in all form-factors](#low-level-onfiguration-of-wallarm-waf-filtering-nodes-in-all-form-factors)
* [Configuration of Wallarm WAF node rules](#configuration-of-wallarm-waf-node-rules)

### Low-level Сonfiguration of Wallarm WAF Filtering Nodes in All Form-factors

Low-level configuration of filtering nodes is performed via Docker environment variables, provided NGINX configuration file, Kubernetes Ingress controller parameters, etc. The way of configuration depends on the [deployment option](../../supported-platforms.md). 

Low-level configuration can be easily managed separately for different customer environments using your existing change management processes for infrastructure resources.

### Configuration of Wallarm WAF Node Rules

Since each rule record can be associated with a [different set](how-waf-in-separated-environments-works.md#resource-identification) of application instance IDs or `HOST` request headers, the following options are recommended:

* First apply a new configuration to a test or development environment, verify the functionality, and only after that apply the change for the production environment.
* Use the `Define a request as an attack based on a regular expression WAF` rule in the `Experimental` mode. This mode allows the rule to be deployed directly in the production environment without the risk of mistakenly blocking valid end-user requests.

    ![!Creating experimental rule](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/define-attack-experimental.png)

* Use the `Set traffic filtration mode` rule to control WAF filtering mode for specific environments and requests. This rule provides additional flexibility in the way WAF protection can be gradually rolled out to protect new end-points and other resources in different environments. By default, the [`wallarm_mode`](../../configure-parameters-en.md#wallarm_mode) value is used depending on the [`wallarm_mode_allow_override`](../../configure-parameters-en.md#wallarm_mode_allow_override) setting.

    ![!Creating a rule to overwrite the filtering mode](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/rule-overwrite-filtering-mode.png)