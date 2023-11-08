[link-app-examination]:     app-examination.md
[link-points]:              ../points/intro.md
[link-using-extension]:     ../using-extension.md
[link-meta-info]:           ../create-extension.md#structure-of-the-meta-info-section

[doc-collect-phase]:        ../phase-collect.md
[doc-match-phase]:          ../phase-match.md
[doc-modify-phase]:         ../phase-modify.md
[doc-generate-phase]:       ../phase-generate.md
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project


#   Criação de Extensão de Modificação

A extensão descrita neste documento irá modificar uma requisição básica de entrada para injetar algum payload. Esses payloads poderiam levar à exploração da vulnerabilidade SQLi no formulário de login do aplicativo alvo [“OWASP Juice Shop”][link-juice-shop].
  
##  Preparativos

É altamente recomendado seguir estas etapas antes de criar uma extensão FAST:
1.  [Investigue o comportamento do aplicativo alvo][link-app-examination] para o qual você está criando a extensão.
2.  [Leia os princípios de construção de pontos para uma extensão][link-points].


##  Construção da Extensão

Crie um arquivo que descreve a extensão (por exemplo, `mod-extension.yaml`) e preencha-o com as seções requeridas:

1.  [**A seção `meta-info`**][link-meta-info].

   Prepare a descrição da vulnerabilidade que a extensão tentará detectar.
    * cabeçalho da vulnerabilidade: `OWASP Juice Shop SQLi (extensão mod)`
    * descrição da vulnerabilidade: `Demonstração de SQLi no OWASP Juice Shop (Login Admin)`
    * tipo de vulnerabilidade: SQL injection
    * nível de ameaça da vulnerabilidade: alto
    
    A  seção `meta-info` correspondente deve ser assim:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (extensão mod)'
      - description: 'Demonstração de SQLi no OWASP Juice Shop (Login Admin)'
    ```
    
2.  **A seção `collect`, a [Fase Collect][doc-collect-phase]**.
    
    O método REST API `POST /rest/user/login` é chamado ao tentar fazer login.
    
    Não há necessidade de criar solicitações de teste para cada uma das solicitações baseline de login que foram enviadas para a API, pois a detecção de vulnerabilidades será realizada da mesma forma para cada pedaço de dados passado na solicitação POST.
    
    Configure a extensão de maneira que ela execute uma vez quando a API receber a solicitação de login. Para fazer isso, adicione a fase Collect com a condição de unicidade à extensão.

    A solicitação `/rest/user/login` para a API fazer o login inclui:

    1.  a primeira parte do caminho com o valor `rest`,
    2.  a segunda parte do caminho com o valor `user`, e 
    3.  o método de ação `login`
    
    Os pontos correspondentes que se referem a esses valores são os seguintes:

    1.  `PATH_0_value` para a primeira parte do caminho,
    2.  `PATH_1_value` para a segunda parte do caminho,
    3.  `ACTION_NAME_value` para o método de ação `login`
    
    Se você acrescentar a condição de que a combinação destes três elementos deve ser única, então a extensão só será executada para a primeira solicitação baseline `/rest/user/login` para a API (tal solicitação será tratada como única, e todas as solicitações subsequentes para a API para o login não serão únicas). 
    
    Adicione a seção `collect` correspondente ao arquivo YAML da extensão. 
    
    ```
    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]
    ```

3.  **A seção `match`, a [Fase Match][doc-match-phase]**.
    
    É necessário verificar se as solicitações baseline de entrada são realmente as solicitações para a API fazer o login, pois a extensão que estamos criando explorará as vulnerabilidades que o formulário de login contém.
    
    Configure a extensão para que ela só execute se uma solicitação baseline estiver direcionada para a seguinte URI: `/rest/user/login`. Adicione a fase Match que verifica se a solicitação recebida contém os elementos requeridos. Isso pode ser feito usando a seguinte seção `match`:

    ```
    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'
    ```

4.  **A seção `modify`, a [Fase Modify][doc-modify-phase]**.
    
    Vamos supor que seja necessário modificar a solicitação baseline para alcançar os seguintes objetivos:
    * Limpar o valor do cabeçalho HTTP `Accept-Language` (este valor não é necessário para que a vulnerabilidade seja detectada).
    * Substituir os valores reais dos parâmetros `email` e `password` pelos valores neutros `dummy`.
    
    Adicione à extensão a seguinte seção `modify` que altera a solicitação para atender aos objetivos descritos acima:
    
    ```
    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"
    ```
    
    !!! info "Sintaxe da descrição dos elementos da solicitação"
        Como os dados da solicitação que estão contidos no formato JSON são armazenados em pares `<chave: valor>`, o ponto que se refere ao valor do elemento `email` se parecerá com o mostrado acima. O ponto que se refere ao valor do elemento `password` tem uma estrutura similar.
        
        Para ver informações detalhadas sobre a construção dos pontos, prossiga para este [link][link-points].
 
5.  **A seção `generate`, a [Fase Generate][doc-generate-phase]**.

    É sabido que existem dois payloads que devem substituir o valor do parâmetro `email` na solicitação baseline para explorar a vulnerabilidade de injeção de SQL no aplicativo alvo:
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
        
    !!! info "Inserindo o payload na solicitação modificada"
        O payload será inserido na solicitação modificada anteriormente, porque a extensão contém a seção `modify`. Assim, após inserir o primeiro payload no campo `email`, os dados da solicitação de teste devem ser assim:
    
        ```
        {
            "email": "'or 1=1 --",
            "password":"dummy"
        }
        ```
    
        Como qualquer senha pode ser usada para fazer login com sucesso devido aos payloads escolhidos, não é necessário inserir o payload no campo de senha, que terá um valor `dummy` após a fase Modify ser aplicada.
    
        Adicione a seção `generate` que criará as solicitações de teste que atendem aos requisitos discutidos acima.
    
        ```
        generate:
          - payload:
            - "'or 1=1 --"
            - "admin@juice-sh.op'--"
          - into: "POST_JSON_DOC_HASH_email_value"
          - method:
            - replace
        ```

6.  **A seção `detect`, a [Fase Detect][doc-detect-phase]**.
    
    As seguintes condições indicam que a autenticação do usuário com direitos de administrador foi bem-sucedida:
    * A presença do parâmetro identificador do carrinho de compras com o valor `1` no corpo da resposta. O parâmetro está no formato JSON e deve ser da seguinte maneira:
    
        ```
        "bid":1
        ```
    
    * A presença do parâmetro email do usuário com o valor `admin@juice-sh.op` no corpo da resposta. O parâmetro está no formato JSON e deve ser da seguinte maneira:
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    Adicione a seção `detect` que verifica se o ataque foi bem-sucedido de acordo com as condições descritas acima.
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
!!! info "Escapando símbolos especiais"
    Lembre-se de escapar os símbolos especiais nas strings.

##  Arquivo de Extensão

Agora o arquivo `mod-extension.yaml` contém o conjunto completo das seções requeridas para a extensão operar. A listagem do conteúdo do arquivo está abaixo:

??? info "mod-extension.yaml"
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (extensão mod)'
      - description: 'Demonstração de SQLi no OWASP Juice Shop (Login Admin)'

    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]

    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'

    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"

    generate:
      - payload:
        - "'or 1=1 --"
        - "admin@juice-sh.op'--"
      - into: "POST_JSON_DOC_HASH_email_value"
      - method:
        - replace

    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```

##  Utilizando a Extensão

Para obter informações detalhadas sobre como usar a expressão criada, leia [este documento][link-using-extension].