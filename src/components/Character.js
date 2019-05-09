import React, { Component, useState, useEffect } from 'react';

import Summary from './Summary';
import { useHttp } from '../hooks/http';

const Character = props => {
  const [loadedCharacter, setloadedCharacter] = useState({})
  const [isLoading, setisLoading] = useState(false)
  
  //const [isLoading, fetchData] = useHttp('https://swapi.co/api/people' + props.selectedChar, [props.selectedChar])
  

  console.log('Rendering..........');

  //Whenever selectedChar changes this useEffect will re_run
  useEffect(()=>{
    fetchData()
    return () => { // this run will run right before the next run!
      console.log("Cleaning up.... this is first effect");
    };
  },[props.selectedChar])

  useEffect(()=>{
    return () =>{
      console.log("Hello world this is second effect");
    };
  },[])


  const fetchData = () => {
    console.log(
      'Sending Http request for new character with id ' +
        props.selectedChar
    );
    setisLoading(true);
    fetch('https://swapi.co/api/people/' + props.selectedChar)
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not fetch person!');
        }
        return response.json();
      })
      .then(charData => {
        const loadedCharacter = {
          id: props.selectedChar,
          name: charData.name,
          height: charData.height,
          colors: {
            hair: charData.hair_color,
            skin: charData.skin_color
          },
          gender: charData.gender,
          movieCount: charData.films.length
        };
        setloadedCharacter(loadedCharacter);
        setisLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
    let content = <p>Loading Character...</p>;

    if (!isLoading && loadedCharacter.id) {
      content = (
        <Summary
          name={loadedCharacter.name}
          gender={loadedCharacter.gender}
          height={loadedCharacter.height}
          hairColor={loadedCharacter.colors.hair}
          skinColor={loadedCharacter.colors.skin}
          movieCount={loadedCharacter.movieCount}
        />
      );
    } else if (!isLoading && !loadedCharacter.id) {
      content = <p>Failed to fetch character.</p>;
    }
    return content;
}

//same logic as Should componentUpdated 
export default React.memo(Character, (prevProps, nextProps)=>{
  return nextProps.selectedChar != prevProps.selectedChar
});
