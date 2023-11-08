# Personalizando o Wallarm Sidecar

Este artigo instrui você sobre a personalização segura e efetiva da [solução Wallarm Kubernetes Sidecar](deployment.md) fornecendo exemplos para alguns casos de uso de personalização comuns.

## Área de configuração

A solução Wallarm Sidecar é baseada nos componentes padrão do Kubernetes, portanto, a configuração da solução é muito semelhante à configuração da stack do Kubernetes. Você pode configurar a solução Wallarm Sidecar globalmente através do `values.yaml` e em uma base por aplicativo de pod via anotações.

### Configurações globais

As opções de configuração global se aplicam a todos os recursos de sidecar criados pelo controlador Wallarm e são definidas nos [valores padrão do gráfico Helm](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml). Você pode substituí-los durante `helm install` ou `helm upgrade` fornecendo um `values.yaml` personalizado.

O número de opções de configuração global disponíveis é ilimitado. Deve-se ter cuidado ao personalizar a solução, pois ela permite a alteração completa do Pod resultante e a função inadequada da solução como resultado. Por favor, confie na documentação do Helm e Kubernetes ao alterar as configurações globais.

[Aqui está a lista de valores específicos do gráfico Wallarm](helm-chart-for-wallarm.md)

### Configurações por pod

As configurações por pod permitem personalizar o comportamento da solução para determinados aplicativos.

As configurações do pod de aplicação por aplicação são definidas através das anotações do Pod do aplicativo. As anotações têm precedência sobre as configurações globais. Se a mesma opção for especificada globalmente e através da anotação, o valor da anotação será aplicado.

