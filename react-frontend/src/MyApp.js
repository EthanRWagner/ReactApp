import React, {useState, useEffect} from 'react';
import Table from './Table';
import Form from './Form';
import axios from 'axios';

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter (index) {
    const updated = characters.filter((character, i) => {
        return i !== index
      });
      setCharacters(updated);
  }
  
  function updateList(person) {
    makePostCall(person).then( result => {
      if (result && result.status === 200)
        setCharacters([...characters, person] );
    });
  }

  // asynchronous function to get users from user list from backend.
  // allows the frontend to run other threads if waiting
  async function fetchAll(){
    try {
      const response = await axios.get('http://localhost:5000/users');
      return response.data.users_list;
    }
    catch (error){
      //we are not handling errors just logging into the console.
      console.log(error);
      return false;
    }
  }

  //used to build table after data fetched. However, should not retrieve
  //data everytime the table is updated should use state to update
  // Note: the [] argument makes it so MyApp only used useEffect hook
  //       when MyApp component first mounts.
  useEffect(() => {
    fetchAll().then( result => {
      if (result)
        setCharacters(result);
    });
  }, [] );

  async function makePostCall(person){
    try {
      const response = await axios.post('http://localhost:5000/users', person);
      return response;
    }
    catch(error){
      console.log(error);
      return false;
    }
  }
  
  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  )
}

export default MyApp;