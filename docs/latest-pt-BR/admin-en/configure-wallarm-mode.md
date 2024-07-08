[acl-access-phase]:     ../admin-en/configure-parameters-en.md#wallarm_acl_access_phase 

# Configuração do modo de filtração

O modo de filtração define o comportamento do nó de filtragem ao processar solicitações recebidas. Estas instruções descrevem os modos de filtração disponíveis e seus métodos de configuração.

## Modos de filtração disponíveis

O nó de filtragem Wallarm pode processar solicitações recebidas nos seguintes modos (do mais brando ao mais restrito):

* **Desativado** (`off`)
* **Monitoramento** (`monitoring`)
* **Bloqueio seguro** (`safe_blocking`)
* **Bloqueio** (`block`)

--8<-- "../include-pt-BR/wallarm-modes-description-latest.md"

## Métodos de configuração do modo de filtração

O modo de filtração pode ser configurado das seguintes maneiras:

* Atribua um valor à diretiva `wallarm_mode` no arquivo de configuração do nó de filtragem

    !!! warning "Suporte da diretiva `wallarm_mode` no nó CDN"
        Por favor, note que a diretiva `wallarm_mode` não pode ser configurada nos [nós CDN do Wallarm](../installation/cdn-node.md). Para configurar o modo de filtração dos nós CDN, por favor utilize outros métodos disponíveis.
* Defina a regra de filtração geral no Console Wallarm
* Crie uma regra de modo de filtração na seção **Regras** do Console Wallarm

