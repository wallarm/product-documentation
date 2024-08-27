# Tipos de ataques e vulnerabilidades

[cwe-20]: https://cwe.mitre.org/data/definitions/20.html
[cwe-22]: https://cwe.mitre.org/data/definitions/22.html
[cwe-78]: https://cwe.mitre.org/data/definitions/78.html
[cwe-79]: https://cwe.mitre.org/data/definitions/79.html
[cwe-88]: https://cwe.mitre.org/data/definitions/88.html
[cwe-89]: https://cwe.mitre.org/data/definitions/89.html
[cwe-90]: https://cwe.mitre.org/data/definitions/90.html
[cwe-93]: https://cwe.mitre.org/data/definitions/93.html
[cwe-94]: https://cwe.mitre.org/data/definitions/94.html
[cwe-113]: https://cwe.mitre.org/data/definitions/113.html
[cwe-96]: https://cwe.mitre.org/data/definitions/96.html
[cwe-97]: https://cwe.mitre.org/data/definitions/97.html
[cwe-150]: https://cwe.mitre.org/data/definitions/150.html
[cwe-159]: https://cwe.mitre.org/data/definitions/159.html
[cwe-200]: https://cwe.mitre.org/data/definitions/200.html
[cwe-209]: https://cwe.mitre.org/data/definitions/209.html
[cwe-215]: https://cwe.mitre.org/data/definitions/215.html
[cwe-288]: https://cwe.mitre.org/data/definitions/288.html
[cwe-307]: https://cwe.mitre.org/data/definitions/307.html
[cwe-352]: https://cwe.mitre.org/data/definitions/352.html
[cwe-409]: https://cwe.mitre.org/data/definitions/409.html
[cwe-425]: https://cwe.mitre.org/data/definitions/425.html
[cwe-444]: https://cwe.mitre.org/data/definitions/444.html
[cwe-511]: https://cwe.mitre.org/data/definitions/511.html
[cwe-521]: https://cwe.mitre.org/data/definitions/521.html
[cwe-538]: https://cwe.mitre.org/data/definitions/538.html
[cwe-541]: https://cwe.mitre.org/data/definitions/541.html
[cwe-548]: https://cwe.mitre.org/data/definitions/548.html
[cwe-601]: https://cwe.mitre.org/data/definitions/601.html
[cwe-611]: https://cwe.mitre.org/data/definitions/611.html
[cwe-776]: https://cwe.mitre.org/data/definitions/776.html
[cwe-799]: https://cwe.mitre.org/data/definitions/799.html
[cwe-639]: https://cwe.mitre.org/data/definitions/639.html
[cwe-918]: https://cwe.mitre.org/data/definitions/918.html
[cwe-943]: https://cwe.mitre.org/data/definitions/943.html
[cwe-1270]: https://cwe.mitre.org/data/definitions/1270.html
[cwe-1294]: https://cwe.mitre.org/data/definitions/1294.html
[cwe-937]: https://cwe.mitre.org/data/definitions/937.html
[cwe-1035]: https://cwe.mitre.org/data/definitions/1035.html
[cwe-1104]: https://cwe.mitre.org/data/definitions/1104.html

[link-cwe]: https://cwe.mitre.org/

