[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[custom-blocking-page-docs]:        ../../admin-en/configuration-guides/configure-block-page-and-code.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[multitenancy-overview]:            ../multi-tenant/overview.md
[applications-docs]:                ../../user-guides/settings/applications.md
[available-filtration-modes]:       ../../admin-en/configure-wallarm-mode.md#available-filtration-modes
[ui-filtration-mode]:              ../../admin-en/configure-wallarm-mode.md#general-filtration-mode
[self-hosted-connector-node-helm-conf]: ../native-node/helm-chart-conf.md
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# Istio Ingress için Wallarm Filtresi

Wallarm, Istio tarafından yönetilen API’leri güvence altına almak için trafiği [satır içi](../inline/overview.md) veya [bant dışı](../oob/overview.md) analiz eden bir filtre sağlar. Wallarm node’u harici olarak dağıtırsınız ve gRPC tabanlı external processing filtresi aracılığıyla analize yönelik trafiği Wallarm node’una yönlendirmek için Envoy ayarlarında Wallarm tarafından sağlanan yapılandırmayı uygularsınız.

!!! info "OOB modu (aynalanmış trafik)"
    `observability_mode` Envoy parametresini [burada](https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/filters/http/ext_proc/v3/ext_proc.proto#envoy-v3-api-msg-extensions-filters-http-ext-proc-v3-externalprocessor) açıklandığı şekilde ayarlayarak Wallarm filtresini [bant dışı (OOB)](../oob/overview.md) trafik analizi için de kullanabilirsiniz.

## Kullanım senaryoları

Bu, Envoy proxy ile çalışan ve Istio tarafından yönetilen API’leri gerçek zamanlı olarak güvenceye almak için en uygun seçimdir.

## Sınırlamalar

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

## Gereksinimler

Dağıtıma devam edebilmek için aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Istio teknolojilerine hakimiyet
* API trafiğini yöneten Envoy proxy ile Istio

## Dağıtım

### 1. Bir Wallarm Node dağıtın

Wallarm node’u, dağıtmanız gereken Wallarm platformunun temel bileşenidir. Gelen trafiği inceler, kötü amaçlı aktiviteleri tespit eder ve tehditleri azaltacak şekilde yapılandırılabilir.

Self-hosted node dağıtımı için bir yapıt seçin ve `envoy-external-filter` modu için ekli talimatları izleyin:

* Bare metal veya VM’lerde Linux altyapıları için [Hepsi-bir-arada yükleyici](../native-node/all-in-one.md)
* Container tabanlı dağıtımlar kullanan ortamlar için [Docker image](../native-node/docker-image.md)
* AWS altyapıları için [AWS AMI](../native-node/aws-ami.md)
* Kubernetes kullanan altyapılar için [Helm chart](../native-node/helm-chart.md)

### 2. Envoy’u trafiği Wallarm node’una proxy’lemek için yapılandırın

1. `envoy.yaml` → `http_filters` bölümünüzde, istek ve yanıtları analiz için harici Wallarm Node’a gönderecek external processing filtresini yapılandırın. Bunun için aşağıdaki şablonu kullanın:

    ```yaml
    ...

    http_filters:
    - name: ext_proc
      typed_config:
        "@type": type.googleapis.com/envoy.extensions.filters.http.ext_proc.v3.ExternalProcessor
        grpc_service:
          envoy_grpc:
            cluster_name: wallarm_cluster
        processing_mode:
          request_body_mode: STREAMED
          response_body_mode: STREAMED
        request_attributes: ["request.id", "request.time", "source.address"]
    ```
1. `envoy.yaml` → `clusters` bölümünüzde, verileri Wallarm Node’a iletmek için kullanılan Wallarm kümesini yapılandırın. Bunun için aşağıdaki şablonu kullanın:

    ```yaml
    clusters:
    - ...
    - name: wallarm_cluster
      connect_timeout: 30s
      load_assignment:
        cluster_name: wallarm_cluster
        endpoints: # Wallarm Node'un uç noktası
        - lb_endpoints:
          - endpoint:
              address:
                socket_address:
                  address: 127.0.0.1
                  port_value: 5080
      http2_protocol_options: {} # http2'yi etkinleştirmek için ayarlanmalıdır
      transport_socket:
        name: envoy.transport_sockets.tls
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.UpstreamTlsContext
          common_tls_context:
            validation_context:
              trusted_ca:
                filename: /path/to/node-ca.pem # Node örneği tarafından kullanılan sertifikayı veren CA
    ```

!!! info "Olası 500 hatalarından kaçınma"
    Harici filtrede sorunlar oluştuğunda olası 500 hatalarından kaçınmak için yapılandırmaya [`failure_mode_allow`](https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/filters/http/ext_proc/v3/ext_proc.proto) parametresini ekleyebilirsiniz.

## Test

Dağıtılan filtrenin işlevselliğini test etmek için şu adımları izleyin:

1. Istio Gateway’e test amaçlı [Yol Geçişi][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl https://<ISTIO_GATEWAY_IP>/etc/passwd
    ```
1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinde açın ve saldırının listede görüntülendiğinden emin olun.

    ![Arayüzdeki Attacks][attacks-in-ui-image]