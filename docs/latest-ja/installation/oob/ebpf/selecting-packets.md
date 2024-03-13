# ミラーリングのソース選択

[Wallarm eBPFソリューション](deployment.md)はトラフィックミラーを操作し、トラフィックミラーの範囲を制御できます。これにより、Kubernetesのネームスペース、ポッド、コンテナでパケットミラーを生成できます。このガイドでは、選択プロセスをどのように管理するかを説明します。

ミラーリングのためのパケットを選択するためのいくつかの方法があります：

* `wallarm-mirror`ラベルをネームスペースに適用して、そのネームスペース内のポッドのすべてのトラフィックをミラーリングします。
* 特定のポッドに`mirror.wallarm.com/enabled`アノテーションを適用して、そのトラフィックをミラーリングします。
* Wallarm Helmチャートの`values.yaml`ファイルの`config.agent.mirror.filters`設定を構成します。この設定により、ネームスペース、ポッド、コンテナ、ノードレベルでのミラーリングを有効にできます。

## ラベルを使用したネームスペースのミラーリング

ネームスペースレベルでのミラーリングを制御するには、`wallarm-mirror`ラベルを望ましいKubernetesネームスペースに適用し、その値を`enabled`または`disabled`に設定します、例えば：

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

## アノテーションを使用したポッドのミラーリング

ポッドレベルでのミラーリングを制御するには、`mirror.wallarm.com/enabled`アノテーションを使用して、その値を`true`または`false`に設定します、例えば：

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

## `values.yaml`を使用したネームスペース、ポッド、コンテナ、ノードのミラーリング

`values.yaml`ファイルの`config.agent.mirror.filters`ブロックにより、トラフィックミラーリングレベルの細かい制御が可能です。このアプローチにより、以下のエンティティのミラーリングを制御できます：

* ネームスペース - `filters.namespace`パラメータを使用して
* ポッド - ポッドのラベルで`filters.pod_labels`を使用するか、ポッドのアノテーションで`filters.pod_annotations`を使用
* ノード - `filters.node_name`パラメータを使用して
* コンテナ - `filters.container_name`パラメータを使用して

### ネームスペースの選択

特定のネームスペースのトラフィックミラーリングを有効にするには、その名前を`filters.namespace`パラメータに指定します。例えば、`my-namespace` Kubernetesネームスペースのトラフィックミラーリングを有効にするには：

```yaml
config:
  agent:
    mirror:
      filters:
        - namespace: 'my-namespace'
```

### ポッドの選択

ポッドのラベルとアノテーションによって、トラフィックミラーリングするポッドを選択できます。方法は以下の通りです：

=== "ラベルによるポッドの選択"
    特定のラベルを持つポッドのトラフィックミラーリングを有効にするには、`pod_labels`パラメータを使用します。
    
    例えば、`environment: production`ラベルを持つポッドのトラフィックミラーリングを有効にするには：

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_labels:
                environment: 'production'
    ```

    ポッドを識別するために複数のラベルが必要な場合は、複数のラベルを指定できます。例えば、以下の設定により、`environment: production AND (team: backend OR team: ops)`ラベルを持つポッドのトラフィックがWallarm eBPFによってミラーリングされ、分析されます：

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_labels:
                environment: 'production'
                team: 'backend,ops'
    ```
=== "アノテーションによるポッドの選択"
    特定のアノテーションを持つポッドのトラフィックミラーリングを有効にするには、`pod_annotations`パラメータを使用します。
    
    例えば、`app.kubernetes.io/name: myapp`アノテーションを持つポッドのトラフィックミラーリングを有効にするには：

    ```yaml
    config:
      agent:
        mirror:
          filters:
            - pod_annotations:
                app.kubernetes.io/name: 'myapp'
    ```

    ポッドを識別するために複数のアノテーションが必要な場合は、複数のアノテーションを指定できます。例えば、以下の設定により、以下のアノテーションを持つポッドのトラフィックがWallarm eBPFによってミラーリングされ、分析されます：
    
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

特定のKubernetesノードのトラフィックミラーリングを有効にするには、ノード名を`filters.node_name`パラメータに指定します。例えば、`my-node` Kubernetesノードのトラフィックミラーリングを有効にするには：

```yaml
config:
  agent:
    mirror:
      filters:
        - node_name: 'my-node'
```

### コンテナの選択

特定のKubernetesコンテナのトラフィックミラーリングを有効にするには、コンテナ名を`filters.container_name`パラメータに指定します。例えば、`my-container` Kubernetesコンテナのトラフィックミラーリングを有効にするには：

```yaml
config:
  agent:
    mirror:
      filters:
        - container_name: 'my-container'
```

### 変更の適用

`values.yaml`ファイルを変更し、デプロイされたチャートをアップグレードしたい場合は、以下のコマンドを使用します：

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```

## ラベル、アノテーション、フィルター間の優先順位

複数の選択方法が使用され、より高いレベルでミラーリングが有効になっている場合、より低い構成レベルが優先されます。

より高いレベルでミラーリングが無効にされている場合、より高いレベルが優先されるため、下位の設定はまったく適用されません。

同じオブジェクトが異なる手段（例えば、Wallarmポッドのアノテーションと`values.yaml`のフィルターブロックを使用して）でミラーリングのために選択された場合、Wallarmポッドのアノテーションが優先されます。

## 例

ラベル、アノテーション、フィルターは、トラフィックミラーリングおよび分析のレベルを設定する上で高い柔軟性を提供しますが、これらは互いに重複する場合があります。以下の設定例は、それらがどのように協力するかを理解するのに役立ちます。

### `values.yaml`の多層設定

以下の`values.yaml`設定を考えます：

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

設定されたフィルターは以下のように適用されます：

```
namespace: default OR (namespace: my-namespace AND environment: production AND (team: backend
OR team: ops) AND app.kubernetes.io/name: myapp)
```

### ネームスペースラベル、ポッドアノテーションおよび`values.yaml`フィルターの組み合わせ

| 設定 | 結果 |
| ------------- | ------ |
| <ul><li>`values.yaml`での値 → `config.agent.mirror.allNamespaces`が`true`に設定され</li><li>ネームスペースラベルが`wallarm-mirror=disabled`である</li></ul> | ネームスペースはミラーリングされません |
| <ul><li>ネームスペースラベルが`wallarm-mirror=enabled`であり</li><li>ポッドアノテーションが`mirror.wallarm.com/enabled=false`である</li></ul> | ポッドはミラーリングされません |
| <ul><li>ネームスペースラベルが`wallarm-mirror=disabled`であり</li><li>ポッドアノテーションが`mirror.wallarm.com/enabled=true`である、またはより低いレベルの設定でトラフィックミラーリングが選択されている</li></ul> | ポッドはミラーリングされません |
| <ul><li>ネームスペースラベルが`wallarm-mirror=disabled`であり</li><li>`values.yaml` → `config.agent.mirror.filters`で同じネームスペースが選択されている</li></ul> | ネームスペースはミラーリングされません
| <ul><li>ポッドアノテーションが`mirror.wallarm.com/enabled=false`であり</li><li>`values.yaml` → `config.agent.mirror.filters`で同じポッドが選択されている</li></ul> | ポッドはミラーリングされません