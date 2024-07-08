# Gerenciando a Wallarm usando Terraform

Se você usa [Terraform](https://www.terraform.io/) para gerenciar suas infraestruturas, pode ser uma opção confortável para você usá-lo para gerenciar a Wallarm. O [provedor Wallarm](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) para Terraform permite isso.

## Requisitos

* Conhecimento básico do [Terraform](https://www.terraform.io/)
* Binário do Terraform 0.15.5 ou superior
* Conta Wallarm na [Nuvem EUA](https://us1.my.wallarm.com/) ou [Nuvem EU](https://my.wallarm.com/)
* Acesso à conta com a função **Administrador** na Console Wallarm na Nuvem EUA ou EU [Cloud](../../about-wallarm/overview.md#cloud)
* Acesso a `https://us1.api.wallarm.com` se estiver trabalhando com a Nuvem Wallarm dos EUA ou a `https://api.wallarm.com` se estiver trabalhando com a Nuvem Wallarm da EU. Por favor, certifique-se de que o acesso não está bloqueado por um firewall

## Instalando o provedor

1. Copie e cole na configuração do Terraform:

    ```
    terraform {
      required_version = ">= 0.15.5"

      required_providers {
        wallarm = {
          source = "wallarm/wallarm"
          version = "1.1.2"
        }
      }
    }

    provider "wallarm" {
      # Opções de configuração
    }
    ```

1. Execute `terraform init`.

## Conectando o provedor à sua conta Wallarm

Para conectar o provedor Terraform da Wallarm à sua conta Wallarm na [Nuvem EUA](https://us1.my.wallarm.com/signup) ou [Nuvem EU](https://my.wallarm.com/signup), defina as credenciais de acesso à API na configuração do Terraform:

=== "Nuvem EUA"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://us1.api.wallarm.com"
      # Apenas necessário quando a funcionalidade multilocação é utilizada:
      # client_id = <CLIENT_ID>
    }
    ```
=== "Nuvem EU"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://api.wallarm.com"
      # Apenas necessário quando a funcionalidade multilocação é utilizada:
      # client_id = <CLIENT_ID>
    }
    ```

* `<WALLARM_API_TOKEN>` permite o acesso à API de sua conta Wallarm. [Como conseguir it →](../../user-guides/settings/api-tokens.md)
* `<CLIENT_ID>` é ID do inquilino (cliente); requerido apenas quando a função de [multilocação](../../installation/multi-tenant/overview.md) é usada. Pegue o `id` (não `uuid`) conforme descrito [aqui](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api).

Veja os [detalhes](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) na documentação do provedor Wallarm.

## Gerenciando a Wallarm com provedor

Com o provedor Wallarm, via Terraform você pode gerenciar:

* [Nós](../../user-guides/nodes/nodes.md) em sua conta
* [Aplicativos](../../user-guides/settings/applications.md)
* [Regras](../../user-guides/rules/rules.md)
* [Gatilhos](../../user-guides/triggers/triggers.md)
* IPs na [lista de negação](../../user-guides/ip-lists/denylist.md), [lista de permissão](../../user-guides/ip-lists/allowlist.md) e [lista cinza](../../user-guides/ip-lists/graylist.md)
* [Usuários](../../user-guides/settings/users.md)
* [Integrações](../../user-guides/settings/integrations/integrations-intro.md)
* Modo de [filtração](../../admin-en/configure-wallarm-mode.md) global
* Escopo [Scanner](../../user-guides/scanner.md)
* [Vulnerabilidades](../../user-guides/vulnerabilities.md)

!!! info "Provedor Terraform Wallarm e nós CDN"
    Atualmente, nós [CDN](../../user-guides/nodes/cdn-node.md) não podem ser gerenciados por meio do provedor Terraform Wallarm.

Veja como realizar as operações listadas na [documentação](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) do provedor Wallarm.

## Exemplo de uso

Abaixo está um exemplo de configuração Terraform para Wallarm:

```
provider "wallarm" {
  api_token = "<WALLARM_API_TOKEN>"
  api_host = "https://us1.api.wallarm.com"
}

resource "wallarm_global_mode" "global_block" {
  waf_mode = "default"
}

resource "wallarm_application" "tf_app" {
  name = "Terraform Application 001"
  app_id = 42
}

resource "wallarm_rule_mode" "tiredful_api_mode" {
  mode =  "monitoring"

  action {
    point = {
      instance = 42
    }
  }

  action {
    type = "regex"
    point = {
      scheme = "https"
    }
  }
}
```

Salve o arquivo de configuração e depois execute `terraform apply`.

A configuração faz o seguinte:

* Conecta à Nuvem EUA → conta da empresa com o token de API Wallarm fornecido.
* `resource "wallarm_global_mode" "global_block"` → define o modo de filtração global para `Configurações locais (padrão)`, o que significa que o modo de filtração é controlado localmente em cada nó.
* `resource "wallarm_application" "tf_app"` → cria aplicativo chamado `Terraform Application 001` com ID `42`.
* `resource "wallarm_rule_mode" "tiredful_api_mode"` → cria a regra que define o modo de filtração de tráfego para `Monitoring` para todas as solicitações enviadas através do protocolo HTTPS para o aplicativo com ID `42`.

## Informações adicionais sobre Wallarm e Terraform

O Terraform suporta uma série de integrações (**[provedores](https://www.terraform.io/language/providers)**) e configurações prontas para usar (**[módulos](https://www.terraform.io/language/modules)**) disponíveis para usuários através do [registro](https://www.terraform.io/registry#navigating-the-registry) público, fornecido por diversos fornecedores.

Para este registro, a Wallarm publicou:

* O [provedor Wallarm](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) para gerenciar a Wallarm via Terraform. Descrito no artigo atual.
* O [módulo Wallarm](../../installation/cloud-platforms/aws/terraform-module/overview.md) para implantar o nó na AWS a partir do ambiente compatível com Terraform.

Essas duas são ferramentas independentes usadas para diferentes propósitos. Não é necessário usar um para usar o outro.
