Actualizado para 2016
Diseño actualizado
Soporte de etiquetas de Hacktoberfest
¡Usted puede conseguir implicado recogiendo algunas de las ediciones etiquetadas hacktoberfest para ayudar a su cuenta!
Ejecución de la aplicación
Genere un token de acceso personal de GitHub para asegurarse de que no se limita la frecuencia con tanta frecuencia.
Exporte el token GitHub como una variable de entorno para que Node.js utilice.
Mac / Linux: exportación GITHUB_TOKEN = YOUR_TOKEN
Windows (cmd.exe): set GITHUB_TOKEN = TU TOKEN
Windows (Powershell): $ env: GITHUB_TOKEN = TU TOKEN
npm instalar
node index.js
Navegador de punto a localhost: 5000
Ejecución de la aplicación en el acoplador
Como alternativa a la sección anterior, puede ejecutar la aplicación dentro de un contenedor de acoplador.
Docker build -t hacktoberfest-checker.
Docker run -p 5000: 5000 -e "GITHUB_TOKEN = YOUR_TOKEN" hacktoberfest-checker
Pruebas
El corredor de pruebas elegido es Jest - un proyecto de Facebook. Puede obtener más información sobre Jest en la serie de vídeos de Egghead.io.
Jest se puede instalar localmente (package.json), o globalmente:
Puede instalarlo localmente ejecutando npm install
Puede instalarlo globalmente ejecutando npm install -g jest-cli
(BONUS) También puede utilizar el hilo como una alternativa npm. Simplemente instale el hilo con npm instalar -g hilo y luego utilice el hilo para instalar las dependencias
Una vez instalado Jest, ya está listo para comenzar las pruebas. Para facilitar todo, hemos proporcionado algunos comandos de pre-compilación en el paquete. Json:
Npm run test o npm t ejecutarán todas las suites de prueba
Prueba de ejecución npm: reloj ejecutará Jest en modo de reloj
Prueba de ejecución npm: la cobertura ejecutará todas las suites de prueba y proporcionará cobertura de código
Npm run test: updateSnapshot ejecutará todos los conjuntos de pruebas y actualizará las instantáneas obsoletas o no utilizadas (para más información sobre las instantáneas vea este video)
Npm run test: full ejecutará Jest en modo watch y proporcionará cobertura de código
TODO (2015)
 Presentación del formulario Ajax
 Fijar la capacidad de vincular a los usuarios que la reparación de ajax por encima se rompió (por ejemplo, http: // localhost: 5000 /? Username = jenkoian)
 Implementar una página web real utilizando Bootstrap o algo así
 Agregar campo para introducir el nombre de usuario de GitHub
 Cache nombres de usuario y etags para hacer uso de If-None-Match para reducir el riesgo de alcanzar el límite de velocidad en github API.
 Mostrar una lista de solicitudes de extracción en cuestión
 Añade renuncia (GitHub API sólo permite un máximo de 300 eventos, por lo que si usted es una abeja github ocupado, probablemente no le hará justicia)
 O incluso mejor que el descargo de responsabilidad anterior, utilice la API de búsqueda en lugar de la API de eventos
 Agregar mensaje contextual, p. 2/4 PRs hecho "Half way there", 4/4 PRs hecho "Way to go", 12/4 PRs hecho "Ahora estás mostrando"
Licencia
MIT © 2015-2016 Ian Jenkins
