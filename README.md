



# Deploiement sur HebergOS (http uniquement)

- Dans le terminal du conteneur, crerr une nouvelle session screen :
```bash
screen -S vite-algo
```
- Lancer le serveur Vite dedans
```bash
npx vite --host --port 80 n2i2024-Algorythms/
```

## Revenir plus tard sur cette session
- Taper
```bash
screen -r vite-algo
```

## Quitter définitivement la session
```bash
exit
```
(depuis la session)
