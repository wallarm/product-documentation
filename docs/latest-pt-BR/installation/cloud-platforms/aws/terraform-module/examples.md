# Testando o Módulo Terraform Wallarm com exemplos

Preparamos exemplos de diferentes maneiras de usar o [Módulo Terraform Wallarm](https://registry.terraform.io/modules/wallarm/wallarm/aws/), para que você possa experimentá-lo antes de implementá-lo na produção.

Existem 4 exemplos representando abordagens frequentes de implementação:

* Solução Proxy
* Solução Avançada de Proxy
* Solução Espelho

## Solução Proxy

[Este exemplo](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) demonstra como implantar o Wallarm como um proxy inline para a Nuvem Privada Virtual (VPC) da AWS usando o módulo Terraform.

A solução proxy Wallarm fornece uma camada de rede funcional adicional que atua como um roteador de tráfego HTTP avançado com as funções de segurança do Next-Gen WAF e API. Esta é a opção de implantação **recomendada**, pois oferece a solução mais funcional e fácil de implementar.

![Esquema Proxy](../../../../images/waf-installation/aws/terraform/wallarm-as-proxy.png)

Características principais da solução:

* Wallarm processa o tráfego no modo síncrono, que não limita as capacidades do Wallarm e permite a mitigação instantânea de ameaças (`preset=proxy`).
* A solução Wallarm é implantada como uma camada de rede separada, que permite controlá-la independentemente de outras camadas e colocar a camada em quase qualquer posição de estrutura de rede. A posição recomendada está atrás de um balanceador de carga voltado para a Internet.

[Consulte o guia de implementação de exemplo no GitHub](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)

Você pode ver a flexibilidade da solução em ação ao experimentar a [solução avançada de proxy](#proxy-advanced-solution).

## Solução Avançada de Proxy

[Este exemplo](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced) demonstra como implantar o Wallarm como um proxy inline com configurações avançadas na Nuvem Privada Virtual (VPC) da AWS usando o módulo Terraform. É muito semelhante à [implantação de proxy simples](#proxy-solution), mas com algumas opções de configuração avançada frequentes demonstradas.

A solução avançada de proxy Wallarm (assim como um proxy simples) fornece uma camada de rede funcional adicional que atua como um roteador de tráfego HTTP avançado com as funções de segurança do Next-Gen WAF e API.

[Consulte o guia de implementação de exemplo no GitHub](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)

## Solução Proxy para Amazon API Gateway

[Este exemplo](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway) demonstra como proteger o [Amazon API Gateway](https://aws.amazon.com/api-gateway/) com Wallarm implementado como um proxy inline para a Nuvem Privada Virtual (VPC) da AWS usando o módulo Terraform.

A solução proxy Wallarm fornece uma camada de rede funcional adicional que atua como um roteador de tráfego HTTP avançado com as funções de segurança do Next-Gen WAF e API. Ele pode rotear solicitações para quase qualquer tipo de serviço, incluindo o Amazon API Gateway, sem limitar suas capacidades.

[Consulte o guia de implementação de exemplo no GitHub](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)

## Solução Espelho

[Este exemplo](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/mirror) demonstra como implantar o módulo Terraform Wallarm como uma solução Out-of-Band analisando o tráfego espelhado. Espera-se que o NGINX, Envoy, Istio e/ou Traefik já forneçam espelhamento de tráfego.

![Esquema Espelho](../../../../images/waf-installation/aws/terraform/wallarm-for-mirrored-traffic.png)

Características principais da solução:

* Wallarm processa o tráfego no modo assíncrono (`preset=mirror`) sem afetar o fluxo de tráfego atual, tornando a abordagem a mais segura.
* A solução Wallarm é implantada como uma camada de rede separada, que permite controlá-la independentemente de outras camadas e colocar a camada em quase qualquer posição de estrutura de rede. A posição recomendada está na rede privada.

[Consulte o guia de implementação de exemplo no GitHub](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/mirror)