Before following the installation steps ahead, make sure you have a recent version of the Marklogic server installed. If not, go to https://developer.marklogic.com/products
You also need a recent version of npm and Node.js with the following dependencies: `express`, `express-session`, `cors`, `body-parser`, `marklogic`, `connect-marklogic`.

# SYSTEM SETUP - step by step

1. With your Marklogic server admin interface http://localhost:8001, create a new forest. Name it "debates-01"

2. Create a new database called "debates"

3. Attach forest "debates-01" to database "debates"

4. Create an application server on port 8070:
*   root: path ending with WebContent, 
*   port 8070, 
*   modules (file system),
*   database "debates",
*   default user admin(admin)

5. Download or copy the contents of WebContent in your root directory and test `localhost:8070` on your browser. Google Chrome for desktop recommended.

6. Create a REST Client API instance by sending the following XML code to the server.

`<rest-api xmlns="http://marklogic.com/rest-api">
  <name>AusDebates</name>
  <database>debates</database>
  <port>8060</port>
</rest-api>`

If you name it `config.xml`, you can use the following curl command: (unix users may prefer single quotes instead of double quotes)

`curl -X POST --anyauth --user admin:admin -d @"./config.xml" -H "Content-type: application/xml" http://localhost:8002/LATEST/rest-apis`

Double-check that the authentication is set to "basic".

7. Load some example data to the server. The folder openausdocs contains five dated files of sessions as well as two files with data about the senators: `people.xml` and `senators.xml`. One way to load the files is to use the admin interface on port 8001. Follow the path Configure - Databases - debates and select the Load tab. Enter the directory name where you want to load the files from. More example data can be found at http://data.openaustralia.org/

8. Set up Node.js server. Copy the contents of Server folder to your folder of choice. Install and update the required node dependencies and start the server: `node tripleserver.js`.
It should be listening on localhost port 3000.

All done!



