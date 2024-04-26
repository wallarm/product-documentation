# Recommendations on Configuring the Filter Node for Separated Environments

You have already learned [how Wallarm filtering nodes work in separate environments](how-wallarm-in-separated-environments-works.md). For the nodes to work as described, learn recommendations on configuring nodes in separated environments from this article.

## Initial Wallarm Protection Deployment Process

If you perform the initial rollout of Wallarm protection for environments, it is recommended you use the following approach (you are welcome to adjust it as needed):

1. Learn about available Wallarm node deployment options [here](../../../installation/supported-deployment-options.md).
2. If necessary, learn about available options to separately manage the filtering node configuration for your environments. You can find this information [here](how-wallarm-in-separated-environments-works.md#relevant-wallarm-features).
3. Deploy Wallarm filtering nodes in your non-production environments with the filtration mode set to `monitoring`.
4. Learn about how to operate, scale, and monitor the Wallarm solution; confirm the stability of the new network component.
5. Deploy Wallarm filtering nodes in your production environment with the filtration mode set to `monitoring`.
6. Implement proper configuration management and monitoring processes for the new Wallarm component.
7. Keep the traffic flowing via the filtering nodes in all your environments, including testing and production, for 7-14 days to give the Wallarm cloud‑based backend some time to learn about your application.
8. Enable the `blocking` filtration mode in all your non-production environments and use automated or manual tests to confirm the protected application is working as expected.
9. Enable the `blocking` filtration mode in the production environment. Using available methods, confirm that the application is working as expected.

!!! info
    To set up the filtration mode, please use these [instructions](../../configure-wallarm-mode.md).

## Gradual Rollout of New Wallarm Node Changes

From time to time changes might be needed in your existing Wallarm infrastructure. Depending on your organization's change management policy, you might be required to test all potentially risky changes in a non-production environment, and then apply the changes in your production environment.

The following approaches are recommended to test and gradually change the configuration of different Wallarm components and features:
* [Low-level configuration of Wallarm filtering nodes in all form-factors](#low-level-configuration-of-wallarm-filtering-nodes-in-all-form-factors)
* [Configuration of Wallarm node rules](#configuration-of-wallarm-node-rules)

### Low-level Configuration of Wallarm Filtering Nodes in All Form-factors

Low-level configuration of filtering nodes is performed via Docker environment variables, provided NGINX configuration file, Kubernetes Ingress controller parameters, etc. The way of configuration depends on the [deployment option](../../../installation/supported-deployment-options.md). 

Low-level configuration can easily be separately managed for different customer environments using your existing change management processes for infrastructure resources.

### Configuration of Wallarm Node Rules

Since each rule record can be associated with a [different set](how-wallarm-in-separated-environments-works.md#resource-identification) of application instance IDs or `HOST` request headers, the following options are recommended:

* First apply a new configuration to a test or development environment, verify the functionality, and then apply the change for the production environment.
* Use the `Create regexp-based attack indicator` rule in the `Experimental` mode. This mode allows the rule to be deployed directly in the production environment without the risk of mistakenly blocking valid end user requests.

    ![Creating experimental rule](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/define-attack-experimental.png)

* Use the `Set filtration mode` rule to control the Wallarm filtration mode for specific environments and requests. This rule provides additional flexibility in the way Wallarm protection can be gradually rolled out to protect new end-points and other resources in different environments. By default, the [`wallarm_mode`](../../configure-parameters-en.md#wallarm_mode) value is used depending on the [`wallarm_mode_allow_override`](../../configure-parameters-en.md#wallarm_mode_allow_override) setting.

    ![Creating a rule to overwrite the filtration mode](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/rule-overwrite-filtering-mode.png)