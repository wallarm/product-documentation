---
descrição: Este documento lista as vulnerabilidades de software que o FAST detecta. Cada entidade na lista tem o código Wallarm que corresponde a esta vulnerabilidade. A maioria das vulnerabilidades também é acompanhada pelos códigos do [Common Weakness Enumeration (CWE)][link-cwe].

Cada entidade na lista tem o código Wallarm que corresponde a esta vulnerabilidade.

## Lista de Vulnerabilidades

### Anomalia

**Código CWE:** nenhum<br>
**Código Wallarm:** `anomaly`

####    Descrição

Uma Anomalia é caracterizada por uma reação atípica do aplicativo a um pedido recebido.

A anomalia detectada indica uma área fraca e potencialmente vulnerável do aplicativo. Essa vulnerabilidade permite que um invasor ataque diretamente o aplicativo ou colete os dados antes do ataque.

### Ataque em Entidade Externa XML (XXE)

**Código CWE:** [CWE-611][cwe-611]<br>
**Código Wallarm:** `xxe`

####    Descrição

A vulnerabilidade XXE permite que um invasor injete uma entidade externa em um documento XML para ser avaliado por um analisador XML e depois executado no servidor web de destino.

Como resultado de um ataque bem-sucedido, um invasor será capaz de 
* obter acesso aos dados confidenciais do aplicativo web
* escanear redes de dados internas
* ler os arquivos localizados no servidor web
* realizar um ataque [SSRF][anchor-ssrf]
* realizar um ataque de Denial of Service (DoS)

Essa vulnerabilidade ocorre devido à falta de restrição no análise de entidades externas XML em um aplicativo da web.

####    Medidas de Remediação 

Você pode seguir estas recomendações:
* Desabilite a análise de entidades externas XML ao trabalhar com os documentos XML fornecidos por um usuário.
* Aplique as recomendações da [Página de Prevenção contra Ataques XXE da OWASP (OWASP XXE Prevention Cheat Sheet)][link-owasp-xxe-cheatsheet].


### Injeção de Modelo no Lado do Servidor (SSTI)

**Códigos CWE:** [CWE-94][cwe-94], [CWE-159][cwe-159]<br>
**Código Wallarm:** `ssti`

####    Descrição

Um invasor pode injetar um código executável em um formulário preenchido por um usuário em um servidor web vulnerável a ataques SSTI, de modo que o código seja analisado e executado pelo servidor web.

Um ataque bem-sucedido pode tornar um servidor web vulnerável completamente comprometido, permitindo potencialmente a um invasor executar solicitações arbitrárias, explorar os sistemas de arquivos do servidor, e, em certas condições, executar remotamente código arbitrário (veja [“Ataque RCE”][anchor-rce] para detalhes), assim como muitas outras coisas.

Essa vulnerabilidade decorre da validação e análise incorreta da entrada do usuário.

####    Medidas de Remediação 

Você pode seguir a recomendação de sanear e filtrar toda a entrada do usuário para evitar que uma entidade na entrada seja executada.


### Falsificação de Solicitação entre Sites (CSRF)

**Código CWE:** [CWE-352][cwe-352]<br>
**Código Wallarm:** `csrf`

####    Descrição

Um ataque CSRF permite a um invasor enviar solicitações para um aplicativo vulnerável em nome de um usuário legítimo.

A vulnerabilidade correspondente ocorre devido ao navegador do usuário adicionar automaticamente cookies que são definidos para o nome de domínio alvo ao executar a solicitação entre sites.

Como resultado, o invasor pode enviar uma solicitação ao aplicativo web vulnerável a partir de um site malicioso, passando como um usuário legítimo que está autenticado no site vulnerável; o invasor nem mesmo precisa ter acesso aos cookies desse usuário.

####    Medidas de Remediação

Você pode seguir estas recomendações:
* Empregue mecanismos de proteção anti-CSRF, como tokens CSRF e outros.
* Define o atributo `SameSite` do cookie.
* Aplique as recomendações do [OWASP CSRF Prevention Cheat Sheet][link-owasp-csrf-cheatsheet].


### Cross-site Scripting (XSS)

**Código CWE:** [CWE-79][cwe-79]<br>
**Código Wallarm:** `xss`

####    Descrição

Um ataque cross-site scripting permite a um invasor executar um código arbitrário preparado no navegador de um usuário.

Existem alguns tipos de ataques XSS:
* O XSS persistente é quando um código malicioso é pré-incorporado na página do aplicativo da web.

    Se o aplicativo da web for vulnerável ao ataque XSS persistente, então será possível para um invasor injetar um código malicioso na página HTML do aplicativo da web; além disso, este código persistirá e será executado pelo navegador de qualquer usuário que solicite a página da web infectada.
    
* O XSS refletido é quando um invasor engana um usuário para abrir um uma link especialmente criado.      

