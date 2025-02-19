```markdown
# ミラーリングのソース選択

[Wallarm eBPF solution](deployment.md)はトラフィックミラーを用いて動作し、トラフィックミラーのスコープを制御することを提供します。Kubernetesのnamespace、pod、およびコンテナごとにパケットミラーを生成できるようにします。このガイドでは、選択プロセスの管理方法について説明します。

パケットをミラーリングするための選択方法はいくつかあります:

* namespaceに`wallarm-mirror`ラベルを適用して、そのnamespace内のすべてのpodのトラフィックをミラーリングします。
* 特定のpodに`mirror.wallarm.com/enabled`アノテーションを適用して、そのトラフィックをミラーリングします。
* Wallarm Helmチャートの`values.yaml`ファイル内の`config.agent.mirror.filters`設定を構成します。この構成では、namespace、pod、コンテナ、またはノードレベルでミラーリングを有効にできます。

## ラベルを使用したnamespaceのミラーリング

namespaceレベルでミラーリングを制御するには、対象のKubernetes namespaceに`wallarm-mirror`ラベルを適用し、その値を`enabled`または`disabled`に設定します。例:

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

## アノテーションを使用したpodのミラーリング

podレベルでミラーリングを制御するには、`mirror.wallarm.com/enabled`アノテーションを使用し、その値を`true`または`false`に設定します。例:

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

## `values.yaml`を使用したnamespace、pod、コンテナ、またはノードのミラーリング

`values.yaml`ファイル内の`config.agent.mirror.filters`ブロックにより、トラフィックミラーリングレベルを細かく制御できます。このアプローチでは、以下のエンティティのミラーリングを制御できます:

* Namespace - `filters.namespace`パラメータを使用
* Pod - podのラベルを使用する`filters.pod_labels`またはpodのアノテーションを使用する`filters.pod_annotations`
* Node - `filters.node_name`パラメータを使用
* Container - `filters.container_name`パラメータを使用

### Namespaceの選択

特定のnamespaceのトラフィックミラーリングを有効にするには、`filters.namespace`パラメータにその名前を指定します。例えば、`my-namespace`というKubernetes namespaceのトラフィックミラーリングを有効にするには:

```yaml
config:
  agent:
    mirror:
      filters:
        - namespace: 'my-namespace'
```

### Podの選択

podのラベルおよびアノテーションによってトラフィックミラーリング対象のpodを選択できます。以下はその方法です:

=== "ラベルによるpodの選択"
    特定のラベルを持つpodのトラフィックミラーリングを有効にするには、`pod_labels`パラメータを使用します。
    
    例えば、`environment: production`ラベルを持つpodのトラフィックミラーリングを有効にするには:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_labels:
                environment: 'production'
    ```

    複数のラベルが必要な場合は、いくつかのラベルを指定できます。例えば、以下の構成では、`environment: production AND (team: backend OR team: ops)`のラベルを持つpodのトラフィックをWallarm eBPFがミラーリングおよび解析します:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_labels:
                environment: 'production'
                team: 'backend,ops'
    ```
=== "アノテーションによるpodの選択"
    特定のアノテーションを持つpodのトラフィックミラーリングを有効にするには、`pod_annotations`パラメータを使用します。
    
    例えば、`app.kubernetes.io/name: myapp`アノテーションを持つpodのトラフィックミラーリングを有効にするには:

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_annotations:
                app.kubernetes.io/name: 'myapp'
    ```

    複数のアノテーションが必要な場合は、いくつかのアノテーションを指定できます。例えば、以下の構成では、次のアノテーションを持つpodのトラフィックをWallarm eBPFがミラーリングおよび解析します:
    
    ```
    app.kubernetes.io/name: myapp AND (app.kubernetes.io/instance: myapp-instance-main OR
    app.kubernetes.io/instance: myapp-instance-reserve)
    ```

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_annotations:
                app.kubernetes.io/name: 'myapp'
                app.kubernetes.io/instance: 'myapp-instance-main,myapp-instance-reserve'
    ```

### ノードの選択

特定のKubernetesノードのトラフィックミラーリングを有効にするには、`filters.node_name`パラメータにノード名を指定します。例えば、`my-node`というKubernetesノードのトラフィックミラーリングを有効にするには:

```yaml
config:
  agent:
    mirror:
      filters:
        - node_name: 'my-node'
```

### コンテナの選択

特定のKubernetesコンテナのトラフィックミラーリングを有効にするには、`filters.container_name`パラメータにコンテナ名を指定します。例えば、`my-container`というKubernetesコンテナのトラフィックミラーリングを有効にするには:

```yaml
config:
  agent:
    mirror:
      filters:
        - container_name: 'my-container'
```

### 変更の適用

`values.yaml`ファイルを変更してデプロイ済みのチャートをアップグレードする場合は、以下のコマンドを使用します:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```

## ラベル、アノテーション、フィルターの優先順位

複数の選択方法が使用され、上位のレベルでミラーリングが有効になっている場合、下位の設定が優先されます。

上位のレベルでミラーリングが無効化されている場合、下位の設定は一切適用されません。上位のレベルがトラフィックミラーリングの無効化において優先されるためです。

同じ対象が異なる手段（例：Wallarm podのアノテーションおよび`values.yaml`フィルターブロック）を通じてミラーリング対象として選択された場合、Wallarm podのアノテーションが優先されます。

## 例

ラベル、アノテーション、およびフィルターは、トラフィックミラーリングおよび解析のレベル設定において高い柔軟性を提供します。しかし、これらは互いに重複する可能性があります。以下はいくつかの構成例で、これらがどのように連携するかを説明します。

### `values.yaml`における多層構成

次の`values.yaml`構成を考えます:

```yaml
config:
  agent:
    mirror:
      filters:
        - namespace: "default"
        - namespace: 'my-namespace'
          pod_labels:
            environment: 'production'
            team: 'backend,ops'
          pod_annotations:
            app.kubernetes.io/name: 'myapp'
```

設定されたフィルターは次のように適用されます:

```
namespace: default OR (namespace: my-namespace AND environment: production AND (team: backend
OR team: ops) AND app.kubernetes.io/name: myapp)
```

### namespaceラベル、podアノテーション、および`values.yaml`フィルターの併用

| 構成 | 結果 |
| ------------- | ------ |
| <ul><li>`values.yaml`の値→`config.agent.mirror.allNamespaces`が`true`に設定され、</li><li>namespaceラベルが`wallarm-mirror=disabled`</li></ul> | namespaceはミラーリングされません |
| <ul><li>namespaceラベルが`wallarm-mirror=enabled`で、</li><li>podアノテーションが`mirror.wallarm.com/enabled=false`</li></ul> | podはミラーリングされません |
| <ul><li>namespaceラベルが`wallarm-mirror=disabled`で、</li><li>podアノテーションが`mirror.wallarm.com/enabled=true`またはその他の下位設定が選択されていても</li></ul> | podはミラーリングされません |
| <ul><li>namespaceラベルが`wallarm-mirror=disabled`で、</li><li>同じnamespaceが`values.yaml`→`config.agent.mirror.filters`で選択されている</li></ul> | namespaceはミラーリングされません |
| <ul><li>podアノテーションが`mirror.wallarm.com/enabled=false`で、</li><li>同じpodが`values.yaml`→`config.agent.mirror.filters`で選択されている</li></ul> | podはミラーリングされません |
```