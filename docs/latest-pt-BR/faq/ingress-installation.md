# Instalando o controlador Wallarm Ingress baseado em NGINX

Este guia de solução de problemas lista problemas comuns que você pode enfrentar durante a [instalação do controlador Wallarm Ingress baseado em NGINX](../admin-en/installation-kubernetes-en.md). Se você não encontrou detalhes relevantes aqui, entre em contato com o [Suporte técnico da Wallarm](mailto:support@wallarm.com).

## Como verificar quais endereços IP dos clientes são detectados/utilizados pelo controlador Ingress?

* Dê uma olhada no log do contêiner do controlador e encontre registros sobre solicitações atendidas. No formato de log padrão, o primeiro campo relatado é o endereço IP do cliente detectado. `25.229.38.234` é o endereço IP detectado no exemplo abaixo:
```
[wallarm-ingress-nginx-ingress-controller-775cf75564-6jlt9 nginx-ingress-controller] 25.229.38.234 - - [14/Mar/2020:23:55:11 +0000] "GET /ping HTTP/1.1" 200 893 "-" "curl/7.64.1" 172 0.020 [default-sise-80] [] 172.17.0.5:8080 893 0.020 200 d8402076753798d3b065269c16d4b34f 
```

* Acesse seu console Wallarm para a [nuvem dos EUA](https://us1.my.wallarm.com) ou para a [nuvem da UE](https://my.wallarm.com) → a seção **Eventos** e expanda os detalhes da solicitação. Um endereço IP é exibido no campo *Origem*. Por exemplo:

    ![Endereço IP do qual a solicitação foi enviada](../images/request-ip-address.png)

    Se a lista de ataques estiver vazia, você pode enviar um [ataque de teste](../admin-en/installation-check-operation-en.md#2-run-a-test-attack) para o aplicativo protegido pelo controlador Wallarm Ingress.
    
## Como verificar que o controlador Ingress está recebendo o cabeçalho de solicitação X-FORWARDED-FOR?

Por favor, vá para o Console Wallarm para a [nuvem dos EUA](https://us1.my.wallarm.com) ou para a [nuvem da UE](https://my.wallarm.com) → a seção **Eventos** e expanda os detalhes da solicitação. Nos detalhes da solicitação exibidos, preste atenção ao cabeçalho `X-FORWARDED-FOR`. Por exemplo:

![O cabeçalho X-FORWARDED-FOR da solicitação](../images/x-forwarded-for-header.png)

Se a lista de ataques estiver vazia, você pode enviar um [ataque de teste](../admin-en/installation-check-operation-en.md#2-run-a-test-attack) para o aplicativo protegido pelo controlador Wallarm Ingress.
