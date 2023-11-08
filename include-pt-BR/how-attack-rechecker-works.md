Com base nos ataques iniciais detectados, o módulo **Verificação de ameaça ativa** cria muitas novas solicitações de teste com diferentes payloads atacando o mesmo endpoint. Esse mecanismo permite que o Wallarm detecte vulnerabilidades que poderiam ser potencialmente exploradas durante os ataques. O processo de verificação de ameaça ativa confirmará que o aplicativo não é vulnerável aos vetores de ataque específicos ou encontrará problemas reais de segurança do aplicativo.

[Lista de vulnerabilidades que podem ser detectadas pelo módulo](../attacks-vulns-list.md)

O processo de **Verificação de ameaça ativa** usa a seguinte lógica para verificar o aplicativo protegido para possíveis vulnerabilidades de segurança na Web e na API:

1. Para cada grupo de solicitação maliciosa (cada ataque) detectado por um nó de filtragem Wallarm e carregados para o Wallarm Cloud conectado, o sistema analisa qual endpoint específico (URL, parâmetro de string de requisição, atributo JSON, campo XML, etc) foi atacado e qual tipo específico de vulnerabilidade (SQLi, RCE, XSS, etc) o atacante estava tentando explorar. Por exemplo, vamos dar uma olhada na seguinte solicitação GET maliciosa:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=UNION SELECT username, password
    ```

    A partir da solicitação, o sistema aprenderá os seguintes detalhes:
    
    * A URL atacada é `https://example.com/login`
    * O tipo de ataque usado é SQLi (de acordo com o payload `UNION SELECT username, password`)
    * O parâmetro da string de consulta atacada é `user`
    * Uma peça adicional de informação fornecida na solicitação é o parâmetro da string de requisição `token = IyEvYmluL3NoCg` (provavelmente usado pelo aplicativo para autenticar o usuário)
2. Usando as informações coletadas, o módulo **Verificação de ameaça ativa** criará uma lista de cerca de 100-150 solicitações de teste para o endpoint originalmente visado, mas com diferentes tipos de payloads maliciosos para o mesmo tipo de ataque (como SQLi). Por exemplo:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=1')+WAITFOR+DELAY+'0 indexpt'+AND+('wlrm'='wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1+AND+SLEEP(10)--+wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1);SELECT+PG_SLEEP(10)--
    https://example.com/login?token=IyEvYmluL3NoCg&user=1'+OR+SLEEP(10)+AND+'wlrm'='wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1+AND+1=(SELECT+1+FROM+PG_SLEEP(10))
    https://example.com/login?token=IyEvYmluL3NoCg&user=%23'%23\x22%0a-sleep(10)%23
    https://example.com/login?token=IyEvYmluL3NoCg&user=1';+WAITFOR+DELAY+'0code:10'--
    https://example.com/login?token=IyEvYmluL3NoCg&user=1%27%29+OR+SLEEP%280%29+AND+%28%27wlrm%27%3D%27wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=SLEEP(10)/*'XOR(SLEEP(10))OR'|\x22XOR(SLEEP(10))OR\x22*/
    ```

    !!! info "Payloads maliciosos não prejudicam seus recursos"
        Os payloads maliciosos das solicitações geradas não incluem sintaxe realmente maliciosa, eles são destinados apenas para imitar o princípio do ataque. Como resultado, eles não prejudicam seus recursos.
3. O módulo **Verificação de ameaça ativa** enviará solicitações de teste geradas para o aplicativo contornando a proteção Wallarm (usando o recurso de [permissões de endereço][allowlist-scanner-addresses]) e verificará que o aplicativo no endpoint específico não é vulnerável ao tipo de ataque específico. Se o módulo suspeitar que o aplicativo tem uma vulnerabilidade de segurança real, criará um evento com o tipo [incidente](../user-guides/events/check-attack.md#incidents).

    !!! info "Valor do cabeçalho HTTPS `User-Agent` nas solicitações"
        O cabeçalho HTTP `User-Agent` nas solicitações do módulo **Verificação de ameaça ativa** terá o valor `Wallarm Threat-Verification (v1.x)`.
4. Os incidentes de segurança detectados são relatados no Wallarm Console e podem ser despachados para sua equipe de segurança por meio das [Integrações](../user-guides/settings/integrations/integrations-intro.md) e [Triggers](../user-guides/triggers/triggers.md) de terceiros disponíveis.