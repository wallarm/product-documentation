Para verificar a interação dos módulos NGINX‑Wallarm e postanalytics separados, você pode enviar a solicitação com um teste de ataque para o endereço do aplicativo protegido:

```bash
curl http://localhost/etc/passwd
```

Se os módulos NGINX‑Wallarm e postanalytics separados estiverem configurados corretamente, o ataque será enviado para a Nuvem Wallarm e exibido na seção **Eventos** do Console Wallarm:

![Ataques na interface][img-attacks-in-interface]

Se o ataque não foi enviado para a Nuvem, verifique se não há erros na operação dos serviços:

* Certifique-se de que o serviço postanalytics `wallarm-tarantool` está no status `ativo`

    ```bash
    sudo systemctl status wallarm-tarantool
    ```

    ![status do wallarm-tarantool][tarantool-status]
* Analise os logs do módulo postanalytics

    ```bash
    sudo cat /var/log/wallarm/tarantool.log
    ```

    Se houver o registro como `SystemError binary: failed to bind: Cannot assign requested address`, certifique-se de que o servidor aceita a conexão no endereço e porta especificados.
* No servidor com o módulo NGINX‑Wallarm, analise os logs do NGINX:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

   Se houver o registro como `[error] wallarm: <endereço> connect() failed`,certifique-se de que o endereço do módulo postanalytics separado está correto nos arquivos de configuração do módulo NGINX‑Wallarm e o servidor postanalytics separado aceita conexão no endereço e porta especificados.
* No servidor com o módulo NGINX‑Wallarm, obtenha as estatísticas das solicitações processadas usando o comando abaixo e certifique-se de que o valor de `tnt_errors` é 0

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [Descrição de todos os parâmetros retornados pelo serviço de estatísticas →][statistics-service-all-parameters]