# Configuração da proteção contra ataques de força bruta

Ataque comportamental (ataque de força bruta) é um dos tipos de ataque que podem ser detectados pelo Wallarm, se configurado adequadamente. Estas instruções fornecem etapas para configurar o nó Wallarm para proteger suas aplicações contra ataques de força bruta. Por padrão, o nó Wallarm não detecta ataques de força bruta.

Existem as seguintes classes de ataques de força bruta:

* [Ataques de força bruta regulares](../../attacks-vulns-list.md#brute-force-attack): quebra de senha por força bruta, identificador de sessão por força bruta, preenchimento de credenciais. Esses ataques são caracterizados por um grande número de solicitações com diferentes valores de parâmetro forçado enviados para um URI típico por um período limitado de tempo.
* [Navegação forçada](../../attacks-vulns-list.md#forced-browsing). Esses ataques são caracterizados por um grande número de códigos de resposta 404 retornados a solicitações para diferentes URIs por um período limitado de tempo.

    O objetivo desse ataque é enumerar e acessar recursos ocultos (por exemplo, diretórios e arquivos contendo informações sobre componentes de aplicação). O tipo de ataque de navegação forçada geralmente permite aos invasores coletar informações sobre a aplicação e, em seguida, realizar outros tipos de ataque, explorando essas informações.

[Descrição detalhada de força bruta →](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)

!!! warning "Restrições de proteção de força bruta"
    Ao procurar sinais de ataque de força bruta, os nós Wallarm analisam apenas solicitações HTTP que não contém sinais de outros tipos de ataque. Por exemplo, as solicitações não são consideradas parte de um ataque de força bruta nos seguintes casos:

    * Essas solicitações contêm sinais de [ataques de validação de entrada](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks).
    * Essas solicitações correspondem à expressão regular especificada na [regra **Criar indicador de ataque baseado em regexp**](../../user-guides/rules/regex-rule.md#adding-a-new-detection-rule).

## Etapas de configuração

1. Se o nó de filtragem estiver implantado atrás de um servidor proxy ou balanceador de carga, então [configure](../using-proxy-or-balancer-en.md) a exibição de um endereço IP real do cliente.
1. [Configure](#configuring-the-trigger-to-identify-brute-force) o gatilho **Força bruta** ou **Navegação forçada**.
1. [Teste](#testing-the-configuration-of-brute-force-protection) a configuração da proteção de força bruta.

## Configurando o gatilho para identificar força bruta

!!! info "Gatilhos para o número de solicitações"
    Abaixo está a descrição da configuração simplificada da proteção da força bruta. A condição do gatilho **Número de solicitações** foi substituída por duas condições para detecção de diferentes classes de ataque de força bruta. Além disso, o ajuste das regras **Marcar solicitações como um ataque de navegação forçada / força bruta** não é mais necessário.

    Se o gatilho para **Número de solicitações** e as regras para o etiquetamento de ataques estiverem configurados, eles ainda funcionarão, mas as regras não poderão ser atualizadas ou recriadas. No entanto, recomendamos simplificar a configuração atual conforme descrito abaixo e desativar os gatilhos antigos.

Os gatilhos definem as condições para a detecção do ataque de força bruta. Dependendo da classe do ataque de força bruta a ser detectada, você pode definir as seguintes condições:

* **Força bruta** para detectar ataques regulares de força bruta com base no número de solicitações originadas do mesmo endereço IP.
* **Navegação forçada** para detectar os ataques de navegação forçada com base no número dos códigos de resposta 404 retornados às solicitações que têm a mesma origem nas solicitações IP.

Os passos para configurar o gatilho são:

1. Abra o Console Wallarm → seção **Gatilhos** e abra a janela para criação de gatilho.
2. Selecione a condição **Força bruta** ou **Navegação forçada** dependendo da classe de ataque de força bruta a ser detectada.
3. Defina o limite:

    * Se a condição do gatilho é **Força bruta** - o limite é para o número de solicitações originadas do mesmo endereço IP por um período de tempo.
    * Se a condição do gatilho é **Navegação forçada** - o limite é para o número de códigos de resposta 404 retornados às solicitações que têm a mesma origem nas solicitações IP.
4. Se necessário, especifique **URI** para ativar o gatilho apenas para solicitações enviadas para certos endpoints, por exemplo:

    * Se você configurar a proteção contra quebra de senhas por força bruta, especifique o URI usado para autenticação.
    * Se você configurar proteção contra ataques de navegação forçada, especifique o URI do diretório de arquivo de recursos.
    * Se o URI não for especificado, o gatilho será ativado em qualquer endpoint com o número de solicitações excedendo o limite.

    O URI pode ser configurado através do [construtor URI](../../user-guides/rules/rules.md#uri-constructor) ou [formulário de edição avançado](../../user-guides/rules/rules.md#advanced-edit-form) na janela de criação do gatilho.

    !!! warning "Gatilhos com URIs aninhados"
        Se URIs aninhados forem especificados nos gatilhos com condições idênticas, as solicitações ao URI de nível de aninhamento inferior serão contadas apenas no gatilho com o filtro pelo URI de nível de aninhamento inferior. O mesmo vale para os códigos de resposta 404.

        Gatilhos sem URI nas condições são considerados de nível de aninhamento superior.

        **Exemplo:**

        * O primeiro gatilho com a condição **Força bruta** não tem filtro pelo URI (solicitações para qualquer aplicação ou sua parte são contadas por este gatilho).
        * O segundo gatilho com a condição **Força bruta** tem o filtro pelo URI `example.com/api`.

        Solicitações para `example.com/api` são contadas apenas pelo segundo gatilho com o filtro por `example.com/api`.
5. Se necessário, defina outros filtros de gatilho:

    * **Aplicação** a qual as solicitações são direcionadas.
    * Um ou mais **IPs** de onde as solicitações são enviadas.
6. Selecione as reações do gatilho:

    * Se a condição do gatilho é **Força bruta** - a reação é **Marcar como força bruta**. As solicitações recebidas após a superação do limite serão marcadas como ataque de força bruta e exibidas na seção **Eventos** do Console Wallarm.
    * Se a condição do gatilho é **Navegação forçada** - a reação é **Marcar como navegação forçada**. As solicitações recebidas após a superação do limite serão marcadas como ataque de navegação forçada e exibidas na seção **Eventos** do Console Wallarm.
    * **Adicionar endereço de IP à lista negra** e o período para bloqueio de endereço de IP para adicionar endereços IP de fontes de solicitações maliciosas à [lista negra](../../user-guides/ip-lists/denylist.md). O nó Wallarm bloqueará todas as solicitações originadas do IP listado na lista negra após a superação do limite.
    * **Adicionar endereço de IP à lista cinza** e o período para [listar em cinza](../../user-guides/ip-lists/graylist.md) os endereços IP de fontes de solicitações maliciosas. O nó Wallarm bloqueará as solicitações originadas dos IPs listados em cinza apenas se as solicitações contiverem sinais de ataque de [validação de entrada](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [o `vpatch`](../../user-guides/rules/vpatch-rule.md) ou [personalizados](../../user-guides/rules/regex-rule.md). Ataques de força bruta originados de IPs listados em cinza não são bloqueados.
6. Salve o gatilho e aguarde a [conclusão da sincronização entre Cloud e nó](../configure-cloud-node-synchronization-en.md) (geralmente leva de 2 a 4 minutos).

Exemplo do gatilho **Força bruta** para bloquear os ataques regulares de força bruta direcionados a `https://example.com/api/v1/login`:

![Exemplo de gatilho de força bruta](../../images/user-guides/triggers/trigger-example6.png)

A descrição do exemplo fornecida e outros exemplos de gatilho usados para proteção contra força bruta estão disponíveis neste [link](../../user-guides/triggers/trigger-examples.md#mark-requests-as-a-bruteforce-attack-if-31-or-more-requests-are-sent-to-the-protected-resource).

Você pode configurar vários gatilhos para proteção contra força bruta.

## Testando a configuração da proteção contra força bruta

1. Envie o número de solicitações que exceda o limite configurado para o URI protegido. Por exemplo, 50 solicitações para `example.com/api/v1/login`:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://example.com/api/v1/login ; done
    ```
2. Se a reação do gatilho for **Adicionar endereço IP à lista negra**, abra o Console Wallarm → **Listas de IP** → **Lista negra** e verifique se o endereço IP de origem está bloqueado.

    Se a reação do gatilho for **Adicionar endereço IP à lista cinza**, verifique a seção **Listas de IP** → **Lista cinza** do Console Wallarm.
3. Abra a seção **Eventos** e verifique se as solicitações são exibidas na lista como um ataque de força bruta ou de navegação forçada.

    ![Ataque de navegação forçada na interface](../../images/user-guides/events/forced-browsing-attack.png)

    O número de solicitações exibidas corresponde ao número de solicitações enviadas após o limite do gatilho ter sido excedido ([mais detalhes sobre a detecção de ataques comportamentais](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)). Se este número for superior a 5, a amostragem de solicitação é aplicada e os detalhes da solicitação são exibidos apenas para os primeiros 5 acertos ([mais detalhes sobre a amostragem de solicitações](../../user-guides/events/analyze-attack.md#sampling-of-hits)).

    Para procurar ataques, você pode usar os filtros, por exemplo: `dirbust` para os ataques de navegação forçada, `brute` para os ataques de força bruta. Todos os filtros são descritos nas [instruções de uso da pesquisa](../../user-guides/search-and-filters/use-search.md).