# week-19-PWA-text-editor

## Description

- I wanted to build this application to create a text editor that stores data to an IndexedDB database.

## Process

- The first thing i did was set up the scripts in my main package.json file.
- In the webpack.config.js i added:
    - install.js, editor.js and index.js as the 3 entrypoint files for webpack to bundle from.
    - added the HtmlWebpackPlugin to generate the html file and inject the bundles. 
    - the CSS and Babel loaders.
    - the injectManifest plugin to inject my custom service worker file into the webpack bundle. And the WebpackPwaManifest plugin to create a manifest.json file, for installing the PWA.
- In the src-sw.js file i set up asset caching, for the css and javascript files.
- In the install.js i added the Logic for installing the PWA using the install button.
- In database.js i:
    - created a database in IDB called 'jate'
    - created an object store in said database also called 'jate', with an autoincramenting keyPath called 'id'.
    - created a putDb fuction that takes some 'content' passed to it and updates it to the record with the id of 1 in the database (essentially taks the 'content' ie text that the user it typing and puts that into the db so it persists and can be retrieved even after the app is closed so you dont lose your text.)
    - created a getDb function that gets all the content from the database (which is just 1 record which holds the text of whatever the user has typed into the text editor.)

## Challenges:
- when i tried running up the app, after closing it the persisted data in the idb database wouldnt be retrieved and displayed on the screen. This was because the getAll request returns an array of 1 object with an id and value property, not a string, so it was causing errors. So in the get request in editor.js i changed 'data' to 'data[0].value' to properly access the data held in the value field of the record in the database, so it was properly displayed.


## Application
- link to my deployed application:
https://week-19-pwa-text-editor.onrender.com/