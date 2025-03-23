# Práctica de Despliegue de Servidores

## Ejercicio 1: Aplicación NodePop con MongoDB

**URL del proyecto:** [https://nodepop-node.martinrivasr.duckdns.org/](https://nodepop-node.martinrivasr.duckdns.org/)

Esta aplicación corresponde al primer ejercicio del despliegue de servidores. Utiliza **MongoDB** como sistema gestor de base de datos y está desplegada sobre una instancia Linux configurada con **Nginx** como servidor web y **Supervisor** como gestor de procesos.

### Credenciales de acceso
- **Usuario:** admin@example.com  
- **Contraseña:** 1234

---

## Ejercicio 2: Aplicación NodePop Frontend con React + Backend Node/SQLite

**URL del proyecto:** [https://nodepop.martinrivasr.duckdns.org/login](https://nodepop.martinrivasr.duckdns.org/login)

Este segundo ejercicio es una aplicación construida con **React** en el frontend y un backend en **Node.js** utilizando **SQLite** como base de datos.

### Credenciales de acceso
- **Usuario:** admin@test.com  
- **Contraseña:** 1234

---

Ambas aplicaciones fueron desplegadas en entornos Linux y configuradas con certificados SSL mediante Let's Encrypt para garantizar conexión segura. Los puertos y servicios fueron gestionados con buenas prácticas de seguridad, incluyendo redirecciones HTTPS y manejo de procesos de forma desacoplada del terminal.