* O XSS baseado em DOM é quando um snippet de código JavaScript incorporado na página do aplicativo da web analisa a entrada e a executa como um comando JavaScript devido a erros neste snippet de código.

Explorar qualquer uma das vulnerabilidades listadas acima leva à execução de um código JavaScript arbitrário. Desde que o ataque XSS foi bem-sucedido, um invasor pode roubar a sessão de um usuário ou credenciais, fazer solicitações em nome do usuário e realizar outras ações maliciosas.

Esta classe de vulnerabilidades ocorre devido à validação e análise incorreta da entrada do usuário.

####    Medidas de Remediação 

Você pode seguir estas recomendações:
* Sanear e filtrar todos os parâmetros que um aplicativo da web recebe como entrada para evitar que uma entidade na entrada seja executada.
* Ao formar as páginas do aplicativo da web, sanear e escapar de quaisquer entidades que são formadas de maneira dinâmica.
* Aplique as recomendações do [OWASP XXS Prevention Cheat Sheet][link-owasp-xss-cheatsheet].


### Referências Diretas a Objetos Inseguros (IDOR)

**Código CWE:** [CWE-639][cwe-639]<br>
**Código Wallarm:** `idor`

####    Descrição

Com a vulnerabilidade IDOR, os mecanismos de autenticação e autorização de um aplicativo web vulnerável não impedem que um usuário acesse os dados ou recursos de outro usuário.

Essa vulnerabilidade ocorre devido ao aplicativo da web conceder a capacidade de acessar um objeto (por exemplo, um arquivo, um diretório, uma entrada de banco de dados) mudando parte da string de solicitação e não implementando mecanismos adequados de controle de acesso.

Para explorar essa vulnerabilidade, um invasor manipula a string de solicitação para obter acesso não autorizado a informações confidenciais que pertencem ao aplicativo da web vulnerável ou a seus usuários.

####    Medidas de Remediação 

Você pode seguir estas recomendações:
* Implemente mecanismos de controle de acesso adequados aos recursos do aplicativo da web.
* Implemente mecanismos de controle de acesso baseados em funções para conceder acesso aos recursos com base em funções atribuídas aos usuários.
* Use referências indiretas a objetos.
* Aplique as recomendações do [OWASP IDOR Prevention Cheat Sheet][link-owasp-idor-cheatsheet].


### Redirecionamento Aberto

**Código CWE:** [CWE-601][cwe-601]<br>
**Código Wallarm:** `redir`

####    Descrição

Um invasor pode usar um ataque de redirecionamento aberto para redirecionar um usuário para uma página web maliciosa por meio de um aplicativo web legítimo.

A vulnerabilidade a este ataque ocorre devido ao filtragem inadequada das entradas de URL.

####    Medidas de Remediação 

Você pode seguir estas recomendações:
* Sanear e filtrar todos os parâmetros que um aplicativo da web recebe como entrada para evitar que uma entidade na entrada seja executada.
* Notifique os usuários sobre todos os redirecionamentos pendentes e peça permissão explícita.


### Falsificação de Solicitação do Lado do Servidor (SSRF)

**Código CWE:** [CWE-918][cwe-918]<br>
**Código Wallarm:** `ssrf`

####    Descrição

Um ataque SSRF bem-sucedido pode permitir a um invasor fazer solicitações em nome do servidor de web atacado; isso pode potencialmente levar à revelação das portas de rede em uso pelo aplicativo web vulnerável, escaneamento das redes internas e à burla da autorização.

####    Medidas de Remediação 

Você pode seguir estas recomendações:
* Sanear e filtrar todos os parâmetros que um aplicativo da web recebe como entrada para evitar que uma entidade na entrada seja executada.
* Aplique as recomendações do [OWASP SSRF Prevention Cheat Sheet][link-owasp-ssrf-cheatsheet].


### Exposição de Informação

**Códigos CWE:** [CWE-200][cwe-200] (veja também: [CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548])<br>
**Código Wallarm:** `info`

####    Descrição

O aplicativo web vulnerável intencionalmente ou não intencionalmente divulga informações confidenciais para um sujeito que não está autorizado a acessá-las.

####    Medidas de Remediação 

Você pode seguir a recomendação de proibir um aplicativo da web de ter a capacidade de exibir qualquer informação confidencial.


### Execução Remota de Código (RCE)

**Códigos CWE:** [CWE-78][cwe-78], [CWE-94][cwe-94] e outros<br>
**Código Wallarm:** `rce`

####    Descrição

Um invasor pode injetar código malicioso em uma solicitação a um aplicativo da web, e o aplicativo executará esse código. Além disso, o invasor pode tentar executar certos comandos para o sistema operacional em que o aplicativo da web vulnerável está sendo executado.

