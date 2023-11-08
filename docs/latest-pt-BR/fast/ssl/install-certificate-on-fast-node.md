[link-openssl]:                 https://www.openssl.org/docs/man1.0.2/man1/x509.html
[link-pem-encoding]:            https://www.ssl.com/guide/pem-der-crt-and-cer-x-509-encodings-and-conversions/


#   Instalando Seu Próprio Certificado SSL no Nó FAST

!!! info "Pré-requisitos"
    Este guia assume que:
    
    * Seu navegador está configurado para usar um nó FAST como um proxy HTTP ou HTTPS.
    * Seu navegador já confia no certificado SSL que você está prestes a instalar para o nó FAST.

!!! warning "Requisitos de certificado"
    Para concluir com sucesso esta instalação, seu certificado SSL deve ser um certificado raiz ou um certificado intermediário.
    
    O certificado e a chave privada correspondente devem ser [codificados usando PEM][link-pem-encoding]. Se seu certificado tiver uma codificação diferente, você pode usar qualquer ferramenta de conversão de certificado disponível, como o [OpenSSL][link-openssl] para convertê-lo em um certificado codificado em PEM.

##  Instalando o Certificado SSL

Para instalar um certificado SSL no nó FAST, siga estas etapas:
1.  Certifique-se de que você já possui um certificado SSL, bem como a chave privada que assinou o certificado, no formato PEM.

2.  Coloque o arquivo de certificado e o arquivo de chave no mesmo diretório no host Docker. Será necessário montar este diretório no contêiner Docker com o nó FAST nas próximas etapas.

3.  Especifique o nó FAST onde o certificado e a chave estão localizados usando as seguintes variáveis de ambiente:

    ```
    CA_CERT=<caminho interno para o certificado>
    CA_KEY=<caminho interno para a chave>
    ```
    
    Nas linhas acima, substitua os valores `<caminho interno para o certificado>` e `<caminho interno para a chave>` pelo caminho esperado para o certificado e a chave após montar o diretório no contêiner Docker.

4.  Implemente o contêiner Docker com o nó FAST executando o seguinte comando:

    ```
    docker run --name <nome> \ 
    -e WALLARM_API_TOKEN=<token> \
    -e ALLOWED_HOSTS=<lista de host> \
    -e CA_CERT=<caminho interno para o certificado> \
    -e CA_KEY=<caminho interno para a chave> \
    -v <caminho para o diretório com o certificado e a chave>:<caminho interno para o diretório> \
    -p <porto de publicação>:8080 \
    wallarm/fast
    ```
    
    Este comando define os seguintes parâmetros:
    
    * O nome do contêiner.
    * O token e a lista de host do aplicativo de destino usando as variáveis de ambiente `WALLARM_API_TOKEN` e `ALLOWED_HOSTS` (o último não é obrigatório).
    * A localização do arquivo de certificado SSL dentro do contêiner usando a variável `CA_CERT`.
    * A localização do arquivo de chave privada dentro do contêiner usando a vara `CA_CERT`.
    * O porto de publicação do aplicativo.
    
    Use a opção `-v` do comando `docker run` para montar o diretório do host Docker `<caminho para o diretório com o certificado e a chave>` no contêiner. O conteúdo deste diretório fica disponível dentro do contêiner no caminho `<caminho interno para o diretório>`. 
        
    !!! warning "Nota"
        Os caminhos para os arquivos de certificado e chave especificados com as variáveis de ambiente `CA_CERT` e `CA_KEY` devem apontar para os arquivos no parâmetro `<caminho interno para o diretório>` que você especificou com a opção `-v` do comando `docker run`.   

Agora, seu certificado SSL deve estar instalado com sucesso. Sua instância do nó FAST agora fará proxy das solicitações HTTPS sem quaisquer mensagens de certificado não confiável.


##  Um Exemplo de Instalação de um Certificado SSL.

O seguinte é suposto ser o caso:
* Os arquivos `cert.pem` e `cert.key` com o certificado SSL e a chave privada correspondente estão localizados no diretório `/home/user/certs` do host Docker onde o nó FAST é lançado,
* O conteúdo do diretório `/home/user/certs` estará disponível dentro do contêiner com o nó FAST no caminho `/tmp/certs`,
* O token `fast_token` é usado,
* Apenas `example.com` está incluído na lista de hosts, e
* O nó FAST será executado no contêiner chamado `fast-node` e sua porta interna `8080` será publicada em `localhost:8080`,

então você precisa executar o seguinte comando para conectar o certificado SSL ao nó FAST:

```
docker run --name fast-node \
-e WALLARM_API_TOKEN="fast_token" \
-e ALLOWED_HOSTS="example.com" \
-e CA_CERT="/tmp/certs/cert.pem" \
-e CA_KEY="/tmp/certs/cert.key" \
-v /home/user/certs:/tmp/certs \
-p 8080:8080 \
wallarm/fast
```