[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-logic]:           logic.md
[link-markers]:         detect/markers.md
[link-ext-logic]:       logic.md

[img-generate-methods]: ../../images/fast/dsl/en/phases/generate-methods.png
[img-generate-payload]: ../../images/fast/dsl/en/phases/generate-payload.png

# Fase Generate

!!! info "Escopo da fase"
    Esta fase é utilizada em uma extensão de modificação e é opcional para sua operação (a seção `generate` pode estar ausente ou presente no arquivo YAML).

    Esta fase deve estar ausente do arquivo YAML da extensão de não modificação.
    
    Leia sobre os tipos de extensão em detalhes [aqui][link-ext-logic].

!!! info "Sintaxe de descrição do elemento de solicitação"
     Ao criar uma extensão FAST, você precisa entender a estrutura da solicitação HTTP enviada para a aplicação e a da resposta HTTP recebida da aplicação para descrever corretamente os elementos da solicitação com os quais você precisa trabalhar usando os pontos.
     
     Para ver informações detalhadas, prossiga para este [link][link-points].
 
 A fase especifica uma carga útil para ser inserida nos parâmetros particulares de uma solicitação de linha de base para criar solicitações de teste baseadas nesta solicitação.

A seção `generate` tem a seguinte estrutura:

```
generate:
  - into:
    - parameter 1
    - parameter 2
    - …
    - parameter N
  - method:
    - postfix
    - prefix
    - random
    - replace
  - payload:
    - payload 1
    - payload 2
    - …
    - payload N
```

* O parâmetro `into` permite a especificação de um ou vários elementos de solicitação nos quais a carga útil deve ser inserida. O valor deste parâmetro pode ser uma string ou um array de strings. Você pode usar uma [expressão regular formatada em Ruby][link-ruby-regexp] como valor do parâmetro `into`.
    
    Este parâmetro é opcional e pode estar ausente na seção. Se o parâmetro `into` for omitido, a carga útil é inserida no elemento de solicitação que tem permissão para ser modificado de acordo com a política de teste dada.
    
    Vamos supor que os seguintes elementos de solicitação mutáveis foram extraídos da solicitação de linha de base de acordo com a política de teste:
    
    * `GET_uid_value`
    * `HEADER_COOKIE_value`
    
    A extensão processará sequencialmente todos os elementos mutáveis (também conhecidos como pontos de inserção).
    
    Se o parâmetro `into` estiver ausente, as cargas úteis serão coladas sequencialmente no parâmetro `GET_uid_value` e as solicitações de teste produzidas serão usadas para verificar a aplicação alvo para vulnerabilidades. Em seguida, após os resultados das solicitações de teste serem processados, a extensão processa o parâmetro `HEADER_COOKIE_value` e, da mesma forma, insere as cargas úteis neste parâmetro.
    
    Se o parâmetro `into` contiver o parâmetro da solicitação `GET_uid_value`, conforme mostrado no exemplo a seguir, a carga útil será inserida no parâmetro `GET_uid_value`, mas não no parâmetro `HEADER_COOKIE_value`.
    
    ```
    into: 
      - 'GET_uid_value'
    ```
    Como o exemplo a seguir contém apenas um parâmetro, o valor do parâmetro into pode ser escrito em uma linha:
    
    `into: 'GET_uid_value'`

* `method` — este parâmetro opcional especifica a lista dos métodos que serão utilizados para inserir a carga útil no elemento da solicitação de linha de base.
    * `prefix` — insere a carga útil antes do valor do elemento da solicitação de linha de base.
    * `postfix` — insere a carga útil após o valor do elemento da solicitação de linha de base.
    * `random` — insere a carga útil em um lugar aleatório no valor do elemento da solicitação de linha de base.
    * `replace` — substitui o valor do elemento da solicitação de linha de base pela carga útil.
    
    ![Métodos de inserção de carga útil][img-generate-methods]
    
    Se o parâmetro `method` estiver ausente, o método `replace` será utilizado por padrão.
    
    O número de solicitações de teste criadas depende do número de `methods` especificados: uma solicitação de teste por método de inserção.
    
    Por exemplo, se os seguintes métodos de inserção forem especificados:
    
    ```
    method:
      - prefix
      - replace
    ```
    
    então, para uma única carga útil, duas solicitações de teste são criadas; para duas cargas úteis, quatro solicitações de teste são criadas (duas solicitações de teste para cada carga útil), e assim por diante.

* O parâmetro `payload` especifica a lista de cargas úteis a serem inseridas no parâmetro de solicitação para criar uma solicitação de teste que será então usada para testar a aplicação alvo para vulnerabilidades.
    
    Este parâmetro é obrigatório, e ele deve sempre estar presente na seção. A lista deve conter pelo menos uma carga útil. Se houver várias cargas úteis, o nó FAST insere sequencialmente as cargas úteis no parâmetro de solicitação e testa a aplicação alvo para vulnerabilidades usando cada uma das solicitações de teste criadas.
    
    ![Geração de carga útil][img-generate-payload]
    
    A carga útil é uma string que é inserida em um dos parâmetros durante o processamento da solicitação.
    
    ??? info "Exemplo de múltiplas cargas úteis"
        ```
        payload:
          - "') or 1=('1"
          - "/%5c../%5c../%5c../%5c../%5c../%5c../%5c../etc/passwd/"
        ```
    
    Você pode usar marcadores especiais como parte da carga útil para expandir ainda mais as possibilidades de detecção de vulnerabilidades:

    * **`STR_MARKER`** — insira uma string aleatória na carga útil exatamente na posição onde o `STR_MARKER` está especificado. 
        
        Por exemplo, o `STR_MARKER` pode ser usado para verificar a aplicação para uma vulnerabilidade XXS.
        
        ??? info "Exemplo"
            `'userSTR_MARKER'`
    
    * **`CALC_MARKER`** — Insira uma string contendo uma expressão aritmética aleatória (por exemplo, `1234*100`) na carga útil exatamente na posição onde o `CALC_MARKER` está especificado.
        
        Por exemplo, o `CALC_MARKER` pode ser usado para verificar a aplicação para uma vulnerabilidade RCE.
        
        ??? info "Exemplo"
            `'; bc <<< CALC_MARKER'`
    
    * **`DNS_MARKER`** — insira uma string contendo um domínio aleatório (por exemplo, `r4nd0m.wlrm.tl`) na carga útil exatamente na posição onde o `DNS_MARKER` está especificado.
        
        Por exemplo, o `DNS_MARKER` pode ser usado para verificar a aplicação para vulnerabilidades DNS Out-of-Bound.

        ??? info "Exemplo"
            `'; ping DNS_MARKER'`
    
    !!! info "Lógica de operação dos marcadores"
        Se a fase Detect detectar um marcador de qualquer carga útil na resposta do servidor, então o ataque é bem-sucedido, o que significa que a vulnerabilidade foi explorada com êxito. Para ver informações detalhadas sobre a fase Detect operando com marcadores, prossiga para este [link][link-markers].