Desde que um ataque RCE tenha sido bem-sucedido, um invasor pode realizar uma ampla gama de ações, incluindo
* Comprometer a confidencialidade, a acessibilidade e a integridade dos dados do aplicativo da web vulnerável.
* Ter controle sobre o sistema operacional e o servidor em que o aplicativo da web é executado.
* Outras ações possíveis.

Esta vulnerabilidade ocorre devido à validação e análise incorreta da entrada do usuário.

####    Medidas de Remediação

Você pode seguir a recomendação de sanear e filtrar toda a entrada do usuário para evitar que uma entidade na entrada seja executada.


### Drible de Autenticação

**Código CWE:** [CWE-288][cwe-288]<br>
**Código Wallarm:** `auth`

####    Descrição

Apesar de ter mecanismos de autenticação em vigor, um aplicativo da web pode ter métodos de autenticação alternativos que permitem evitar o principal mecanismo de autenticação ou explorar suas fraquezas. Essa combinação de fatores pode resultar em um invasor obtendo acesso com permissões de usuário ou administrador.

Um ataque bem-sucedido de drible de autenticação pode potencialmente levar a revelação dos dados confidenciais dos usuários ou a tomar controle do aplicativo vulnerável com permissões de administrador.

####    Medidas de Remediação 

Você pode seguir estas recomendações:
* Melhore e fortaleça os mecanismos de autenticação existentes.
* Elimine quaisquer métodos de autenticação alternativos que possam permitir que os invasores acessem um aplicativo ao contornar o procedimento de autenticação exigido pelos mecanismos predefinidos.
* Aplique as recomendações do [OWASP Authentication Cheat Sheet][link-owasp-auth-cheatsheet].


### Injeção LDAP

**Código CWE:** [CWE-90][cwe-90]<br>
**Código Wallarm:** `ldapi`

####    Descrição

As injeções LDAP representam uma classe de ataques que permitem a um invasor alterar filtros de busca LDAP modificando solicitações para um servidor LDAP.

Um ataque bem-sucedido de injeção LDAP potencialmente concede acesso às operações de leitura e gravação de dados confidenciais sobre usuários e hosts LDAP.

Essa vulnerabilidade ocorre devido à validação e análise incorretas da entrada do usuário.

####    Medidas de Remediação 

Você pode seguir estas recomendações:
* Sanear e filtrar todos os parâmetros que um aplicativo da web recebe como entrada para evitar que uma entidade na entrada seja executada.
* Aplique as recomendações do [OWASP LDAP Injection Prevention Cheat Sheet][link-owasp-ldapi-cheatsheet].


### Injeção NoSQL

**Código CWE:** [CWE-943][cwe-943]<br>
**Código Wallarm:** `nosqli`

####    Descrição

Vulnerabilidade a este ataque ocorre devido à filtragem insuficiente da entrada de usuário. Um ataque de injeção NoSQL é realizado injetando uma consulta especialmente preparada em um banco de dados NoSQL.

####    Medidas de Remediação 

Você pode seguir a recomendação de sanear e filtrar toda a entrada do usuário para evitar que uma entidade na entrada seja executada.


### Traversal de Caminho

**Código CWE:** [CWE-22][cwe-22]<br>
**Código Wallarm:** `ptrav`

####    Descrição

Um ataque de traversal de caminho permite a um invasor acessar arquivos e diretórios com dados confidenciais armazenados no sistema de arquivos onde o aplicativo da web vulnerável reside, alterando os caminhos existentes através dos parâmetros do aplicativo da web.

A vulnerabilidade a este ataque ocorre devido à filtragem insuficiente de entrada de usuário ao solicitar um arquivo ou diretório através do aplicativo da web.

####    Medidas de Remediação 

Você pode seguir estas recomendações:
* Sanear e filtrar todos os parâmetros que um aplicativo da web recebe como entrada para evitar que uma entidade na entrada seja executada.
* Recomendações adicionais para mitigar tais ataques estão disponíveis [aqui][link-ptrav-mitigation].


### Injeção SQL

**Código CWE:** [CWE-89][cwe-89]<br>
**Código Wallarm:** `sqli`

####    Descrição

A vulnerabilidade a esse ataque ocorre devido à filtragem insuficiente da entrada de usuário. Um ataque de injeção SQL é realizado injetando uma consulta especialmente preparada em um banco de dados SQL.

O ataque de injeção SQL permite a um invasor injetar código SQL arbitrário em uma consulta SQL. Isso potencialmente leva o invasor a obter acesso para ler e modificar dados confidenciais, bem como a adquirir direitos de administrador do DBMS.

####    Medidas de Remediação 

Você pode seguir estas recomendações:
* Sanear e filtrar todos os parâmetros que um aplicativo da web recebe como entrada para evitar que uma entidade na entrada seja executada.
* Aplique as recomendações do [OWASP SQL Injection Prevention Cheat Sheet][link-owasp-sqli-cheatsheet].
