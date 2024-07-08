[variability-in-endpoints-docs]:       ../api-discovery/overview.md#variability-in-endpoints
[changes-in-api-docs]:       ../api-discovery/track-changes.md
[bola-protection-for-endpoints-docs]:  ../api-discovery/overview.md#automatic-bola-protection

# Proteção BOLA <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

A seção **Proteção BOLA** da Wallarm Console UI permite configurar a mitigação de [ataques BOLA (IDOR)](../attacks-vulns-list.md#broken-object-level-authorization-bola) direcionados aos endpoints da API explorados pelo módulo **API Discovery**. 

Essa seção está disponível nas seguintes condições:

* O módulo [API Discovery](../api-discovery/overview.md) está habilitado
* A [função](settings/users.md#user-roles) do usuário é **Administrador** ou **Administrador Global**

    A seção também está disponível em modo somente leitura para **Analistas** e **Analistas Globais**.

!!! info "Variações da mitigação BOLA"

    A mitigação BOLA está disponível nas seguintes variações:

    * Mitigação automatizada para os endpoints explorados pelo módulo **API Discovery** (a UI para configuração é abordada neste artigo)
    * Mitigação para quaisquer endpoints protegidos pelos nós Wallarm - essa opção é configurada manualmente através do disparador correspondente

    Encontre mais detalhes nas [instruções gerais sobre proteção BOLA (IDOR)](../admin-en/configuration-guides/protecting-against-bola.md).

## Configurando a proteção BOLA automatizada

Para a Wallarm analisar os endpoints explorados pelo módulo API Discovery quanto a vulnerabilidades BOLA e proteger aqueles que estão em risco, **mude a chave para o estado habilitado**.

![Disparador BOLA](../images/user-guides/bola-protection/trigger-enabled-state.png)

Depois, você pode ajustar o comportamento padrão do Wallarm editando o modelo de autodetecção BOLA da seguinte maneira:

* Altere o limite para as solicitações do mesmo IP serem marcadas como ataques BOLA.
* Altere a reação ao exceder o limite:

    * **Denylist IP** - Wallarm vai [bloquear](ip-lists/denylist.md) os IPs da fonte do ataque BOLA e assim bloquear todo o tráfego que esses IPs produzem.
    * **Graylist IP** - Wallarm vai [incluir na lista cinza](ip-lists/graylist.md) os IPs da fonte do ataque BOLA e assim bloquear apenas solicitações mal-intencionadas desses IPs e somente se o nó de filtragem estiver no [modo](../admin-en/configure-wallarm-mode.md) de bloqueio seguro.

![Disparador BOLA](../images/user-guides/bola-protection/trigger-template.png)

## Lógica de proteção BOLA automatizada

--8<-- "../include-pt-BR/waf/features/bola-mitigation/bola-auto-mitigation-logic.md"

## Desativando a proteção BOLA automatizada

Para desativar a proteção BOLA automatizada, mude a chave para o estado desativado na seção **Proteção BOLA**.

Quando a sua assinatura API Discovery expira, a proteção BOLA automatizada é desativada automaticamente.