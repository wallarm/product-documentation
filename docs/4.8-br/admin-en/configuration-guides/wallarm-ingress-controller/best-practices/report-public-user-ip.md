# Relatório adequado do endereço IP público do usuário final (controlador Ingress baseado em NGINX)

Estas instruções descrevem a configuração do controlador Ingress da Wallarm necessária para identificar um endereço IP de origem de um cliente (usuário final) quando um controlador está posicionado atrás de um balanceador de carga.

Por padrão, o controlador Ingress assume que está diretamente exposto à Internet e que os endereços IP dos clientes conectados são seus IPs reais. No entanto, as solicitações podem ser passadas pelo balanceador de carga (por exemplo, AWS ELB ou Google Network Load Balancer) antes de serem enviadas para o controlador Ingress.

Em situações em que um controlador está colocada atrás de um balanceador de carga, o controlador Ingress considera o IP do balanceador de carga como o verdadeiro IP do usuário final, o que pode levar a [operação incorreta de alguns recursos da Wallarm](../../../using-proxy-or-balancer-en.md#possible-problems-of-using-a-proxy-server-or-load-balancer-ip-address-as-a-request-source-address). Para relatar os endereços IP corretos dos usuários finais ao controlador Ingress, por favor configure o controlador conforme descrito abaixo.

## Etapa 1: Ativar a transferência do IP real do cliente na camada de rede

Este recurso é altamente dependente da plataforma em nuvem que está sendo usada; na maioria dos casos, pode ser ativado definindo o atributo `values.yaml` `controller.service.externalTrafficPolicy` para o valor `Local`:

```
controller:
  service:
    externalTrafficPolicy: "Local"
```

## Etapa 2: Habilitar o controlador Ingress para obter o valor do cabeçalho da solicitação HTTP X-FORWARDED-FOR

Normalmente, os balanceadores de carga adicionam o cabeçalho HTTP [`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For) contendo um endereço IP original do cliente. Você pode encontrar o nome exato do cabeçalho na documentação do balanceador de carga.

O controlador Ingress da Wallarm pode obter o endereço IP real do usuário final deste cabeçalho se o `values.yaml` do controlador for configurado da seguinte forma:

```
controller:
  config:
    enable-real-ip: "true"
    forwarded-for-header: "X-Forwarded-For"
```

* [Documentação sobre o parâmetro `enable-real-ip`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#enable-real-ip)
* No parâmetro [`forwarded-for-header`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#forwarded-for-header), por favor especifique o nome do cabeçalho do balanceador de carga contendo um endereço IP original do cliente

--8<-- "../include/ingress-controller-best-practices-intro.md"
