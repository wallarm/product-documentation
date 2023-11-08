1. Execute o comando `curl http://127.0.0.8/wallarm-status` se a configuração padrão do serviço de estatísticas estiver em uso. 
2. Caso contrário, consulte o arquivo de configuração `/etc/nginx/conf.d/wallarm-status.conf` para construir o comando correto semelhante ao acima.
```
{"solicitações":64,"ataques":16,"bloqueados":0,"anormais":64,"erros_tnt":0,"erros_api":0,"solicitações_perdidas":0,"falhas_segmentação":0,"falhas_memória":0,"falhas_memória_leve":0,"tempo_deteção":0,"id_bd":46,"id_regras_personalizadas":4,"instâncias_proton": { "total":2,"sucesso":2,"alternativa":0,"falhas":0 },"contagem_trabalhadores_parados":0,"trabalhadores_parados":[] }
```