[link-owasp-xxe-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
[link-owasp-xss-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
[link-owasp-idor-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
[link-owasp-ssrf-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
[link-owasp-auth-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
[link-owasp-ldapi-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
[link-owasp-sqli-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
[link-owasp-inputval-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html

[link-ptrav-mitigation]: https://owasp.org/www-community/attacks/Path_Traversal
[link-wl-process-time-limit-directive]: admin-en/configure-parameters-en.md#wallarm_process_time_limit

[doc-vpatch]: user-guides/rules/vpatch-rule.md

[anchor-main-list]: #a-lista-principal-de-ataques-e-vulnerabilidades
[anchor-special-list]: #a-lista-de-ataques-especiais-e-vulnerabilidades 

[anchor-brute]: #ataque-de-forca-bruta
[anchor-rce]: #execucao-remota-de-codigo-rce
[anchor-ssrf]: #falsificacao-de-solicitacao-do-lado-do-servidor-ssrf 

[link-imap-wiki]: https://pt.wikipedia.org/wiki/Internet_Message_Access_Protocol
[link-smtp-wiki]: https://pt.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol
[ssi-wiki]: https://pt.wikipedia.org/wiki/Include_de_Servidor_Server_Side_Includes
[link-owasp-csrf-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

O nó de filtragem Wallarm pode detectar muitos ataques e vulnerabilidades, incluindo aqueles incluídos na lista de ameaças OWASP API Top 10. Esses ataques e vulnerabilidades estão listados [aqui][anchor-main-list].

Cada item da lista:

* É etiquetado com **Ataque**, **Vulnerabilidade** ou ambos.

     O nome de um ataque específico pode ser o mesmo do nome da vulnerabilidade que esse ataque explora. Nesse caso, essa entidade será marcada com a tag combinada **Vulnerabilidade/Ataque**.

* Possui o código Wallarm que corresponde a esta entidade.

A maioria das vulnerabilidades e ataques desta lista também é acompanhada por um ou mais códigos da lista de tipos de fraquezas de software, também conhecida como [Enumerador Comum de Fraquezas (Common Weakness Enumeration)][link-cwe] ou CWE.

Além disso, o nó de filtragem Wallarm usa vários tipos de ataque e vulnerabilidades especiais para a finalidade interna de marcar o tráfego processado. Tais entidades não são acompanhadas por códigos CWE, mas são [listadas separadamente][anchor-special-list]. 

??? info "Assista ao vídeo sobre como a Wallarm protege contra o OWASP Top 10"
   <div class="video-wrapper">
   <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
   </div>

## A lista principal de ataques e vulnerabilidades

### Ataque à Entidade Externa XML (XXE)

**Vulnerabilidade/Ataque**

**Código CWE:** [CWE-611][cwe-611]

**Código Wallarm:** `xxe`

**Descrição:**

A vulnerabilidade XXE permite que um atacante injete uma entidade externa em um documento XML a ser avaliado por um analisador XML e, em seguida, executado no servidor web alvo.

Como resultado de um ataque bem-sucedido, um atacante será capaz de:

*   Obter acesso aos dados confidenciais do aplicativo da web
*   Analisar as redes de dados internas
*   Ler os arquivos localizados no servidor web
*   Realizar um ataque [SSRF][anchor-ssrf]
*   Realizar um ataque de Negação de Serviço (DoS)

Esta vulnerabilidade ocorre devido à falta de restrição na análise de entidades XML externas em um aplicativo da web.

**Solução:**

Você pode seguir estas recomendações:

*   Desabilite a análise de entidades externas XML ao trabalhar com documentos XML fornecidos por um usuário.
*   Aplique as recomendações da [Folha de dicas de prevenção XXE da OWASP][link-owasp-xxe-cheatsheet].

### Ataque de força bruta

**Ataque**

**Códigos CWE:** [CWE-307][cwe-307], [CWE-521][cwe-521], [CWE-799][cwe-799]

**Código Wallarm:** `brute`

**Descrição:**

Um ataque de força bruta ocorre quando um grande número de solicitações com uma carga útil predefinida é enviado para o servidor. Essas cargas úteis podem ser geradas por algum meio ou retiradas de um dicionário. A resposta do servidor é então analisada para encontrar a combinação correta dos dados na carga útil.

Um ataque de força bruta bem-sucedido pode potencialmente contornar mecanismos de autenticação e autorização e/ou revelar recursos ocultos do aplicativo da web (como diretórios, arquivos, partes do site, etc.), concedendo assim a capacidade de conduzir outras ações maliciosas.

**Solução:**

Você pode seguir estas recomendações:

*   Limite o número de solicitações por um certo período de tempo para um aplicativo da web.
*   Limite o número de tentativas de autenticação/autorização por um certo período de tempo para um aplicativo da web.
*   Bloqueie novas tentativas de autenticação/autorização após um certo número de tentativas fracassadas.
*   Proíba um aplicativo da web de acessar quaisquer arquivos ou diretórios no servidor em que ele é executado, exceto aqueles dentro do escopo do aplicativo. 

[Como configurar a solução Wallarm para proteger aplicativos contra força bruta →](admin-en/configuration-guides/protecting-against-bruteforce.md)

### Varredura de recursos

**Ataque**

**Código CWE:** none

**Código Wallarm:** `scanner`

**Descrição:**    

O código `scanner` é atribuído a uma solicitação HTTP se essa solicitação é considerada parte de uma atividade de software de varredura de terceiros que tem como alvo atacar ou varrer um recurso protegido. As solicitações do Scanner Wallarm não são consideradas um ataque de varredura de recursos. Essas informações podem ser usadas posteriormente para atacar esses serviços.

**Solução:**

Você pode seguir estas recomendações:

*   Limite a possibilidade de uma varredura do perímetro da rede, empregando a lista de permissões e negações de endereços IP junto com mecanismos de autenticação / autorização.
*   Minimize a superfície de varredura colocando o perímetro da rede atrás de um firewall.
*   Defina um conjunto necessário e suficiente de portas a serem abertas para que seus serviços operem.
*   Restrinja o uso do protocolo ICMP no nível da rede.
*   Atualize periodicamente os seus equipamentos de infraestrutura de TI. Isso inclui:
    
    *   firmware de servidores e outros equipamentos
    *   sistemas operacionais
    *   demais softwares

### Injeção de Template do Lado do Servidor (SSTI)

**Vulnerabilidade/Ataque**

**Códigos CWE:** [CWE-94][cwe-94], [CWE-159][cwe-159]

**Código Wallarm:** `ssti`

**Descrição:**

Um atacante pode injetar um código executável em um formulário preenchido por um usuário em um servidor da web vulnerável a ataques SSTI para que o código seja analisado e executado pelo servidor da web.

Um ataque bem-sucedido pode tornar completamente comprometido um servidor da web vulnerável, permitindo potencialmente que um atacante execute solicitações arbitrárias, explore os sistemas de arquivos dos servidores e, sob determinadas condições, execute remotamente um código arbitrário (consulte [Ataque RCE][anchor-rce] para detalhes), bem como muitas outras coisas.

Essa vulnerabilidade surge devido à validação e análise incorretas da entrada do usuário.

**Solução:**

Você pode seguir a recomendação de desinfetar e filtrar toda a entrada do usuário para evitar que uma entidade na entrada seja executada.

### Bomba de dados

**Ataque**

**Código CWE:** [CWE-409][cwe-409], [CWE-776][cwe-776]

**Código Wallarm:** `data_bomb`

**Descrição:**

A Wallarm marca uma solicitação como o ataque de Bomba de Dados se ela contém a Bomba Zip ou XML:

* A [Bomba Zip](https://pt.wikipedia.org/wiki/Ataque_zip_bomba) é um arquivo de arquivo mal-intencionado projetado para travar ou tornar inútil o programa ou sistema que o lê. A Bomba Zip permite que o programa funcione como pretendido, mas o arquivo é criado de tal forma que o descompactar requer uma quantidade inordinada de tempo, espaço em disco e/ou memória.
* A [Bomba XML (ataque de um bilhão de risos)](https://pt.wikipedia.org/wiki/Bomba_XML) é o tipo de ataque DoS que é direcionada aos parsers de documentos XML. Um atacante envia cargas úteis maliciosas em entidades XML.

    Por exemplo, `entidadeUm` pode ser definida como 20 `entidadeDois`, que por sua vez podem ser definidas como 20 `entidadeTres`. Se a mesma regra for continuada até `entidadeOito`, o parser XML desdobrará uma única ocorrência de `entidadeUm` em 1 280 000 000 `entidadeOito` - ocupando 5 GB de memória.

**Solução:**

Limite o tamanho das solicitações de entrada para que não possa prejudicar o sistema.

### Cross-site scripting (XSS)

**Vulnerabilidade/Ataque**

**Código CWE:** [CWE-79][cwe-79]

**Código Wallarm:** `xss`

**Descrição:**

Um ataque de cross-site scripting permite que um atacante execute um código arbitrário preparado no navegador de um usuário.

Existem alguns tipos de ataques XSS:

*   XSS Armazenado é quando um código malicioso é pré-incorporado na página do aplicativo da web.

    Se o aplicativo da web for vulnerável ao ataque XSS armazenado, então será possível para um atacante injetar um código malicioso na página HTML do aplicativo da web; além disso, esse código persistirá e será executado pelo navegador de qualquer usuário solicitando a página da web infectada.
    
*   XSS Refletido é quando um atacante engana um usuário para abrir um link especialmente construído.      

*   XSS baseado em DOM é quando um código JavaScript incorporado na página do aplicativo da web analisa a entrada e a executa como um comando JavaScript devido a erros nesse trecho de código.

A exploração de qualquer uma das vulnerabilidades listadas acima leva à execução de um código JavaScript arbitrário. Se o ataque XSS for bem-sucedido, um atacante pode roubar a sessão de um usuário ou credenciais, fazer solicitações em nome do usuário e realizar outras ações maliciosas. 

Esta classe de vulnerabilidades ocorre devido à validação e análise incorretas da entrada do usuário.

**Solução:**

Você pode seguir estas recomendações:

*   Desinfetar e filtrar todos os parâmetros que um aplicativo da web recebe como entrada para evitar que uma entidade na entrada seja executada.
*   Ao formar as páginas do aplicativo da web, desinfete e escape quaisquer entidades que sejam formadas dinamicamente.
*   Aplique as recomendações da [Folha de dicas de prevenção XSS da OWASP][link-owasp-xss-cheatsheet].

### Autorização de nível de objeto quebrado (BOLA)

**Vulnerabilidade/Ataque**

**Código CWE:** [CWE-639][cwe-639]

**Código Wallarm:** `idor` para vulnerabilidades, `bola` para ataques

**Descrição:**

Os invasores podem explorar os pontos finais da API que são vulneráveis à autorização de nível de objeto quebrado, manipulando o ID de um objeto que é enviado na solicitação. Isso pode resultar em acesso não autorizado a dados sensíveis.

Esse problema é extremamente comum em aplicativos baseados em API porque o componente do servidor geralmente não rastreia completamente o estado do cliente e, em vez disso, depende mais de parâmetros como os IDs dos objetos, que são enviados do cliente para decidir quais objetos acessar.

Dependendo da lógica do ponto final da API, um invasor pode apenas ler dados em aplicativos da web, APIs e usuários ou modificá-los.

Esta vulnerabilidade também é conhecida como IDOR (Referência de objeto direto inseguro).

[Mais detalhes sobre a vulnerabilidade](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa1-broken-object-level-authorization.md)

**Solução:**

* Implemente um mecanismo de autorização adequado que dependa das políticas e hierarquia do usuário.
* Prefira usar valores aleatórios e imprevisíveis como [GUIDs](https://pt.wikipedia.org/wiki/Identificador_%C3%BAnico_global) para os IDs dos objetos.
* Escreva testes para avaliar o mecanismo de autorização. Não implemente mudanças vulneráveis que quebrem os testes.

**Comportamento Wallarm:**

* Wallarm descobre automaticamente vulnerabilidades desse tipo.
* Wallarm não detecta ataques explorando essa vulnerabilidade por padrão. Para detectar e bloquear os ataques BOLA, configure o [gatilho **BOLA**](admin-en/configuration-guides/protecting-against-bola.md).

### Redirecionamento aberto

**Vulnerabilidade/Ataque**

**Código CWE:** [CWE-601][cwe-601]

**Código Wallarm:** `redir`

**Descrição:**

Um invasor pode usar um ataque de redirecionamento aberto para redirecionar um usuário para uma página da web maliciosa por meio de um aplicativo da web legítimo.

A vulnerabilidade para esse ataque ocorre devido ao filtro incorreto das entradas da URL.

**Solução:**

Você pode seguir estas recomendações:

*   Desinfetar e filtrar todos os parâmetros que um aplicativo da web recebe como entrada para evitar que uma entidade na entrada seja executada.
*   Notifique os usuários sobre todos os redirecionamentos pendentes e peça permissão explícita.


### Falsificação de solicitação do lado do servidor (SSRF)

**Vulnerabilidade/Ataque**

**Código CWE:** [CWE-918][cwe-918]

**Código Wallarm:** `ssrf`

**Descrição:**

Um ataque SSRF bem-sucedido pode permitir que um atacante faça solicitações em nome do servidor da web atacado; isso potencialmente leva a revelar as portas de rede em uso pelo aplicativo da web, a varredura das redes internas e a violação da autorização.

A partir do lançamento 4.4.3, Wallarm mitiga tentativas de ataque SSRF. As vulnerabilidades SSRF são detectadas por todas as [versões suportadas da Wallarm](updating-migrating/versioning-policy.md).

**Solução:**

Você pode seguir estas recomendações:

*   Desinfetar e filtrar todos os parâmetros que um aplicativo da web recebe como entrada para evitar que uma entidade na entrada seja executada.
*   Aplique as recomendações da [Folha de dicas de prevenção SSRF da OWASP][link-owasp-ssrf-cheatsheet].

### Falsificação de solicitação entre sites (CSRF)

**Vulnerabilidade**

**Código CWE:** [CWE-352][cwe-352]

**Código Wallarm:** `csrf`

**Descrição:**

Cross-Site Request Forgery (CSRF) é um ataque que força um usuário final a executar ações indesejadas em um aplicativo da web no qual ele está autenticado atualmente. Com a ajuda de engenharia social (como enviar um link por e-mail ou chat), um invasor pode enganar os usuários de um aplicativo da web para executar as ações de escolha do invasor.

A vulnerabilidade correspondente ocorre porque o navegador do usuário adiciona automaticamente os cookies de sessão do usuário que são definidos para o nome de domínio de destino ao realizar a solicitação entre sites.

Para a maioria dos sites, esses cookies incluem credenciais associadas ao site. Portanto, se o usuário estiver autenticado no site no momento, o site não terá como distinguir entre a solicitação forjada enviada pela vítima e uma solicitação legítima enviada pela vítima.

Como resultado, o atacante pode enviar uma solicitação para o aplicativo da web vulnerável a partir de um site malicioso, se passando por um usuário legítimo que está autenticado no site vulnerável; o atacante nem precisa ter acesso aos cookies do usuário.

**Comportamento Wallarm:**

Wallarm apenas descobre vulnerabilidades CSRF, mas não detecta e, portanto, não bloqueia ataques CSRF. O problema CSRF é resolvido em todos os navegadores modernos através de políticas de segurança de conteúdo (CSP).

**Solução:**

O CSRF é resolvido pelos navegadores, outros métodos de proteção são menos úteis, mas ainda podem ser usados.

Você pode seguir estas recomendações:

*   Empregue mecanismos de proteção contra CSRF, como tokens CSRF e outros.
*   Defina o atributo de cookie `SameSite`.
*   Aplique as recomendações da [Folha de dicas de prevenção CSRF da OWASP][link-owasp-csrf-cheatsheet].

### Acesso forçado

**Ataque**

**Código CWE:** [CWE-425][cwe-425]

**Código Wallarm:** `dirbust`

**Descrição:**

Este ataque pertence à classe de ataques de força bruta. O objetivo deste ataque é detectar os recursos ocultos de um aplicativo da web, ou seja, diretórios e arquivos. Isso é alcançado tentando diferentes nomes de arquivos e diretórios que são gerados com base em algum modelo ou extraídos de um arquivo de dicionário preparado.

Um ataque de acesso forçado bem-sucedido potencialmente concede acesso a recursos ocultos que não estão explicitamente disponíveis na interface do aplicativo da web, mas estão expostos ao serem acessados diretamente.

**Solução:**

Você pode seguir estas recomendações:

*   Restringir ou limitar o acesso dos usuários aos recursos que eles não devem ter acesso direto (por exemplo, empregando alguns mecanismos de autenticação ou autorização).
*   Limite o número de solicitações por um determinado período de tempo para o aplicativo da web.
*   Limite o número de tentativas de autenticação/autorização por um determinado período de tempo para o aplicativo da web.
*   Bloqueie novas tentativas de autenticação/autorização após um determinado número de tentativas fracassadas.
*   Defina os direitos de acesso necessários e suficientes para os arquivos e diretórios do aplicativo da web.

[Como configurar a solução Wallarm para proteger aplicativos contra força bruta →](admin-en/configuration-guides/protecting-against-bruteforce.md)


### Exposição de informações

**Vulnerabilidade/Ataque**

**Códigos CWE:** [CWE-200][cwe-200] (veja também: [CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548])

**Código Wallarm:** `infoleak`

**Descrição:**

O aplicativo divulga intencional ou inadvertidamente informações sensíveis para um assunto que não tem autorização para acessá-las.

A vulnerabilidade deste tipo só pode ser detectada pelo método de [detecção passiva](about-wallarm/detecting-vulnerabilities.md#passive-detection). Se a resposta à solicitação expõe informações sensíveis, a Wallarm registra um incidente e uma vulnerabilidade ativa do tipo **Exposição de informações**. Alguns tipos de informações sensíveis que podem ser detectadas pela Wallarm incluem:

* Status do sistema e do ambiente (por exemplo: rastreamento de pilha, avisos, erros fatais)
* Status e configuração da rede
* O código do aplicativo ou estado interno
* Metadados (por exemplo, registro de conexões ou cabeçalhos de mensagens)

**Solução:**

Você pode seguir a recomendação de proibir um aplicativo da web de ter a capacidade de exibir qualquer informação sensível.

### Componente vulnerável

**Vulnerabilidade**

**Códigos CWE:** [CWE-937][cwe-937], [CWE-1035][cwe-1035], [CWE-1104][cwe-1104]

**Código Wallarm:** `vuln_component`

**Descrição:**

Esta vulnerabilidade ocorre se o seu aplicativo da web ou API usar um componente vulnerável ou desatualizado. Isso pode incluir um SO, servidor de web / aplicativo, sistema de gerenciamento de banco de dados (DBMS), ambientes de tempo de execução, bibliotecas e outros componentes.

Esta vulnerabilidade corresponde a [A06:2021 – Componentes vulneráveis e desatualizados](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components).

**Solução:**

Você pode seguir a recomendação de monitorar e aplicar atualizações ou alterações de configuração oportunamente para a vida útil do aplicativo ou API, como segue:

* Remova dependências não utilizadas, recursos desnecessários, componentes, arquivos e documentação.
* Inventarie continuamente as versões de ambos os componentes do lado do cliente e do lado do servidor (por exemplo, frameworks, bibliotecas) e suas dependências usando ferramentas como OWASP Dependency Check, retire.js, etc.
* Monitore continuamente fontes como Common Vulnerability and Exposures (CVE) e National Vulnerability Database (NVD) em busca de vulnerabilidades nos componentes.
* Obtenha apenas componentes de fontes oficiais em links seguros. Prefira pacotes assinados para reduzir a chance de incluir um componente modificado e malicioso.
* Monitore as bibliotecas e os componentes que não são mantidos ou não criam patches de segurança para versões mais antigas. Se o patching não for possível, considere implantar um patch virtual para monitorar, detectar ou proteger contra o problema descoberto.

### Execução remota de código (RCE)

**Vulnerabilidade/Ataque**

**Códigos CWE:** [CWE-78][cwe-78], [CWE-94][cwe-94] e outros

**Código Wallarm:** `rce`

**Descrição:**

Um atacante pode injetar um código malicioso em uma solicitação para um aplicativo da web e o aplicativo executará esse código. Além disso, o atacante pode tentar executar certos comandos para o sistema operacional em que o aplicativo da web vulnerável é executado. 

Dado que um ataque RCE é bem-sucedido, um atacante pode realizar uma ampla gama de ações, incluindo:

*   Comprometer a confidencialidade, acessibilidade e integridade dos dados do aplicativo da web vulnerável.
*   Assumir o controle do sistema operacional e do servidor em que o aplicativo da web é executado.
*   Outras ações possíveis.
      
Esta vulnerabilidade ocorre devido à validação e análise incorretas da entrada do usuário.

**Solução:**

Você pode seguir a recomendação de desinfetar e filtrar toda a entrada do usuário para evitar que uma entidade na entrada seja executada.

### Evasão de autenticação

**Vulnerabilidade**

**Código CWE:** [CWE-288][cwe-288]

**Código Wallarm:** `auth`

**Descrição:**

Apesar de haver mecanismos de autenticação em vigor, um aplicativo da web pode ter métodos alternativos de autenticação que permitem contornar o mecanismo de autenticação principal ou explorar suas fraquezas. Essa combinação de fatores pode resultar em um atacante obtendo acesso com permissões de usuário ou administrador.

Um ataque bem-sucedido de evasão de autenticação potencialmente leva à divulgação dos dados confidenciais dos usuários ou ao controle do aplicativo vulnerável com permissões de administrador.

**Solução:**

Você pode seguir estas recomendações:

*   Melhore e fortaleça os mecanismos de autenticação existentes.
*   Elimine quaisquer métodos alternativos de autenticação que possam permitir aos atacantes acessar um aplicativo contornando o procedimento de autenticação exigido por meio de mecanismos predefinidos.
*   Aplique as recomendações da [Folha de dicas de autenticação da OWASP][link-owasp-auth-cheatsheet].

### Injeção CRLF

**Vulnerabilidade/Ataque**

**Código CWE:** [CWE-93][cwe-93]

**Código Wallarm:** `crlf`

**Descrição:**

As injeções CRLF representam uma classe de ataques que permitem que um invasor injete os caracteres Carriage Return (CR) e Line Feed (LF) em uma solicitação a um servidor (por exemplo, solicitação HTTP).

Combinada com outros fatores, essa injeção de caracteres CR/LF pode ajudar a explorar uma variedade de vulnerabilidades (por exemplo, Divisão de resposta HTTP [CWE-113][cwe-113], Contrabando de resposta HTTP [CWE-444][cwe-444]).

Um ataque de injeção CRLF bem-sucedido pode dar ao invasor a capacidade de contornar firewalls, realizar envenenamento de cache, substituir páginas da web legítimas por maliciosas, realizar o ataque de "redirecionamento aberto" e muitas outras ações.

Esta vulnerabilidade ocorre devido à validação e análise incorretas da entrada do usuário.

**Solução:**

Você pode seguir a recomendação de desinfetar e filtrar toda a entrada do usuário para evitar que uma entidade na entrada seja executada.

### Injeção LDAP

**Vulnerabilidade/Ataque**

**Código CWE:** [CWE-90][cwe-90]

**Código Wallarm:** `ldapi`

**Descrição:**

As injeções LDAP representam uma classe de ataques que permitem que um invasor altere os filtros de pesquisa LDAP modificando as solicitações a um servidor LDAP.

Um ataque de injeção LDAP bem-sucedido potencialmente concede acesso às operações de leitura e gravação em dados confidenciais sobre usuários e hosts LDAP.

Esta vulnerabilidade ocorre devido à validação e análise incorretas da entrada do usuário.

**Solução:**

Pode-se seguir estas recomendações:

*   Desinfetar e filtrar todos os parâmetros que um aplicativo da web recebe como entrada para evitar que uma entidade na entrada seja executada.
*   Aplique as recomendações da [Folha de dicas de prevenção de injeção LDAP da OWASP][link-owasp-ldapi-cheatsheet].

### Injeção NoSQL

**Vulnerabilidade/Ataque**

**Código CWE:** [CWE-943][cwe-943]

**Código Wallarm:** `nosqli`

**Descrição:**

A vulnerabilidade para este ataque ocorre devido à filtragem insuficiente da entrada do usuário. Um ataque de injeção NoSQL é realizado injetando uma consulta especialmente criada em um banco de dados NoSQL.

**Solução:**

Pode-se seguir a recomendação para desinfetar e filtrar toda a entrada do usuário para evitar que uma entidade na entrada seja executada.

### Traversal de Caminho

**Vulnerabilidade/Ataque**

**Código CWE:** [CWE-22][cwe-22]

**Código Wallarm:** `ptrav`

**Descrição:**

Um ataque de traversal de caminho permite que um invasor acesse arquivos e diretórios com dados confidenciais armazenados no sistema de arquivos onde reside o aplicativo da web vulnerável, alterando os caminhos existentes por meio dos parâmetros do aplicativo da web.

A vulnerabilidade para este ataque ocorre devido à filtragem insuficiente da entrada do usuário ao solicitar um arquivo ou diretório por meio do aplicativo da web.

**Solução:**

Pode-se seguir estas recomendações:

*   Desinfetar e filtrar todos os parâmetros que um aplicativo da web recebe como entrada para evitar que uma entidade na entrada seja executada.
*   Recomendações adicionais para mitigar esses ataques estão disponíveis [aqui][link-ptrav-mitigation].

### Injeção SQL

**Vulnerabilidade/Ataque**

**Código CWE:** [CWE-89][cwe-89]

**Código Wallarm:** `sqli`

**Descrição:**

A vulnerabilidade para este ataque ocorre devido à filtragem insuficiente da entrada do usuário. Um ataque de injeção SQL é realizado injetando uma consulta especialmente criada em um banco de dados SQL.

Um ataque de injeção SQL permite que um invasor injete um código SQL arbitário em uma [consulta SQL](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1). Isso leva potencialmente ao invasor sendo concedido acesso para ler e modificar os dados confidenciais, bem como a direitos de administrador do DBMS.

**Solução:**

Pode-se seguir estas recomendações:

*   Desinfetar e filtrar todos os parâmetros que um aplicativo da web recebe como entrada para evitar que uma entidade na entrada seja executada.
*   Aplique as recomendações da [Folha de dicas de prevenção de injeção SQL da OWASP][link-owasp-sqli-cheatsheet].

### Injeção de Email

**Ataque**

**Códigos CWE:** [CWE-20][cwe-20], [CWE-150][cwe-150], [CWE-88][cwe-88]

**Código Wallarm:** `mail_injection`

**Descrição:**

Email Injection é uma expressão [IMAP][link-imap-wiki]/[SMTP][link-smtp-wiki] maliciosa geralmente enviada por meio do formulário de contato do aplicativo da web para alterar o comportamento padrão do servidor de email.

A vulnerabilidade para este ataque ocorre devido à má validação dos dados inseridos no formulário de contato. A Email Injection permite contornar as restrições do cliente de email, roubar dados do usuário e enviar spam.

**Solução:**

* Desinfetar e filtrar todos os dados de entrada do usuário para evitar cargas úteis maliciosas na entrada de serem executadas.
* Aplique as recomendações da [Folha de dicas de validação de entrada da OWASP][link-owasp-inputval-cheatsheet].

### Injeção do SSI

**Ataque**

**Códigos CWE:** [CWE-96][cwe-96], [CWE-97][cwe-97]

**Código Wallarm:** `ssi`

**Descrição:**

[SSI (Server Side Includes)][ssi-wiki] é uma linguagem de scripts do lado do servidor interpretada simples mais útil para incluir o conteúdo de um ou mais arquivos em uma página da web em um servidor web. É suportado pelos servidores web Apache e NGINX.

A injeção SSI permite a exploração de um aplicativo da web injetando cargas úteis maliciosas nas páginas HTML ou executando códigos arbitrários remotamente. Pode ser explorado através da manipulação do SSI em uso no aplicativo ou forçando seu uso através de campos de entrada do usuário.

**Exemplo:**

Um invasor pode alterar a saída da mensagem e alterar o comportamento do usuário. Exemplo de injeção SSI:

```bash
<!--#config errmsg="Acesso negado, digite seu nome de usuário e senha"-->
```

**Solução:**

* Desinfetar e filtrar todos os dados de entrada do usuário para evitar cargas úteis maliciosas na entrada de serem executadas.
* Aplique as recomendações da [Folha de dicas de validação de entrada da OWASP][link-owasp-inputval-cheatsheet].

### Atribuição em massa

**Ataque**

**Código Wallarm:** `mass_assignment`

**Descrição:**

Durante um ataque de Atribuição em Massa, os invasores tentam vincular parâmetros da solicitação HTTP a variáveis ou objetos de código do programa. Se uma API for vulnerável e permitir a vinculação, os invasores poderão alterar propriedades de objeto sensíveis que não se destinam a ser expostas, o que pode levar à escalonamento de privilégios, à evasão de mecanismos de segurança e muito mais.

As APIs vulneráveis ao ataque de atribuição em massa permitem converter a entrada do cliente em variáveis internas ou propriedades de objeto sem filtragem adequada. Esta vulnerabilidade está incluída no [OWASP API Top 10 (API6:2019 Mass Assignment)](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa6-mass-assignment.md) lista dos riscos de segurança de API mais sérios.

A partir da versão 4.4.3, o Wallarm mitiga tentativas de atribuição em massa.

**Solução:**

Para proteger a API, você pode seguir estas recomendações:

* Evite usar funções que vinculam automaticamente a entrada do cliente em variáveis de código ou propriedades de objeto.
* Use recursos de função incorporados para listar apenas as propriedades que devem ser atualizadas pelo cliente e listar em preto as propriedades privadas.
* Se aplicável, defina e aplique de maneira explícita esquemas para as cargas úteis de dados de entrada.

### JWT fraco

**Vulnerabilidade**

**Código CWE:** [CWE-1270][cwe-1270], [CWE-1294][cwe-1294]

**Código Wallarm:** `weak_auth`

**Descrição:**

[JSON Web Token (JWT)](https://jwt.io/) é uma padrão de autenticação popular usado para trocar dados entre recursos como APIs de forma segura.

A comprometimento do JWT é um objetivo comum dos atacantes já que quebrar os mecanismos de autenticação fornece a eles acesso total a aplicativos da web e APIs. Os JWTs mais fracos têm maior chance de serem comprometidos.

**Comportamento Wallarm:**

A Wallarm detecta JWTs fracos apenas se o nó de filtragem tiver a versão 4.4 ou superior e houver o [gatilho **JWT fraco**](user-guides/triggers/trigger-examples.md#detect-weak-jwts) ativado.

A Wallarm considera que os JWTs são fracos se forem:

* Não criptografados - não há algoritmo de assinatura (o campo `alg` é `none` ou ausente).
* Assinados usando chaves secretas comprometidas.

Uma vez que um JWT fraco é detectado, a Wallarm registra a [vulnerabilidade](user-guides/vulnerabilities.md) correspondente.

**Solução:**

* Aplique as recomendações da [Folha de dicas do Token Web JSON do OWASP](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
* [Verifique se sua implementação JWT é vulnerável a segredos bem conhecidos](https://lab.wallarm.com/340-weak-jwt-secrets-you-should-check-in-your-code/)

### Abuso de API

**Ataque**

**Código Wallarm:** `api_abuse`

**Descrição:**

Um conjunto de tipos de bot básicos que inclui o aumento do tempo de resposta do servidor, a criação de contas falsas e a escalada.

**Comportamento Wallarm:**

A Wallarm detecta o abuso da API apenas se o nó de filtragem tiver a versão 4.2 ou superior.

O módulo [Prevenção de abuso de API](api-abuse-prevention/overview.md) usa o modelo complexo de detecção de bots para detectar o seguinte tipo de bots:

* Abuso da API destinado a aumentar o tempo de resposta do servidor ou indisponibilidade do servidor. Normalmente, é alcançado por picos de tráfego maliciosos.
* [Criação de conta falsa](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-019_Account_Creation) e [Spamming](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-017_Spamming) é a criação de contas falsas ou confirmação de conteúdo falso (por exemplo, feedback). Geralmente, não resulta na indisponibilidade do serviço, mas retarda ou degrada processos de negócios regulares, por exemplo:

    * Processamento de solicitações de usuários reais pela equipe de suporte
    * Coleta de estatísticas de usuário reais pela equipe de marketing

* [Scalping](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-005_Scalping) é caracterizado por bots tornando produtos de lojas online indisponíveis para clientes reais, por exemplo, reservando todos os itens para que eles fiquem fora de estoque, mas não geram qualquer lucro.

Se as métricas apontam para sinais de ataque de bot, o módulo [denylists ou graylists](api-abuse-prevention/overview.md#reaction-to-malicious-bots) a fonte do tráfego de anomalias por 1 hora.

**Solução:**

Você pode seguir estas recomendações:

* Familiarize-se com o [deskrição de ameaças automatizadas da OWASP](https://owasp.org/www-project-automated-threats-to-web-applications/) para aplicativos da web.
* Denylist de endereços IP de regiões e origens (como Tor), definitivamente não relacionados ao seu aplicativo.
* Configure o limite de taxa do lado do servidor para as solicitações.
* Use soluções CAPTCHA adicionais.
* Procure em sua análise de aplicativo os sinais de ataque bot.

### Abuso da API - Assumir conta

**Ataque**

**Código Wallarm:** `api_abuse`

**Descrição:**

Um tipo de ataque cibernético no qual um ator malicioso ganha acesso à conta de outra pessoa sem permissão ou conhecimento. Isso pode acontecer quando um invasor obtém as credenciais de login de um usuário por meio de vários meios, como phishing, malwares ou engenharia social. Depois de ter acesso à conta, eles podem usar para vários propósitos, como roubar informações sensíveis, realizar transações fraudulentas ou espalhar spam ou malwares. Ataques de assumir contas podem ter sérias consequências para indivíduos e empresas, incluindo perdas financeiras, danos à reputação e perda de confiança.

**Comportamento Wallarm:**

A Wallarm detecta o abuso da API apenas se o nó de filtragem tiver a versão 4.2 ou superior.

O módulo [Prevenção de abuso de API](api-abuse-prevention/overview.md) usa o modelo complexo de detecção de bots para detectar os seguintes tipos de bots de Assumir Conta:

* [Crack de Credencial](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-007_Credential_Cracking.html) inclui ataques de força bruta, dicionário (lista de palavras) e palpite usados contra processos de autenticação do aplicativo para identificar credenciais de conta válidas.
* [Preenchimento de Credenciais](https://owasp.org/www-community/attacks/Credential_stuffing) é a injeção automatizada de credenciais de usuário roubadas em formulários de login do site, a fim de obter acesso fraudulento a contas de usuários.

**Solução:**

Você pode seguir estas recomendações:

* Familiarize-se com o [deskrição de ameaças automatizadas da OWASP](https://owasp.org/www-project-automated-threats-to-web-applications/) para aplicativos da web.
* Use senhas fortes.
* Não use as mesmas senhas para diferentes recursos.
* Ative a autenticação de dois fatores.
* Use soluções CAPTCHA adicionais.
* Monitore as contas em busca de atividades suspeitas.

### Abuso da API - Rastreadores de segurança

**Ataque**

**Código Wallarm:** `api_abuse`

**Descrição:**

Embora os rastreadores de segurança sejam projetados para verificar sites e detectar vulnerabilidades e problemas de segurança, eles também podem ser usados para fins maliciosos. Os invasores podem usá-los para identificar sites vulneráveis e explorá-los para seu próprio ganho.

Além disso, alguns rastreadores de segurança podem ser mal projetados e inadvertidamente causar danos a sites, sobrecarregando servidores, causando falhas ou criando outros tipos de interrupções.

**Comportamento Wallarm:**

A Wallarm detecta o abuso da API apenas se o nó de filtragem tiver a versão 4.2 ou superior.

O módulo [Prevenção de abuso de API](api-abuse-prevention/overview.md) usa o modelo complexo de detecção de bots para detectar os seguintes tipos de bots Rastreadores de Segurança:

* [Digitalização de dados](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-004_Fingerprinting) explora solicitações específicas que são enviadas ao aplicativo trazendo informações para perfilar o aplicativo.
* [Footprinting](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-018_Footprinting.html) é uma coleta de informações com o objetivo de aprender o máximo possível sobre a composição, configuração e mecanismos de segurança do aplicativo.
* [Varredura de vulnerabilidade](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-014_Vulnerability_Scanning) é caracterizada pela busca de vulnerabilidade do serviço.

**Solução:**

Você pode seguir estas recomendações:

* Familiarize-se com o [deskrição de ameaças automatizadas da OWASP](https://owasp.org/www-project-automated-threats-to-web-applications/) para aplicativos da web.
* Use certificados SSL.
* Use soluções CAPTCHA adicionais.
* Implemente limite de taxa.
* Monitore seu tráfego em busca de padrões que podem indicar atividade maliciosa.
* Use um arquivo robots.txt para dizer aos rastreadores dos mecanismos de busca quais páginas podem e não podem ser rastreadas.
* Atualize regularmente o software.
* Use uma rede de entrega de conteúdo (CDN).

### Abuso da API - Raspagem

**Ataque**

**Código Wallarm:** `api_abuse`

**Descrição:**

A raspagem da web, também conhecida como coleta de dados ou colheita da web, é o processo de extrair dados automaticamente de sites. Envolve o uso de software ou código para recuperar e extrair dados de páginas da web e salvá-los em um formato estruturado, como uma planilha ou banco de dados.

A raspagem da web pode ser usada para fins maliciosos. Por exemplo, os raspadores podem ser usados para roubar informações sensíveis, como credenciais de login, informações pessoais ou dados financeiros de sites. Os raspadores também podem ser usados para spam ou raspar dados de um site de uma maneira que degrade seu desempenho, causando ataques de negação de serviço (DoS).

**Comportamento Wallarm:**

A Wallarm detecta o abuso da API apenas se o nó de filtragem tiver a versão 4.2 ou superior.

O módulo [Prevenção de abuso de API](api-abuse-prevention/overview.md) usa o modelo complexo de detecção de bots para detectar o tipo de bot [scraping](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-011_Scraping) que está coletando dados acessíveis e / ou saída processada do aplicativo que pode resultar em conteúdo privado ou não gratuito tornando-se disponível para qualquer usuário.

**Solução:**

Você pode seguir estas recomendações:

* Familiarize-se com o [deskrição de ameaças automatizadas da OWASP](https://owasp.org/www-project-automated-threats-to-web-applications/) para aplicativos da web.
* Use soluções CAPTCHA adicionais.
* Use um arquivo robots.txt para dizer aos rastreadores de motores de busca quais páginas eles podem e não podem rastrear.
* Monitore seu tráfego em busca de padrões que podem indicar atividade maliciosa.
* Implemente um limite de taxa.
* Ofusque ou criptografe dados.
* Tomar medidas legais.

## A lista de ataques especiais e vulnerabilidades

### Patch virtual

**Ataque**

**Código Wallarm:** `vpatch`

**Descrição:**     

Uma solicitação é marcada como um `vpatch` se faz parte de um ataque que foi mitigado pelo mecanismo de [patch virtual][doc-vpatch].

### Cabeçalho XML inseguro

**Ataque**

**Código Wallarm:** `invalid_xml`

**Descrição:**  

Uma solicitação é marcada como um `invalid_xml` se o corpo dela contém um documento XML e a codificação do documento difere da codificação declarada no cabeçalho XML.

### Excedendo o limite de recursos computacionais

**Ataque**

**Código Wallarm:** `overlimit_res`

**Descrição:**

Existem dois cenários em que o nó Wallarm marca uma solicitação como o ataque `overlimit_res`:

* O nó Wallarm está configurado de tal maneira que deve gastar no máximo `N` milissegundos no processamento de solicitações de entrada (valor padrão: `1000`). Se a solicitação não for processada dentro do prazo especificado, o processamento da solicitação será interrompido e a solicitação marcada como um ataque `overlimit_res`.

    Você pode especificar o limite de tempo personalizado e alterar o comportamento padrão do nó quando o limite é excedido usando a [regra **Ajuste fino da detecção de ataque overlimit_res**](user-guides/rules/configure-overlimit-res-detection.md).

    Limitar o tempo de processamento da solicitação evita os ataques de bypass direcionados aos nós Wallarm. Em alguns casos, as solicitações marcadas como `overlimit_res` podem indicar recursos insuficientes alocados para os módulos Wallarm que levam a um longo tempo de processamento da solicitação.
* A solicitação faz o upload do arquivo gzip pesando mais de 512 MB.

### Ataque de negação de serviço distribuído (DDoS)

Um ataque de negação de serviço distribuído (DDoS) é um tipo de ataque cibernético no qual um invasor busca tornar um site ou serviço online indisponível, sobrecarregando-o com tráfego de várias fontes.

Existem muitas técnicas que os invasores podem usar para lançar um ataque DDoS, e os métodos e ferramentas que eles usam podem variar significativamente. Alguns ataques são relativamente simples e usam técnicas de baixo nível, como enviar um grande número de solicitações de conexão a um servidor, enquanto outros são mais sofisticados e usam táticas complexas, como falsificação de endereços IP ou exploração de vulnerabilidades na infraestrutura de rede.

[Leia nosso guia sobre como proteger recursos contra DDoS](admin-en/configuration-guides/protecting-against-ddos.md)