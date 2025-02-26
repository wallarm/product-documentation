# Configurando aplicações

Se a sua empresa tem várias aplicações, você pode achar conveniente não apenas visualizar as estatísticas do tráfego da empresa inteira, mas também visualizar as estatísticas separadamente para cada aplicação. Para separar o tráfego pelas aplicações, você pode usar a entidade "aplicação" do sistema Wallarm.

!!! aviso "Suporte à configuração do aplicativo para o nó CDN"
    Para configurar aplicações para os [nós CDN do Wallarm](../../installation/cdn-node.md), solicite à [equipe de suporte do Wallarm](mailto:support@wallarm.com) para fazer isso.

Usar aplicações permite que você:

* Visualize eventos e estatísticas separadamente para cada aplicação
* Configure [gatilhos](../triggers/triggers.md), [regras](../rules/rules.md) e outros recursos do Wallarm para certas aplicações
* [Configure o Wallarm em ambientes separados](../../installation/multi-tenant/overview.md#issues-addressed-by-multitenancy)

Para que o Wallarm identifique suas aplicações, é necessário atribuí-lo identificadores exclusivos através da diretiva apropriada na configuração do nó. Os identificadores podem ser definidos tanto para os domínios da aplicação quanto para os caminhos do domínio.

Por padrão, Wallarm considera cada aplicação como a aplicação `default` com o identificador (ID) `-1`.

## Adicionando uma aplicação

1. (Opcional) Adicione uma aplicação no Console Wallarm → **Configurações** → **Aplicações**.

    ![Adicionando uma aplicação](../../images/user-guides/settings/configure-app.png)

    !!! aviso "Acesso de administrador"
        Somente usuários com a função **Administrador** podem acessar a seção **Configurações** → **Aplicações**.
2. Atribua um ID único a uma aplicação na configuração do nó via:

    * A diretiva [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) se o Wallarm está instalado como módulo NGINX, imagem da nuvem marketplace, contêiner Docker baseado em NGINX com um arquivo de configuração montado, contêiner lateral.
    * A [variável de ambiente](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) `WALLARM_APPLICATION` se o Wallarm está instalado como um contêiner Docker baseado em NGINX.
    * A [anotação Ingress](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `wallarm-application` se o Wallarm está instalado como controlador de Ingress.
    * O parâmetro [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) se o Wallarm está instalado como um contêiner Docker baseado no Envoy com um arquivo de configuração montado.

    O valor pode ser um número inteiro positivo, exceto para `0`.

    Se uma aplicação com um ID especificado não for adicionada no Console Wallarm → **Configurações** → **Aplicações**, ela será adicionada à lista automaticamente. O nome da aplicação será gerado automaticamente com base no identificador especificado (por exemplo, `Aplicação #1` para a aplicação com o ID `-1`). O nome pode ser alterado mais tarde via Console Wallarm.

Se a aplicação estiver configurada corretamente, seu nome será exibido nos detalhes dos ataques direcionados a esta aplicação. Para testar a configuração da aplicação, você pode enviar o [ataque de teste](../../admin-en/installation-check-operation-en.md#2-run-a-test-attack) ao endereço da aplicação.

## Identificação automática de aplicação

Você pode configurar uma identificação automática de aplicação com base em:

* Cabeçalhos de solicitação específicos
* Cabeçalho de solicitação específico ou parte dos URLs usando a diretiva `map` do NGINX

!!! info "Apenas NGINX"
    As abordagens listadas são aplicáveis apenas para implementações de nós baseadas em NGINX.

### Identificação de aplicação com base em cabeçalhos de solicitação específicos

Esta abordagem inclui dois passos:

1. Configurar sua rede para que o cabeçalho com o ID da aplicação seja adicionado a cada solicitação.
1. Use o valor deste cabeçalho como valor para a diretiva `wallarm_application`. Veja o exemplo abaixo.

Exemplo do arquivo de configuração NGINX (`/etc/nginx/default.conf`):

```
server {
    listen       80;
    server_name  example.com;
    wallarm_mode block;
    wallarm_application $http_custom_id;
    
    location / {
        proxy_pass      http://upstream1:8080;
    }
}    
```

Exemplo de solicitação de ataque:

```
curl -H "Cookie: SESSID='UNION SELECT SLEEP(5)-- -" -H "CUSTOM-ID: 222" http://example.com
```

Esta solicitação:

* Será considerada um ataque e adicionada à seção **Eventos**.
* Será associada à aplicação com ID `222`.
* Se a aplicação correspondente não existir, ela será adicionada a **Configurações** → **Aplicações** e automaticamente chamada de `Aplicação #222`.

![Adicionando uma aplicação com base na solicitação do cabeçalho](../../images/user-guides/settings/configure-app-auto-header.png)

### Identificação de aplicação com base em cabeçalho de solicitação específico ou parte dos URLs usando a diretiva `map` do NGINX 

Você pode adicionar as aplicações com base em cabeçalho de solicitação específico ou parte dos URLs do endpoint, usando a diretiva `map` do NGINX. Veja a descrição detalhada da diretiva na [documentação](https://nginx.org/en/docs/http/ngx_http_map_module.html#map) do NGINX.

## Excluindo uma aplicação

Para excluir a aplicação do sistema Wallarm, exclua a diretiva apropriada do arquivo de configuração do nó. Se a aplicação for excluída apenas da seção **Configurações** → **Aplicações**, ela será restaurada na lista.
