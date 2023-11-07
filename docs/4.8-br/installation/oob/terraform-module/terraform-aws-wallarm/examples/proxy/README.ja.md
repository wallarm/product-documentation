					# Implantação do Wallarm como um Proxy no AWS VPC

Este exemplo descreve como implantar o Wallarm como um proxy inline em uma Virtual Private Cloud (VPC) da AWS usando o [módulo Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/).

A solução de proxy Wallarm fornece uma camada de rede adicional que atua como um roteador de tráfego HTTP avançado com recursos de WAF e segurança de API.

Você pode verificar a flexibilidade da solução testando a [solução proxy avançada](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced).

## Principais Características

* Wallarm processa o tráfego em modo síncrono, permitindo a mitigação imediata de ameaças sem limitar os recursos do Wallarm (`preset=proxy`).
* A solução Wallarm é implantada como uma camada de rede separada que pode ser controlada independentemente das outras camadas, permitindo a alocação da camada em quase qualquer posição na estrutura de rede. A posição recomendada está atrás dos balanceadores de carga voltados para a internet.

## Arquitetura da Solução

![Esquema do proxy Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Um exemplo de solução de proxy Wallarm inclui os seguintes componentes:

* Um Application Load Balancer voltado para a Internet para rotear o tráfego para as instâncias do nó Wallarm.
* Instâncias do nó Wallarm para analisar o tráfego e proxy adicional de qualquer pedido. Os elementos correspondentes são instâncias EC2 A, B e C no esquema.

     Neste exemplo, os nós Wallarm operam em um modo de monitoramento que produz o comportamento descrito. Os nós Wallarm também podem operar em outros modos voltados para o bloqueio de pedidos maliciosos e o encaminhamento adicional apenas de pedidos legítimos. Consulte a [nossa documentação](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) para detalhes dos modos dos nós Wallarm.
* O serviço para o qual o nó Wallarm faz proxy do pedido. O serviço pode ser de qualquer tipo. Por exemplo:

    * Uma aplicação AWS API Gateway conectada à VPC através do endpoint da VPC (a implantação do Terraform do Wallarm correspondente é abordada no [exemplo API Gateway](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)).
    * AWS S3
    * Nó EKS executando dentro do cluster EKS (para este caso, recomenda-se usar a Configuração do Internal Load Balancer ou do Serviço NodePort)
    * Outros serviços de backend

    Por padrão, os nós Wallarm fazem proxy de tráfego para `https://httpbin.org`. Durante o lançamento do exemplo, você pode especificar qualquer outro domínio ou caminho de serviço acessível a partir da Virtual Private Cloud (VPC) da AWS para fazer proxy do tráfego.

    Usando a opção de configuração do módulo `https_redirect_code = 302`, você pode voltar os pedidos HTTP para HTTPS de forma segura utilizando o AWS ALB.

Os componentes listados (exceto o servidor proxy) são implantados pelo módulo de exemplo `wallarm` fornecido.

## Componentes do Código

Este exemplo inclui os seguintes componentes de código:

* `main.tf`: A configuração principal do módulo `wallarm` implantado como solução de proxy. A configuração cria a instância AWS ALB e do Wallarm.
* `ssl.tf`: Configuração de offload SSL/TLS que emite automaticamente um novo AWS Certificate Manager (ACM) para o domínio especificado pelo `variable_name` e associa o mesmo ao ALB da AWS.

     Para desativar esta funcionalidade, comente os ficheiros `ssl.tf` e `dns.tf` e comente adicionalmente as opções `lb_ssl_enabled`, `lb_certificate_arn`, `https_redirect_code`, `depends_on` na definição do módulo `wallarm`. Com esta funcionalidade desativada, apenas a porta HTTP (80) estará disponível. 
* `dns.tf`: Configuração do AWS Route 53 para provisionar registros DNS para o ALB da AWS.

     Siga as instruções acima para desativar esta funcionalidade.

## Requisitos

* Terraform 1.0.5 ou mais recente [instalado localmente](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Acesso a uma conta com a função de **administrador** no console Wallarm [EU Cloud](https://my.wallarm.com/) ou [US Cloud](https://us1.my.wallarm.com/)
* Acesso a `https://api.wallarm.com` se estiver colaborando com a Wallarm Cloud EU, ou `https://us1.api.wallarm.com` se estiver colaborando com a Wallarm Cloud US. Verifique se o firewall não está bloqueando o acesso.
* Para testar o exemplo com os recursos SSL e DNS habilitados, você precisará configurar a [zona de hospedagem do Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html.)

## Executando o Exemplo de Solução Proxy Wallarm AWS

1. Faça o cadastro no console Wallarm [EU Cloud](https://my.wallarm.com/nodes) ou [US Cloud](https://us1.my.wallarm.com/nodes).
1. Abra **Nós** no console do Wallarm e crie um nó do tipo **Nó Wallarm**.
1. Copie o token do nó gerado.
1. Clone o repositório que contém o código do exemplo na sua máquina:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Defina os valores das variáveis na opção `default` do arquivo `variables.tf` dentro do repositório clonado `examples/proxy`, e salve as alterações.
1. Defina o protocolo e o endereço do seu servidor proxy em `proxy_pass` em `examples/proxy/main.tf`.

     Por padrão, o Wallarm faz proxy do tráfego para `https://httpbin.org`. Se o valor padrão atende às suas necessidades, deixe-o como está.
1. A partir do diretório `examples/proxy`, execute os seguintes comandos para implantar a pilha:

     ```
     terraform init
     terraform apply
     ```

Para remover o ambiente implantado, utilize o seguinte comando:

```
terraform destroy
```

## Solução de Problemas

### A Wallarm está recreando constantemente instâncias

As configurações do grupo de auto scaling da AWS fornecido estão focadas na melhor confiabilidade e disponibilidade do serviço. Se o grupo de Auto Scaling da AWS estiver criando e terminando constantemente as instâncias EC2 durante a inicialização, é possível que a verificação de integridade esteja falhando.

Para resolver este problema, verifique e corrija as seguintes configurações:

* O token do nó Wallarm é um valor válido que foi copiado da UI do console Wallarm.
* A configuração NGINX é válida.
* O nome do domínio especificado na configuração NGINX é resolvido corretamente (por exemplo, o valor de `proxy_pass`).

**Medida Extrema** Se o problema não for resolvido embora as configurações acima estejam corretas, você pode desabilitar manualmente o health check do ELB nas configurações do grupo Auto Scaling para encontrar a causa do problema. Isso manterá a instância ativa mesmo se a configuração do serviço estiver inválida, e a instância não será reiniciada. Isso proporcionará tempo para examinar detalhadamente os logs e depurar o serviço, e o problema poderá ser resolvido em alguns minutos.

## Recursos Adicionais

* [Certificado AWS ACM](https://docs.aws.amazon.com/acm/latest/userguide/gs.html)
* [AWS VPC com sub-redes públicas e privadas (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)