As prioridades dos métodos de configuração do modo de filtração são determinadas na [diretiva `wallarm_mode_allow_override`](#setting-up-priorities-of-the-filtration-mode-configuration-methods-using-wallarm_mode_allow_override). Por padrão, as configurações especificadas no Console Wallarm têm uma prioridade maior que a diretiva `wallarm_mode`, independentemente da gravidade de seu valor.

### Especificando o modo de filtração na diretiva `wallarm_mode`

!!! warning "Suporte da diretiva `wallarm_mode` no nó CDN"
    Por favor, note que a diretiva `wallarm_mode` não pode ser configurada nos [nós CDN do Wallarm](../installation/cdn-node.md). Para configurar o modo de filtração dos nós CDN, por favor utilize outros métodos disponíveis.

Usando a diretiva `wallarm_mode` no arquivo de configuração do nó de filtragem, você pode definir modos de filtração para diferentes contextos. Esses contextos são ordenados do mais global ao mais local na seguinte lista:

* `http`: as diretivas dentro do bloco `http` são aplicadas às solicitações enviadas ao servidor HTTP.
* `server`: as diretivas dentro do bloco `server` são aplicadas às solicitações enviadas ao servidor virtual.
* `location`: as diretivas dentro do bloco `location` são aplicadas apenas às solicitações que contêm aquele caminho específico.

Se diferentes valores da diretiva `wallarm_mode` forem definidos para os blocos `http`, `server` e `location`, a configuração mais local terá a maior prioridade.

**Exemplo de uso da diretiva `wallarm_mode`:**

```bash
http {
    
    wallarm_mode monitoring;
    
    server {
        server_name SERVER_A;
    }
    
    server {
        server_name SERVER_B;
        wallarm_mode off;
    }
    
    server {
        server_name SERVER_C;
        wallarm_mode off;
        
        location /main/content {
            wallarm_mode monitoring;
        }
        
        location /main/login {
            wallarm_mode block;
        }

        location /main/reset-password {
            wallarm_mode safe_blocking;
        }
    }
}
```

Neste exemplo, os modos de filtração são definidos para os recursos da seguinte forma:

1. O modo `monitoring` é aplicado às solicitações enviadas ao servidor HTTP.
2. O modo `monitoring` é aplicado às solicitações enviadas ao servidor virtual `SERVER_A`.
3. O modo `off` é aplicado às solicitações enviadas ao servidor virtual `SERVER_B`.
4. O modo `off` é aplicado às solicitações enviadas ao servidor virtual `SERVER_C`, exceto para as solicitações que contêm o caminho `/main/content`, `/main/login` ou `/main/reset-password`.
      1. O modo `monitoring` é aplicado às solicitações enviadas ao servidor virtual `SERVER_C` que contêm o caminho `/main/content`.
      2. O modo `block` é aplicado às solicitações enviadas ao servidor virtual `SERVER_C` que contêm o caminho `/main/login`.
      3. O modo `safe_blocking` é aplicado às solicitações enviadas ao servidor virtual `SERVER_C` que contêm o caminho `/main/reset-password`.

### Configuração da regra de filtração geral no Console Wallarm

Os botões de rádio na guia **Geral** das configurações do Console Wallarm na [Nuvem Wallarm US](https://us1.my.wallarm.com/settings/general) ou [Nuvem Wallarm EU](https://my.wallarm.com/settings/general) definem o modo de filtração geral para todas as solicitações recebidas. O valor da diretiva `wallarm_mode` definido no bloco `http` no arquivo de configuração tem o mesmo escopo de ação que esses botões.

As configurações do modo de filtração local na guia **Regras** do Console Wallarm têm uma prioridade maior do que as configurações globais na guia **Global**.

Na guia **Geral**, você pode especificar um dos seguintes modos de filtração:

* **Configurações locais (padrão)**: o modo de filtração definido usando a [diretiva `wallarm_mode`](#specifying-the-filtering-mode-in-the-wallarm_mode-directive) é aplicado
* [**Monitoramento**](#available-filtration-modes)
* [**Bloqueio seguro**](#available-filtration-modes)
* [**Bloqueio**](#available-filtration-modes)
    
![A guia de configurações gerais](../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png)

!!! info "A sincronização do Cloud Wallarm e do nó de filtragem"
    As regras definidas no Console Wallarm são aplicadas durante o processo de sincronização do Cloud Wallarm e do nó de filtragem, que é realizado a cada 2-4 minutos.

    [Mais detalhes sobre a configuração de sincronização do nó de filtragem e do Cloud Wallarm →](configure-cloud-node-synchronization-en.md)

### Configuração das regras de filtração na guia "Regras"

Você pode ajustar o modo de filtração para processar solicitações que atendem a suas condições personalizadas na guia **Regras** do Console Wallarm. Estas regras têm uma prioridade maior do que a [regra de filtração geral definida no Console Wallarm](#setting-up-the-general-filtration-rule-in-wallarm-console).

* [Detalhes sobre o trabalho com regras na guia **Regras** →](../user-guides/rules/rules.md)
* [Guia passo a passo para criar uma regra que gerencia o modo de filtração →](../user-guides/rules/wallarm-mode-rule.md)

!!! info "A sincronização do Cloud Wallarm e do nó de filtragem"
    As regras definidas no Console Wallarm são aplicadas durante o processo de sincronização do Cloud Wallarm e do nó de filtragem, que é realizado a cada 2-4 minutos.

    [Mais detalhes sobre a configuração de sincronização do nó de filtragem e do Cloud Wallarm →](configure-cloud-node-synchronization-en.md)

### Configuração das prioridades dos métodos de configuração do modo de filtração usando `wallarm_mode_allow_override`

!!! warning "Suporte da diretiva `wallarm_mode_allow_override` no nó CDN"
    Por favor, note que a diretiva `wallarm_mode_allow_override` não pode ser configurada nos [nós CDN Wallarm](../installation/cdn-node.md).

A diretiva `wallarm_mode_allow_override` gerencia a capacidade de aplicar regras que são definidas no Console Wallarm em vez de usar os valores da diretiva `wallarm_mode` do arquivo de configuração do nó de filtragem.

Os seguintes valores são válidos para a diretiva `wallarm_mode_allow_override`:

* `off`: regras especificadas no Console Wallarm são ignoradas. As regras especificadas pela diretiva `wallarm_mode` no arquivo de configuração são aplicadas.
* `strict`: apenas as regras especificadas no Cloud Wallarm que definem modos de filtração mais restritos do que aqueles definidos pela diretiva `wallarm_mode` no arquivo de configuração são aplicadas.

    Os modos de filtração disponíveis ordenados do mais brando ao mais restrito estão listados [acima](#available-filtration-modes).

* `on` (por padrão): regras especificadas no Console Wallarm são aplicadas. As regras especificadas pela diretiva `wallarm_mode` no arquivo de configuração são ignoradas.

Os contextos nos quais o valor da diretiva `wallarm_mode_allow_override` pode ser definido, em ordem do mais global ao mais local, são apresentados na seguinte lista:

* `http`: as diretivas dentro do bloco `http` são aplicadas às solicitações enviadas ao servidor HTTP.
* `server`: as diretivas dentro do bloco `server` são aplicadas às solicitações enviadas ao servidor virtual.
* `location`: as diretivas dentro do bloco `location` são aplicadas apenas às solicitações que contêm aquele caminho específico.

Se diferentes valores da diretiva `wallarm_mode_allow_override` forem definidos nos blocos `http`, `server` e `location`, então a configuração mais local terá a maior prioridade.

**Exemplo de uso da diretiva `wallarm_mode_allow_override`:**

```bash
http {
    
    wallarm_mode monitoring;
    
    server {
        server_name SERVER_A;
        wallarm_mode_allow_override off;
    }
    
    server {
        server_name SERVER_B;
        wallarm_mode_allow_override on;
        
        location /main/login {
            wallarm_mode_allow_override strict;
        }
    }
}
```

Este exemplo de configuração resulta nas seguintes aplicações das regras de modo de filtração do Console Wallarm:

1. As regras de modo de filtração definidas no Console Wallarm são ignoradas para solicitações enviadas ao servidor virtual `SERVER_A`. Não há diretiva `wallarm_mode` especificada no bloco `server` que corresponde ao servidor `SERVER_A`, por isso o modo de filtração `monitoring` especificado no bloco `http` é aplicado para tais solicitações.
2. As regras de modo de filtração definidas no Console Wallarm são aplicadas às solicitações enviadas ao servidor virtual `SERVER_B`, exceto para as solicitações que contêm o caminho `/main/login`.
3. Para aquelas solicitações que são enviadas ao servidor virtual `SERVER_B` e contêm o caminho `/main/login`, as regras de modo de filtração definidas no Console Wallarm são aplicadas apenas se definirem um modo de filtração que é mais rigoroso do que o modo `monitoring`.

## Exemplo de configuração do modo de filtração

Vamos considerar o exemplo de uma configuração do modo de filtração que usa todos os métodos mencionados acima.

### Configuração do modo de filtração no arquivo de configuração do nó de filtragem

```bash
http {
    
    wallarm_mode block;
        
    server { 
        server_name SERVER_A;
        wallarm_mode monitoring;
        wallarm_mode_allow_override off;
        
        location /main/login {
            wallarm_mode block;
            wallarm_mode_allow_override strict;
        }
        
        location /main/signup {
            wallarm_mode_allow_override strict;
        }
        
        location /main/apply {
            wallarm_mode block;
            wallarm_mode_allow_override on;
        }
    }
}
```

### Configuração do modo de filtração no Console Wallarm

* [Regra de filtração geral](#setting-up-the-general-filtration-rule-in-wallarm-console): **Monitoramento**.
* [Regras de filtração](#setting-up-the-filtration-rules-on-the-rules-tab):
    * Se a solicitação atende às seguintes condições:
        * Método: `POST`
        * Primeira parte do caminho: `main`
        * Segunda parte do caminho: `apply`,
        
        então aplique o modo de filtração **Padrão**.
        
    * Se a solicitação atende à seguinte condição:
        * Primeira parte do caminho: `main`,
        
        então aplique o modo de filtração **Bloqueio**.
        
    * Se a solicitação atende às seguintes condições:
        * Primeira parte do caminho: `main`
        * Segunda parte do caminho: `login`,
        
        então aplique o modo de filtração **Monitoramento**.

### Exemplos de solicitações enviadas ao servidor `SERVER_A`

Exemplos das solicitações enviadas ao servidor configurado `SERVER_A` e as ações que o nó de filtragem Wallarm aplica a elas são as seguintes:

* A solicitação maliciosa com o caminho `/news` é processada, mas não bloqueada devido à configuração `wallarm_mode monitoring;` para o servidor `SERVER_A`.

* A solicitação maliciosa com o caminho `/main` é processada, mas não bloqueada devido à configuração `wallarm_mode monitoring;` para o servidor `SERVER_A`.

    A regra **Bloqueio** definida no Console Wallarm não é aplicada devido à configuração `wallarm_mode_allow_override off;` para o servidor `SERVER_A`.

* A solicitação maliciosa com o caminho `/main/login` é bloqueada devido à configuração `wallarm_mode block;` para as solicitações com o caminho `/main/login`.

    A regra **Monitoramento** definida no Console Wallarm não é aplicada a ela devido à configuração `wallarm_mode_allow_override strict;` no arquivo de configuração do nó de filtragem.

* A solicitação maliciosa com o caminho `/main/signup` é bloqueada devido à configuração `wallarm_mode_allow_override strict;` para as solicitações com o caminho `/main/signup` e a regra **Bloqueio** definida no Console Wallarm para as solicitações com o caminho `/main`.
* A solicitação maliciosa com o caminho `/main/apply` e o método `GET` é bloqueada devido à configuração `wallarm_mode_allow_override on;` para as solicitações com o caminho `/main/apply` e a regra **Bloqueio** definida no Console Wallarm para as solicitações com o caminho `/main`.
* A solicitação maliciosa com o caminho `/main/apply` e o método `POST` é bloqueada devido à configuração `wallarm_mode_allow_override on;` para as solicitações com o caminho `/main/apply`, a regra **Padrão** definida no Console Wallarm e a configuração `wallarm_mode block;` para as solicitações com o caminho `/main/apply` no arquivo de configuração do nó de filtragem.

## Melhores práticas sobre a aplicação gradual do modo de filtração

Para uma integração bem-sucedida de um novo nó Wallarm, siga estas recomendações passo a passo para mudar os modos de filtração:

1. Implemente nós de filtragem Wallarm em seus ambientes não produtivos com o modo de operação definido como `monitoring`.
1. Implemente nós de filtragem Wallarm em seu ambiente de produção com o modo de operação definido como `monitoring`.
1. Mantenha o tráfego fluindo através dos nós de filtragem em todos os seus ambientes (incluindo os de teste e produção) durante 7 a 14 dias para dar ao backend baseado na nuvem Wallarm algum tempo para aprender sobre sua aplicação.
1. Ative o modo `block` do Wallarm em todos os seus ambientes não produtivos e use testes automatizados ou manuais para confirmar que a aplicação protegida está funcionando conforme o esperado.
1. Ative o modo `block` do Wallarm no ambiente de produção e use os métodos disponíveis para confirmar que a aplicação está funcionando conforme o esperado.