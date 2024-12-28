[nginx-process-time-limit-docs]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]: ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]: ../../user-guides/ip-lists/graylist.md
[ip-list-docs]: ../../user-guides/ip-lists/overview.md
[waf-mode-instr]: ../../admin-en/configure-wallarm-mode.md

# Atualizando o controlador de entrada NGINX EOL com módulos integrados da Wallarm

Essas instruções descrevem as etapas para atualizar o Controlador de Entrada Wallarm em fim de vida (versão 3.6 e inferior) para a nova versão com o nó Wallarm 4.8.

--8<-- "../include-pt-BR/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! warning "A versão atualizada do Community Ingress NGINX Controller"
    Se você atualizar o nó da versão 3.4 ou inferior, por favor, note que a versão do Community Ingress NGINX Controller, na qual é baseado o controlador de entrada Wallarm, foi atualizada da 0.26.2 para a 1.9.5.
    
    Como a operação do Community Ingress NGINX Controller 1.9.5 foi significativamente alterada, sua configuração precisa ser adaptada a essas mudanças durante a atualização do controlador de entrada Wallarm.

    Estas instruções contêm a lista de configurações do Community Ingress NGINX Controller que provavelmente você terá que alterar. No entanto, por favor, elabore um plano individual para a migração da configuração com base nas [notas de release do Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md). 

## Requisitos

--8<-- "../include-pt-BR/waf/installation/requirements-nginx-ingress-controller-latest.md"

## Passo 1: Informe o suporte técnico da Wallarm que você está atualizando os módulos do nó de filtragem (apenas se atualizar o nó 2.18 ou inferior)

Se estiver atualizando o nó 2.18 ou inferior, informe o [suporte técnico da Wallarm](mailto:support@wallarm.com) que você está atualizando os módulos do nó de filtragem para 4.8 e peça para ativar a nova lógica de listas de IP para sua conta Wallarm.

Quando a nova lógica de listas de IP estiver ativada, abra o Console Wallarm e certifique-se de que a seção [**Listas de IP**](../../user-guides/ip-lists/overview.md) está disponível.

## Passo 2: Desative o módulo de verificação de ameaças ativas (apenas se atualizar o nó 2.16 ou inferior)

Se estiver atualizando o nó Wallarm 2.16 ou inferior, desative o módulo [Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) no Console Wallarm → **Vulnerabilities** → **Configure**.

