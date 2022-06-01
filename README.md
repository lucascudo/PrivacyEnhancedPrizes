# PrivacyEnhancedPrizes

![System Architecture](https://raw.githubusercontent.com/lucascudo/PrivacyEnhancedPrizes/main/PrivacyEnhancedPrizes.png)

## API SETUP
```
cd api
npm install
cd secrets
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
``` 
## CLIENT_APP SETUP
```
cd clientapp
npm install
cd secrets
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```
 ## RUN API
```
cd api
npm run start:dev
``` 
 ## RUN CLIENT_APP
```
cd clientapp
npm run start:ssl
``` 

### extras (TODO)
- embelezar as páginas
- adicionar comentários swagger (documentação da API)
- corrigir testes unitários
- implementar pipeline de Continuous Integration com github actions
