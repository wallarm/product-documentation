# ミラーリング対象の選択

[Wallarm eBPFソリューション](deployment.md)はトラフィックミラー上で動作し、トラフィックミラーのスコープを制御できます。Kubernetesのnamespace、pod、container単位でパケットのミラーリングを行うことができます。本ガイドでは、選択プロセスの管理方法を説明します。

!!! warning "バージョン4.10に限定"
    Wallarm eBPFベースのソリューションは現在、[Wallarm Node 4.10](/4.10/installation/oob/ebpf/deployment/)で利用可能な機能のみをサポートしています。

ミラーリング対象のパケットを選択する方法はいくつかあります。

* namespaceに`wallarm-mirror`ラベルを付与すると、そのnamespace内のpodのすべてのトラフィックをミラーリングできます。
* 特定のpodに`mirror.wallarm.com/enabled`アノテーションを付与すると、そのpodのトラフィックをミラーリングできます。
* Wallarm Helmチャートの`values.yaml`ファイルで`config.agent.mirror.filters`設定を構成します。この設定により、namespace、pod、container、またはnodeレベルでミラーリングを有効化できます。

## ラベルを使用したnamespaceのミラーリング

namespaceレベルでミラーリングを制御するには、対象のKubernetesのnamespaceに`wallarm-mirror`ラベルを付与し、値を`enabled`または`disabled`に設定します。例:

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

## アノテーションを使用したpodのミラーリング

podレベルでミラーリングを制御するには、`mirror.wallarm.com/enabled`アノテーションを使用し、値を`true`または`false`に設定します。例:

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

## `values.yaml`を使用したnamespace、pod、container、またはnodeのミラーリング

`values.yaml`ファイル内の`config.agent.mirror.filters`ブロックにより、トラフィックミラーリングのレベルをきめ細かく制御できます。この方法では、次の対象のミラーリングを制御できます。

* namespace - `filters.namespace`パラメータを使用します
* pod - podのラベルに`filters.pod_labels`、またはpodのアノテーションに`filters.pod_annotations`を使用します
* node - `filters.node_name`パラメータを使用します
* container - `filters.container_name`パラメータを使用します

### namespaceの選択

特定のnamespaceでトラフィックミラーリングを有効化するには、`filters.namespace`パラメータにその名前を指定します。例えば、`my-namespace`というKubernetesのnamespaceでトラフィックミラーリングを有効化するには次のとおりです:

```yaml
config:
  agent:
    mirror:
      filters:
        - namespace: 'my-namespace'
```

### podの選択

podのラベルやアノテーションによって、トラフィックミラーリング対象のpodを選択できます。方法は次のとおりです。

=== "ラベルでpodを選択"
    特定のラベルを持つpodでトラフィックミラーリングを有効化するには、`pod_labels`パラメータを使用します。
    
    例えば、`environment: production`ラベルを持つpodでトラフィックミラーリングを有効化するには次のとおりです:
    
    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_labels:
                environment: 'production'
    ```
    
    podの特定に複数のラベルが必要な場合は、複数のラベルを指定できます。例えば、次の構成では、`environment: production AND (team: backend OR team: ops)`というラベル条件に一致するpodのトラフィックをWallarm eBPFがミラーリングして解析します:
    
    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_labels:
                environment: 'production'
                team: 'backend,ops'
    ```
=== "アノテーションでpodを選択"
    特定のアノテーションを持つpodでトラフィックミラーリングを有効化するには、`pod_annotations`パラメータを使用します。
    
    例えば、`app.kubernetes.io/name: myapp`アノテーションを持つpodでトラフィックミラーリングを有効化するには次のとおりです:
    
    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_annotations:
                app.kubernetes.io/name: 'myapp'
    ```
    
    podの特定に複数のアノテーションが必要な場合は、複数のアノテーションを指定できます。例えば、次の構成では、以下のアノテーション条件を満たすpodのトラフィックをWallarm eBPFがミラーリングして解析します:
    
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

### nodeの選択

特定のKubernetesのnodeでトラフィックミラーリングを有効化するには、`filters.node_name`パラメータにnode名を指定します。例えば、`my-node`というKubernetesのnodeでトラフィックミラーリングを有効化するには次のとおりです:

```yaml
config:
  agent:
    mirror:
      filters:
        - node_name: 'my-node'
```

### containerの選択

特定のKubernetesのcontainerでトラフィックミラーリングを有効化するには、`filters.container_name`パラメータにcontainer名を指定します。例えば、`my-container`というKubernetesのcontainerでトラフィックミラーリングを有効化するには次のとおりです:

```yaml
config:
  agent:
    mirror:
      filters:
        - container_name: 'my-container'
```

### 変更の適用

`values.yaml`ファイルを変更し、デプロイ済みのチャートをアップグレードしたい場合は、次のコマンドを使用します:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```

## ラベル、アノテーション、フィルター間の優先順位

複数の選択方法を併用し、上位レベルでミラーリングが有効化されている場合は、下位の設定レベルが優先されます。

上位レベルでミラーリングが無効化されている場合は、上位レベルが無効化に関して優先されるため、下位の設定は一切適用されません。

同一のオブジェクトが異なる手段（例: Wallarmのpodアノテーションと`values.yaml`のfiltersブロック）でミラーリング対象に選択されている場合は、Wallarmのpodアノテーションが優先されます。

## 例

ラベル、アノテーション、フィルターは、トラフィックのミラーリングと解析のレベル設定に高い柔軟性を提供します。しかし、これらは互いに重複する場合があります。どのように組み合わせて動作するかを理解するための構成例を以下に示します。

### `values.yaml`における多層の構成

次の`values.yaml`構成の例です:

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

設定したフィルターは次のように適用されます:

```
namespace: default OR (namespace: my-namespace AND environment: production AND (team: backend
OR team: ops) AND app.kubernetes.io/name: myapp)
```

### namespaceラベル、podアノテーション、`values.yaml`フィルターの組み合わせ

| 構成 | 結果 |
| ------------- | ------ |
| <ul><li>`values.yaml` → `config.agent.mirror.allNamespaces`の値が`true`に設定されており</li><li>namespaceラベルが`wallarm-mirror=disabled`である</li></ul> | そのnamespaceはミラーリングされません |
| <ul><li>namespaceラベルが`wallarm-mirror=enabled`であり</li><li>podアノテーションが`mirror.wallarm.com/enabled=false`である</li></ul> | そのpodはミラーリングされません |
| <ul><li>namespaceラベルが`wallarm-mirror=disabled`であり</li><li>podアノテーションが`mirror.wallarm.com/enabled=true`である、または他の下位レベルの設定でミラーリングが選択されている</li></ul> | そのpodはミラーリングされません |
| <ul><li>namespaceラベルが`wallarm-mirror=disabled`であり</li><li>同じnamespaceが`values.yaml` → `config.agent.mirror.filters`で選択されている</li></ul> | そのnamespaceはミラーリングされません
| <ul><li>podアノテーションが`mirror.wallarm.com/enabled=false`であり</li><li>同じpodが`values.yaml` → `config.agent.mirror.filters`で選択されている</li></ul> | そのpodはミラーリングされません