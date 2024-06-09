import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, { // 'jate' = idb database name
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      // 'jate' = name of the object store
      // 'keyPath' = the property in this 'jate' object store that will be used to uniquely identify each object (autoinc) for retrieving specific data
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true }); 
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  //console.error('putDb not implemented')
  console.log('PUT to the database')
  // open the 'jate' database
  const jateDb = await openDB('jate', 1)
  // add a transaction to the database for the 'jate' object store in 'readwrite'mode
  const tx = jateDb.transaction('jate', 'readwrite')
  // retrieve the 'jate' object store from the 'tx' transaction
  const store = tx.objectStore('jate')
  // PUT query the 'jate' object store in the 'tx' transaction to update content to the 'jate' object store. value is the name of the record to update
  const request = store.put({id: 1, value: content})
  // get the result of that put request (the updated record)
  const result = await request
  console.log('Data saved to the database', result)
} 

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  //console.error('getDb not implemented');
  console.log('GET all from the database')
  const jateDb = await openDB('jate', 1)
  const tx = jateDb.transaction('jate', 'readonly')
  const store = tx.objectStore('jate')
  const request = store.getAll()
  const result = await request
  console.log('result.value', result)
  return result
}

initdb();
