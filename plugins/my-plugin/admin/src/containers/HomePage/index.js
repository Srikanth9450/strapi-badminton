import React, { memo,useEffect,useState } from 'react';
import axios from 'axios';

class App extends React.Component {
  // State of your application
  state = {
    slots: [],
    error: null,
  };

  // Fetch your restaurants immediately after the component is mounted
  componentDidMount = async () => {
    try {
      const response = await axios.get('http://localhost:1337/my-plugin/totalbookings');
      this.setState({ slots: response.data });
      console.log("response",response.data,response)
    } catch (error) {
      this.setState({ error });
    }
  };

  render() {
    const { error, slot } = this.state;

    // Print errors if any
    if (error) {
      return <div>An error occured: {error.message}</div>;
    }

    return (
      <div className="App">
        <ul>
          {this.state.slots.map(slot => (
            <li ><ul><li>username: {slot.users_permissions_user ? slot.users_permissions_user.username : ''}</li>
            <li>date:{slot.date}</li>
            <li>timeslot:{slot.from}</li></ul>
          </li>
          ))}
        </ul>
      </div>
    );
  }
}


 
export default memo(App);
