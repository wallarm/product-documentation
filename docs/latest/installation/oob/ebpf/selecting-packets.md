# Selecting Packets for Mirroring

The [Wallarm eBPF solution](deployment.md) operates on a traffic mirror and provides control over the traffic mirror scope. It allows you to produce packet mirror by Kubernetes namespaces, pods, and containers. This guide explains how to manage the selection process.

There are several methods available for selecting packets for mirroring:

* Apply the `wallarm-mirror` label to a namespace to mirror all traffic of pods within that namespace.
* Apply the `mirror.wallarm.com/enabled` annotation to a specific pod to mirror its traffic.
* Configure the `config.agent.mirror.filters` setting in the `values.yaml` file of the Wallarm Helm chart. This configuration allows you to enable mirroring at the namespace, pod, container, or node levels.

## Mirroring for a namespace using the label

To control mirroring at the namespace level, apply the `wallarm-mirror` label to the desired Kubernetes namespace and set its value to either `enabled` or `disabled`, e.g.:

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

## Mirroring for a pod using the annotation

To control mirroring at the pod level, use the `mirror.wallarm.com/enabled` annotation and set its value to either `true` or `false`, e.g.:

```bash
kubectl edit deployment -n <NAMESPACE> <APP_LABEL_VALUE>
```

```yaml hl_lines="17"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        mirror.wallarm.com/enabled: "true"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

## Mirroring for a namespace, pod, container, or node using `values.yaml`

The `config.agent.mirror.filters` block in the `values.yaml` file allows fine-grained control over traffic mirroring levels. This approach enables you to control mirroring for the following entities:

* Namespace - using the `filters.namespace` parameter
* Pod - using either `filters.pod_labels` with pod's labels or `filters.pod_annotations` with pod's annotations
* Node - using the `filters.node_name` parameter
* Container - using the `filters.container_name` parameter

### Choosing a namespace

To enable traffic mirroring for a specific namespace, specify its name in the `filters.namespace` parameter. For example, to enable traffic mirroring for the `my-namespace` Kubernetes namespace:

```yaml
...
  agent:
    mirror:
      ...
      filters:
        - namespace: 'my-namespace'
```

### Choosing a pod

You can choose a pod for traffic mirroring by the pod's labels and annotations. Here is how:

=== "Choosing a pod by label"
    To enable traffic mirroring for a pod with a specific label, use the `pod_labels` parameter.
    
    For example, to enable traffic mirroring for a pod with the `environment: production` label:

    ```yaml
    ...
    agent:
      mirror:
      ...
      filters:
        - pod_labels:
            environment: 'production'
    ```

    If multiple labels are required to identify the pod, you can specify several labels. For example, the following configuration enables Wallarm eBPF to mirror and analyze the traffic of pods that have the `environment: production AND (team: backend OR team: ops)` labels:

    ```yaml
    ...
    agent:
      mirror:
      ...
      filters:
        - pod_labels:
            environment: 'production'
            team: 'backend,ops'
    ```
=== "Choosing a pod by annotation"
    To enable traffic mirroring for a pod with a specific annotation, use the `pod_annotations` parameter.
    
    For example, to enable traffic mirroring for a pod with the `app.kubernetes.io/name: myapp` annotation:

    ```yaml
    ...
    agent:
      mirror:
      ...
      filters:
        - pod_annotations:
            app.kubernetes.io/name: 'myapp'
    ```

    If multiple annotations are required to identify the pod, you can specify several annotations. For example, the following configuration enables Wallarm eBPF to mirror and analyze the traffic of pods that have the following annotations:
    
    ```
    app.kubernetes.io/name: myapp AND (app.kubernetes.io/instance: myapp-instance-main OR
    app.kubernetes.io/instance: myapp-instance-reserve)
    ```

    ```yaml
    ...
    agent:
      mirror:
      ...
      filters:
        - pod_annotations:
            app.kubernetes.io/name: 'myapp'
            app.kubernetes.io/instance: 'myapp-instance-main,myapp-instance-reserve'
    ```

### Choosing a node

To enable traffic mirroring for a specific Kubernetes node, specify the node name in the `filters.node_name` parameter. For example, to enable traffic mirroring for the `my-node` Kubernetes node:

```yaml
...
  agent:
    mirror:
      ...
      filters:
        - node_name: 'my-node'
```

### Choosing a container

To enable traffic mirroring for a specific Kubernetes container, specify the container name in the `filters.container_name` parameter. For example, to enable traffic mirroring for the `my-container` Kubernetes container:

```yaml
...
  agent:
    mirror:
      ...
      filters:
        - container_name: 'my-container'
```

### Applying changes

If you modify the `values.yaml` file and want to upgrade your deployed chart, use the following command:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```

## Priorities among labels, annotations and filters

When multiple selection methods are used and mirroring is enabled at a higher level, the lower configuration level takes precedence.

If mirroring is disabled at the higher level, the lower settings are not applied at all, as the higher level has priority when disabling traffic mirroring.

In case the same object is selected for mirroring through different means (e.g., using the Wallarm pod's annotation and the `values.yaml` filters block), the Wallarm pod's annotation takes precedence.

## Examples

Labels, annotations, and filters provide a high degree of flexibility in setting the level of traffic mirroring and analysis. However, they can overlap each other. Here are some configuration examples to help you understand how they work together.

### Multi-level configuration in `values.yaml`

Consider the following `values.yaml` configuration:

```yaml
...
  agent:
    mirror:
      ...
      filters:
        - namespace: "default"
        - namespace: 'my-namespace'
          pod_labels:
            environment: 'production'
            team: 'backend,ops'
          pod_annotations:
            app.kubernetes.io/name: 'myapp'
```

The set filters are applied as follows:

```
namespace: default OR (namespace: my-namespace AND environment: production AND (team: backend
OR team: ops) AND app.kubernetes.io/name: myapp)
```

### Mixing nemspace labels, pod annotations and `values.yaml` filters

| Configuration | Result |
| ------------- | ------ |
| <ul><li>The namespace label is `wallarm-mirror=enabled` and</li><li>The pod annotation is `mirror.wallarm.com/enabled=false`</li></ul> | The pod is not mirrored |
| <ul><li>The namespace label is `wallarm-mirror=disabled` and</li><li>The pod annotation is `mirror.wallarm.com/enabled=true`, or any other lower-level setting is chosen for traffic mirroring</li></ul> | The pod is not mirrored |
| <ul><li>The namespace label is `wallarm-mirror=disabled` and</li><li>The same namespace is selected in `values.yaml` → `config.agent.mirror.filters`</li></ul> | The namespace is not mirrored
| <ul><li>The pod annotation is `mirror.wallarm.com/enabled=false` and</li><li>The same pod is selected in `values.yaml` → `config.agent.mirror.filters`</li></ul> | The pod is not mirrored