O conjunto de anotações suportadas é limitado, mas as anotações `nginx-*-include` e `nginx-*-snippet` permitem qualquer [configuração personalizada do NGINX a ser usada pela solução](#using-custom-nginx-configuration).

[Aqui está a lista de anotações suportadas por pod](pod-annotations.md)

## Casos de uso de configuração

Como mencionado acima, você pode personalizar a solução de várias maneiras para se adequar à sua infraestrutura e requisitos para a solução de segurança. Para tornar as opções de personalização mais comuns mais fáceis de implementar, as descrevemos considerando as melhores práticas relacionadas.

### Implementação única e dividida de contêineres

A Wallarm oferece duas opções para a implementação de contêineres Wallarm em um Pod:

* Implantação única (por padrão)
* Implantação dividida

![Contêineres únicos e divididos][single-split-containers-img]

Você pode definir as opções de implementação do contêiner tanto na base global quanto no pod:

* Globalmente, definindo o valor do gráfico Helm `config.injectionStrategy.schema` para `single` (padrão) ou `split`.
* Em uma base por pod, definindo a anotação do Pod do aplicativo apropriado `sidecar.wallarm.io/sidecar-injection-schema` para `"single"` ou `"split"`.

!!! info "Módulo de pós-análise"
     Observe que o contêiner do módulo pós-análise é executado [separadamente](deployment.md#solution-architecture), as opções de implantação descritas referem-se apenas a outros contêineres.

#### Implantação única (por padrão)

Com a implantação única de contêineres Wallarm, apenas um contêiner será executado em um Pod, além do contêiner init opcional com **iptables**.

Como resultado, existem dois contêineres em execução:

* `sidecar-init-iptables` é o contêiner init que executa iptables. Por padrão, este contêiner inicia, mas você pode [desativá-lo](#capturing-incoming-traffic-port-forwarding).
* `sidecar-proxy` executa o proxy NGINX com os módulos Wallarm e alguns serviços auxiliares. Todos esses processos são executados e gerenciados pelo [supervisord](http://supervisord.org/).

#### Implantação dividida

Com a implantação dividida de contêineres Wallarm, dois contêineres adicionais serão executados em um Pod, além de dois contêineres init.

Esta opção move todos os serviços auxiliares para fora do contêiner `sidecar-proxy` e permanece apenas os serviços NGINX para serem iniciados pelo contêiner.

A implantação de contêineres divididos oferece um controle mais granular sobre os recursos consumidos por NGINX e serviços auxiliares. É a opção recomendada para aplicativos altamente carregados onde a divisão dos namespaces da CPU/Memória/Armazenamento entre os contêineres Wallarm e auxiliares é necessária.

Como resultado, existem quatro contêineres em execução:

* `sidecar-init-iptables` é o contêiner init que executa iptables. Por padrão, este contêiner inicia, mas você pode [desativá-lo](#capturing-incoming-traffic-port-forwarding).
* `sidecar-init-helper` é o contêiner init com serviços auxiliares encarregados de conectar o nó Wallarm ao Wallarm Cloud.
* `sidecar-proxy` é o contêiner com serviços NGINX.
* `sidecar-helper` é o contêiner com alguns outros serviços auxiliares.

### Descoberta automática de porta do contêiner de aplicação

A porta do aplicativo protegido pode ser configurada de muitas maneiras. Para lidar adequadamente e encaminhar o tráfego de entrada, o Wallarm sidecar deve estar ciente da porta TCP que o contêiner do aplicativo aceita pedidos de entrada.

Por padrão, o controlador sidecar descobre automaticamente a porta na seguinte ordem de prioridade:

1. Se a porta estiver definida através da anotação do pod `sidecar.wallarm.io/application-port`, o controlador Wallarm usará esse valor.
1. Se houver a porta definida sob a configuração do contêiner de aplicação `name: http`, o controlador Wallarm usará esse valor.
1. Se não houver porta definida sob a configuração `name: http`, o controlador Wallarm usará o valor da porta encontrado primeiro nas configurações do contêiner do aplicativo.
1. Se não houver portas definidas nas configurações do contêiner do aplicativo, o controlador Wallarm usará o valor de `config.nginx.applicationPort` do gráfico Wallarm Helm.

Se a descoberta automática da porta do contêiner do aplicativo não funcionar conforme o esperado, especifique a porta explicitamente usando a 1ª ou a 4ª opção.

### Capturando tráfego de entrada (encaminhamento de porta)

Por padrão, o controlador Wallarm sidecar roteia o tráfego da seguinte maneira:

1. Captura o tráfego de entrada que chega ao IP do Pod anexado e à porta do contêiner do aplicativo.
1. Redireciona esse tráfego para o contêiner de sidecar usando os recursos internos de iptables.
1. O sidecar mitiga solicitações maliciosas e encaminha tráfego legítimo para o contêiner do aplicativo.

A captura de tráfego de entrada é implementada usando o contêiner init que executa iptables, que é a melhor prática para o encaminhamento automático de portas. Este contêiner é executado como privilegiado, com a capacidade `NET_ADMIN`.

![Encaminhamento de porta padrão com iptables][port-forwarding-with-iptables-img]

No entanto, essa abordagem é incompatível com a malha de serviço como o Istio, uma vez que o Istio já tem a captura de tráfego baseada em iptables implementada. Nesse caso, você pode desativar iptables e o encaminhamento de portas funcionará da seguinte maneira:

![Encaminhamento de porta sem iptables][port-forwarding-without-iptables-img]

!!! info "Contêiner do aplicativo desprotegido"
     Se iptables estiver desativado, um contêiner de aplicativo exposto não será protegido pelo Wallarm. Como resultado, o tráfego "east-west" malicioso pode alcançar o contêiner do aplicativo se seu endereço IP e porta forem conhecidos por um invasor.

     O tráfego east/west é o tráfego que circula pelo cluster Kubernetes (por exemplo, de serviço para serviço).

Você pode alterar o comportamento padrão da seguinte maneira:

1. Desativar iptables de uma das maneiras:

    * Globalmente, definindo o valor do gráfico Helm `config.injectionStrategy.iptablesEnable` para `"false"`
    * Em uma base por pod, definindo a anotação do Pod `sidecar.wallarm.io/sidecar-injection-iptables-enable` para `"false"`
2. Atualize a configuração `spec.ports.targetPort` em seu manifesto de Serviço para apontar para a porta `proxy`.

    Se a captura de tráfego baseada em iptables estiver desabilitada, o contêiner Wallarm sidecar publicará uma porta com o nome `proxy`. Para que o tráfego de entrada venha do serviço Kubernetes para a porta `proxy`, a configuração `spec.ports.targetPort` em seu manifesto de Serviço deve apontar para esta porta:

```yaml hl_lines="16-17 34"
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
        sidecar.wallarm.io/sidecar-injection-iptables-enable: "false"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-svc
  namespace: default
spec:
  ports:
    - port: 80
      targetPort: proxy
      protocol: TCP
      name: http
  selector:
    app: myapp
```

### Alocando recursos para contêineres

A quantidade de memória alocada para os contêineres Wallarm sidecar determina a qualidade e a velocidade do processamento de solicitações. Para alocar recursos suficientes para solicitações de memória e limites, [conheça nossas recomendações][allocate-resources-for-node-docs].

A alocação de recursos é permitida tanto no nível global quanto no nível do pod.

#### Alocação global via valores do gráfico Helm

| Padrão de implantação de contêiner | Nome do contêiner        | Valor do gráfico                                      |
|-------------------|-----------------------|--------------------------------------------------|
| [Dividido, Único](#single-and-split-deployment-of-containers)     | sidecar-proxy         | config.sidecar.containers.proxy.resources        |
| Dividido             | sidecar-helper        | config.sidecar.containers.helper.resources       |
| Dividido, Único     | sidecar-init-iptables | config.sidecar.initContainers.iptables.resources |
| Dividido             | sidecar-init-helper   | config.sidecar.initContainers.helper.resources   |

Exemplo de valores do gráfico Helm para gerenciamento de recursos (solicitações e limites) globalmente:

```yaml
config:
  sidecar:
    containers:
      proxy:
        resources:
          requests:
            cpu: 200m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
      helper:
        resources:
          requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 300m
              memory: 256Mi
    initContainers:
      helper:
        resources:
          requests:
            cpu: 100m
            memory: 64Mi
          limits:
            cpu: 300m
            memory: 128Mi
      iptables:
        resources:
          requests:
            cpu: 50m
            memory: 32Mi
          limits:
            cpu: 100m
            memory: 64Mi
```

#### Alocação de base por pod via anotações de Pod

| Padrão de implantação de contêiner | Nome do contêiner        | Anotação                                                             |
|-------------------|-----------------------|------------------------------------------------------------------------|
| [Único, Dividido](#single-and-split-deployment-of-containers)     | sidecar-proxy         | sidecar.wallarm.io/proxy-{cpu,memory,cpu-limit,memory-limit}         |
| Dividido             | sidecar-helper        | sidecar.wallarm.io/helper-{cpu,memory,cpu-limit,memory-limit}        |
| Único, Dividido     | sidecar-init-iptables | sidecar.wallarm.io/init-iptables-{cpu,memory,cpu-limit,memory-limit} |
| Dividido             | sidecar-init-helper   | sidecar.wallarm.io/init-helper-{cpu,memory,cpu-limit,memory-limit}   |

Exemplo de anotações para gerenciar recursos (solicitações e limites) em uma base por pod (com o padrão de contêiner `único` habilitado):

```yaml hl_lines="16-24"
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
        sidecar.wallarm.io/proxy-cpu: 200m
        sidecar.wallarm.io/proxy-cpu-limit: 500m
        sidecar.wallarm.io/proxy-memory: 256Mi
        sidecar.wallarm.io/proxy-memory-limit: 512Mi
        sidecar.wallarm.io/init-iptables-cpu: 50m
        sidecar.wallarm.io/init-iptables-cpu-limit: 100m
        sidecar.wallarm.io/init-iptables-memory: 32Mi
        sidecar.wallarm.io/init-iptables-memory-limit: 64Mi
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

### Término SSL/TLS

Por padrão, a solução Sidecar aceita apenas tráfego HTTP e encaminha tráfego HTTP simples para os pods do aplicativo. Presume-se que a terminação SSL/TLS seja realizada por um componente de infraestrutura localizado antes da solução sidecar (como Ingress/Application Gateway), permitindo que a solução sidecar processe HTTP simples.

No entanto, pode haver casos em que a infraestrutura existente não suporte a terminação SSL/TLS. Nesses casos, você pode habilitar a terminação SSL/TLS no nível do Wallarm sidecar. Este recurso é suportado a partir do gráfico Helm 4.6.1.

!!! warning "A solução Sidecar suporta o processamento de tráfego SSL ou HTTP simples"
    A solução Wallarm Sidecar suporta o processamento de tráfego SSL/TLS ou HTTP simples. A habilitação da terminação SSL/TLS significa que a solução sidecar não processará o tráfego HTTP simples, enquanto a desabilitação da terminação SSL/TLS resultará no processamento apenas do tráfego HTTPS.

Para habilitar a terminação SSL/TLS:

1. Obtenha o certificado do servidor (chave pública) e a chave privada associada ao servidor para o qual o Sidecar irá terminar o SSL/TLS.
1. No namespace do pod do aplicativo, crie um [segredo TLS](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) contendo o certificado do servidor e a chave privada.
1. No arquivo `values.yaml`, adicione a seção `config.profiles` para montagem de segredos. O exemplo abaixo mostra várias configurações de montagem de certificado.

    Personalize o código com base nos comentários para atender às suas necessidades. Remova quaisquer configurações de montagem de certificado desnecessárias se você precisar apenas de um certificado.

    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          host: "us1.api.wallarm.com" # ou string vazia se estiver usando o EU Cloud
        # Outras configurações Wallarm https://docs.wallarm.com/installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm/
      profiles:
        tls-profile: # Defina qualquer nome de perfil TLS desejado aqui
          sidecar:
            volumeMounts:
              - name: nginx-certs-example-com # Nome do volume contendo chaves example.com
                mountPath: /etc/nginx/certs/example.com # Caminho para montar chaves example.com no contêiner
                readOnly: true
              - name: nginx-certs-example-io # Nome do volume contendo chaves example.io
                mountPath: /etc/nginx/certs/example.io # Caminho para montar chaves example.io no contêiner
                readOnly: true
            volumes:
              - name: nginx-certs-example-com # Nome do volume contendo chaves example.com
                secret:
                  secretName: example-com-certs # Nome do segredo criado para o backend example.com, contendo chaves pública e privada
              - name: nginx-certs-example-io # Nome do volume contendo chaves example.io
                secret:
                  secretName: example-io-certs # Nome do segredo criado para o backend example.io, contendo chaves pública e privada
          nginx:
            # Configuração específica do módulo SSL NGINX para seu procedimento de terminação TLS/SSL.
            # Consulte https://nginx.org/en/docs/http/ngx_http_ssl_module.html.
            # Esta configuração é necessária para o Sidecar realizar a terminação de tráfego.
            servers:
              - listen: "ssl http2"
                include:
                  - "server_name example.com www.example.com"
                  - "ssl_protocols TLSv1.3"
                  - "ssl_certificate /etc/nginx/certs/example.com/tls.crt"
                  - "ssl_certificate_key /etc/nginx/certs/example.com/tls.key"
                  - "ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384"
                  - "ssl_conf_command Ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256"
              - listen: "ssl"
                include:
                  - "server_name example.io www.example.io"
                  - "ssl_protocols TLSv1.2 TLSv1.3"
                  - "ssl_certificate /etc/nginx/certs/example.io/tls.crt"
                  - "ssl_certificate_key /etc/nginx/certs/example.io/tls.key"
    ```
1. Aplique as alterações de `values.yaml` na solução Sidecar usando o seguinte comando:

    ```bash
    helm upgrade <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar -f values.yaml
    ```
1. [Aplique](pod-annotations.md#how-to-use-annotations) a anotação `sidecar.wallarm.io/profile: tls-profile` ao pod do aplicativo.
1. Uma vez que a configuração é aplicada, você pode testar a solução seguindo os passos descritos [aqui](deployment.md#step-4-test-the-wallarm-sidecar-proxy-operation), substituindo o protocolo HTTP pelo HTTPS.

A solução sidecar aceitará tráfego TLS/SSL, o encerrará e encaminhará tráfego HTTP simples para o pod do aplicativo.

### Habilitando módulos adicionais do NGINX

A imagem do Docker do Wallarm sidecar é distribuída com os seguintes módulos adicionais do NGINX desabilitados por padrão:

* [ngx_http_auth_digest_module.so](https://github.com/atomx/nginx-http-auth-digest)
* [ngx_http_brotli_filter_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_brotli_static_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_geoip2_module.so](https://github.com/leev/ngx_http_geoip2_module)
* [ngx_http_influxdb_module.so](https://github.com/influxdata/nginx-influxdb-module)
* [ngx_http_modsecurity_module.so](https://github.com/SpiderLabs/ModSecurity)
* [ngx_http_opentracing_module.so](https://github.com/opentracing-contrib/nginx-opentracing)

Você pode habilitar módulos adicionais apenas em uma base por pod, definindo a anotação de Pod `sidecar.wallarm.io/nginx-extra-modules`.

O formato do valor da anotação é uma matriz. Exemplo com módulos adicionais habilitados:

```yaml hl_lines="16-17"
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
        sidecar.wallarm.io/nginx-extra-modules: "['ngx_http_brotli_filter_module.so','ngx_http_brotli_static_module.so', 'ngx_http_opentracing_module.so']"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

### Usando configuração personalizada do NGINX

Se não houver [anotações de pods](pod-annotations.md) dedicadas para algumas configurações do NGINX, você pode especificá-las via **snippets** e **includes** do pod.

#### Snippet

Snippets é uma maneira conveniente de adicionar alterações de uma linha à configuração do NGINX. Para alterações mais complexas, [includes](#include) é uma opção recomendada.

Para especificar configurações personalizadas via snippets, use as seguintes anotações de pod:

| Seção de configuração do NGINX | Anotação                                  |
|----------------------|---------------------------------------------|
| http                 | `sidecar.wallarm.io/nginx-http-snippet`     |
| server               | `sidecar.wallarm.io/nginx-server-snippet`   |
| location             | `sidecar.wallarm.io/nginx-location-snippet` |

Exemplo da anotação alterando o valor da diretiva NGINX [`disable_acl`][disable-acl-directive-docs]:

```yaml hl_lines="18"
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
        sidecar.wallarm.io/wallarm-mode: block
        sidecar.wallarm.io/nginx-location-snippet: "disable_acl on"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

Para especificar mais de uma diretiva, use o símbolo `;`, por exemplo:

```yaml
sidecar.wallarm.io/nginx-location-snippet: "disable_acl on;wallarm_timeslice 10"
```

#### Include

Para montar um arquivo de configuração adicional do NGINX no contêiner Wallarm sidecar, você pode [criar ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) ou [recurso Secret](https://kubernetes.io/docs/concepts/configuration/secret/#creating-a-secret) a partir deste arquivo e usar o recurso criado no contêiner.

Uma vez que o ConfigMap ou o recurso Secret esteja criado, você pode montá-lo no contêiner através dos [componentes Volume e VolumeMounts](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) usando as seguintes anotações de pod:

| Item          |  Anotação                                    | Tipo de valor  |
|---------------|------------------------------------------------|-------------|
| Volumes       | `sidecar.wallarm.io/proxy-extra-volumes`       | JSON |
| Montagens de volume | `sidecar.wallarm.io/proxy-extra-volume-mounts` | JSON |

Uma vez que o recurso esteja montado no contêiner, especifique o contexto do NGINX para adicionar a configuração passando o caminho para o arquivo montado na anotação correspondente:

| Seção de configuração NGINX | Anotação                                  | Tipo de valor |
|----------------------|---------------------------------------------|------------|
| http                 | `sidecar.wallarm.io/nginx-http-include`     | Array  |
| server               | `sidecar.wallarm.io/nginx-server-include`   | Array  |
| location             | `sidecar.wallarm.io/nginx-location-include` | Array  |

Abaixo está o exemplo com um arquivo de configuração montado incluído no nível `http` da configuração NGINX. Este exemplo presume que o ConfigMap `nginx-http-include-cm` foi criado com antecedência e contém diretivas válidas de configuração NGINX.

```yaml hl_lines="16-19"
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
        sidecar.wallarm.io/proxy-extra-volumes: '[{"name": "nginx-http-extra-config", "configMap": {"name": "nginx-http-include-cm"}}]'
        sidecar.wallarm.io/proxy-extra-volume-mounts: '[{"name": "nginx-http-extra-config", "mountPath": "/nginx_include/http.conf", "subPath": "http.conf"}]'
        sidecar.wallarm.io/nginx-http-include: "['/nginx_include/http.conf']"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

### Configurando recursos do Wallarm

Além das configurações gerais da solução listadas, também recomendamos que você aprenda as [melhores práticas para prevenção de ataques com Wallarm][wallarm-attack-prevention-best-practices-docs].

Esta configuração é realizada através de [anotações](pod-annotations.md) e da UI Console Wallarm.

## Outras configurações via anotações

Além dos casos de uso de configuração listados, você pode ajustar a solução Wallarm sidecar para os pods de aplicação usando muitas outras anotações.

[Aqui está a lista de anotações suportadas por pod](pod-annotations.md)