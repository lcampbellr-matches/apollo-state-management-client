import logo from './logo.svg';
import './App.css';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import {
  useQuery,
  useMutation,
} from "@apollo/client";
import React, { useContext, useEffect } from 'react';
import { GET_BOOKS, GET_MOVIES, GET_USERS, UPDATE_USERS, UpdateUsersOptions } from "./queries_mutations";
import { AppContext } from '.';
import { AutoCompleteComp } from './components/Autocomplete';

const App = () => {
  const { loading: loadingBooks, error: errorBooks, data: booksData } = useQuery(GET_BOOKS);
  const { loading: loadingMovies, error: errorMovies, data: moviesData } = useQuery(GET_MOVIES);
  const { loading: loadingUsers, error: errorUsers, data: usersData, startPolling, stopPolling } = useQuery(GET_USERS,
    {
      pollInterval: 5000,
    });
  const [updateUsers] = useMutation(UPDATE_USERS, UpdateUsersOptions);
  const localState = useContext(AppContext);

  startPolling(1000);
  if (usersData?.users.every(user => user.approval)) stopPolling();


  if (loadingBooks || loadingMovies || loadingUsers) return <p>Loading...</p>;
  if (errorBooks || errorMovies || errorUsers) return <p>Error :(</p>;

  const books = booksData?.books?? [];
  const users = usersData?.users?? [];
  const movies = moviesData?.movies?? [];

  const submitOnClick = () => {

    const user = localState.user();
    const book = localState.book();
    const movie = localState.movie();

    const submitDetails = {
      title: user.title,
      movie: movie.title,
      book: book.title,
    };
      
    updateUsers({
      variables: {
        input: submitDetails
      }
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          { 
            users.map(({title, favouriteBook, favouriteMovie, approval}) => <div key={title}>{title} likes the book "{favouriteBook.title}" and the movie "{favouriteMovie.title}"<div className={clsx({ approved:approval, unapproved:!approval, })}></div></div>)
          }
          <h2>Users</h2>
          <AutoCompleteComp stateName="user" options={users} />
          <h2>Set Book</h2>
          <AutoCompleteComp stateName="book" options={books} />
          <h2>Set Movie</h2>
          <AutoCompleteComp stateName="movie" options={movies} />
          <Button
            variant="contained" color="primary"
            onClick={submitOnClick}
            >
            Submit choice
          </Button>

      </header>
    </div>
  );
}

export default App;
