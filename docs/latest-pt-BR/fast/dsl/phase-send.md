[link-ext-logic]:       logic.md

# A Fase de Envio

!!! info "Escopo da fase"
    Esta fase é obrigatória para uma extensão não modificadora funcionar (o arquivo YAML deve conter a seção `send`).
    
    Note que esta fase está ausente em uma extensão modificadora porque a fase de Envio tornaria outras fases inutilizáveis (exceto a fase de Detecção e a fase de Coleta implícita) se combinadas com elas.
    
    Leia sobre os tipos de extensão em detalhes [aqui][link-ext-logic].

  Esta fase envia as solicitações de teste pré-definidas para testar uma aplicação alvo quanto a vulnerabilidades. O host para o qual as solicitações de teste devem ser enviadas é determinado pelo valor do cabeçalho `Host` nas solicitações de referência recebidas.

A seção `send` tem a seguinte estrutura:

```
send:
  - method: <método HTTP>
    url: <URI>
    headers:
    - cabeçalho 1: valor
    ...
    - cabeçalho N: valor
    body: <o corpo da solicitação>
  ...
  - method: <método HTTP>
    ...
```

A seção `send` no arquivo YAML da extensão contém um ou mais conjuntos de parâmetros. Cada parâmetro é especificado como um par `<chave: valor>`. Um dado conjunto de parâmetros descreve uma única solicitação HTTP a ser enviada como uma solicitação de teste. Os seguintes parâmetros fazem parte do conjunto:

* `method`: o método HTTP a ser usado pela solicitação.

    Este é um parâmetro obrigatório: deve estar presente em qualquer conjunto de parâmetros.
    
    ??? info "Lista dos valores permitidos para o parâmetro"

        * `GET`
        * `POST`
        * `PUT`
        * `HEAD`
        * `OPTIONS`
        * `PATCH`
        * `COPY`
        * `DELETE`
        * `LOCK`
        * `UNLOCK`
        * `MOVE`
        * `TRACE`

    ??? info "Exemplo"
        `method: 'POST'`

* `url`: uma string de URL. A solicitação será direcionada para este URI.

    Este é um parâmetro obrigatório: deve estar presente em qualquer conjunto de parâmetros.
    
    ??? info "Exemplo"
        `url: '/en/login.php'`

* `headers`: uma matriz que contém um ou mais cabeçalhos HTTP no formato `nome do cabeçalho: valor do cabeçalho`.

    Se a solicitação HTTP construída não usar qualquer cabeçalho, então este parâmetro pode ser omitido.
    
    FAST adiciona automaticamente os cabeçalhos necessários para que a solicitação HTTP resultante seja correta (mesmo que estejam ausentes no array `headers`); por exemplo, `Host` e `Content-Length`.
    
    ??? info "Exemplo"
        ```
        headers:
        - 'Accept-Language': 'en-US,en;q=0.9'
        - 'Content-Type': 'application/xml'
        ```
      
    !!! info "Trabalhando com o cabeçalho `Host`"
        Você pode adicionar um cabeçalho `Host` a uma solicitação de teste que difere do extraído de uma solicitação de referência, se necessário. 
        
        Por exemplo, é possível adicionar o cabeçalho `Host: demo.com` a uma solicitação de teste na seção Enviar.
    
        Se a extensão correspondente estiver em execução e o nó FAST receber uma solicitação de referência com o cabeçalho `Host: example.com`, então a solicitação de teste com o cabeçalho `Host: demo.com` será enviada para o host `example.com`. A solicitação resultante é semelhante a esta:

        ```
        curl -k -g -X POST -L -H "Host: demo.com" -H "Content-Type: application/json" "http://example.com/app" --data "{"field":"value"}"
        ```
    
* `body`: uma string que contém o corpo da solicitação. Você pode especificar qualquer corpo de solicitação necessário, desde que escape caracteres especiais, se houver, na string resultante.

    Este é um parâmetro obrigatório: deve estar presente em qualquer conjunto de parâmetros.
    
    ??? info "Exemplo"
        `body: 'field1=value1&field2=value2`

Se a seção `send` estiver preenchida com `N` conjuntos de parâmetros descrevendo as `N` solicitações HTTP, então para uma única solicitação de referência recebida, o nó FAST enviará `N` solicitações de teste para a aplicação alvo que reside em um host especificado no cabeçalho `Host` da solicitação de referência.