# Configuração da página de bloqueio e código de erro (NGINX)

Estas instruções descrevem o método para personalizar a página de bloqueio e o código de erro retornados na resposta à solicitação bloqueada pelas seguintes razões:

* Solicitação contém cargas maliciosas dos seguintes tipos: [ataques de validação de entrada](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [ataques vpatch](../../user-guides/rules/vpatch-rule.md), ou [ataques detectados com base em expressões regulares](../../user-guides/rules/regex-rule.md).
* Solicitação contendo cargas maliciosas da lista acima originadas de [endereços IP na lista cinza](../../user-guides/ip-lists/graylist.md) e o nó filtra solicitações no modo de bloqueio seguro [modo](../configure-wallarm-mode.md).
* Solicitação originada do [endereço IP na lista de negação](../../user-guides/ip-lists/denylist.md).

## Limitações de configuração

A configuração da página de bloqueio e do código de erro é suportada em implantações de nó Wallarm baseadas em NGINX, mas não é suportada em implantações de nó Wallarm baseadas em Envoy e CDN. Os nós Wallarm baseados em Envoy e CDN sempre retornam o código `403` na resposta à solicitação bloqueada.

## Métodos de configuração

Por padrão, o código de resposta 403 e a página de bloqueio padrão do NGINX são retornados ao cliente. Você pode alterar as configurações padrão usando as seguintes diretivas do NGINX:

* `wallarm_block_page`
* `wallarm_block_page_add_dynamic_path`

### Diretiva NGINX `wallarm_block_page`

Você pode configurar a página de bloqueio e o código de erro passando os seguintes parâmetros na diretiva `wallarm_block_page` do NGINX:

* Caminho para o arquivo HTM ou HTML da página de bloqueio. Você pode especificar o caminho para uma página de bloqueio personalizada ou a [página de bloqueio de amostra](#customizing-sample-blocking-page) fornecida pelo Wallarm.
* O texto da mensagem a ser retornada em resposta a uma solicitação bloqueada.
* URL para o redirecionamento do cliente.
* `response_code`: código de resposta.
* `type`: o tipo da solicitação bloqueada em resposta ao qual a configuração especificada deve ser retornada. O parâmetro aceita um ou vários valores (separados por vírgulas) da lista:

    * `attack` (por padrão): para solicitações bloqueadas pelo nó de filtragem ao filtrar solicitações no modo de bloqueio ou bloqueio seguro [modo](../configure-wallarm-mode.md).
    * `acl_ip`: para solicitações originadas de endereços IP que são adicionados à [lista de negação](../../user-guides/ip-lists/denylist.md) como um único objeto ou uma sub-rede.
    * `acl_source`: para solicitações originadas de endereços IP que são registrados em [países, regiões ou datacenters na lista de negação](../../user-guides/ip-lists/denylist.md).

A diretiva `wallarm_block_page` aceita os parâmetros listados nos seguintes formatos:

* Caminho para o arquivo HTM ou HTML, código de erro (opcional) e tipo de solicitação bloqueada (opcional)

    ```bash
    wallarm_block_page &/<PATH_TO_FILE/HTML_HTM_FILE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```
    
    Wallarm fornece a página de bloqueio de amostra `&/usr/share/nginx/html/wallarm_blocked.html`. Você pode usar esta página como ponto de partida para sua [personalização](#customizing-sample-blocking-page).

    Você pode usar [variáveis do NGINX](https://nginx.org/en/docs/varindex.html) na página de bloqueio. Para isso, adicione o nome da variável no formato `${variable_name}` ao código da página de bloqueio, por exemplo, `${remote_addr}` para exibir o endereço IP de onde a solicitação bloqueada se originou.

    !!! warning "Informação importante para usuários do Debian e CentOS"
        Se você usa uma versão do NGINX inferior a 1.11 instalada a partir dos repositórios [CentOS/Debian](../../installation/nginx/dynamic-module-from-distr.md), você deve remover a variável `request_id` do código da página para exibir corretamente a página de bloqueio dinâmico:
        ```
        UUID ${request_id}
        ```

        Isso se aplica tanto a `wallarm_blocked.html` quanto à página de bloqueio personalizada.

    [Exemplo de configuração →](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)
* URL para o redirecionamento do cliente e tipo de solicitação bloqueada (opcional)

    ``` bash
    wallarm_block_page /<REDIRECT_URL> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [Exemplo de configuração →](#url-for-the-client-redirection)
* Named NGINX `localização` e tipo de solicitação bloqueada (opcional)

    ``` bash
    wallarm_block_page @<NAMED_LOCATION> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [Exemplo de configuração →](#named-nginx-location)
* Nome da variável que define o caminho para o arquivo HTM ou HTML, código de erro (opcional) e tipo de solicitação bloqueada (opcional)

    ``` bash
    wallarm_block_page &<VARIABLE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```

    !!! warning "Inicializando a página de bloqueio com variáveis do NGINX no código"
        Se você estiver usando este método para definir a página de bloqueio com [variáveis do NGINX](https://nginx.org/en/docs/varindex.html) em seu código, por favor, inicialize esta página através da diretiva [`wallarm_block_page_add_dynamic_path`](#nginx-directive-wallarm_block_page_add_dynamic_path).

    [Exemplo de configuração →](#variable-and-error-code)

A diretiva `wallarm_block_page` pode ser definida dentro dos blocos `http`, `server`, `location` do arquivo de configuração do NGINX.

### Diretiva NGINX `wallarm_block_page_add_dynamic_path`

A diretiva `wallarm_block_page_add_dynamic_path` é usada para inicializar a página de bloqueio que tem variáveis do NGINX em seu código e o caminho para essa página de bloqueio também é definido usando uma variável. Caso contrário, a diretiva não é usada.

A diretiva pode ser definida dentro do bloco `http` do arquivo de configuração do NGINX.

## Personalizando a página de bloqueio de amostra

A página de bloqueio de amostra fornecida pelo Wallarm `/usr/share/nginx/html/wallarm_blocked.html` é a seguinte:

![Página de bloqueio do Wallarm](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

Você pode usar a página de amostra como ponto de partida para sua personalização, aprimorando-a por:

* Adicionando o logotipo da sua empresa - por padrão, nenhum logotipo é apresentado na página.
* Adicionando o e-mail de suporte de sua empresa - por padrão, nenhum link de e-mail é usado e a frase `contact us` é o texto simples sem nenhum link.
* Alterando quaisquer outros elementos HTML ou adicionando os seus.

!!! info "Variantes de página de bloqueio personalizado"
    Em vez de modificar a página de amostra fornecida pelo Wallarm, você pode criar uma página personalizada do zero.

### Procedimento geral

Se você modificar a própria página de amostra, suas modificações podem ser perdidas na atualização dos componentes do Wallarm. Portanto, é recomendável copiar a página de amostra, dar a ela um novo nome e só então modificá-la. Aja de acordo com seu tipo de instalação, conforme descrito nas seções abaixo.

**<a name="copy"></a>Página de amostra para cópia**

Você pode fazer uma cópia de `/usr/share/nginx/html/wallarm_blocked.html` no ambiente onde seu nó de filtragem está instalado. Alternativamente, copie o código abaixo e salve-o como seu novo arquivo:

??? info "Mostrar código da página de amostra"

    ```html
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Você está bloqueado</title>
        <link href="https://fonts.googleapis.com/css?family=Poppins:700|Roboto|Roboto+Mono&display=swap" rel="stylesheet">
        <style>
            html {
                font-family: 'Roboto', sans-serif;
            }

            body {
                margin: 0;
                height: 100vh;
            }

            .content {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                min-height: 100%;
            }

            .logo {
                margin-top: 32px;
            }

            .message {
                display: flex;
                margin-bottom: 100px;
            }

            .alert {
                padding-top: 20px;
                width: 246px;
                text-align: center;
            }

            .alert-title {
                font-family: 'Poppins', sans-serif;
                font-weight: bold;
                font-size: 24px;
                line-height: 32px;
            }

            .alert-desc {
                font-size: 14px;
                line-height: 20px;
            }

            .info {
                margin-left: 76px;
                border-left: 1px solid rgba(149, 157, 172, 0.24);
                padding: 20px 0 20px 80px;
                width: 340px;
            }

            .info-title {
                font-weight: bold;
                font-size: 20px;
                line-height: 28px;
            }

            .info-text {
                margin-top: 8px;
                font-size: 14px;
                line-height: 20px;
            }

            .info-divider {
                margin-top: 16px;
            }

            .info-data {
                margin-top: 12px;
                border: 1px solid rgba(149, 157, 172, 0.24);
                border-radius: 4px;
                padding: 9px 12px;
                font-size: 14px;
                line-height: 20px;
                font-family: 'Roboto Mono', monospace;
            }

            .info-copy {
                margin-top: 12px;

                padding: 6px 12px;
                border: none;
                outline: none;
                background: rgba(149, 157, 172, 0.08);
                cursor: pointer;
                transition: 0.24s cubic-bezier(0.24, 0.1, 0.24, 1);
                border-radius: 4px;

                font-size: 14px;
                line-height: 20px;
            }

            .info-copy:hover {
                background-color: rgba(149, 157, 172, 0.24);
            }

            .info-copy:active {
                background-color: rgba(149, 157, 172, 0.08);
            }

            .info-mailto,
            .info-mailto:visited {
                color: #fc7303;
            }
        </style>
        <script>
            // Coloque aqui o seu e-mail de suporte
            const SUPPORT_EMAIL = "";
        </script>
    </head>

    <body>
        <div class="content">
            <div id="logo" class="logo">
                <!--
                    Coloque o seu logotipo aqui.
                    Você pode usar uma imagem externa:
                    <img src="https://example.com/logo.png" width="160" alt="Nome da Empresa" />
                    Ou coloque o código-fonte do seu logotipo (como svg) aqui:
                    <svg width="160" height="80"> ... </svg>
                -->
            </div>

            <div class="message">
                <div class="alert">
                    <svg width="207" height="207" viewBox="0 0 207 207" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M88.7512 33.2924L15.6975 155.25C14.1913 157.858 13.3943 160.816 13.3859 163.828C13.3775 166.84 14.1579 169.801 15.6494 172.418C17.141 175.035 19.2918 177.216 21.8877 178.743C24.4837 180.271 27.4344 181.092 30.4462 181.125H176.554C179.566 181.092 182.516 180.271 185.112 178.743C187.708 177.216 189.859 175.035 191.351 172.418C192.842 169.801 193.623 166.84 193.614 163.828C193.606 160.816 192.809 157.858 191.303 155.25L118.249 33.2924C116.711 30.7576 114.546 28.6618 111.963 27.2074C109.379 25.7529 106.465 24.9888 103.5 24.9888C100.535 24.9888 97.6206 25.7529 95.0372 27.2074C92.4538 28.6618 90.2888 30.7576 88.7512 33.2924V33.2924Z"
                            stroke="#F24444" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M103.5 77.625V120.75" stroke="#F24444" stroke-width="16" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M103.5 146.625V146.668" stroke="#F24444" stroke-width="16" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    <div class="alert-title">Atividade maliciosa bloqueada</div>
                    <div class="alert-desc">Sua solicitação foi bloqueada pois foi identificada como maliciosa.</div>
                </div>
                <div class="info">
                    <div class="info-title">Por que isso aconteceu</div>
                    <div class="info-text">
                        Você pode ter usado símbolos semelhantes a uma sequência de código malicioso, ou carregado um arquivo específico.
                    </div>

                    <div class="info-divider"></div>

                    <div class="info-title">O que fazer</div>
                    <div class="info-text">
                        Se a sua solicitação é considerada legítima, por favor <a id="mailto" href="" class="info-mailto">entre em contato conosco</a> e forneça a descrição de sua última ação e os seguintes dados:
                    </div>

                    <div id="data" class="info-data">
                        IP ${remote_addr}<br />
                        Bloqueado em ${time_iso8601}<br />
                        UUID ${request_id}
                    </div>

                    <button id="copy-btn" class="info-copy">
                        Copiar detalhes
                    </button>
                </div>
            </div>
            <div></div>
        </div>
        <script>
            // Aviso: apenas código ES5

            function writeText(str) {
                const range = document.createRange();

                function listener(e) {
                    e.clipboardData.setData('text/plain', str);
                    e.preventDefault();
                }

                range.selectNodeContents(document.body);
                document.getSelection().addRange(range);
                document.addEventListener('copy', listener);
                document.execCommand('copy');
                document.removeEventListener('copy', listener);
                document.getSelection().removeAllRanges();
            }

            function copy() {
                const text = document.querySelector('#data').innerText;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    return navigator.clipboard.writeText(text);
                }

                return writeText(text);
            }

            document.querySelector('#copy-btn').addEventListener('click', copy);

            const mailto = document.getElementById('mailto');
            if (SUPPORT_EMAIL) mailto.href = `mailto:${wallarm_dollar}{SUPPORT_EMAIL}`;
            else mailto.replaceWith(mailto.textContent);
        </script>
    </body>
    ```

**Sistema de arquivos comum**

Você pode fazer uma cópia de `/usr/share/nginx/html/wallarm_blocked.html` com um novo nome onde quiser (o NGINX deve ter permissão de leitura lá), incluindo a mesma pasta.

**Container Docker**

Para modificar a página de bloqueio de amostra ou fornecer seu próprio personalizado a partir do zero, você pode usar a funcionalidade [bind mount](https://docs.docker.com/storage/bind-mounts/) do Docker. Ao usá-lo, sua página e o arquivo de configuração do NGINX a partir de sua máquina host são copiados para o contêiner e, em seguida, referenciados com os originais, de modo que, se você alterar os arquivos na máquina host, suas cópias serão sincronizadas e vice-versa.

Portanto, para modificar a página de bloqueio de amostra ou fornecer seu próprio, faça o seguinte:

1. Antes da primeira execução, [prepare](#copy) seu `wallarm_blocked_renamed.html` modificado.
1. Prepare o arquivo de configuração do NGINX com o caminho para a sua página de bloqueio. Veja [exemplo de configuração](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code).
1. Execute o contêiner [montando](../installation-docker-en.md#run-the-container-mounting-the-configuration-file) a página de bloqueio preparada e o arquivo de configuração.
1. Se você precisar atualizar sua página de bloqueio em um contêiner em execução, na máquina host, altere o `wallarm_blocked_renamed.html` referenciado e reinicie o NGINX no contêiner.

**Controlador de Entrada**

Para modificar a página de bloqueio de amostra ou fornecer sua própria, faça o seguinte:

1. [Prepare](#copy) seu `wallarm_blocked_renamed.html` modificado.
1. [Crie o ConfigMap a partir do arquivo](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) `wallarm_blocked_renamed.html`.
1. Monte o ConfigMap criado no pod com o controlador de entrada Wallarm. Para isso, atualize o objeto de Implementação relevante para o controlador de entrada Wallarm seguindo as [instruções](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap).

    !!! info "Variações da página de bloqueio personalizado"
        Em vez de montar o ConfigMap na diretiva existente usada para montar ConfigMap serão excluídas.
        
### Modificações frequentes

Para adicionar o logotipo da sua empresa, no arquivo `wallarm_blocked_renamed.html`, modifique e descomente:

```html
<div class="content">
    <div id="logo" class="logo">
        <!--
            Coloque o seu logotipo aqui.
            Você pode usar uma imagem externa:
            <img src="https://example.com/logo.png" width="160" alt="Nome da Empresa" />
            Ou coloque o código-fonte do seu logotipo (como svg) aqui mesmo:
            <svg width="160" height="80"> ... </svg>
        -->
    </div>
```

Para adicionar o e-mail de suporte da sua empresa, no arquivo `wallarm_blocked_renamed.html`, modifique a variável `SUPPORT_EMAIL`:

```html
<script>
    // Coloque aqui o seu e-mail de suporte
    const SUPPORT_EMAIL = "support@empresa.com";
</script>
```

Se inicializar uma variável personalizada contendo `$` em um valor, escape este símbolo adicionando `{wallarm_dollar}` antes do nome da variável, por exemplo: `${wallarm_dollar}{variable_name}`. A variável `wallarm_dollar` retorna `&`.

## Exemplos de configuração

Abaixo estão exemplos de configuração da página de bloqueio e código de erro através das diretivas `wallarm_block_page` e `wallarm_block_page_add_dynamic_path`.

O parâmetro `type` da diretiva `wallarm_block_page` é explicitamente especificado em cada exemplo. Se você remover o parâmetro `type`, então a página de bloqueio configurada, a mensagem, etc serão retornados apenas na resposta à solicitação bloqueada pelo nó de filtragem no modo de bloqueio ou bloqueio seguro [modo](../configure-wallarm-mode.md).

### Caminho para o arquivo HTM ou HTML com a página de bloqueio e código de erro

Este exemplo mostra as seguintes configurações de resposta:

* [Modificado](#customizing-sample-blocking-page) página de bloqueio de amostra Wallarm `/usr/share/nginx/html/wallarm_blocked_renamed.html` e o código de erro 445 retornado se a solicitação é bloqueada pelo nó de filtragem no modo de bloqueio ou bloqueio seguro.
* Página de bloqueio customizada `/usr/share/nginx/html/block.html` e o código de erro 445 retornado se a solicitação se originou de qualquer endereço IP da lista de negação.

#### Arquivo de configuração NGINX

```bash
wallarm_block_page &/usr/share/nginx/html/wallarm_blocked_renamed.html response_code=445 type=attack;
wallarm_block_page &/usr/share/nginx/html/block.html response_code=445 type=acl_ip,acl_source;
```

Para aplicar as configurações ao contêiner Docker, o arquivo de configuração NGINX com as configurações apropriadas deve ser montado no contêiner juntamente com os arquivos `wallarm_blocked_renamed.html` e `block.html`. [Executando o contêiner montando o arquivo de configuração →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Anotações de ingresso

Antes de adicionar a anotação de ingresso:

1. [Criar ConfigMap dos arquivos](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) `wallarm_blocked_renamed.html` e `block.html`.
2. Monte o ConfigMap criado no pod com o controlador de ingresso Wallarm. Para isso, atualize o objeto de Implementação relevante para o controlador de ingresso Wallarm seguindo as [instruções](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap).

    !!! info "Diretório para ConfigMap montado"
        Como os arquivos existentes no diretório usado para montar ConfigMap podem ser excluídos, é recomendado criar um novo diretório para os arquivos montados via ConfigMap.

Anotações de ingresso:

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked_renamed.html response_code=445 type=attack;&/usr/share/nginx/html/block.html response_code=445 type=acl_ip,acl_source"
```

### URL para o redirecionamento do cliente

Este exemplo mostra as configurações para redirecionar o cliente para a página `host/err445` se o nó de filtragem bloquear a solicitação originada de países, regiões ou data centers na lista de negação.

#### Arquivo de configuração NGINX

```bash
wallarm_block_page /err445 type=acl_source;
```

Para aplicar as configurações para o contêiner Docker, o arquivo de configuração do NGINX com as configurações apropriadas deve ser montado no contêiner. [Executando o contêiner montando o arquivo de configuração →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Anotações de ingresso

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="/err445 type=acl_source"
```

### Named NGINX `location`

Este exemplo mostra as configurações para retornar ao cliente a mensagem `A página é bloqueada` e o código de erro 445, independentemente do motivo do bloqueio da solicitação (modo de bloqueio ou bloqueio seguro, origem na lista de negação como um único IP / sub-rede / país ou região / data center).

#### Arquivo de configuração NGINX

```bash
wallarm_block_page @block type=attack,acl_ip,acl_source;
location @block {
    return 445 'A página é bloqueada';
}
```

Para aplicar as configurações ao contêiner Docker, o arquivo de configuração NGINX com as configurações apropriadas deve ser montado no contêiner. [Executando o contêiner montando o arquivo de configuração →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Anotações de ingresso

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="location @block {return 445 'A página é bloqueada';}"
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="@block type=attack,acl_ip,acl_source"
```

### Variável e código de erro

Esta configuração é retornada ao cliente se a solicitação se originou da fonte colocada na lista de negação como um único IP ou subnet. O nó Wallarm retorna o código 445 e a página de bloqueio com o conteúdo que depende do valor do cabeçalho `User-Agent`:

* Por padrão, a [página de bloqueio de amostra modificada](#customizing-sample-blocking-page) Wallarm `/usr/share/nginx/html/wallarm_blocked_renamed.html` é retornada. Como as variáveis do NGINX são usadas no código da página de bloqueio, esta página deve ser inicializada através da diretiva `wallarm_block_page_add_dynamic_path`.
* Para os usuários do Firefox - `/usr/share/nginx/html/block_page_firefox.html` (se implantar o controlador de ingreso Wallarm, é recomendável criar um diretório separado para os arquivos de página de bloqueio personalizadas, i.e. `/usr/custom-block-pages/block_page_firefox.html`):

    ```bash
    Você está bloqueado!

    IP ${remote_addr}
    Bloqueado em ${time_iso8601}
    UUID ${request_id}
    ```

    Como as variáveis do NGINX são usadas no código da página de bloqueio, esta página deve ser inicializada através da diretiva `wallarm_block_page_add_dynamic_path`.
* Para usuários do Chrome - `/usr/share/nginx/html/block_page_chrome.html` (se implantar o controlador de ingresso Wallarm, é recomendável criar um diretório separado para os arquivos de página de bloqueio personalizadas, i.e. `/usr/custom-block-pages/block_page_chrome.html`):

    ```bash
    Você está bloqueado!
    ```

    Como as variáveis do NGINX NÃO são usadas no código da página de bloqueio, esta página NÃO deve ser inicializada.

#### Arquivo de configuração NGINX

```bash
wallarm_block_page_add_dynamic_path /usr/share/nginx/html/block_page_firefox.html /usr/share/nginx/html/wallarm_blocked_renamed.html;

map $http_user_agent $block_page {
  "~Firefox"  &/usr/share/nginx/html/block_page_firefox.html;
  "~Chrome"   &/usr/share/nginx/html/block_page_chrome.html;
  default     &/usr/share/nginx/html/wallarm_blocked_renamed.html;
}

wallarm_block_page $block_page response_code=445 type=acl_ip;
```

Para aplicar as configurações para o contêiner Docker, o arquivo de configuração NGINX com as configurações apropriadas deve ser montado no contêiner junto com os arquivos `wallarm_blocked_renamed.html`, `block_page_firefox.html` e `block_page_chrome.html`. [Executando o contêiner montando o arquivo de configuração →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Controlador de ingresso

1. Passe o parâmetro `controller.config.http-snippet` para o Helm chart implantado usando o comando [`helm upgrade`](https://helm.sh/docs/helm/helm_upgrade/):

    ```bash
    helm upgrade --reuse-values --set controller.config.http-snippet='wallarm_block_page_add_dynamic_path /usr/custom-block-pages/block_page_firefox.html /usr/share/nginx/html/wallarm_blocked_renamed.html; map $http_user_agent $block_page { "~Firefox" &/usr/custom-block-pages/block_page_firefox.html; "~Chrome" &/usr/custom-block-pages/block_page_chrome.html; default &/usr/share/nginx/html/wallarm_blocked_renamed.html;}' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
2. [Criar o ConfigMap a partir dos arquivos](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) `wallarm_blocked_renamed.html`, `block_page_firefox.html` e `block_page_chrome.html`.
3. Monte o ConfigMap criado no pod com o controlador de ingresso Wallarm. Para isso, atualize o objeto de Implementação relevante para o controlador de ingresso Wallarm seguindo as [instruções](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap).

    !!! info "Diretório para ConfigMap montado"
        Como os arquivos existentes no diretório usado para montar ConfigMap podem ser excluídos, é recomendado criar um novo diretório para os arquivos montados via ConfigMap.
4. Adicione a seguinte anotação a Ingress:

    ```bash
    kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page='$block_page response_code=445 type=acl_ip'
    ```