A operação do módulo pode causar [falsos positivos](../../about-wallarm/protecting-against-attacks.md#false-positives) durante o processo de atualização. Desativar o módulo minimiza este risco.

## Passo 3: Atualize a porta da API

--8<-- "../include-pt-BR/waf/upgrade/api-port-443.md"

## Passo 4: Atualize o repositório de gráfico Helm da Wallarm

=== "Se estiver usando o repositório Helm"
    ```bash
    helm repo update wallarm
    ```
=== "Se estiver usando o repositório GitHub clonado"
    Adicione o [repositório de gráficos Helm da Wallarm](https://charts.wallarm.com/) contendo todas as versões do gráfico usando o comando abaixo. Use o repositório Helm para o trabalho futuro com o controlador de entrada Wallarm.

    ```bash
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

## Passo 5: Atualize a configuração `values.yaml`

Para migrar para Wallarm Ingress controller 4.8, atualize a seguinte configuração especificada no arquivo `values.yaml`:

* Configuração padrão do Community Ingress NGINX Controller
* Configuração do módulo Wallarm

### Configuração padrão do Community Ingress NGINX Controller

1. Verifique as [notas de lançamento sobre o Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md) 0.27.0 e superior e defina as configurações que serão alteradas no arquivo `values.yaml`.
2. Atualize as configurações definidas no arquivo `values.yaml`.

Está a seguir configurações que provavelmente precisarão ser alteradas:

* [Relatório adequado do endereço IP público do usuário final](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md) se as solicitações passarem por um balanceador de carga antes de serem enviadas para o controlador de entrada Wallarm.

    ```diff
    controller:
      config:
    -    use-forwarded-headers: "true"
    +    enable-real-ip: "true"
    +    forwarded-for-header: "X-Forwarded-For"
    ```
* [Configuração de IngressClasses](https://kubernetes.github.io/ingress-nginx/user-guide/multiple-ingress/). A versão da API do Kubernetes em uso foi atualizada no novo controlador de entrada, o que exige que IngressClasses seja configurado por meio dos parâmetros `.controller.ingressClass`, `.controller.ingressClassResource` e `.controller.watchIngressWithoutClass`.

    ```diff
    controller:
    +  ingressClass: waf-ingress
    +  ingressClassResource:
    +    name: waf-ingress
    +    default: true
    +  watchIngressWithoutClass: true
    ```
* Conjunto de parâmetros do ConfigMap (`.controller.config`) [ConfigMap (`.controller.config`)](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/), por exemplo: 

    ```diff
    controller:
    config:
    +  allow-backend-server-header: "false"
      enable-brotli: "true"
      gzip-level: "3"
      hide-headers: Server
      server-snippet: |
        proxy_request_buffering on;
        wallarm_enable_libdetection on;
    ```
* [Validação da sintaxe do Ingress via "webhook de admissão"](https://kubernetes.github.io/ingress-nginx/how-it-works/#avoiding-outage-from-wrong-configuration) agora está habilitada por padrão.

    ```diff
    controller:
    +  admissionWebhooks:
    +    enabled: true
    ```

    !!! warning "Desativando a validação da sintaxe do Ingress"
        É recomendável desativar a validação da sintaxe do Ingress apenas se destabilizar a operação de objetos Ingress. 
* Formato de [Label](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). Se o arquivo `values.yaml` define regras de afinidade de pod, altere o formato do rótulo nessas regras, por exemplo:

    ```diff
    controller:
      affinity:
        podAntiAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
        - podAffinityTerm:
            labelSelector:
                matchExpressions:
    -            - key: app
    +            - key: app.kubernetes.io/name
                operator: In
                values:
                - waf-ingress
    -            - key: component
    +            - key: app.kubernetes.io/component
                operator: In
                values:
    -              - waf-ingress
    +              - controller
    -            - key: release
    +            - key: app.kubernetes.io/instance
                operator: In
                values:
                - waf-ingress-ingress
            topologyKey: kubernetes.io/hostname
            weight: 100
    ```

### Configuração do módulo Wallarm

Altere a configuração do módulo Wallarm definida no arquivo `values.yaml` como segue:

* Se estiver atualizando da versão 2.18 ou inferior, [migre](../migrate-ip-lists-to-node-3.md) a configuração da lista de IP. Estes são os seguintes parâmetros que potencialmente devem ser excluídos de `values.yaml`:

    ```diff
    controller:
      wallarm:
        enabled: true
        - acl:
        -  enabled: true
        resources: {}
    ```

    Como a lógica central da lista de IP foi significativamente alterada no nó Wallarm 3.x, é necessário ajustar a configuração da lista de IP adequadamente.
* Certifique-se de que o comportamento esperado das configurações listadas abaixo corresponde à [lógica alterada dos modos de filtragem `off` e `monitoring`](what-is-new.md#filtration-modes):
      
      * [Diretiva `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Regra de filtragem geral configurada no Console Wallarm](../../user-guides/settings/general.md)
      * [Regras de filtragem de baixo nível configuradas no Console Wallarm](../../user-guides/rules/wallarm-mode-rule.md)

      Caso o comportamento esperado não corresponda à lógica modificada do modo de filtragem, ajuste as [anotações de Ingress](../../admin-en/configure-kubernetes-en.md#ingress-annotations) e [outras configurações](../../admin-en/configure-wallarm-mode.md) para as alterações lançadas.
* Elimine a [configuração do serviço de monitoramento](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md) explícita. Na nova versão do controlador Wallarm Ingress, o serviço de monitoramento é habilitado por padrão e não requer nenhuma configuração adicional.

    ```diff
    controller:
    wallarm:
      enabled: true
      tarantool:
        resources: {}
    -  metrics:
    -    enabled: true
    -    service:
    -      annotations: {}
    ```
* Se a página `&/usr/share/nginx/html/wallarm_blocked.html` configurada via ConfigMap era retornada para solicitações bloqueadas, [ajuste sua configuração](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) para as alterações lançadas.

    Na nova versão do nó, a página de bloqueio de amostra da Wallarm [tem](what-is-new.md#new-blocking-page) a UI atualizada sem logotipo e email de suporte especificado por padrão.
* Se você personalizou a detecção de ataque `overlimit_res` através das diretrizes NGINX [`wallarm_process_time_limit`][nginx-process-time-limit-docs] e [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs], por favor, [transfira](#step-6-transfer-the-overlimit_res-attack-detection-configuration-from-directives-to-the-rule) estas configurações para a regra e delete do arquivo `values.yaml`.

## Passo 6: Transferir a configuração de detecção de ataque `overlimit_res` das diretivas à regra

--8<-- "../include-pt-BR/waf/upgrade/migrate-to-overlimit-rule-ingress-controller.md"

## Passo 7: Verifique todas as mudanças dos manifestos K8s que estão por vir

Para evitar mudanças inesperadamente no comportamento do Controlador de Entrada, revise todas as mudanças dos manifestos K8s que estão por vir usando [Helm Diff Plugin](https://github.com/databus23/helm-diff). Este plugin exibe a diferença entre os manifestos K8s da versão do Controlador de Entrada implantada e da nova.

Para instalar e rodar o plugin:

1. Instale o plugin:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Execute o plugin:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.8.2 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: O nome da liberação Helm com o gráfico do Controlador de Entrada
    * `<NAMESPACE>`: O namespace onde o Controlador de Entrada está implantado
    * `<PATH_TO_VALUES>`: o caminho para o arquivo `values.yaml` que define as [configurações do controlador de entrada 4.8](#step-5-update-the-valuesyaml-configuration)
3. Certifique-se de que nenhuma mudança pode afetar a estabilidade dos serviços em execução e examine cuidadosamente os erros do stdout.

    Se a stdout estiver vazia, verifique se o arquivo `values.yaml` é válido.

Por favor, note as mudanças das seguintes configurações:

* Campo imutável, por exemplo, os seletores de implantação e/ou StatefulSet.
* Labels de pod. As mudanças podem levar à interrupção da operação do NetworkPolicy, por exemplo:

    ```diff
    apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    spec:
      egress:
      - to:
        - namespaceSelector:
            matchExpressions:
            - key: name
              operator: In
              values:
              - kube-system # ${NAMESPACE}
          podSelector:
            matchLabels: # RELEASE_NAME=waf-ingress
    -         app: waf-ingress
    +         app.kubernetes.io/component: "controller"
    +         app.kubernetes.io/instance: "waf-ingress"
    +         app.kubernetes.io/name: "waf-ingress"
    -         component: waf-ingress
    ```
* Configuração do Prometheus com novos labels, por exemplo:

    ```diff
     - job_name: 'kubernetes-ingress'
       kubernetes_sd_configs:
       - role: pod
         namespaces:
           names:
             - kube-system # ${NAMESPACE}
       relabel_configs: # RELEASE_NAME=waf-ingress
         # Selectors
    -    - source_labels: [__meta_kubernetes_pod_label_app]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_name]
           action: keep
           regex: waf-ingress
    -    - source_labels: [__meta_kubernetes_pod_label_release]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_instance]
           action: keep
           regex: waf-ingress
    -    - source_labels: [__meta_kubernetes_pod_label_component]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_component]
           action: keep
    -      regex: waf-ingress
    +      regex: controller
         - source_labels: [__meta_kubernetes_pod_container_port_number]
           action: keep
           regex: "10254|18080"
           # Replacers
         - action: replace
           target_label: __metrics_path__
           regex: /metrics
         - action: labelmap
           regex: __meta_kubernetes_pod_label_(.+)
         - source_labels: [__meta_kubernetes_namespace]
           action: replace
           target_label: kubernetes_namespace
         - source_labels: [__meta_kubernetes_pod_name]
           action: replace
           target_label: kubernetes_pod_name
         - source_labels: [__meta_kubernetes_pod_name]
           regex: (.*)
           action: replace
           target_label: instance
           replacement: "$1"
    ```
* Analisar todas as outras mudanças.

## Passo 8: Atualize o Controlador de Entrada

Existem três maneiras de atualizar o controlador de entrada Wallarm. Dependendo de haver ou não um balanceador de carga implantado em seu ambiente, selecione o método de atualização:

* Implantação do controlador de entrada temporário
* Re-criação regular do lançamento do controlador de entrada
* Lançamento do controlador de entrada de criação sem afetar o balanceador de carga

!!! warning "Usando o ambiente de teste ou minikube"
    Se o controlador de entrada Wallarm estiver implantado no seu ambiente de teste, é recomendável atualizá-lo primeiro. Com todos os serviços operando corretamente no ambiente de teste, você pode prosseguir para o procedimento de atualização no ambiente de produção.

    A menos que seja recomendado [implantar o Controlador Wallarm Ingress 4.8](../../admin-en/installation-kubernetes-en.md) com a configuração atualizada usando minikube ou outro serviço primeiro. Certifique-se de que todos os serviços funcionam conforme o esperado e depois atualize o controlador de entrada no ambiente de produção.

    Essa abordagem ajuda a evitar o tempo de inatividade dos serviços no ambiente de produção.

### Método 1: Implantação do controlador de entrada temporário

Usando este método, você pode implantar o Controlador de Entrada 4.8 como uma entidade adicional em seu ambiente e alternar o tráfego para ele gradualmente. Isso ajuda a evitar mesmo tempo de inatividade temporário de serviços e garante uma migração segura.

1. Copie a configuração IngressClass do arquivo `values.yaml` da versão anterior para o arquivo `values.yaml` para o controlador de entrada Wallarm 4.8.

    Com essa configuração, o controlador de entrada identificará os objetos Ingress, mas não processará seu tráfego.
2. Implantar o Controlador de Entrada 4.8:

    ```bash
    helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.8.2 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: O nome para a liberação Helm do gráfico do controlador de entrada.
    * `<NAMESPACE>`: O namespace para implantar o controlador de entrada.
    * `<PATH_TO_VALUES>`: o caminho para o arquivo `values.yaml` que define as [configurações do controlador de entrada 4.8](#step-5-update-the-valuesyaml-configuration) 
3. Certifique-se de que todos os serviços funcionam corretamente.
4. Troque a carga para o novo controlador de entrada gradualmente.

### Método 2: Re-criação regular do lançamento do controlador de entrada

**Se o balanceador de carga e o controlador de entrada NÃO estiverem descritos no mesmo gráfico Helm**, você pode simplesmente recriar o lançamento Helm. Levará alguns minutos e o controlador de entrada ficará indisponível durante esse tempo.

!!! warning "Se o gráfico Helm definir a configuração de um balanceador de carga"
    Se o gráfico Helm definir a configuração de um balanceador de carga junto com o controlador de entrada, a recriação do lançamento pode levar a um longo tempo de inatividade do balanceador de carga (depende do provedor de nuvem). O endereço IP do balanceador de carga pode ser alterado após a atualização se o endereço constante não estiver atribuído.

    Por favor, analise todos os possíveis riscos se estiver usando este método.

Para recriar o lançamento do Controlador de Entrada:

=== "Helm CLI"
    1. Exclua o lançamento anterior:

        ```bash
        helm delete <RELEASE_NAME> -n <NAMESPACE>
        ```

        * `<RELEASE_NAME>`: O nome do lançamento Helm com o gráfico do Controlador de Entrada

        * `<NAMESPACE>`: O namespace onde o controlador de entrada está implantado

        Por favor, não use a opção `--wait` ao executar o comando, pois pode aumentar o tempo de atualização.

    2. Crie um novo lançamento com o Controlador de Entrada 4.8:

        ```bash
        helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.8.2 -f `<PATH_TO_VALUES>`
        ```

        * `<RELEASE_NAME>`: O nome para o lançamento Helm do gráfico do Controlador de Entrada
        * `<NAMESPACE>`: O namespace para implantar o Controlador de Entrada
        * `<PATH_TO_VALUES>`: O caminho para o arquivo `values.yaml` que define as [configurações do controlador de entrada 4.8](#step-5-update-the-valuesyaml-configuration)
=== "Terraform CLI"
    1. Defina a opção `wait = false` na configuração do Terraform para diminuir o tempo de atualização:
        
        ```diff
        resource "helm_release" "release" {
          ...

        + wait = false

          ...
        }
        ```
    
    2. Exclua o lançamento anterior:

        ```bash
        terraform taint helm_release.release
        ```
    
    3. Crie o novo lançamento com o Controlador de Entrada 4.8:

        ```bash
        terraform apply -target=helm_release.release
        ```

### Método 3: Criação do lançamento do controlador de entrada sem afetar o balanceador de carga

Ao usar o balanceador de carga configurado pelo provedor de nuvem, recomenda-se atualizar o controlador de entrada com este método porque não afeta o balanceador de carga.

A recriação do lançamento levará alguns minutos e o controlador de entrada ficará indisponível durante esse tempo.

1. Obtenha os objetos a serem excluídos (exceto o balanceador de carga):

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | yq -r '. | select(.spec.type != "LoadBalancer") | .kind + "/" + .metadata.name' | tr 'A-Z' 'a-z' > objects-to-remove.txt
    ```

    Para instalar a utilidade `yq`, use as [instruções](https://pypi.org/project/yq/).

    Os objetos a serem excluídos serão emitidos para o arquivo `objects-to-remove.txt`.
2. Exclua os objetos listados e recrie o lançamento:

    ```bash
    cat objects-to-remove.txt | xargs kubectl delete --wait=false -n <NAMESPACE>    && \
    helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.8.2 -f `<PATH_TO_VALUES>`
    ```

    Para diminuir o tempo de inatividade do serviço, NÃO é recomendável executar comandos separadamente.
3. Garanta que todos os objetos são criados:

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | kubectl create -f -
    ```

    A saída deve dizer que todos os objetos já existem.

Estão os seguintes parâmetros passados nos comandos:

* `<RELEASE_NAME>`: O nome do lançamento Helm com o gráfico do Controlador de Entrada.
* `<NAMESPACE>`: O namespace onde o controlador de entrada está implantado.
* `<PATH_TO_VALUES>`: O caminho para o arquivo `values.yaml` definindo as [configurações do controlador de entrada 4.8](#step-5-update-the-valuesyaml-configuration).

## Passo 9: Teste o controlador de entrada atualizado

1. Verifique se a versão do gráfico Helm foi atualizada:

    ```bash
    helm ls
    ```

    A versão do gráfico deve corresponder a `wallarm-ingress-4.8.2`.
2. Obtenha a lista de pods especificando o nome do controlador de entrada Wallarm em `<INGRESS_CONTROLLER_NAME>`:
    
    ``` bash
    kubectl get pods -l release=<INGRESS_CONTROLLER_NAME>
    ```

    Cada status do pod deve ser **STATUS: Running** ou **READY: N/N**. Por exemplo:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

3. Envie a solicitação com o teste [Path Traversal](../../attacks-vulns-list.md#path-traversal) ataque ao endereço do controlador de entrada Wallarm:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Se o nó de filtragem estiver funcionando no modo `block`, o código `403 Forbidden` será retornado em resposta à solicitação e o ataque será exibido no Console Wallarm → **Eventos**.

## Passo 10: Ajuste as anotações do Ingress para as mudanças lançadas

Ajuste as seguintes anotações do Ingress para as mudanças lançadas no controlador de entrada 4.8:

1. Se estiver atualizando a partir da versão 2.18 ou inferior, [migre](../migrate-ip-lists-to-node-3.md) a configuração da lista de IPs. Como a lógica principal da lista de IPs foi significativamente alterada no nó Wallarm 3.x, é necessário ajustar a configuração da lista de IPs adequadamente, alterando as anotações do Ingress (se aplicável).
1. Certifique-se de que o comportamento esperado das configurações listadas abaixo corresponde à [lógica alterada dos modos de filtragem `off` e `monitoring`](what-is-new.md#filtration-modes):
      
      * [Diretiva `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Regra de filtragem geral configurada no Console Wallarm](../../user-guides/settings/general.md)
      * [Regras de filtragem de baixo nível configuradas no Console Wallarm](../../user-guides/rules/wallarm-mode-rule.md)

      Caso o comportamento esperado não corresponda à lógica modificada do modo de filtragem, ajuste as [anotações de Ingress](../../admin-en/configure-kubernetes-en.md#ingress-annotations) para as alterações lançadas.
1. Se o Ingress estiver anotado com `nginx.ingress.kubernetes.io/wallarm-instance`, renomeie esta anotação para `nginx.ingress.kubernetes.io/wallarm-application`.

    Apenas o nome da anotação mudou, sua lógica permanece a mesma. A anotação com o nome anterior será descontinuada em breve, então recomenda-se renomeá-la antes.
1. Se a página `&/usr/share/nginx/html/wallarm_blocked.html` configurada via anotações do Ingress é retornada para solicitações bloqueadas, [ajuste sua configuração](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) para as alterações lançadas.

    Nas novas versões do nó, a página de bloqueio de amostra da Wallarm [tem](what-is-new.md#new-blocking-page) a IU atualizada sem logotipo e email de suporte especificado por padrão.

## Passo 11: Reative o módulo de verificação de ameaça ativa (apenas se atualizar o nó 2.16 ou inferior)

Conheça a [recomendação sobre a configuração do módulo de verificação de ameaças ativas](../../vulnerability-detection/threat-replay-testing/setup.md) e reative-o se necessário.

Depois de um tempo, garanta que a operação do módulo não cause falsos positivos. Se descobrir falsos positivos, por favor, entre em contato com o [suporte técnico da Wallarm](mailto:support@wallarm.com).
