# Alocando Recursos para o Nó Wallarm

A quantidade de memória e recursos de CPU alocados para o nó de filtro determina a qualidade e a velocidade do processamento da solicitação. Estas instruções descrevem as recomendações para a alocação de memória do nó de filtragem.

Em um nó de filtragem existem dois principais consumidores de memória e CPU:

* [Tarantool](#tarantool), também chamado de **módulo pós-analítico**. Este é o backend de análise de dados local e o principal consumidor de memória em um nó de filtragem.
* [NGINX](#nginx) é o principal nó de filtragem e componente de proxy reverso.

A utilização da CPU do NGINX depende de muitos fatores, como o nível de RPS, o tamanho médio de solicitação e resposta, o número de regras de conjunto de regras personalizadas manipuladas pelo nó, tipos e camadas de codificações de dados utilizadas, como Base64 ou compressão de dados, etc.

Em média, um núcleo de CPU pode manipular cerca de 500 RPS. Ao ser executado no modo de produção, é recomendado alocar pelo menos um núcleo de CPU para o processo NGINX e um núcleo para o processo Tarantool. Na maioria dos casos, é recomendado inicialmente sobrealocar um nó de filtragem, ver o uso real da CPU e da memória para os níveis de tráfego de produção reais e reduzir gradualmente os recursos alocados para um nível razoável (com pelo menos 2x de folga para picos de tráfego e redundância do nó).

## Tarantool

--8<-- "../include-pt-BR/allocate-resources-for-waf-node/tarantool-memory.md"

### Alocando Recursos no Controlador de Ingresso do Kubernetes

--8<-- "../include-pt-BR/allocate-resources-for-waf-node/tarantool-memory-ingress-controller.md"

### Alocando Recursos em Outras Opções de Implantação

O dimensionamento da memória do Tarantool é controlado usando o atributo `SLAB_ALLOC_ARENA` no arquivo de configuração `/etc/default/wallarm-tarantool`. Para alocar memória:

<ol start="1"><li>Abra para edição o arquivo de configuração do Tarantool:</li></ol>

=== "Debian 10.x (buster)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS 7.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "Amazon Linux 2.0.2021x e mais antigos"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

<ol start="2"><li>Defina o atributo <code>SLAB_ALLOC_ARENA</code> para o tamanho da memória. O valor pode ser um número inteiro ou um número de ponto flutuante (um ponto <code>.</code> é um separador decimal). Por exemplo:</li></ol>

```
SLAB_ALLOC_ARENA=1.0
```

<ol start="3"><li>Reinicie o Tarantool:</li></ol>

=== "Debian 10.x (buster)"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Amazon Linux 2.0.2021x e mais antigos"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

## NGINX

O consumo de memória do NGINX depende de muitos fatores. Em média, pode ser estimado da seguinte maneira:

```
Número de requisições simultâneas * Tamanho médio da requisição * 3
```

Por exemplo:

* O nó de filtragem está processando no pico 10000 solicitações simultâneas,
* o tamanho médio da solicitação é 5 kB.

O consumo de memória do NGINX pode ser estimado da seguinte maneira:

```
10000 * 5 kB * 3 = 150000 kB (ou ~150 MB)
```

**Para alocar a quantidade de memória:**

* para o pod do controlador de Ingresso NGINX (`ingress-controller`), configure as seguintes seções no arquivo `values.yaml` usando a opção `--set` de `helm install` ou `helm upgrade`:
    ```
    controller:
      resources:
        limits:
          cpu: 400m
          memory: 3280Mi
        requests:
          cpu: 200m
          memory: 1640Mi
    ```

    Exemplo de comandos alterando os parâmetros:

    === "Instalação do controlador de Ingresso"
        ```bash
        helm install --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        Também há [outros parâmetros](../configure-kubernetes-en.md#additional-settings-for-helm-chart) necessários para a correta instalação do controlador de Ingresso. Por favor, passe-os na opção `--set` também.
    === "Atualizando os parâmetros do controlador de Ingresso"
        ```bash
        helm upgrade --reuse-values --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

* para outras opções de implantação, use os arquivos de configuração do NGINX.

## Solução de Problemas

Se um nó Wallarm consome mais memória e CPU do que o esperado, para reduzir o uso de recursos, familiarize-se com as recomendações do artigo de [solução de problemas de alto uso de CPU](../../faq/cpu.md) e siga-as.
