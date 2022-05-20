```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        # Wallarm element: definition of Wallarm sidecar container
        - name: wallarm
          image: wallarm/node:3.6.2-1
          imagePullPolicy: Always
          env:
          # Wallarm API endpoint: 
          # "api.wallarm.com" for the EU Cloud
          # "us1.api.wallarm.com" for the US Cloud
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Wallarm node token
          - name: DEPLOY_TOKEN
            value: "token"
          - name: DEPLOY_FORCE
            value: "true"
          # Amount of memory in GB for request analytics data, 
          # recommended value is 75% of the total server memory
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # Port on which the Wallarm sidecar container accepts requests 
            # from the Service object
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # Definition of your main app container
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # Port on which the application container accepts incoming requests
          - containerPort: 8080
      volumes:
      # Wallarm element: definition of the wallarm-nginx-conf volume
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```
